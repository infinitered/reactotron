import type { ReactotronCore, Plugin } from "../reactotron-core-client"

type AnyFunction = (...args: any[]) => any
export type AcceptableRepls = object | AnyFunction | string | number

const repl = () => (reactotron: ReactotronCore) => {
  const myRepls: { [key: string]: AcceptableRepls } = {}
  // let currentContext = null
  return {
    onCommand: ({ type, payload }) => {
      if (type.substr(0, 5) !== "repl.") return

      switch (type.substr(5)) {
        case "ls":
          reactotron.send("repl.ls.response", Object.keys(myRepls))
          break
        // case "cd":
        //   const changeTo = myRepls.find(r => r.name === payload)
        //   if (!changeTo) {
        //     reactotron.send("repl.cd.response", "That REPL does not exist")
        //     break
        //   }
        //   currentContext = payload
        //   reactotron.send("repl.cd.response", `Change REPL to "${payload}"`)
        //   break
        case "execute":
          // if (!currentContext) {
          //   reactotron.send(
          //     "repl.execute.response",
          //     "You must first select the REPL to use. Try 'ls'"
          //   )
          //   break
          // }
          // const currentRepl = myRepls.find(r => r.name === currentContext)
          // if (!currentRepl) {
          //   reactotron.send("repl.execute.response", "The selected REPL no longer exists.")
          //   break
          // }
          reactotron.send(
            "repl.execute.response",
            function () {
              return eval(payload) // eslint-disable-line no-eval
            }.call(myRepls)
          )
          break
      }
    },
    features: {
      repl: (name: string, value: AcceptableRepls) => {
        if (!name) {
          throw new Error("You must provide a name for your REPL")
        }

        if (myRepls[name]) {
          throw new Error("You are already REPLing an item with that name")
        }

        myRepls[name] = value
      },
    },
  } satisfies Plugin<ReactotronCore>
}
export default repl
