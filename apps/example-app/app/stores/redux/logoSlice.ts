import { type PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface LogoState {
  size: number
  speed: number
}

const initialState: LogoState = {
  size: 80,
  speed: 25,
}

const logoSlice = createSlice({
  name: "logo",
  initialState,
  reducers: {
    changeSpeed: (store, action: PayloadAction<number>) => {
      store.speed = action.payload
    },
    changeSize: (store, action: PayloadAction<number>) => {
      store.size = action.payload
    },
    faster: (store) => {
      store.speed = 10
    },
    slower: (store) => {
      store.speed = 50
    },
    bigger: (store) => {
      store.size = 140
    },
    smaller: (store) => {
      store.size = 40
    },
    reset: (store) => {
      store.size = 80
      store.speed = 25
    },
  },
})

export const { changeSize, changeSpeed, faster, slower, bigger, smaller, reset } = logoSlice.actions
export default logoSlice.reducer
