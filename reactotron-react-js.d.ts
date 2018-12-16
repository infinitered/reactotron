declare module 'reactotron-react-js' {
  export interface ReactotronConfigureOptions {
    name?: string;
    host?: string;
    port?: number;
    userAgent?: string;
    reactotronVersion?: string;
    environment?: string;
    secure?: boolean;
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
    features?: { [name: string]: any };
    /**
     * Fires when a command from the reactotron app arrives.
     */
    onCommand?: (command: ReactotronCommand) => void;
    /**
     * Fires when connecting to the reactotron app.
     */
    onConnect?: () => void;
    /**
     * Fires when disconnected from the reactotron app.
     */
    onDisconnect?: () => void;
  }

  export interface Reactotron {
    /**
     * Configure some settings such as host & port.
     */
    configure(options?: ReactotronConfigureOptions): Reactotron;

    /**
     * Registers a plugin.
     */
    use(middleware: (tron: Reactotron) => ReactotronPlugin): Reactotron;

    /**
     * Connect to the Reactotron app.
     */
    connect(): Reactotron;
  }

  export interface ReactotronTrackGlobalErrorsOptions {
    offline?: boolean;
  }

  /**
   * Provides a global error handler to report errors with sourcemap lookup.
   */
  export function trackGlobalErrors(options?: ReactotronTrackGlobalErrorsOptions): any;

  var instance: Reactotron;

  export { instance as default };
}
