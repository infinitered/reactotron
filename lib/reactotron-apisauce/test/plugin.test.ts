import * as jsonServer from "json-server"
import apisauce from "apisauce"
import createPlugin from "../src/index"

describe("plugin", () => {
  it("parses responses", (done) => {
    // create a json server
    const port = 42352
    const server = jsonServer.create()

    // hookup some leet server codez
    server.get("/hey", (req, res) => {
      res.json({ a: "ok", b: 1 })
    })

    // start listening
    const srv = server.listen(port)

    // captured these guys from our fake plugin
    let request: Record<string, any>
    let response: Record<string, any>
    let duration: number

    // create a fake plugin to receive the real plugin's functionality
    const plugin = createPlugin()({
      apiResponse: (a, b, c) => {
        request = a
        response = b
        duration = c
      },
    })

    // create the api
    const api = apisauce.create({ baseURL: `http://localhost:${port}` })

    // make the call
    api
      .get("/hey")
      .then(plugin.features.apisauce)
      .then(() => {
        // can't seem to deep equals here... it's like we're getting a wierd Object()
        expect(request.url).toEqual(`http://localhost:${port}/hey`)
        expect(request.method).toEqual("get")
        // eslint-disable-next-line dot-notation
        expect(request.headers["Accept"]).toEqual("application/json")
        expect(request.data).toBeFalsy()
        expect(response.body).toEqual({ a: "ok", b: 1 })
        expect(response.status).toEqual(200)
        expect(response.headers["x-powered-by"]).toEqual("Express")
        expect(duration).toBeGreaterThan(0)

        srv.close()
        done()
      })
  })
})
