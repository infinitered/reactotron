import { decode as utf8Decode } from "./utf8-helpers"

const pako = require("pako")

export default {
  byteArrayToStr: (byteArray, method = "auto") => {
    let actualMethod = method
    if (method === "auto") {
      if (byteArray.length > 1) {
        // cf. http://www.zlib.org/rfc-gzip.html
        const ID1 = byteArray[0]
        const ID2 = byteArray[1]
        if (ID1 === 31 && ID2 === 139) {
          actualMethod = "gzip"
        } else {
          actualMethod = "utf-8"
        }
      } else {
        actualMethod = "utf-8"
      }
    }
    switch (actualMethod) {
      case "utf-8":
        return utf8Decode(byteArray)
      case "gzip":
        return pako.inflate(byteArray, { to: "string" })
      default:
        throw new Error(`Invalid byte array to string method: ${method}`)
    }
  },
}
