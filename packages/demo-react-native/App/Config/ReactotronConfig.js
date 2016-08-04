import Reactotron from 'reactotron-react-native'
import tronsauce from 'reactotron-apisauce'

Reactotron
  .configure({
    name: 'Demo Time',
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected')
  })
  .use(tronsauce())
  .connect()
