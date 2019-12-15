import React from "react"

import Checkbox from "./index"

export default {
  title: "Checkbox",
}

export const Off = () => <Checkbox isChecked={false} label="My Checkbox" onToggle={() => {}} />

export const On = () => <Checkbox isChecked label="My Checkbox" onToggle={() => {}} />
