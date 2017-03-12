import Reactotron, { trackGlobalErrors, openInEditor, overlay, asyncStorage } from 'reactotron-react-native'
import apisauce from 'reactotron-apisauce'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'
import { test } from 'ramda'

console.disableYellowBox = true

const vetoTest = test(/(node_modules\/react\/)/)

if (__DEV__) {
  Reactotron
    .configure({
      name: 'React Native Demo',
      socketIoProperties: {
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10
      }
    })
    .use(apisauce({
      ignoreContentTypes: /^(image)\/.*$/i
    }))
    .use(reactotronRedux({
      isActionImportant: action => action.type === 'something.important',
      except: ['ignore']
    }))
    .use(trackGlobalErrors({
      veto: frame => vetoTest(frame.fileName)
    }))
    .use(openInEditor())
    .use(sagaPlugin())
    .use(overlay())
    .use(asyncStorage({ ignore: ['secret'] }))
    .connect()

  console.tron = Reactotron
  Reactotron.clear()
}
