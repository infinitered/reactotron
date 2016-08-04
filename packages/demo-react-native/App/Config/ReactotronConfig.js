import Reactotron from 'reactotron-react-native'
import tronsauce from 'reactotron-apisauce'

if (__DEV__) {
  Reactotron
    .configure({
      name: 'Demo Time',
      onConnect: () => console.log('connected'),
      onDisconnect: () => console.log('disconnected')
    })
    .use(tronsauce())
    .connect()

  console.tron = Reactotron
}
