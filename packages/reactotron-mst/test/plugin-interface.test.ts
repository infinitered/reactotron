import test from "ava"
import { mst } from "../src/reactotron-mst"

test("factory interface", t => {
  t.is(typeof mst(), "function")
})

test("plugin interface", t => {
  const plugin = mst()({})

  t.is(typeof plugin, "object")
  t.is(typeof plugin.onCommand, "function")
  t.is(typeof plugin.features, "object")
  t.is(typeof plugin.features.trackMstNode, "function")
})
