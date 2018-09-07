import * as fs from "fs"

export interface ReactotronServerConfig {
  webPort: number
  reactotronPort: number
}

const DEFAULTS: ReactotronServerConfig = {
  webPort: 4000,
  reactotronPort: 9090,
}

export function getConfig(configPath: string): ReactotronServerConfig {
  const configPathTrimmed = configPath ? configPath.trim() : ""

  let config: ReactotronServerConfig = { ...DEFAULTS }

  if (configPath && fs.existsSync(configPathTrimmed)) {
    try {
      const configContents = fs.readFileSync(configPathTrimmed, "utf8")
      const userConfig = JSON.parse(configContents)

      if (userConfig) {
        config = { ...config, ...userConfig }
      }
    } catch {
      console.error(`Failed trying to read the config file at ${configPathTrimmed}`)
    }
  }

  return config
}
