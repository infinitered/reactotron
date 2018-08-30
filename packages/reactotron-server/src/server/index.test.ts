import test from "ava"
import * as request from "request-promise-native"
import { httpServerInstance, apolloServerInstance } from './'

// Tests in here are ran in serial due to the webserver binding to port 4000 (concurrency results in EADDRINUSE error)

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

  const responseString = await request("http://localhost:4000").catch(err => {
    t.is(err, null, "request to http server has errored")
  })

  t.true(responseString.includes("the new home of reactotron"))
}) 

test.serial("Can create an apollo server to interact with react app", async t => {
  
  const apolloServer = await apolloServerInstance(app, httpServer)

  t.true(apolloServer !== null && typeof apolloServer === "object")
  t.true(apolloServer.graphqlPath === '/graphql')
}) 