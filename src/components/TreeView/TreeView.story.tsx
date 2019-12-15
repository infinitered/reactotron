import React from "react"

import TreeView from "./index"

export default {
  title: "TreeView",
}

export const Default = () => (
  <TreeView
    value={{
      test: 1,
      test2: [1, 2, 3],
      test3: {
        test4: true,
        test5: "Test",
        test6: null,
      },
    }}
  />
)
