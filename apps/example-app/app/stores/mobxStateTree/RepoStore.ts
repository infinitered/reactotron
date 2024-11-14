import { Instance, SnapshotOut, flow, types } from "mobx-state-tree"

export const RepoStoreModel = types
  .model("RepoStore")
  .props({
    message: types.maybe(types.string),
    repoName: types.maybe(types.string),
    url: types.maybe(types.string),
    name: types.maybe(types.string),
    sha: types.maybe(types.string),
    avatar: types.maybe(types.string),

    fetching: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .actions((store) => ({
    reset: () => {
      store.message = undefined
      store.repoName = undefined
      store.url = undefined
      store.name = undefined
      store.sha = undefined
      store.avatar = undefined
      store.fetching = false
      store.error = undefined
    },
  }))
  .actions((store) => {
    const fetchRepo = flow(function* (repo: string) {
      // <- note the star, this is a generator function!
      store.fetching = true
      try {
        const json = yield fetchRepoAsync(repo)

        const lastCommit = json[0]
        console.log("Last commit: ", lastCommit)
        const { commit, author, committer, html_url: url } = lastCommit
        const { message, tree } = commit
        const { sha } = tree
        const { login, avatar_url: avatar } = author || committer

        store.repoName = repo
        store.message = message
        store.url = url
        store.name = login
        store.sha = sha
        store.avatar = avatar
        store.fetching = false
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch projects", error)
        store.fetching = false
        store.error = error.message
      }
      return true
    })
    return {
      fetchRepo,
    }
  })

const fetchRepoAsync = async (repo: string) => {
  const response = await fetch(`https://api.github.com/repos/${repo}/commits`)
  const json = await response.json()
  return json
}

export interface RepoStore extends Instance<typeof RepoStoreModel> {}
export interface RepoStoreSnapshot extends SnapshotOut<typeof RepoStoreModel> {}
