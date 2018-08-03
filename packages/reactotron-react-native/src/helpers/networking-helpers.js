import helpers from "./byteArray-helpers"

const responseToString = xhttp => {
  try {
    switch (xhttp.responseType) {
      case "": // Defaults to text
      case "text":
        return xhttp.responseText
      case "arraybuffer": {
        const { response } = xhttp
        const contentEncoding = xhttp.getResponseHeader("Content-Encoding")
        if (contentEncoding === "gzip") {
          const byteArray = new Uint8Array(response)
          return helpers.byteArrayToStr(byteArray)
        }
        return response
      }
      default:
        throw new Error("Could not convert response to string, unhandled response type")
    }
  } catch (e) {
    throw new Error(`Could not convert response to string\n${e}`)
  }
}

export default {
  responseToString,
}
