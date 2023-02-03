export default (state: any) => {
    // If we have a toJS, lets assume we need to call it to get a plan 'ol JS object
    // NOTE: This handles ImmutableJS
    if (state.toJS) {
      return state.toJS()
    }

    return state
  }
