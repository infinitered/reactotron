export function apiRequestToCurl (payload: any = {}) {
  const output = []
  const request = payload.request || {}
  const { method, headers, data, url } = request

  if (method === "GET") {
    output.push("curl")
  } else {
    output.push(`curl -X ${method} `)
  }

  for (const header in headers) {
    output.push(` -H "${header}:${headers[header]}"`)
  }

  output.push(` ${url}`)

  if (data) {
    let parsedData = data
    try {
      if (typeof data === "string") {
        parsedData = JSON.parse(parsedData)
      }
      parsedData = JSON.stringify(parsedData)
    } catch (e) {}
    output.push(` -d '${parsedData}'`)
  }

  return output.join("")
}
