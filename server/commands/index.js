// redux things
import reduxDispatch from './redux/reduxDispatch'
import reduxValueRequest from './redux/reduxValueRequest'
import reduxKeyRequest from './redux/reduxKeyRequest'
import reduxValueResponse from './redux/reduxValueResponse'
import reduxKeyResponse from './redux/reduxKeyResponse'
import reduxValuePrompt from './redux/reduxValuePrompt'
import reduxKeyPrompt from './redux/reduxKeyPrompt'
import reduxDispatchPrompt from './redux/reduxDispatchPrompt'
import reduxActionDone from './redux/reduxActionDone'
import reduxSubscribeRequest from './redux/reduxSubscribeRequest'
import reduxSubscribeValues from './redux/reduxSubscribeValues'
import reduxSubscribeAdd from './redux/reduxSubscribeAdd'
import reduxSubscribeAddPrompt from './redux/reduxSubscribeAddPrompt'
import reduxSubscribeDelete from './redux/reduxSubscribeDelete'
import reduxSubscribeDeletePrompt from './redux/reduxSubscribeDeletePrompt'
import reduxSubscribeClear from './redux/reduxSubscribeClear'
import devMenuReload from './devMenu/devMenuReload'
import benchReport from './bench/benchReport'

// program things
import die from './program/die'

// api things
import apiLog from './api/apiLog'

// client things
import clientAdd from './client/clientAdd'
import clientRemove from './client/clientRemove'

// command things
import commandRepeat from './commands/commandRepeat'

// content things
import contentLog from './content/contentLog'
import contentClear from './content/contentClear'
import contentScore from './content/contentScore'

// menu things
import menuPush from './menus/menuPush'
import menuPop from './menus/menuPop'
import menuMain from './menus/menuMain'
import menuRedux from './menus/menuRedux'
import menuHelp from './menus/menuHelp'
import menuReduxSubscribe from './menus/menuReduxSubscribe'
import menuDevMenu from './menus/menuDevMenu'
import menuClients from './menus/menuClients'
import consoleError from './console/consoleError'

// come together. right now. over me.
export default [
  clientAdd,
  clientRemove,
  reduxDispatch,
  reduxValueRequest,
  reduxKeyRequest,
  reduxValueResponse,
  reduxKeyResponse,
  reduxValuePrompt,
  reduxKeyPrompt,
  reduxDispatchPrompt,
  reduxActionDone,
  reduxSubscribeRequest,
  reduxSubscribeValues,
  reduxSubscribeAdd,
  reduxSubscribeAddPrompt,
  reduxSubscribeDelete,
  reduxSubscribeDeletePrompt,
  reduxSubscribeClear,
  apiLog,
  contentLog,
  contentClear,
  contentScore,
  menuPush,
  menuPop,
  menuMain,
  menuRedux,
  menuHelp,
  menuReduxSubscribe,
  menuDevMenu,
  menuClients,
  commandRepeat,
  devMenuReload,
  consoleError,
  benchReport,
  die
]
