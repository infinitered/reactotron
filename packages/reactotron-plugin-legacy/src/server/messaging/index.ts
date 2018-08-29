// TODO: Consider a common plugin thing to provide this type of stuff out of the box.
import * as MessageTypes from "./types"

let messaging = null

function setMessenger(messageClient) {
    messaging = messageClient
}

export { messaging, setMessenger, MessageTypes }
