import createLayout from './layout'
import createDrawing from './drawing'
import createInteractions from './interactions'

// little boxes on the hillside, little boxes made of ticky tacky
const layout = createLayout()

// helper drawer
const drawing = createDrawing(layout, {
  apiLoggingStyle: 'short', // short | full
  stateActionLoggingStyle: 'short' // short | full
})
const interactions = createInteractions(layout, drawing)

// glue them together like a superband and hope they don't clobber each other
const ui = {
  ...layout,
  ...drawing,
  ...interactions
}

export default ui
