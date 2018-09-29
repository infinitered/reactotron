import React from "react"
import { format } from "date-fns"

interface Props {
  date: string
  deltaTime?: number
}

export function Timestamp({ date, deltaTime }: Props) {
  const hourMin = format(date, "h:mm:")
  const secMilli = format(date, "ss.SSS")
  const delta = deltaTime ? `+${deltaTime} ms` : ""

  return (
    <div>
      <span>{hourMin}</span>
      <span>{secMilli}</span>
      <span>{delta}</span>
    </div>
  )
}
