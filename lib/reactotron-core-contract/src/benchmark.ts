export interface BenchmarkReportPayload {
  title: string
  steps: Array<{
    title: string
    time: number
    delta: number
  }>
}
