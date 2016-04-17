import R from 'ramda'
import {unregisterKeys, registerKeys, drawInstructions} from './menuHelpers'

const COMMAND = 'menu.pop'

/**
  Installs the previous menu from the menu stack.
 */
const process = (context, action) => {
  // unbind our current menu
  const currentMenu = R.last(context.menuStack)
  unregisterKeys(context, currentMenu)

  // shrink the list and assign the new menu
  const menuStack = R.slice(0, -1, context.menuStack)
  context.menuStack = menuStack
  const nextMenu = R.last(menuStack)

  // hook it up and draw
  registerKeys(context, nextMenu)
  drawInstructions(context, nextMenu)
}

export default {
  name: COMMAND,
  process
}
