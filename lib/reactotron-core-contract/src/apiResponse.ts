export interface ApiResponsePayload {
  duration: number
  request: {
    data: any
    headers: { [key: string]: string }
    method: string
    params: any
    url: string
  }
  response: {
    body: string
    headers: { [key: string]: string }
    status: number
  }
}
