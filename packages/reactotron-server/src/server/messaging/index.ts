import { PubSub } from "apollo-server-express"

import * as MessageTypes from "./types"

const messaging = new PubSub()

export { messaging, MessageTypes }
