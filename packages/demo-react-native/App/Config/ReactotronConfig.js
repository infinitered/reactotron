import Reactotron, {
  trackGlobalErrors,
  openInEditor,
  overlay,
  asyncStorage,
  networking
} from 'reactotron-react-native'
// import apisauce from 'reactotron-apisauce'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'
import { test } from 'ramda'

console.disableYellowBox = true

const vetoTest = test(/(node_modules\/react\/)/)

if (__DEV__) {
  Reactotron.configure({
    name: 'React Native Demo',
    socketIoProperties: {
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10
    }
  })
    .useAllIncluded({
      trackGlobalErrors: { veto: frame => vetoTest(frame.fileName) },
      networking: { ignoreContentTypes: /^(image)\/.*$/i },
      asyncStorage: { ignore: ['secret'] }
    })
    // .use(apisauce({}))
    .use(
      reactotronRedux({
        isActionImportant: action => action.type === 'something.important',
        except: ['ignore']
      })
    )
    .use(sagaPlugin())
    .connect()

  console.tron = Reactotron
  Reactotron.clear()
}
