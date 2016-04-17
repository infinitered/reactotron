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
import reduxSubscribeAddPrompt from './redux/reduxSubscribeAddPrompt'
import reduxSubscribeClear from './redux/reduxSubscribeClear'

// program things
import die from './program/die'

// api things
import apiLog from './api/apiLog'

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
import menuReduxSubscribe from './menus/menuReduxSubscribe'

// come together. right now. over me.
export default [
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
  reduxSubscribeAddPrompt,
  reduxSubscribeClear,
  apiLog,
  contentLog,
  contentClear,
  contentScore,
  menuPush,
  menuPop,
  menuMain,
  menuRedux,
  menuReduxSubscribe,
  commandRepeat,
  die
]
