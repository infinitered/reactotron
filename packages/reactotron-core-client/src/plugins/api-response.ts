
/**
 * Sends API request/response information.
 */
export default () => reactotron => {
  return {
    features: {
      apiResponse: (request, response, duration) => {
        const ok =
          response &&
          response.status &&
          typeof response.status === "number" &&
          response.status >= 200 &&
          response.status <= 299
        const important = !ok
        reactotron.send("api.response", { request, response, duration }, important)
      },
    },
  }
}
