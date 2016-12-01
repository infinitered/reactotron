import Reactotron, { trackGlobalErrors, openInEditor } from 'reactotron-react-native'
import tronsauce from 'reactotron-apisauce'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'
import { test } from 'ramda'

console.disableYellowBox = true

const vetoTest = test(/(YellowBox|redux-saga|node_modules\/react-native)/)

if (__DEV__) {
  Reactotron
    .configure({ name: 'React Native Demo' })
    .use(tronsauce())
    .use(reactotronRedux({
      isActionImportant: action => action.type === 'something.important',
      except: ['ignore']
    }))
    .use(trackGlobalErrors({
      veto: frame => vetoTest(frame.fileName)
    }))
    .use(openInEditor())
    .use(sagaPlugin())
    .connect()

  console.tron = Reactotron
  Reactotron.clear()
}
