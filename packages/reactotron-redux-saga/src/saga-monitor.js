import { is } from 'redux-saga/utils'
import getEffectName from './get-effect-name'
import { FORK, RACE, PENDING, RESOLVED, REJECTED, CANCELLED } from './saga-constants'
import { pick, map, split, pathOr, last, forEach, propEq, filter, __ } from 'ramda'

// creates a saga monitor
export default (reactotron, options) => {
  // a lookup table of effects - keys are numbers, values are objects
  const effects = {}

  // filtering that effect table
  const byParentId = propEq('parentEffectId', __)
  const byLabel = propEq('label', __)
  const getChildEffectInfos = parentEffectId => filter(byParentId(parentEffectId), effects)

  // start a relative timer
  const timer = reactotron.startTimer()

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
      children: [],
      result: null,
      startedAt: timer()
    }

    // store it
    effects[effectId] = effectInfo

    // TODO: temporarily track in our parent for visibility in reactotron until
    // we come up with a better visualization
    const parentEffectInfo = effects[parentEffectId]
    if (parentEffectInfo) {
      parentEffectInfo.children.push(effectInfo)
    }
  }

  // ---------------- Finishing ----------------------------

  // update the duration of the effect
  const updateDuration = effectInfo => {
    effectInfo.duration = timer() - effectInfo.startedAt
  }

  // fires when a task has been resolved
  // TODO: this is the only thing i'm interested in right now.  it's really
  // a subset of what can be tracked by redux-saga, but my head hurts trying
  // to follow all the cases.
  //
  // I'd like figure out just how to display saga information, and that's really
  // what is holding me back from deciding what to throw over the wire to reactotron.
  const taskResolved = (effectId, taskResult) => {
    // lookup this effect info
    const effectInfo = effects[effectId]
    updateDuration(effectInfo)

    // grab the parent too
    const { parentEffectId } = effectInfo
    const parentEffectInfo = effects[parentEffectId]

    // TODO: For now, let's just display a bunch of data and let the user figure
    // it out.

    const sample = {}
    if (effectInfo.name === FORK) {
      const args = pathOr([], split('.', 'effect.FORK.args'), effectInfo)
      const lastArg = last(args)
      sample.type = lastArg && lastArg.type
      sample.duration = effectInfo.duration
      // TODO: recurse
      sample.children = map(
        pick(['name', 'duration', 'result', 'effectId']),
        effectInfo.children
      )
    }

    reactotron.send('saga.task.complete', {
      triggerType: sample.type,
      duration: sample.duration,
      children: sample.children,
      giantBagOfUnsortedStuff: {
        effectInfo: effectInfo,
        parentEffectInfo: parentEffectInfo,
        taskResult
      }
    })
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
      result.done.then(
        onTaskResult,
        error => effectRejected(effectId, error)
      )
    } else {
      // this is an effect and we are complete
      effectInfo.status = RESOLVED
      effectInfo.result = result
      if (effectInfo.name === RACE) {
        setRaceWinner(effectId, result)
      }
    }
  }

  // flags on of the children as the winner
  const setRaceWinner = (effectId, resultOrError) => {
    const winnerLabel = Object.keys(resultOrError)[0]
    const children = getChildEffectInfos(effectId)
    const winningChildren = filter(byLabel(winnerLabel), children)
    const setWinner = effectInfo => { effectInfo.winner = true }

    // set the 1 (hopefully 1) winner -- but i'm not sure
    forEach(setWinner, winningChildren)
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
  }

  // ---------------- Cancelling ---------------------------

  // redux-saga calls this when an effect is cancelled
  const effectCancelled = effectId => {
    const effectInfo = effects[effectId]
    updateDuration(effectInfo)
    effectInfo.status = CANCELLED
  }

  // the interface for becoming a redux-saga monitor
  return {
    effectTriggered,
    effectResolved,
    effectRejected,
    effectCancelled
  }
}
