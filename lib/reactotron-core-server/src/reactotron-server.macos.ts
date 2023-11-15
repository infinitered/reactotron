// import TcpSocket from "react-native-tcp-socket"
// import {
//   ServerEventMap,
//   ServerOptions,
//   PartialConnection,
//   CommandEvent,
//   WebSocketEvent,
//   ServerEventKey,
//   Command,
// } from "reactotron-core-contract"

export const socketServerType = "macos"

// // this.tcpServer = TcpSocket.createServer((socket) => {}).listen({
// //   port,
// //   host: "localhost",
// // })
// // // register events
// // this.tcpServer.on("connection", (socket) => {
// //   const thisConnectionId = this.connectionId++

// //   // a wild client appears
// //   const partialConnection = {
// //     id: thisConnectionId,
// //     address: request.socket.remoteAddress,
// //     socket,
// //   } as PartialConnection

// //   // tuck them away in a "almost connected status"
// //   this.partialConnections.push(partialConnection)

// //   // trigger onConnect
// //   this.emitter.emit("connect", partialConnection)

// //   socket.on("error", (error) => console.log("ERR", error))
