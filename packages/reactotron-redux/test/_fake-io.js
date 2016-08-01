export default (x) => {
  return {
    on: (command, callback) => true,
    emit: () => true
  }
}
