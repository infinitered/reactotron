import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface ErrorState {
  message?: string
  repo?: string
  url?: string
  name?: string
  sha?: string
  avatar?: string

  error?: string
  fetching: boolean
}

const initialState: ErrorState = {
  fetching: false,
}

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    throwAnError: (store) => {
      // @ts-ignore We want to throw this error.
      store.error = this.doesNotExist()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(throwErrorAsync.pending, () => {
        console.log("wait for it...")
      })
      .addCase(throwErrorAsync.fulfilled, () => {
        console.log("kaboom!")
      })
  },
})

const dismantleBomb = (cutTheRedWire: boolean) => {
  if (cutTheRedWire) {
    // @ts-ignore We want to throw this error.
    this.isSparta("👢") // this is madness!
  }
}

export const throwErrorAsync = createAsyncThunk("error/throwErrorAsync", async () => {
  const result = await new Promise((resolve) => {
    setTimeout(() => {
      dismantleBomb(true)
      resolve("🧨")
    }, 1000)
  })
  return result
})

export const { throwAnError } = errorSlice.actions
export default errorSlice.reducer
