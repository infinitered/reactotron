import Reactotron from 'reactotron-react-native'

Reactotron
  .configure({
    name: 'Demo Time',
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected')
  })
  .connect()
