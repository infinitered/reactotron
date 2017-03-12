import test from 'ava'
import serialize from '../src/serialize'

test('serializes objects', t => {
  const mock = { x: 1 }
  const actual = serialize(mock)
  const expected = `{"x":1}`

  t.deepEqual(actual, expected)
})

test('serializes arrays', t => {
  const mock = { x: [1, 2, 3] }
  const actual = serialize(mock)
  const expected = `{"x":[1,2,3]}`

  t.deepEqual(actual, expected)
})

test('serializes nested objects', t => {
  const mock = { x: { y: 1 } }
  const actual = serialize(mock)
  const expected = `{"x":{"y":1}}`

  t.deepEqual(actual, expected)
})

test('detects circular nested refs', t => {
  const parent = {}
  const child = { parent }
  parent.child = child

  const actual = serialize(parent)
  const expected = `{"child":{"parent":"~~~ Circular Reference ~~~"}}`

  t.deepEqual(actual, expected)
})

test('medium sized funk', t => {
  const mockPayload = {}
  const o = {}
  o.foo = { x: 1 }
  o.bar = o
  mockPayload.string = 'String'
  mockPayload.number = 69
  mockPayload.object = o
  mockPayload.list = [
    o,
    mockPayload.string,
    'literally a string',
    mockPayload.number,
    o
  ]
  mockPayload.fn = function hello () {}
  mockPayload.anonymous = () => {}

  const actual = JSON.parse(serialize(mockPayload))
  t.is(actual.string, 'String')
  t.is(actual.number, 69)
  t.is(actual.object.foo.x, 1)
  t.is(actual.object.bar, '~~~ Circular Reference ~~~')
  t.is(actual.list[0], '~~~ Circular Reference ~~~')
  t.is(actual.list[1], 'String')
  t.is(actual.list[2], 'literally a string')
  t.is(actual.list[3], 69)
  t.is(actual.list[4], '~~~ Circular Reference ~~~')
  t.is(actual.fn, '~~~ hello() ~~~')
  t.is(actual.anonymous, '~~~ Anonymous Function ~~~')
})
