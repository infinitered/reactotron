import { createServer } from "./index"
import type { ServerOptions, WssServerOptions } from "reactotron-core-contract"

interface ParsedArgs {
  port: number
  wss?: WssServerOptions
  help: boolean
}

function parseArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {
    port: 9090,
    help: false,
  }

  const wssOptions: any = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case "--help":
      case "-h":
        result.help = true
        break

      case "--port":
      case "-p":
        if (i + 1 < args.length) {
          result.port = parseInt(args[++i], 10)
          if (isNaN(result.port)) {
            console.error(`Invalid port: ${args[i]}`)
            process.exit(1)
          }
        } else {
          console.error("--port requires a value")
          process.exit(1)
        }
        break

      case "--wss-pfx":
        if (i + 1 < args.length) {
          wssOptions.pathToPfx = args[++i]
        } else {
          console.error("--wss-pfx requires a path")
          process.exit(1)
        }
        break

      case "--wss-cert":
        if (i + 1 < args.length) {
          wssOptions.pathToCert = args[++i]
        } else {
          console.error("--wss-cert requires a path")
          process.exit(1)
        }
        break

      case "--wss-key":
        if (i + 1 < args.length) {
          wssOptions.pathToKey = args[++i]
        } else {
          console.error("--wss-key requires a path")
          process.exit(1)
        }
        break

      case "--wss-passphrase":
        if (i + 1 < args.length) {
          wssOptions.passphrase = args[++i]
        } else {
          console.error("--wss-passphrase requires a value")
          process.exit(1)
        }
        break

      default:
        console.error(`Unknown argument: ${arg}`)
        process.exit(1)
    }
  }

  // Only add wss if at least one wss option was provided
  if (Object.keys(wssOptions).length > 0) {
    result.wss = wssOptions as WssServerOptions
  }

  return result
}

function printHelp() {
  console.log(`
Reactotron Server CLI

Usage:
  reactotron-core-server [options]

Options:
  -p, --port <number>              Port to listen on (default: 9090)
  -h, --help                       Show this help message

TLS/WSS Options:
  --wss-pfx <path>                 Path to PFX certificate file
  --wss-cert <path>                Path to certificate file
  --wss-key <path>                 Path to key file
  --wss-passphrase <passphrase>    Passphrase for certificate

Examples:
  reactotron-core-server --port 9090
  reactotron-core-server --port 9090 --wss-pfx ./server.pfx --wss-passphrase mypass
  reactotron-core-server --port 9090 --wss-cert ./cert.pem --wss-key ./key.pem
`)
}

export async function run() {
  const args = process.argv.slice(2)
  const { port, wss, help } = parseArgs(args)

  if (help) {
    printHelp()
    process.exit(0)
  }

  const options: ServerOptions = { port }
  if (wss) {
    options.wss = wss
  }

  const server = createServer(options)

  server.on("start", () => {
    console.log(`✓ Reactotron server listening on port ${port}`)
    if (wss) {
      console.log("✓ TLS/WSS enabled")
    }
  })

  server.on("portUnavailable", (unavailablePort) => {
    console.error(`✗ Port ${unavailablePort} is already in use`)
    process.exit(1)
  })

  server.on("connect", () => {
    console.log("→ Client connecting...")
  })

  server.on("connectionEstablished", (conn) => {
    console.log(`✓ Connection established: ${conn.name || "Unknown"} (${conn.address})`)
  })

  server.on("disconnect", (conn) => {
    console.log(`✗ Client disconnected: ${conn.name || "Unknown"}`)
  })

  server.on("command", (cmd) => {
    // Log commands in a compact format
    if (cmd.type !== "client.intro") {
      console.log(`  ${cmd.type}`)
    }
  })

  server.on("stop", () => {
    console.log("✓ Reactotron server stopped")
  })

  // Handle graceful shutdown
  const shutdown = () => {
    console.log("\n→ Shutting down...")
    server.stop()
    process.exit(0)
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)

  server.start()
}

// Allow running directly with ts-node or node
if (require.main === module) {
  run().catch((error) => {
    console.error("Error starting server:", error)
    process.exit(1)
  })
}
