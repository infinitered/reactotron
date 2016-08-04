import Reactotron from 'reactotron-react-native'
import decorate from 'reactotron-core-client/plugins/decorator'
import tronsauce from 'reactotron-apisauce'

Reactotron
  .configure({
    name: 'Demo Time',
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected')
  })
  .use(decorate(console, 'tron'))
  .use(tronsauce())
  .connect()
