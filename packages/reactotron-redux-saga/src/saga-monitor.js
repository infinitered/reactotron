import { is } from 'redux-saga/utils'
import getEffectName from './get-effect-name'
import getEffectDescription from './get-effect-description'
import {
  ITERATOR,
  CALL,
  PUT,
  FORK,
  RACE,
  PENDING,
  RESOLVED,
  REJECTED,
  CANCELLED
} from './saga-constants'
import {
  reject,
  values,
  pluck,
  isNil,
  split,
  pathOr,
  last,
  forEach,
  propEq,
  filter,
  __
} from 'ramda'
// import { reject, values, pluck, isNil, split, pathOr, last, forEach, propEq, filter, __, map, omit } from 'ramda'

// creates a saga monitor
export default (reactotron, options) => {
  // a lookup table of effects - keys are numbers, values are objects
  let effects = {}

  // filtering that effect table
  const byParentId = propEq('parentEffectId', __)
  const byLabel = propEq('label', __)
  const getChildEffectInfos = parentEffectId => filter(byParentId(parentEffectId), values(effects))
  const getChildEffectIds = effectId => pluck('effectId', getChildEffectInfos(effectId))

  // start a relative timer
  const timer = reactotron.startTimer()

  // ---------------- Sending Effect Updates ----------------
  // const sendReactotronEffectTree = () => reactotron.send('saga.effect.update', effects)

  // ---------------- Starting -----------------------------

  // redux-saga calls this when an effect is triggered (started)
  const effectTriggered = description => {
    const { effect, effectId, parentEffectId, label } = description

    // create an EffectInfo to hold the details
    const effectInfo = {
      effectId,
      parentEffectId,
      effect,
      label,
      status: PENDING,
      name: getEffectName(effect),
      description: getEffectDescription(effect),
      result: null,
      startedAt: timer()
    }

    // store it
    effects[effectId] = effectInfo

    // send it
    // sendReactotronEffectTree()
  }

  // ---------------- Finishing ----------------------------

  // update the duration of the effect
  const updateDuration = effectInfo => {
    effectInfo.duration = timer() - effectInfo.startedAt
  }

  // fires when a task has been resolved
  const taskResolved = (effectId, taskResult) => {
    // lookup this effect info
    const effectInfo = effects[effectId]
    updateDuration(effectInfo)
    const { duration } = effectInfo

    // grab the parent too
    const { parentEffectId } = effectInfo
    const parentEffectInfo = effects[parentEffectId]
    const children = []

    // a human friendly name of the saga task
    let sagaDescription
    // what caused the trigger
    let triggerType

    // for FORK tasks, we have a bunch on things to pass along
    if (effectInfo.name === FORK) {
      const args = pathOr([], split('.', 'effect.FORK.args'), effectInfo)
      const lastArg = last(args)
      triggerType = lastArg && lastArg.type
      if (parentEffectInfo) {
        if (parentEffectInfo.name === ITERATOR) {
          sagaDescription = parentEffectInfo.description
        }
      } else {
        sagaDescription = '(root)'
        triggerType = `${effectInfo.description}()`
      }

      // flatten out the nested effects
      const buildChild = (depth, effectId) => {
        const sourceEffectInfo = effects[effectId]
        if (isNil(sourceEffectInfo)) return

        let extra = null
        if (sourceEffectInfo.effect) {
          switch (sourceEffectInfo.name) {
            case CALL:
              extra = sourceEffectInfo.effect[sourceEffectInfo.name].args
              break

            case PUT:
              extra = sourceEffectInfo.effect[sourceEffectInfo.name].action
              break

            // children handle this
            case RACE:
              break

            // TODO: More of customizations needed here

            default:
              extra = sourceEffectInfo.effect[sourceEffectInfo.name]
              break
          }
        }
        // assemble the structure
        children.push({
          depth,
          effectId: sourceEffectInfo.effectId,
          parentEffectId: sourceEffectInfo.parentEffectId || null,
          name: sourceEffectInfo.name || null,
          description: sourceEffectInfo.description || null,
          duration: Math.round(sourceEffectInfo.duration),
          status: sourceEffectInfo.status || null,
          winner: sourceEffectInfo.winner || null,
          loser: sourceEffectInfo.loser || null,
          result: sourceEffectInfo.result || null,
          extra: extra || null
        })

        // rerun this function for our children
        forEach(x => buildChild(depth + 1, x), getChildEffectIds(effectId))
      }
      const xs = getChildEffectIds(effectId)
      forEach(effectId => buildChild(0, effectId), xs)
    }

    reactotron.send('saga.task.complete', {
      triggerType: triggerType || effectInfo.description,
      description: sagaDescription,
      duration: Math.round(duration),
      children
    })

    // effects = omit(map(String, pluck('effectId', children)), effects)
  }

  // redux-saga calls this when an effect is resolved (successfully or not)
  const effectResolved = (effectId, result) => {
    // lookup this effect info and set the rsult
    const effectInfo = effects[effectId]
    updateDuration(effectInfo)
    effectInfo.result = result

    // this is a task
    if (is.task(result)) {
      // when the task promise resolves,
      const onTaskResult = taskResult => {
        if (result.isCancelled()) {
          effectCancelled(effectId)
        } else {
          effectResolved(effectId, taskResult)
          taskResolved(effectId, taskResult)
        }
      }

      // hook the promise to capture the resolve or reject
      result.done.then(onTaskResult, error => {
        effectRejected(effectId, error)
        if (!error.reactotronWasHere) {
          reactotron.reportError(error)
        }
        error.reactotronWasHere = true
      })
    } else {
      // this is an effect and we are complete
      effectInfo.status = RESOLVED
      effectInfo.result = result
      if (effectInfo.name === RACE) {
        setRaceWinner(effectId, result)
      }
    }

    // send it
    // sendReactotronEffectTree()
  }

  // flags on of the children as the winner
  const setRaceWinner = (effectId, resultOrError) => {
    const winnerLabel = Object.keys(resultOrError)[0]
    const children = getChildEffectInfos(effectId)
    const winningChildren = filter(byLabel(winnerLabel), children)
    const losingChildren = reject(byLabel(winnerLabel), children)
    const setWinner = effectInfo => {
      effectInfo.winner = true
    }
    const setLoser = effectInfo => {
      effectInfo.loser = true
    }

    // set the 1 (hopefully 1) winner -- but i'm not sure
    forEach(setWinner, winningChildren)
    forEach(setLoser, losingChildren)
  }

  // ---------------- Failing ------------------------------

  // redux-saga calls this when an effect is rejected (an error has happened)
  const effectRejected = (effectId, error) => {
    const effectInfo = effects[effectId]
    updateDuration(effectInfo)
    effectInfo.status = REJECTED
    effectInfo.error = error
    if (effectInfo.name === RACE) {
      setRaceWinner(effectId, error)
    }

    // send it
    // sendReactotronEffectTree()
  }

  // ---------------- Cancelling ---------------------------

  // redux-saga calls this when an effect is cancelled
  const effectCancelled = effectId => {
    const effectInfo = effects[effectId]
    updateDuration(effectInfo)
    effectInfo.status = CANCELLED

    // send it
    // sendReactotronEffectTree()
  }

  // the interface for becoming a redux-saga monitor
  return {
    effectTriggered,
    effectResolved,
    effectRejected,
    effectCancelled,
    actionDispatched: () => {}
  }
}
