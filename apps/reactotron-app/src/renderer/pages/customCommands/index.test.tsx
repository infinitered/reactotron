import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { CustomCommandsContext } from "reactotron-core-ui"
import type { CustomCommand } from "reactotron-core-ui"
import { ThemeProvider } from "styled-components"

import StandaloneContext from "../../contexts/Standalone"
import CustomCommands from "."

jest.mock("reactotron-core-ui", () => {
  const ReactActual = jest.requireActual<typeof import("react")>("react")

  return {
    CustomCommandsContext: ReactActual.createContext({
      customCommands: [],
      sendCustomCommand: null,
    }),
    EmptyState: ({ title, children }) =>
      ReactActual.createElement(
        "div",
        null,
        ReactActual.createElement("span", null, title),
        children
      ),
    Header: ({ title, actions, children }) =>
      ReactActual.createElement(
        "div",
        null,
        title,
        actions.map((action) =>
          ReactActual.createElement(
            "button",
            {
              "data-tip": action.tip,
              key: action.tip,
              onClick: action.onClick,
              type: "button",
            },
            action.tip
          )
        ),
        children
      ),
  }
})

jest.mock("../../contexts/Standalone", () => {
  const ReactActual = jest.requireActual<typeof import("react")>("react")

  return {
    __esModule: true,
    default: ReactActual.createContext(null),
  }
})

const theme = {
  backgroundLighter: "#333",
  backgroundSubtleDark: "#111",
  foreground: "#aaa",
  foregroundDark: "#888",
}

const connections = {
  ios: {
    id: 1,
    clientId: "ios-client",
    platform: "ios" as const,
    commands: [],
    connected: true,
  },
  android: {
    id: 2,
    clientId: "android-client",
    platform: "android" as const,
    commands: [],
    connected: true,
  },
}

const commands: CustomCommand[] = [
  {
    clientId: connections.ios.clientId,
    id: "ios-command",
    command: "reload-ios",
    title: "Reload iOS",
    description: "Reload the selected iOS app",
  },
  {
    clientId: connections.android.clientId,
    id: "android-command",
    command: "clear-android-cache",
    title: "Clear Android Cache",
    description: "Only available on the Android app",
  },
]

interface ProvidersProps {
  children: React.ReactNode
  customCommands?: CustomCommand[]
  selectedClientId: keyof typeof connections
  sendCustomCommand?: jest.Mock
}

function Providers({
  children,
  customCommands = commands,
  selectedClientId,
  sendCustomCommand = jest.fn(),
}: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <StandaloneContext.Provider
        value={{
          serverStatus: "started",
          connections: Object.values(connections),
          selectedConnection: connections[selectedClientId],
          selectConnection: jest.fn(),
          mcpStatus: "stopped",
          mcpPort: null,
          toggleMcp: jest.fn(),
          mcpRedactionEnforced: true,
          openMcpSettings: jest.fn(),
          closeMcpSettings: jest.fn(),
          mcpSettingsOpen: false,
          updateMcpRedactionConfig: jest.fn(),
          mcpRedactionConfig: {
            defaults: {
              sensitiveKeys: [],
              statePathPatterns: [],
              valuePatterns: [],
            },
            allowClientDisable: false,
            allowClientRemoveRules: false,
          },
        }}
      >
        <CustomCommandsContext.Provider value={{ customCommands, sendCustomCommand }}>
          {children}
        </CustomCommandsContext.Provider>
      </StandaloneContext.Provider>
    </ThemeProvider>
  )
}

function renderPage(props: Omit<ProvidersProps, "children">) {
  return render(
    <Providers {...props}>
      <CustomCommands />
    </Providers>
  )
}

describe("CustomCommands", () => {
  it("shows and sends only commands from the selected connection", () => {
    const sendCustomCommand = jest.fn()

    renderPage({ selectedClientId: "ios", sendCustomCommand })

    expect(screen.getByText("Reload iOS")).toBeTruthy()
    expect(screen.queryByText("Clear Android Cache")).toBeNull()
    expect(screen.getAllByText("Send Command")).toHaveLength(1)

    fireEvent.click(screen.getByText("Send Command"))

    expect(sendCustomCommand).toHaveBeenCalledWith("reload-ios", {})
  })

  it("updates the command list when the selected connection changes", () => {
    const view = renderPage({ selectedClientId: "ios" })

    expect(screen.getByText("Reload iOS")).toBeTruthy()
    expect(screen.queryByText("Clear Android Cache")).toBeNull()

    view.rerender(
      <Providers selectedClientId="android">
        <CustomCommands />
      </Providers>
    )

    expect(screen.queryByText("Reload iOS")).toBeNull()
    expect(screen.getByText("Clear Android Cache")).toBeTruthy()
  })

  it("shows the empty state when only another connection has commands", () => {
    renderPage({
      selectedClientId: "android",
      customCommands: [commands[0]],
    })

    expect(screen.getByText("No Custom Commands")).toBeTruthy()
    expect(screen.queryByText("Reload iOS")).toBeNull()
  })

  it("does not reveal another connection's commands through search", () => {
    const { container } = renderPage({ selectedClientId: "ios" })

    fireEvent.click(container.querySelector('[data-tip="Search"]'))
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "android" } })

    expect(screen.queryByText("Clear Android Cache")).toBeNull()
    expect(screen.queryByText("Reload iOS")).toBeNull()
  })

  it("keeps single-connection search results working", () => {
    const { container } = renderPage({
      selectedClientId: "ios",
      customCommands: [commands[0]],
    })

    fireEvent.click(container.querySelector('[data-tip="Search"]'))
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "reload" } })

    expect(screen.getByText("Reload iOS")).toBeTruthy()
    expect(screen.queryByText("No Custom Commands")).toBeNull()
  })
})
