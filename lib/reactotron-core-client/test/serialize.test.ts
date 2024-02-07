import serialize from "../src/serialize"

test("serializes objects", () => {
  const mock = { x: 1 }
  const actual = serialize(mock)
  const expected = `{"x":1}`

  expect(actual).toEqual(expected)
})

test("serializes arrays", () => {
  const mock = { x: [1, 2, 3] }
  const actual = serialize(mock)
  const expected = `{"x":[1,2,3]}`

  expect(actual).toEqual(expected)
})

test("serializes BigInts", () => {
  const mock = {
    x: [BigInt(1), BigInt(2), BigInt(3)],
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision, no-loss-of-precision
    y: [BigInt(12345678901234567890), BigInt(2345434553442342345235243234)],
  }
  const actual = serialize(mock)
  const expected = `{"x":["1","2","3"],"y":["12345678901234567168","2345434553442342324832043008"]}`

  expect(actual).toEqual(expected)
})

test("serializes nested objects", () => {
  const mock = { x: { y: 1 } }
  const actual = serialize(mock)
  const expected = `{"x":{"y":1}}`

  expect(actual).toEqual(expected)
})

test("detects circular nested refs", () => {
  const parent: any = {}
  const child: any = { parent }
  parent.child = child

  const actual = serialize(parent)
  const expected = `{"child":{"parent":"~~~ Circular Reference ~~~"}}`

  expect(actual).toEqual(expected)
})

test("medium sized funk", () => {
  const mockPayload: any = {}
  const o: any = {}
  o.foo = { x: 1 }
  o.bar = o
  mockPayload.string = "String"
  mockPayload.number = 69
  mockPayload.object = o
  mockPayload.list = [o, mockPayload.string, "literally a string", mockPayload.number, o]
  function hello() {
    // Intentionally empty
  }
  mockPayload.fn = hello
  mockPayload.anonymous = () => {}
  mockPayload.bigInt = BigInt(1212)

  const actual = JSON.parse(serialize(mockPayload))
  expect(actual.string).toBe("String")
  expect(actual.number).toBe(69)
  expect(actual.object.foo.x).toBe(1)
  expect(actual.object.bar).toBe("~~~ Circular Reference ~~~")
  expect(actual.list[0]).toEqual({ foo: { x: 1 }, bar: "~~~ Circular Reference ~~~" })
  expect(actual.list[1]).toBe("String")
  expect(actual.list[2]).toBe("literally a string")
  expect(actual.list[3]).toBe(69)
  expect(actual.list[4]).toEqual({ foo: { x: 1 }, bar: "~~~ Circular Reference ~~~" })
  expect(actual.fn).toBe("~~~ hello() ~~~")
  expect(actual.anonymous).toBe("~~~ anonymous function ~~~")
  expect(actual.bigInt).toBe("1212")
})
