import test from "ava"
import * as request from "request-promise-native"
import { GraphQLClient } from "graphql-request"
import { httpServerInstance, apolloServerInstance, startServersListening } from "./"

// Tests in here are ran in serial due to the webserver binding to port 4000 (concurrency results in EADDRINUSE error)
// I really want to find a way to refactor out the serials in here. Perhaps after calling "startServersListening" we dont need them any more?
// Im new to ava so not sure what the best solution is here

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

test.serial("Does return reactotron current connection details", async t => {

  // @ts-nocheck
  const client = new GraphQLClient('http://localhost:4000/graphql')

  const query = `{
    connections {
      platform
      name
    }
  }`

  const data = await client.request(query).catch(err => console.log(err))

  console.log(data);

  t.deepEqual({
    connections: []
  }, data)

});