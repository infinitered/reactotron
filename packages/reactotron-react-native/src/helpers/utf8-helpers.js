// Adapted from https://stackoverflow.com/questions/8936984

const EOF_byte = -1
const EOF_code_point = -1

const encoderError = code_point => {
  console.error("UTF8 encoderError", code_point)
}

const decoderError = (fatal, opt_code_point) => {
  if (fatal) console.error("UTF8 decoderError", opt_code_point)
  return opt_code_point || 0xfffd
}

const inRange = (a, min, max) => {
  return min <= a && a <= max
}

const div = (n, d) => {
  return Math.floor(n / d)
}

const stringToCodePoints = string => {
  /** @type {Array.<number>} */
  const cps = []
  // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
  let i = 0
  const n = string.length
  while (i < string.length) {
    const c = string.charCodeAt(i)
    if (!inRange(c, 0xd800, 0xdfff)) {
      cps.push(c)
    } else if (inRange(c, 0xdc00, 0xdfff)) {
      cps.push(0xfffd)
    } else if (i === n - 1) {
      // (inRange(c, 0xD800, 0xDBFF))
      cps.push(0xfffd)
    } else {
      const d = string.charCodeAt(i + 1)
      if (inRange(d, 0xdc00, 0xdfff)) {
        const a = c & 0x3ff
        const b = d & 0x3ff
        i += 1
        cps.push(0x10000 + (a << 10) + b)
      } else {
        cps.push(0xfffd)
      }
    }
    i += 1
  }
  return cps
}

export function encode(str) {
  let pos = 0
  const codePoints = stringToCodePoints(str)
  const outputBytes = []

  while (codePoints.length > pos) {
    const code_point = codePoints[pos++]

    if (inRange(code_point, 0xd800, 0xdfff)) {
      encoderError(code_point)
    } else if (inRange(code_point, 0x0000, 0x007f)) {
      outputBytes.push(code_point)
    } else {
      let count = 0
      let offset = 0
      if (inRange(code_point, 0x0080, 0x07ff)) {
        count = 1
        offset = 0xc0
      } else if (inRange(code_point, 0x0800, 0xffff)) {
        count = 2
        offset = 0xe0
      } else if (inRange(code_point, 0x10000, 0x10ffff)) {
        count = 3
        offset = 0xf0
      }

      outputBytes.push(div(code_point, 64 ** count) + offset)

      while (count > 0) {
        const temp = div(code_point, 64 ** (count - 1))
        outputBytes.push(0x80 + (temp % 64))
        count -= 1
      }
    }
  }
  return new Uint8Array(outputBytes)
}

export function decode(data) {
  const fatal = false
  let pos = 0
  let result = ""
  let code_point
  let utf8_code_point = 0
  let utf8_bytes_needed = 0
  let utf8_bytes_seen = 0
  let utf8_lower_boundary = 0

  while (data.length > pos) {
    const byte = data[pos++]

    if (byte === this.EOF_byte) {
      if (utf8_bytes_needed !== 0) {
        code_point = decoderError(fatal)
      } else {
        code_point = EOF_code_point
      }
    } else if (utf8_bytes_needed === 0) {
      if (inRange(byte, 0x00, 0x7f)) {
        code_point = byte
      } else {
        if (inRange(byte, 0xc2, 0xdf)) {
          utf8_bytes_needed = 1
          utf8_lower_boundary = 0x80
          utf8_code_point = byte - 0xc0
        } else if (inRange(byte, 0xe0, 0xef)) {
          utf8_bytes_needed = 2
          utf8_lower_boundary = 0x800
          utf8_code_point = byte - 0xe0
        } else if (inRange(byte, 0xf0, 0xf4)) {
          utf8_bytes_needed = 3
          utf8_lower_boundary = 0x10000
          utf8_code_point = byte - 0xf0
        } else {
          decoderError(fatal)
        }
        utf8_code_point *= 64 ** utf8_bytes_needed
        code_point = null
      }
    } else if (!inRange(byte, 0x80, 0xbf)) {
      utf8_code_point = 0
      utf8_bytes_needed = 0
      utf8_bytes_seen = 0
      utf8_lower_boundary = 0
      pos--
      code_point = decoderError(fatal, byte)
    } else {
      utf8_bytes_seen += 1
      utf8_code_point += (byte - 0x80) * 64 ** (utf8_bytes_needed - utf8_bytes_seen)

      if (utf8_bytes_seen !== utf8_bytes_needed) {
        code_point = null
      } else {
        const cp = utf8_code_point
        const lower_boundary = utf8_lower_boundary
        utf8_code_point = 0
        utf8_bytes_needed = 0
        utf8_bytes_seen = 0
        utf8_lower_boundary = 0
        if (inRange(cp, lower_boundary, 0x10ffff) && !inRange(cp, 0xd800, 0xdfff)) {
          code_point = cp
        } else {
          code_point = decoderError(fatal, byte)
        }
      }
    }
    // Decode string
    if (code_point !== null && code_point !== EOF_code_point) {
      if (code_point <= 0xffff) {
        if (code_point > 0) result += String.fromCharCode(code_point)
      } else {
        code_point -= 0x10000
        result += String.fromCharCode(0xd800 + ((code_point >> 10) & 0x3ff))
        result += String.fromCharCode(0xdc00 + (code_point & 0x3ff))
      }
    }
  }
  return result
}
