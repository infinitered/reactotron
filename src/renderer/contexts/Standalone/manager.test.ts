import { reducer, clientConnected, clientDisconnected, commandReceived } from "./manager"

function buildState(updates?: {
  connections?: any[]
  selectedClientId?: string
  orphanedCommands?: any[]
}) {
  return {
    connections: [],
    selectedClientId: null,
    orphanedCommands: [],
    ...(updates || {}),
  }
}

describe("contexts/Standalone/manager", () => {
  describe("reducer", () => {
    describe("AddConnection", () => {
      it("should handle new connections and add them to our list", () => {
        const updatedState = reducer(
          buildState(),
          clientConnected({ clientId: "1234", id: 0, platform: "ios" })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [
              { clientId: "1234", id: 0, platform: "ios", commands: [], connected: true },
            ],
            selectedClientId: "1234",
          })
        )
      })

      it("should not recreate an existing connection but should update the connected status", () => {
        const updatedState = reducer(
          buildState({
            connections: [
              {
                clientId: "1234",
                id: 0,
                platform: "ios",
                commands: [{ test: true }],
                connected: false,
              },
            ],
          }),
          clientConnected({ clientId: "1234", id: 0, platform: "ios" })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [
              {
                clientId: "1234",
                id: 0,
                platform: "ios",
                commands: [{ test: true }],
                connected: true,
              },
            ],
            selectedClientId: "1234",
          })
        )
      })

      it("should grab orphaned commands for this connection", () => {
        const updatedState = reducer(
          buildState({
            orphanedCommands: [{ connectionId: 0, test: true }],
          }),
          clientConnected({ clientId: "1234", id: 0, platform: "ios" })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [
              {
                clientId: "1234",
                id: 0,
                platform: "ios",
                commands: [{ connectionId: 0, test: true }],
                connected: true,
              },
            ],
            selectedClientId: "1234",
          })
        )
      })

      it("should not switch selected connections if there are more then one", () => {
        const updatedState = reducer(
          buildState({
            connections: [
              { clientId: "1234", id: 0, platform: "ios", commands: [], connected: true },
            ],
            selectedClientId: "1234",
          }),
          clientConnected({ clientId: "5678", id: 0, platform: "ios" })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [
              { clientId: "1234", id: 0, platform: "ios", commands: [], connected: true },
              { clientId: "5678", id: 0, platform: "ios", commands: [], connected: true },
            ],
            selectedClientId: "1234",
          })
        )
      })
    })

    describe("RemoveConnection", () => {
      it("should mark a connection as disconnected", () => {
        const updatedState = reducer(
          buildState({
            connections: [{ clientId: "1234", id: 0, platform: "ios", connected: true }],
          }),
          clientDisconnected({ clientId: "1234", id: 0, platform: "ios" })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [{ clientId: "1234", id: 0, platform: "ios", connected: false }],
          })
        )
      })

      it("should not change the selected connection id if this was not the selected connection", () => {
        const updatedState = reducer(
          buildState({
            connections: [
              { clientId: "1234", id: 0, platform: "ios", connected: true },
              { clientId: "456", id: 0, platform: "ios", connected: true },
            ],
            selectedClientId: "456",
          }),
          clientDisconnected({ clientId: "1234", id: 0, platform: "ios" })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [
              { clientId: "1234", id: 0, platform: "ios", connected: false },
              { clientId: "456", id: 0, platform: "ios", connected: true },
            ],
            selectedClientId: "456",
          })
        )
      })

      it("should change the selected client id if there is another connection available", () => {
        const updatedState = reducer(
          buildState({
            connections: [
              { clientId: "1234", id: 0, platform: "ios", connected: true },
              { clientId: "456", id: 0, platform: "ios", connected: true },
            ],
            selectedClientId: "1234",
          }),
          clientDisconnected({ clientId: "1234", id: 0, platform: "ios" })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [
              { clientId: "1234", id: 0, platform: "ios", connected: false },
              { clientId: "456", id: 0, platform: "ios", connected: true },
            ],
            selectedClientId: "456",
          })
        )
      })

      it("should clear out the selected connection id if there are no other connections available", () => {
        const updatedState = reducer(
          buildState({
            connections: [{ clientId: "1234", id: 0, platform: "ios", connected: true }],
            selectedClientId: "1234",
          }),
          clientDisconnected({ clientId: "1234", id: 0, platform: "ios" })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [{ clientId: "1234", id: 0, platform: "ios", connected: false }],
            selectedClientId: null,
          })
        )
      })
    })

    describe("CommandReceived", () => {
      it("should store commands without a client id as orphaned commands", () => {
        const updatedState = reducer(
          buildState(),
          commandReceived({
            id: 0,
            date: new Date('2020-01-01T00:00:00Z'),
            deltaTime: 0,
            important: false,
            messageId: 0,
            payload: null,
            connectionId: 0,
            type: "api.response" as any,
          })
        )

        expect(updatedState).toEqual(
          buildState({
            orphanedCommands: [
              {
                id: 0,
                date: new Date('2020-01-01T00:00:00Z'),
                deltaTime: 0,
                important: false,
                messageId: 0,
                payload: null,
                connectionId: 0,
                type: "api.response" as any,
              },
            ],
          })
        )
      })

      it("should store commands with a client id in the right connection", () => {
        const updatedState = reducer(
          buildState({ connections: [{ clientId: "1234", commands: [] }] }),
          commandReceived({
            id: 0,
            date: new Date('2020-01-01T00:00:00Z'),
            deltaTime: 0,
            important: false,
            messageId: 0,
            payload: null,
            connectionId: 0,
            clientId: "1234",
            type: "api.response" as any,
          })
        )

        expect(updatedState).toEqual(
          buildState({
            connections: [
              {
                clientId: "1234",
                commands: [
                  {
                    id: 0,
                    date: new Date('2020-01-01T00:00:00Z'),
                    deltaTime: 0,
                    important: false,
                    messageId: 0,
                    payload: null,
                    connectionId: 0,
                    clientId: "1234",
                    type: "api.response" as any,
                  },
                ],
              },
            ],
          })
        )
      })
    })
  })
})
