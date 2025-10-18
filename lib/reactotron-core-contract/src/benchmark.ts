export type BenchmarkStep = {
  title: string
  time: number
  delta: number
}

export interface BenchmarkReportPayload {
  title: string
  steps: BenchmarkStep[]
}
