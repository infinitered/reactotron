import objectRenderer, { OBJECT_TYPE } from "./ObjectRenderer"
import LsRenderer, { LS_TYPE } from "./LsRenderer"

export const renderTypes = {
  OBJECT_TYPE,
  LS_TYPE,
}

export default {
  ...objectRenderer,
  ...LsRenderer,
}
