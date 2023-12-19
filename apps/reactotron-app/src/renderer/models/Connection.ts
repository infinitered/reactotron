import { type Instance, t } from "mobx-state-tree"

export const ConnectionModel = t.model({
  // clientId: t.string,
  // type: t.string,
  // name: t.string,
  // description: t.string,
  // host: t.string,
  // port: t.number,
  // connected: t.boolean,
  // features: t.array(t.string),
  // platform: t.string,
  // platformVersion: t.string,
  // osRelease: t.string,
  // userAgent: t.string,
})

export type Connection = Instance<typeof ConnectionModel>
