import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const RepoStoreModel = types
  .model("RepoStore")
  .props({
    message: types.maybe(types.string),
    repo: types.maybe(types.string),
    url: types.maybe(types.string),
    name: types.maybe(types.string),
    sha: types.maybe(types.string),
    fetching: false,
    avatar: types.maybe(types.string),
    error: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    fetchRepo(repo: string) {
      fetch(`https://api.github.com/repos/${repo}/commits`)
        .then((response) => response.json())
        .then((json) => {
          if (json.length > 0) {
            const lastCommit = json[0]
            console.log("Last commit: ", lastCommit)
            const { commit, author, committer, html_url: url } = lastCommit
            const { message, tree } = commit
            const { sha } = tree
            const { login, avatar_url: avatar } = author || committer

            store.setProp("message", message)
            store.setProp("repo", repo)
            store.setProp("url", url)
            store.setProp("name", login)
            store.setProp("sha", sha)
            store.setProp("avatar", avatar)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
  }))

export interface RepoStore extends Instance<typeof RepoStoreModel> {}
export interface RepoStoreSnapshot extends SnapshotOut<typeof RepoStoreModel> {}

// @demo remove-file
