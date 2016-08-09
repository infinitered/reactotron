import Reactotron from 'reactotron-react-js'
import tronsauce from 'reactotron-apisauce'

Reactotron
.configure({
  name: 'Demo Time!'
})
.use(tronsauce())
.connect()

console.tron = Reactotron
