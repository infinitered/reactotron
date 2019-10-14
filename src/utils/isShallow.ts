export default (value: object) => {
  if (Array.isArray(value)) {
    return !value.some(v => typeof v === "object")
  }

  const keys = Object.keys(value)
  return !keys.some(v => typeof (value as any)[v] === "object")
}
