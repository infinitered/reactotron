// This function probably sucks but that is ok for now.
export function isShallow(value: object) {
  return (
    !(Object.keys(value)
      .map(v => typeof value[v])
      .filter(v => v === "object").length > 0)
  )
}
