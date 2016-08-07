import layout from './layout'
import drawing from './drawing'

export default {
  ...layout,
  ...drawing(layout)
}
