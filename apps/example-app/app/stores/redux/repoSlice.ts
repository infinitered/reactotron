import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface RepoState {
  message?: string
  repoName?: string
  url?: string
  name?: string
  sha?: string
  avatar?: string

  error?: string
  fetching: boolean
}

const initialState: RepoState = {
  fetching: false,
}

const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    reset: (state) => {
      state.message = undefined
      state.repoName = undefined
      state.url = undefined
      state.name = undefined
      state.sha = undefined
      state.avatar = undefined
      state.fetching = false
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsync.pending, (state) => {
        console.log("Fetching...")
        state.fetching = true
      })
      .addCase(fetchAsync.fulfilled, (state, action) => {
        console.log("Fetched!")
        state.fetching = false

        const lastCommit = action.payload.json[0]
        console.log("Last commit: ", lastCommit)
        const { commit, author, committer, html_url: url } = lastCommit
        const { message, tree } = commit
        const { sha } = tree
        const { login, avatar_url: avatar } = author || committer

        state.repoName = action.payload.repo
        state.message = message
        state.url = url
        state.name = login
        state.sha = sha
        state.avatar = avatar
      })
  },
})

export const fetchAsync = createAsyncThunk("repo/fetchAsync", async (repo: string) => {
  console.log("initiating API call...")
  const response = await fetch(`https://api.github.com/repos/${repo}/commits`)
  const json = await response.json()
  console.log("got it!", json)
  return { json, repo }
})

export const { reset } = repoSlice.actions
export default repoSlice.reducer
