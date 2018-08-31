import test from "ava"
import * as request from "request-promise-native"
import { httpServerInstance, apolloServerInstance, startServersListening } from "./"

// Tests in here are ran in serial due to the webserver binding to port 4000 (concurrency results in EADDRINUSE error)

let appServer, apolloServer;

test.serial("Can create a http server to serve react app", async t => {

  t.notThrows(() => {
    appServer = httpServerInstance()
  })

  // Not sure if there is a way to nicely destructure here, this does for now
  let httpServer = appServer.httpServer;

  t.true(httpServer !== null && typeof httpServer === "object")  
}) 

test.serial("Can create an apollo server to interact with react app", async t => {
  
  const { app, httpServer } = appServer
  apolloServer = await apolloServerInstance(app, httpServer)

  t.true(apolloServer !== null && typeof apolloServer === "object")
  t.true(apolloServer.graphqlPath === '/graphql')
}) 

test.serial("Does serve react app and apollo pubsub", async t => {

  startServersListening(appServer, apolloServer)

  const responseString = await request("http://localhost:4000").catch(err => {
    t.is(err, null, "request to http server has errored")
  })

  t.true(responseString.includes("the new home of reactotron"))
})