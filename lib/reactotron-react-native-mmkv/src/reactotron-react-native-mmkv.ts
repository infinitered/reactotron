import { type MMKV } from "react-native-mmkv"
import type { ReactotronCore } from "reactotron-core-client"

export interface MmkvPluginConfig {
  /**
   * MMKV storage instance
   * @example
   * import { MMKV } from "react-native-mmkv"
   * const storage = new MMKV()
   */
  storage: MMKV
  /** Storage keys you want to ignore */
  ignore?: Array<string>
}

interface Listener {
  remove: () => void
}

/**
 * Reactotron plugin to log MMKV storage changes
 *
 * @example
 * import { MMKV } from 'react-native-mmkv'
 * import type { ReactotronReactNative } from 'reactotron-react-native'
 * // create your storage instance
 * const storage = new MMKV()
 *
 * // pass your instance to the plugin
 * Reactotron.use(mmkvPlugin<ReactotronReactNative>({ storage }))
 */
export default function mmkvPlugin<Client extends ReactotronCore = ReactotronCore>(
  config: MmkvPluginConfig
) {
  /** This gives us the ability to ignore specific writes for less noise */
  const ignore = config.ignore ?? []

  let listener: Listener | undefined

  return (reactotron: Client) => {
    const log = ({
      value,
      preview,
    }: {
      value: string | number | boolean | object
      preview: string
    }) => {
      reactotron.display({
        name: "MMKV",
        value,
        preview,
        important: true,
      })
    }
    return {
      onConnect() {
        listener = config.storage.addOnValueChangedListener((key) => {
          const keyIsIgnored = ignore.includes(key)
          if (keyIsIgnored) return
          const value = config.storage.getString(key) ?? "undefined"
          log({
            value: { key, value },
            preview: `Set "${key}" to ${value}`,
          })
        })
      },
      onDisconnect() {
        listener?.remove()
      },
    }
  }
}
