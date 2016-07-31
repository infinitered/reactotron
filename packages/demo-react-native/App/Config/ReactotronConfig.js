import Reactotron from 'reactotron-react-native'
import decorate from 'reactotron-core-client/plugins/decorator'

Reactotron
  .configure({
    name: 'Demo Time',
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected')
  })
  .addPlugin(decorate(console, 'tron'))
  .connect()
