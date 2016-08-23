import Reactotron, { trackGlobalErrors } from 'reactotron-react-js'
import tronsauce from 'reactotron-apisauce'

Reactotron
  .configure({ name: 'Demo Time!', secure: false })
  .use(tronsauce())
  .use(trackGlobalErrors({ offline: false }))
  .connect()

console.tron = Reactotron
