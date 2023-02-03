export default function pathObject(path: string, obj: any) {
  if (!path) return obj

  const splitPaths = path.split(".")

  let pathedObj = obj

  for (let i = 0; i < splitPaths.length; i++) {
    const curPath = splitPaths[i]
    pathedObj = pathedObj[curPath]

    if (i < splitPaths.length - 1 && typeof pathedObj !== "object") {
      pathedObj = undefined
      break
    }
  }

  return pathedObj
}
