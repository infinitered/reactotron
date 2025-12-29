const STATIC_DATA = []

export default (() => {
  const parsed = JSON.parse(JSON.stringify(STATIC_DATA))
  return parsed
})()
