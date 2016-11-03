import Reactotron, { trackGlobalErrors } from 'reactotron-react-native'
import tronsauce from 'reactotron-apisauce'
import { reactotronRedux } from 'reactotron-redux'

if (__DEV__) {
  Reactotron
    .configure({ name: 'React Native Demo' })
    .use(tronsauce())
    .use(reactotronRedux({
      isActionImportant: action => action.type === 'repo.receive',
      except: ['ignore']
    }))
    .use(trackGlobalErrors({
      veto: frame => frame.fileName.indexOf('/node_modules/react-native/') >= 0
    }))
    .connect()

  console.tron = Reactotron
  Reactotron.clear()
}
