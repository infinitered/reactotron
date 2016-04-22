const COMMAND = 'menu.help'

const process = (context, action) => {
  context.log('help message setup')
  context.message('Hi I am a message!', (value) => {
    context.log('callback done')
    // nothing needed here
  })
}

export default {
  name: COMMAND,
  process
}
