import { types, IModelType, ISnapshottable } from "mobx-state-tree"
import { TestUserModel } from "./test-user-model"
import { IObservableArray } from "mobx"

// lol - https://github.com/Microsoft/TypeScript/issues/5938
export type __IModelType = IModelType<any, any>
export type __ISnapshottable = ISnapshottable<any>
export type __IObservableArray = IObservableArray<any>

export const TestCompanyModel = types
  .model()
  .props({
    name: "",
    employees: types.optional(types.array(TestUserModel), []),
    owner: types.maybe(TestUserModel),
  })
  .actions((self) => ({
    setName(value: string) {
      self.name = value
    },
  }))

export const createTestCompany = () =>
  TestCompanyModel.create({
    name: "Steve",
    owner: { name: "me", age: 100 },
    employees: [
      { name: "a", age: 1 },
      { name: "b", age: 2 },
    ],
  })
