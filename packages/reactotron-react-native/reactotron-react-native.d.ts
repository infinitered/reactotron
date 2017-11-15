declare module 'reactotron-react-native' {
  export interface ReactotronConfigureOptions {
    name?: string
    host?: string
    port?: number
    userAgent?: string
    reactotronVersion?: string
    environment?: string
  }

  export interface ReactotronDisplayOptions {
    name: string
    value?: any
    preview?: string
    important?: boolean
    image?: string
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
    ignoreContentTypes?: RegExpConstructor
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
     * Use the pack of ReactNative plugins.
     */
    useReactNative(options?: ReactotronUseReactNativeOptions): Reactotron

    /**
     * Clears the Reactotron app.
     */
    clear(): void

    /**
     * Prints a value such a string, object, or array.
     *
     * Examples:
     *
     * ```js
     *   .log('hi')
     *   .log({ objects: 'can', go: 'here' })
     *   .log([1,2,3], true)
     * ```
     *
     * @param {value} The value to launch.
     * @param {important} If true, the value will be highlighted.
     *
     */
    log(value: any, important?: boolean): void
    error(value: any): void

    /**
     * Prints a custom display message.
     */
    display(options: ReactotronDisplayOptions): void
  }

  var instance: Reactotron

  export { instance as default }
}
