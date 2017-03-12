// state things
import stateDispatch from './state/stateDispatch'
import stateValueRequest from './state/stateValueRequest'
import stateKeyRequest from './state/stateKeyRequest'
import stateValuePrompt from './state/stateValuePrompt'
import stateKeyPrompt from './state/stateKeyPrompt'
import stateDispatchPrompt from './state/stateDispatchPrompt'
import stateSubscribeAdd from './state/stateSubscribeAdd'
import stateSubscribeAddPrompt from './state/stateSubscribeAddPrompt'
import stateSubscribeDelete from './state/stateSubscribeDelete'
import stateSubscribeDeletePrompt from './state/stateSubscribeDeletePrompt'
import stateSubscribeClear from './state/stateSubscribeClear'
import devMenuReload from './devMenu/devMenuReload'

// program things
import die from './program/die'

// command things
import commandRepeat from './commands/commandRepeat'

// content things
import contentClear from './content/contentClear'
import contentScore from './content/contentScore'

// menu things
import menuPush from './menus/menuPush'
import menuPop from './menus/menuPop'
import menuMain from './menus/menuMain'
import menuState from './menus/menuState'
import menuHelp from './menus/menuHelp'
import menuStateSubscribe from './menus/menuStateSubscribe'
import menuDevMenu from './menus/menuDevMenu'
import menuClients from './menus/menuClients'

// come together. right now. over me.
export default [
  stateDispatch,
  stateValueRequest,
  stateKeyRequest,
  stateValuePrompt,
  stateKeyPrompt,
  stateDispatchPrompt,
  stateSubscribeAdd,
  stateSubscribeAddPrompt,
  stateSubscribeDelete,
  stateSubscribeDeletePrompt,
  stateSubscribeClear,
  contentClear,
  contentScore,
  menuPush,
  menuPop,
  menuMain,
  menuState,
  menuHelp,
  menuStateSubscribe,
  menuDevMenu,
  menuClients,
  commandRepeat,
  devMenuReload,
  die
]
