import { put } from 'redux-saga/effects'
import { AsyncStorage } from 'react-native'

function testRecursion () {
  if (!__DEV__) return
  const object = {}
  object.myself = object
  object.listOfMyself = [object, object, 'lol', object]
  object.nested = {
    me: object,
    listOfMe: [object, object]
  }
  console.tron.display({ name: 'RECURSIVE SAFETY', value: object })
}

function testFunctionNames () {
  if (!__DEV__) return
  const babelNamesThis = () => {}
  console.tron.display({
    name: 'FUNCTION NAMES',
    value: [babelNamesThis, () => true, function namedFunction () {}]
  })
}

function testFalsyThings () {
  if (!__DEV__) return

  // a flat version
  console.tron.display({
    name: 'FALSY THINGS',
    value: {
      false: false,
      zero: 0,
      emptyString: '',
      undefined: undefined,
      null: null
    }
  })

  // a nested version
  console.tron.display({
    name: 'FALSY THINGS',
    value: {
      false: false,
      zero: 0,
      emptyString: '',
      undefined: undefined,
      null: null,
      nested: {
        deeply: {
          false: false,
          zero: 0,
          emptyString: '',
          undefined: undefined,
          null: null,
          list: [ false, 0, '', undefined, null ]
        }
      }
    }
  })
}

async function addStuffToAsyncStorage () {
  const exists = await AsyncStorage.getItem('addedAt')
  if (exists) return
  await AsyncStorage.multiSet([
    ['secret', 'should not go to reactotron.'],
    ['not.secret', 'this should go to reactotron though'],
    ['stringify', JSON.stringify({ hello: { nested: 100 } })],
    ['addedAt', new Date().toISOString()]
  ])
}

// process STARTUP actions
export function * startup () {
  testRecursion()
  testFunctionNames()
  addStuffToAsyncStorage()
  testFalsyThings()
  // we can yield promises to sagas now... if that's how you roll
  yield new Promise(resolve => {
    resolve()
  }); // eslint-disable-line
  yield put({ type: 'HELLO' })
}
