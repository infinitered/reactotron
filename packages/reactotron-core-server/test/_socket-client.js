import ioClient from 'socket.io-client'

export default (address) =>
  ioClient(address, { jsonp: false, transports: ['websocket'] })
