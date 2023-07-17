import filterCommands, { filterSearch, filterHidden } from "./index"
import { CommandType } from "reactotron-core-contract"

const TEST_COMMANDS = [
  { type: "SEARCHTYPE" },
  { type: "ADUMMYOBJ", payload: { message: "SEARCHMESSAGE" } },
  { type: "ADUMMYOBJ", payload: { preview: "SEARCHPREVIEW" } },
  { type: "ADUMMYOBJ", payload: { name: "SEARCHNAME" } },
  { type: "ADUMMYOBJ", payload: { path: "SEARCHPATH" } },
  { type: "ADUMMYOBJ", payload: { triggerType: "SEARCHTRIGGERTYPE" } },
  { type: "ADUMMYOBJ", payload: { description: "SEARCHDESCRIPTION" } },
  { type: "ADUMMYOBJ", payload: { request: { url: "SEARCHURL" } } },
  { type: "log", payload: { debug: "LOGDEBUG" } },
  { type: "client.intro", payload: { connection: "SEARCHCONNECTION" } },
]

const TESTS = [
  { name: "type", search: "SEARCHTYPE", result: [{ type: "SEARCHTYPE" }] },
  {
    name: "payload.message",
    search: "SEARCHMESSAGE",
    result: [{ type: "ADUMMYOBJ", payload: { message: "SEARCHMESSAGE" } }],
  },
  {
    name: "payload.preview",
    search: "SEARCHPREVIEW",
    result: [{ type: "ADUMMYOBJ", payload: { preview: "SEARCHPREVIEW" } }],
  },
  {
    name: "payload.name",
    search: "SEARCHNAME",
    result: [{ type: "ADUMMYOBJ", payload: { name: "SEARCHNAME" } }],
  },
  {
    name: "payload.path",
    search: "SEARCHPATH",
    result: [{ type: "ADUMMYOBJ", payload: { path: "SEARCHPATH" } }],
  },
  {
    name: "payload.triggerType",
    search: "SEARCHTRIGGERTYPE",
    result: [{ type: "ADUMMYOBJ", payload: { triggerType: "SEARCHTRIGGERTYPE" } }],
  },
  {
    name: "payload.description",
    search: "SEARCHDESCRIPTION",
    result: [{ type: "ADUMMYOBJ", payload: { description: "SEARCHDESCRIPTION" } }],
  },
  {
    name: "payload.request.url",
    search: "SEARCHURL",
    result: [{ type: "ADUMMYOBJ", payload: { request: { url: "SEARCHURL" } } }],
  },
  {
    name: "log => debug",
    search: "debug",
    result: [{ type: "log", payload: { debug: "LOGDEBUG" } }],
  },
  {
    name: "log => warning",
    search: "warning",
    result: [{ type: "log", payload: { debug: "LOGDEBUG" } }],
  },
  {
    name: "log => error",
    search: "error",
    result: [{ type: "log", payload: { debug: "LOGDEBUG" } }],
  },
  {
    name: "clientIntro => connection",
    search: "connection",
    result: [{ type: "client.intro", payload: { connection: "SEARCHCONNECTION" } }],
  },
  {
    name: "multiple results",
    search: "ADUMMYOBJ",
    result: [
      { type: "ADUMMYOBJ", payload: { message: "SEARCHMESSAGE" } },
      { type: "ADUMMYOBJ", payload: { preview: "SEARCHPREVIEW" } },
      { type: "ADUMMYOBJ", payload: { name: "SEARCHNAME" } },
      { type: "ADUMMYOBJ", payload: { path: "SEARCHPATH" } },
      { type: "ADUMMYOBJ", payload: { triggerType: "SEARCHTRIGGERTYPE" } },
      { type: "ADUMMYOBJ", payload: { description: "SEARCHDESCRIPTION" } },
      { type: "ADUMMYOBJ", payload: { request: { url: "SEARCHURL" } } },
    ],
  },
]

describe("utils/filterCommands", () => {
  describe("filterSearch", () => {
    TESTS.forEach((test) => {
      it(`should search in '${test.name}'`, () => {
        const result = filterSearch(TEST_COMMANDS, test.search)

        expect(result).toEqual(test.result)
      })
    })
  })

  describe("filterHidden", () => {
    it("should filter out only command types that are in the list", () => {
      const result = filterHidden(TEST_COMMANDS, [CommandType.ClientIntro])

      expect(result).toEqual(TEST_COMMANDS.filter((tc) => tc.type !== CommandType.ClientIntro))
    })
  })

  describe("filterCommands", () => {
    TESTS.forEach((test) => {
      it(`should search in '${test.name}'`, () => {
        const result = filterCommands(TEST_COMMANDS, test.search, [])

        expect(result).toEqual(test.result)
      })
    })

    it("should filter out only command types that are in the list", () => {
      const result = filterCommands(TEST_COMMANDS, "", [CommandType.ClientIntro])

      expect(result).toEqual(TEST_COMMANDS.filter((tc) => tc.type !== CommandType.ClientIntro))
    })
  })
})
