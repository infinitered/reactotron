declare module "reactotron-react-native" {
  export interface ReactotronConfigureOptions {
    name?: string
    host?: string
    port?: number
    userAgent?: string
    reactotronVersion?: string
    environment?: string
  }

  export interface ReactotronImageOptions {
    uri: string
    preview?: string
    filename?: string
    width?: number
    height?: number
    caption?: string
  }

  export interface ReactotronDisplayOptions {
    name: string
    value?: any
    preview?: string
    important?: boolean
    image?: string | ReactotronImageOptions
  }

  export interface ReactotronStackFrame {
    methodName?: string
    lineNumber?: number
    column?: number
    file?: string
  }

  export interface ReactotronUseReactNativeAsync {
    ignore: string[]
  }

  export interface ReactotronUseReactNativeNetworking {
    ignoreContentTypes?: RegExp
    ignoreUrls?: RegExp
  }

  export interface ReactotronUseReactNativeEditor {
    url?: string
  }

  export interface ReactotronUseReactNativeErrors {
    veto: (stackFrame: ReactotronStackFrame) => boolean
  }

  export interface ReactotronUseReactNativeOptions {
    asyncStorage?: false | ReactotronUseReactNativeAsync
    networking?: false | ReactotronUseReactNativeNetworking
    editor?: false | ReactotronUseReactNativeEditor
    errors?: false | ReactotronUseReactNativeErrors
    overlay?: false
  }

  export interface ReactotronBenchmark {
    /**
     * Completes a step of the benchmark and assigns a name.
     */
    step: (name?: string) => void
    /**
     * Finishes up the last step of the benchmark, assigns a name, and sends
     * the results up to the Reactotron app.
     */
    stop: (name?: string) => void
  }

  export interface ReactotronCommand {
    /**
     * The type of command.
     */
    type: string
    /**
     * The data belonging to the command.
     */
    payload: any
  }

  export interface ReactotronPlugin {
    /**
     * Additional functions or objects to place on the Reactotron namespace.
     */
    features?: { [name: string]: any }
    /**
     * Fires when a command from the reactotron app arrives.
     */
    onCommand?: (command: ReactotronCommand) => void
    /**
     * Fires when connecting to the reactotron app.
     */
    onConnect?: () => void
    /**
     * Fires when disconnected from the reactotron app.
     */
    onDisconnect?: () => void
  }

  // export type ReactotronUseMiddleware = (tron?: Reactotron) => ReactotronMiddleware

  /**
   * Reactotron.
   */
  export interface Reactotron {
    /**
     * Configure some settings such as host & port.
     */
    configure(options?: ReactotronConfigureOptions): Reactotron

    /**
     * Connect to the Reactotron app.
     */
    connect(): Reactotron

    /**
     * Closes the active connection.
     */
    close()

    /**
     * Use the pack of ReactNative plugins.
     */
    useReactNative(options?: ReactotronUseReactNativeOptions): Reactotron

    /**
     * Registers a plugin.
     */
    use(middleware: (tron: Reactotron) => ReactotronPlugin): Reactotron

    /**
     * Clears the Reactotron app.
     */
    clear(): void

    /**
     * Prints a value such a string, object, or array.
     *
     * This is the same as console.log, except it sends it to the Reactotron app.
     *
     * @param value Anything you'd like to log.
     */
    log(...value: any[]): void

    /**
     * Prints a value such a string, object, or array.  It prints it highlighted
     * within the Reactotron app so it's visually easy to recognize.  Great if you
     * have a lot of messages flowing.
     *
     * @param value The value to log.
     */
    logImportant(...value: any[]): void

    /**
     * Logs an error with a stack trace.
     *
     * @param error
     * @param stack
     */
    error(error: any, stack?: any): void

    /**
     * Prints a custom display message.
     */
    display(options: ReactotronDisplayOptions): void

    /**
     * Displays an image.
     *
     * @param options The image options.
     */
    image(options: ReactotronImageOptions): void

    /**
     * Provides a way to manually sourcemap an error and report the
     * results to the Reactotron app.
     *
     * Generally you won't need to do this, however, there are certain
     * types of errors in React Native that don't seem to do this by
     * default.
     *
     * Yes, I'm looking at you Promise-based errors.
     *
     * @param error The error object.
     */
    reportError?(error: any): void

    /**
     * Starts a new benchmark.
     * 
     * @param title The name of the benchmark.
     */
    benchmark(title?: string): ReactotronBenchmark
  }

  var instance: Reactotron

  export { instance as default }
}
