import { spawn, ChildProcess } from "child_process"
import { join } from "path"
import { getPort } from "get-port-please"

const BIN_PATH = join(__dirname, "..", "bin", "reactotron-core-server.js")

interface SpawnResult {
  stdout: string
  stderr: string
  exitCode: number | null
}

/**
 * Helper to spawn the CLI and collect output
 */
function spawnCli(args: string[], timeout = 3000): Promise<SpawnResult> {
  return new Promise((resolve) => {
    const child = spawn("node", [BIN_PATH, ...args])
    let stdout = ""
    let stderr = ""

    child.stdout?.on("data", (data) => {
      stdout += data.toString()
    })

    child.stderr?.on("data", (data) => {
      stderr += data.toString()
    })

    const timer = setTimeout(() => {
      child.kill("SIGTERM")
    }, timeout)

    child.on("close", (exitCode) => {
      clearTimeout(timer)
      resolve({ stdout, stderr, exitCode })
    })
  })
}

/**
 * Helper to spawn the CLI and keep it running until manually killed
 */
function spawnCliKeepAlive(args: string[]): {
  child: ChildProcess
  stdout: string[]
  stderr: string[]
  waitForOutput: (pattern: string | RegExp, timeout?: number) => Promise<void>
  kill: () => Promise<number | null>
} {
  const child = spawn("node", [BIN_PATH, ...args])
  const stdout: string[] = []
  const stderr: string[] = []

  child.stdout?.on("data", (data) => {
    stdout.push(data.toString())
  })

  child.stderr?.on("data", (data) => {
    stderr.push(data.toString())
  })

  const waitForOutput = (pattern: string | RegExp, timeout = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for pattern: ${pattern}`))
      }, timeout)

      const checkOutput = () => {
        const fullOutput = stdout.join("")
        const matches =
          typeof pattern === "string" ? fullOutput.includes(pattern) : pattern.test(fullOutput)
        if (matches) {
          clearTimeout(timer)
          resolve()
        }
      }

      // Check existing output
      checkOutput()

      // Listen for new output
      const listener = () => checkOutput()
      child.stdout?.on("data", listener)

      // Clean up listener when done
      setTimeout(() => {
        child.stdout?.off("data", listener)
      }, timeout)
    })
  }

  const kill = (): Promise<number | null> => {
    return new Promise((resolve) => {
      child.on("close", (exitCode) => {
        resolve(exitCode)
      })
      child.kill("SIGTERM")
    })
  }

  return { child, stdout, stderr, waitForOutput, kill }
}

describe("CLI bin", () => {
  describe("--help", () => {
    it("displays help text and exits with code 0", async () => {
      const result = await spawnCli(["--help"], 2000)

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain("Reactotron Server CLI")
      expect(result.stdout).toContain("Usage:")
      expect(result.stdout).toContain("--port")
      expect(result.stdout).toContain("--help")
      expect(result.stdout).toContain("TLS/WSS Options")
      expect(result.stdout).toContain("Examples:")
    })

    it("displays help with -h shorthand", async () => {
      const result = await spawnCli(["-h"], 2000)

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain("Reactotron Server CLI")
    })
  })

  describe("server start", () => {
    it("starts server on default port 9090", async () => {
      const process = spawnCliKeepAlive([])

      await process.waitForOutput("Reactotron server listening on port 9090")

      const fullOutput = process.stdout.join("")
      expect(fullOutput).toContain("✓ Reactotron server listening on port 9090")

      const exitCode = await process.kill()
      expect(exitCode).toBe(0)
    }, 10000)

    it("starts server on custom port", async () => {
      const port = await getPort({ random: true })
      const process = spawnCliKeepAlive(["--port", port.toString()])

      await process.waitForOutput(`Reactotron server listening on port ${port}`)

      const fullOutput = process.stdout.join("")
      expect(fullOutput).toContain(`✓ Reactotron server listening on port ${port}`)

      await process.kill()
    }, 10000)

    it("starts server with -p shorthand", async () => {
      const port = await getPort({ random: true })
      const process = spawnCliKeepAlive(["-p", port.toString()])

      await process.waitForOutput(`Reactotron server listening on port ${port}`)

      const fullOutput = process.stdout.join("")
      expect(fullOutput).toContain(`✓ Reactotron server listening on port ${port}`)

      await process.kill()
    }, 10000)

    it("handles graceful shutdown", async () => {
      const port = await getPort({ random: true })
      const process = spawnCliKeepAlive(["--port", port.toString()])

      await process.waitForOutput(`Reactotron server listening on port ${port}`)

      const exitCode = await process.kill()

      const fullOutput = process.stdout.join("")
      expect(fullOutput).toContain("→ Shutting down...")
      expect(fullOutput).toContain("✓ Reactotron server stopped")
      expect(exitCode).toBe(0)
    }, 10000)
  })

  describe("error handling", () => {
    it("exits with error on invalid port", async () => {
      const result = await spawnCli(["--port", "invalid"], 2000)

      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain("Invalid port")
    })

    it("exits with error when port is missing value", async () => {
      const result = await spawnCli(["--port"], 2000)

      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain("--port requires a value")
    })

    it("exits with error on unknown argument", async () => {
      const result = await spawnCli(["--unknown-flag"], 2000)

      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain("Unknown argument: --unknown-flag")
    })

    it("exits with error when port is unavailable", async () => {
      const port = await getPort({ random: true })

      // Start first server
      const firstProcess = spawnCliKeepAlive(["--port", port.toString()])
      await firstProcess.waitForOutput(`Reactotron server listening on port ${port}`)

      // Try to start second server on same port
      const result = await spawnCli(["--port", port.toString()], 3000)

      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain(`Port ${port} is already in use`)

      // Clean up first server
      await firstProcess.kill()
    }, 15000)
  })

  describe("TLS/WSS options", () => {
    it("accepts wss-pfx flag without error", async () => {
      // Note: This will fail to start due to invalid cert, but we're testing arg parsing
      const result = await spawnCli(["--port", "9999", "--wss-pfx", "./fake.pfx"], 2000)

      // Should not error on unknown argument
      expect(result.stderr).not.toContain("Unknown argument")
    })

    it("accepts wss-cert and wss-key flags", async () => {
      const result = await spawnCli(
        ["--port", "9999", "--wss-cert", "./fake.pem", "--wss-key", "./fake.key"],
        2000
      )

      expect(result.stderr).not.toContain("Unknown argument")
    })

    it("accepts wss-passphrase flag", async () => {
      const result = await spawnCli(
        ["--port", "9999", "--wss-pfx", "./fake.pfx", "--wss-passphrase", "test"],
        2000
      )

      expect(result.stderr).not.toContain("Unknown argument")
    })

    it("exits with error when wss-pfx is missing value", async () => {
      const result = await spawnCli(["--wss-pfx"], 2000)

      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain("--wss-pfx requires a path")
    })
  })
})
