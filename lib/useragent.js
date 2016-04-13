// I would have never figured this out by myself.
//
// http://stackoverflow.com/questions/29408492/is-it-possible-to-combine-react-native-with-socket-io

// This needs to be in a file itself.
if (window.navigator && Object.keys(window.navigator).length === 0) {
  window = Object.assign(window, {navigator: {userAgent: 'Its Me.  Socket man.'}});
}
