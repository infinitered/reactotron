import reduxDispatch from './reduxDispatch'
import reduxValueRequest from './reduxValueRequest'
import reduxKeyRequest from './reduxKeyRequest'
import reduxValueResponse from './reduxValueResponse'
import reduxKeyResponse from './reduxKeyResponse'
import reduxValuePrompt from './reduxValuePrompt'
import reduxKeyPrompt from './reduxKeyPrompt'
import reduxDispatchPrompt from './reduxDispatchPrompt'
import die from './die'
import log from './log'
import apiLog from './apiLog'
import menuPush from './menuPush'
import menuMain from './menuMain'
import menuRedux from './menuRedux'

export default [
  reduxDispatch,
  reduxValueRequest,
  reduxKeyRequest,
  reduxValueResponse,
  reduxKeyResponse,
  reduxValuePrompt,
  reduxKeyPrompt,
  reduxDispatchPrompt,
  apiLog,
  log,
  menuPush,
  menuMain,
  menuRedux,
  die
]
