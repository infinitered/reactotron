import { decode as utf8Decode } from "./utf8-helpers"

const pako = require("pako")

export default {
  byteArrayToStr: (byteArray, method = "auto") => {
    let actualMethod
    if (method === "auto") {
      if (byteArray.length > 1) {
        // cf. http://www.zlib.org/rfc-gzip.html
        const ID1 = byteArray[0]
        const ID2 = byteArray[1]
        if (ID1 === 31 && ID2 === 139) {
          actualMethod = "gzip"
        } else {
          actualMethod = "string"
        }
      } else {
        actualMethod = method
      }
    }
    switch (actualMethod) {
      case "string":
        return utf8Decode(byteArray)
      case "gzip":
        return pako.inflate(byteArray, { to: "string" })
      default:
        throw new Error(`Invalid byte array to string method: ${method}`)
    }
  },
}
