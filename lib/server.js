import express from 'express'
import TerminalKit from 'terminal-kit'
import bodyParser from 'body-parser'
import prettyJson from 'prettyjson'
import R from 'ramda'

const PORT = 7890
const term = TerminalKit.terminal
const app = express()
app.use(bodyParser.json())

app.post('/log', (req, res) => {
  const type = R.toUpper(req.body.type)
  const msg = req.body.message
  term.cyan(`[${type}]\n`)
  // term(JSON.stringify(msg, null, 2))
  console.log(prettyJson.render(msg, {
    keysColor: 'red',
    dashColor: 'magenta',
    stringColor: 'white'
  }))
  term('\n')
  res.json({})
})

app.listen(PORT, () => {
  term.bold('---------------\n')
  term.bold('REPLsauce time!\n')
  term.bold('---------------\n\n')

  term(`Listening on port ${PORT}.\n`)
})
