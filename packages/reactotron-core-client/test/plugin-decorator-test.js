import test from 'ava'
import { createClient } from '../src'
import decorate from '../src/plugins/decorator'
import io from './_fake-io'

test('attaches with a default name', t => {
  const client = createClient({ io })
  const victim = {}
  const plugin = decorate(victim)
  client.use(plugin)
  t.is(victim.reactotron, client)
})

test('attaches with a custom name', t => {
  const client = createClient({ io })
  const victim = {}
  const plugin = decorate(victim, 'lol')
  client.use(plugin)
  t.is(victim.lol, client)
})

test('victim must be an object', t => {
  const client = createClient({ io })
  t.throws(() => client.use(decorate(null)))
  t.throws(() => client.use(decorate(1)))
  t.throws(() => client.use(decorate('')))
  t.throws(() => client.use(decorate(undefined)))
})
