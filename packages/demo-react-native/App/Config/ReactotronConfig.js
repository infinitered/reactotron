import parseErrorStack from 'parseErrorStack'
import symbolicateStackTrace from 'symbolicateStackTrace'
import Reactotron, { trackGlobalErrors, openInEditor } from 'reactotron-react-native'
import tronsauce from 'reactotron-apisauce'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

if (__DEV__) {
  Reactotron
    .configure({ name: 'React Native Demo', parseErrorStack, symbolicateStackTrace })
    .use(tronsauce())
    .use(reactotronRedux({
      isActionImportant: action => action.type === 'something.important',
      except: ['ignore']
    }))
    .use(trackGlobalErrors({
      veto: frame => frame.fileName.indexOf('/node_modules/redux-saga/') >= 0
    }))
    .use(openInEditor())
    .use(sagaPlugin())
    .connect()

  console.tron = Reactotron
  Reactotron.clear()
}
