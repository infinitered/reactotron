import net from 'net'

export default function getFreePort (cb) {
  const server = net.createServer()
  server.listen(() => {
    const port = server.address().port
    server.close(() => cb(port))
  })
}
