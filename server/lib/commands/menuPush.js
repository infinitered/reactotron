import R from 'ramda'
import {unregisterKeys, registerKeys, drawInstructions} from './menuHelpers'

const COMMAND = 'menu.push'

/**
  Installs a new menu.
 */
const process = (context, action) => {
  const menu = action.menu
  const {menuStack} = context

  // unregister the old menu if possible
  const previousMenu = R.last(menuStack)
  previousMenu && unregisterKeys(context, previousMenu)

  // register and draw the new menu
  menuStack.push(menu)
  registerKeys(context, menu)
  drawInstructions(context, menu)
}

export default {
  name: COMMAND,
  process
}
