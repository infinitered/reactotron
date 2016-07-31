import Reactotron from 'reactotron-react-native'
import decorate from 'reactotron-core-client/plugins/decorator'

Reactotron
  .configure({
    name: 'Demo Time',
    host: '10.0.1.19',
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected')
  })
  .addPlugin(decorate(console, 'tron'))
  .connect()
