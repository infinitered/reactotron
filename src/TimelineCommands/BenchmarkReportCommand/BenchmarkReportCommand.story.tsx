import React from "react"

import { BenchmarkReportCommand } from "./index"

export default {
  title: "Timeline Commands/Benchmark Report Command",
}

const benchmarkReportCommand = {
  clientId: "",
  connectionId: 0,
  deltaTime: 0,
  important: false,
  messageId: 0,
  type: "",
  payload: {
    title: "Benchmark Name",
    steps: [
      { title: "Step 1!", delta: 0, time: 0 },
      { title: "Step 2!", delta: 1009, time: 1009 },
      { title: "Step 3!", delta: 513, time: 1522 },
      { title: "Step 4!", delta: 501, time: 2023 },
    ],
  },
  date: new Date("2019-01-01T10:12:23.435"),
}

export const BenchmarkReportCommandClosed = () => (
  <BenchmarkReportCommand
    command={benchmarkReportCommand}
    isOpen={false}
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)

export const BenchmarkReportCommandOpen = () => (
  <BenchmarkReportCommand
    command={benchmarkReportCommand}
    isOpen
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)
