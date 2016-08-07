import layout from './uiLayout'
import drawing from './uiDrawing'

export default {
  ...layout,
  ...drawing(layout)
}
