import Reactotron from '../../client' // in a real app, you would use 'reactotron'

Reactotron.connect({
  name: 'ReactDomExample'
})

// a little easier (albiet ghetto) way to make Reactotron available in other
// places wihout having to import it all the time.
console.tron = Reactotron
