import { escapeRegex } from "./escape-regex"

it("should return same string when no special characters", () => {
  expect(escapeRegex("hello")).toBe("hello")
})
it("should escape dot character", () => {
  expect(escapeRegex("hello.world")).toBe("hello\\.world")
})
it("should escape multiple special characters", () => {
  expect(escapeRegex("(test)*")).toBe("\\(test\\)\\*")
})
it("should escape all regex special characters", () => {
  const specialChars = ".*+?^${}()|[]\\"
  const expected = "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\"
  expect(escapeRegex(specialChars)).toBe(expected)
})
it("should handle empty string", () => {
  expect(escapeRegex("")).toBe("")
})
