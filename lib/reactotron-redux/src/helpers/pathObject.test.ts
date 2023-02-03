import pathObject from "./pathObject"

describe("pathObject", () => {
  it("should return the entire object if a null is passed", () => {
    const obj = { isThis: { here: true } }
    const path = null

    const pathedObj = pathObject(path, obj)

    expect(pathedObj).toEqual(obj)
  })

  it("should return the entire object if a empty string is passed", () => {
    const obj = { isThis: { here: true } }
    const path = ""

    const pathedObj = pathObject(path, obj)

    expect(pathedObj).toEqual(obj)
  })

  it("should return the section of object if a single level path is passed", () => {
    const obj = { isThis: { here: true } }
    const path = "isThis"

    const pathedObj = pathObject(path, obj)

    expect(pathedObj).toEqual(obj.isThis)
  })

  it("should return the section of object if a two level path is passed", () => {
    const obj = { isThis: { here: true } }
    const path = "isThis.here"

    const pathedObj = pathObject(path, obj)

    expect(pathedObj).toEqual(true)
  })

  it("should return the section of object if a three level path is passed", () => {
    const obj = { isThis: { here: { again: true } } }
    const path = "isThis.here.again"

    const pathedObj = pathObject(path, obj)

    expect(pathedObj).toEqual(true)
  })

  it("should return undefined of object if an invalid path is passed on level one", () => {
    const obj = { isThis: { here: { again: true } } }
    const path = "isThis2.here.again"

    const pathedObj = pathObject(path, obj)

    expect(pathedObj).toEqual(undefined)
  })

  it("should return undefined of object if an invalid path is passed on level two", () => {
    const obj = { isThis: { here: { again: true } } }
    const path = "isThis.here2.again"

    const pathedObj = pathObject(path, obj)

    expect(pathedObj).toEqual(undefined)
  })

  it("should return undefined of object if an invalid path is passed on level three", () => {
    const obj = { isThis: { here: { again: true } } }
    const path = "isThis.here.again2"

    const pathedObj = pathObject(path, obj)

    expect(pathedObj).toEqual(undefined)
  })
})
