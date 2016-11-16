import { put } from 'redux-saga/effects'

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
    value: [
      babelNamesThis,
      () => true,
      function namedFunction () {}
    ]
  })
}

// process STARTUP actions
export function * startup () {
  testRecursion()
  testFunctionNames()
  yield put({ type: 'HELLO' })
}
