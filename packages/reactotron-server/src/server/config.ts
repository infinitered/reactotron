import * as fs from "fs"

export function getConfig(configPath: string) {
  const configPathTrimmed = configPath.trim()

  let config = {
    webPort: 4000,
    reactotronPort: 9091,
  }

  if (fs.existsSync(configPathTrimmed)) {
    try {
      const configContents = fs.readFileSync(configPathTrimmed, "utf8")
      const userConfig = JSON.parse(configContents)

      if (userConfig) {
        config = {
          ...config,
          ...userConfig,
        }
      }
    } catch {
      console.error(`Failed trying to read the config file at ${configPathTrimmed}`)
    }
  }

  return config
}
