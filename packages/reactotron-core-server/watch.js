const watch = require('node-watch')
const execa = require('execa')

watch('src', { recursive: true }, async (evt, name) => {
  await execa('npm', ['run', 'build', '-s'], { stdio: 'inherit' })
})
