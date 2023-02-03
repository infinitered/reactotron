import { types, IModelType } from "mobx-state-tree"

// lol - https://github.com/Microsoft/TypeScript/issues/5938
export type __IModelType = IModelType<any, any>

export const TestUserModel = types
  .model()
  .props({ name: "", age: 100 })
  .actions(self => ({
    setAge(value: number) {
      self.age = value
    },
  }))
