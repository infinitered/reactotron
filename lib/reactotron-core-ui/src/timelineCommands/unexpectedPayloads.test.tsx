import React, { ComponentType } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { ThemeProvider } from "styled-components"

import { themes } from "../themes"
import type { TimelineCommandPropsEx } from "./BaseCommand"
import AsyncStorageMutationCommand from "./AsyncStorageMutationCommand"
import ApiResponseCommand from "./ApiResponseCommand"
import BenchmarkReportCommand from "./BenchmarkReportCommand"
import SagaTaskCompleteCommand from "./SagaTaskCompleteCommand"
import StateValuesChangeCommand from "./StateValuesChangeCommand"

type CommandComponent = ComponentType<TimelineCommandPropsEx<unknown>>

function renderCommand(Component: CommandComponent, type: string, payload: unknown) {
  return render(
    <ThemeProvider theme={themes.dark}>
      <Component
        command={{
          connectionId: 1,
          date: new Date("2026-08-18T00:00:00.000Z"),
          deltaTime: 0,
          important: false,
          messageId: 1,
          payload,
          type,
        }}
        copyToClipboard={jest.fn()}
      />
    </ThemeProvider>
  )
}

function expectRenderedWithoutFallback(title: string) {
  expect(screen.getByText(title)).toBeTruthy()
  expect(screen.queryByText("RENDER ERROR")).toBeNull()
}

describe("timeline commands with unexpected payloads", () => {
  test.each([
    ["data", { action: "setItem" }],
    ["key", { action: "setItem", data: { value: "abc" } }],
  ])("renders an AsyncStorage mutation when %s is missing", (_label, payload) => {
    renderCommand(AsyncStorageMutationCommand, "asyncStorage.mutation", payload)

    expectRenderedWithoutFallback("ASYNC STORAGE")
    expect(screen.getByText("setItem")).toBeTruthy()
  })

  test("preserves a valid AsyncStorage mutation preview", () => {
    renderCommand(AsyncStorageMutationCommand, "asyncStorage.mutation", {
      action: "setItem",
      data: { key: "session", value: "abc" },
    })

    expectRenderedWithoutFallback("ASYNC STORAGE")
    expect(screen.getByText("setItem: session")).toBeTruthy()
  })

  test.each([
    [
      "request",
      { duration: 12, response: { body: "ok", headers: {}, status: 200 } },
      "API RESPONSE (200)",
    ],
    [
      "response",
      {
        duration: 12,
        request: { data: null, headers: {}, method: "get", params: null, url: "/health" },
      },
      "API RESPONSE",
    ],
    ["request and response", { duration: 12 }, "API RESPONSE"],
  ])("renders an API response when %s is missing", (_label, payload, title) => {
    renderCommand(ApiResponseCommand, "api.response", payload)

    expectRenderedWithoutFallback(title)
  })

  test("preserves a valid API response preview", () => {
    renderCommand(ApiResponseCommand, "api.response", {
      duration: 25,
      request: {
        data: JSON.stringify({ operationName: "GetUser" }),
        headers: {},
        method: "post",
        params: null,
        url: "https://example.com/graphql?debug=true",
      },
      response: { body: "ok", headers: {}, status: 201 },
    })

    expectRenderedWithoutFallback("API RESPONSE (201)")
    expect(screen.getByText("POST /graphql GetUser")).toBeTruthy()
  })

  test("ignores non-object state subscription changes", () => {
    renderCommand(StateValuesChangeCommand, "state.values.change", {
      added: [],
      changed: "bad",
      changes: [],
      removed: [],
    })
    fireEvent.click(screen.getByText("SUBSCRIPTIONS"))

    expectRenderedWithoutFallback("SUBSCRIPTIONS")
    expect(screen.queryByText("3 changed")).toBeNull()
  })

  test("preserves valid state subscription counts", () => {
    renderCommand(StateValuesChangeCommand, "state.values.change", {
      added: { profile: true },
      changed: { token: "next" },
      changes: [],
      removed: { legacy: true },
    })
    fireEvent.click(screen.getByText("SUBSCRIPTIONS"))

    expectRenderedWithoutFallback("SUBSCRIPTIONS")
    expect(screen.getByText("1 changed 1 added 1 removed")).toBeTruthy()
  })

  test.each([
    ["missing", { title: "startup" }],
    ["empty", { title: "startup", steps: [] }],
  ])("renders a benchmark with %s steps", (_label, payload) => {
    renderCommand(BenchmarkReportCommand, "benchmark.report", payload)

    expectRenderedWithoutFallback("BENCHMARK")
    expect(screen.getByText("startup")).toBeTruthy()
  })

  test("preserves a valid benchmark duration", () => {
    renderCommand(BenchmarkReportCommand, "benchmark.report", {
      title: "startup",
      steps: [
        { delta: 0, time: 0, title: "start" },
        { delta: 250, time: 250, title: "ready" },
      ],
    })

    expectRenderedWithoutFallback("BENCHMARK")
    expect(screen.getByText("startup in 0.250s")).toBeTruthy()
  })

  test.each([
    ["missing", { duration: 10, triggerType: "ACTION" }],
    ["non-array", { children: {}, duration: 10, triggerType: "ACTION" }],
  ])("renders a saga completion with %s children", (_label, payload) => {
    renderCommand(SagaTaskCompleteCommand, "saga.task.complete", payload)
    fireEvent.click(screen.getByText("SAGA"))

    expectRenderedWithoutFallback("SAGA")
    expect(screen.getByText("0 Effects")).toBeTruthy()
  })

  test("preserves valid saga completion children", () => {
    renderCommand(SagaTaskCompleteCommand, "saga.task.complete", {
      children: [
        {
          depth: 0,
          description: "Call API",
          duration: 5,
          effectId: 1,
          extra: null,
          loser: null,
          name: "CALL",
          parentEffectId: 0,
          result: null,
          status: "RESOLVED",
          winner: null,
        },
      ],
      description: "Load user",
      duration: 5,
      triggerType: "ACTION",
    })
    fireEvent.click(screen.getByText("SAGA"))

    expectRenderedWithoutFallback("SAGA")
    expect(screen.getByText("1 Effect")).toBeTruthy()
    expect(screen.getByText("CALL")).toBeTruthy()
  })
})
