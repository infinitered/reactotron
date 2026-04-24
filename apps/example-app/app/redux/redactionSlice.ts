// REDACTION TEST — scratch slice for exercising MCP redaction. Drop before merge.
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface RedactionTestState {
  auth: {
    username?: string
    password?: string
    accessToken?: string
    api_key?: string
    tokens?: { access?: string; refresh?: string }
  }
  settings: {
    theme?: string
    note?: string
  }
}

const initialState: RedactionTestState = { auth: {}, settings: {} }

const redactionSlice = createSlice({
  name: "redactionTest",
  initialState,
  reducers: {
    setSensitive: (_state, action: PayloadAction<RedactionTestState>) => action.payload,
    clearSensitive: () => initialState,
  },
})

export const { setSensitive, clearSensitive } = redactionSlice.actions
export default redactionSlice.reducer
