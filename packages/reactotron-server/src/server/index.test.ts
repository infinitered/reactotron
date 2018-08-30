import test from "ava"
import * as request from "request-promise-native"
import { httpServerInstance, apolloServerInstance } from './'

// Tests in here are ran in serial due to the webserver binding to port 4000 (concurrency results in EADDRINUSE)

let app, httpServer;

test.serial("Can create a http server to serve react app", async t => {

  let appServer;

  t.notThrows(() => {
    appServer = httpServerInstance()
  })

  // Not sure if there is a way to nicely destructure here, this does for now
  app = appServer.app;
  httpServer = appServer.httpServer;

  t.true(httpServer !== null && typeof httpServer === "object")

  const httpString = await request("http://localhost:4000").catch(err => {
    t.is(err, null, "request to http server has errored")
  })

  
}) 

test.serial("Can create an apollo server to interact with react app", t => {
  
  const apolloServer = apolloServerInstance(app, httpServer)

  t.true(apolloServer !== null && typeof apolloServer === "object")
}) 