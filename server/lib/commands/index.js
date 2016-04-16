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

export default [
  reduxDispatch,
  reduxValueRequest,
  reduxKeyRequest,
  reduxValueResponse,
  reduxKeyResponse,
  reduxValuePrompt,
  reduxKeyPrompt,
  reduxDispatchPrompt,
  log,
  die
]
