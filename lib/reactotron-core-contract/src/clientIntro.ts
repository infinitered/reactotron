export interface ClientIntroPayload {
  name: string
  clientId?: string
  environment?: string
  reactotronVersion?: string
  /** Additional fields added by server on receipt */
  address?: string
}
