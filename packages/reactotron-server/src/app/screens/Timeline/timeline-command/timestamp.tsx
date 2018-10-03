import React from "react"
import { format } from "date-fns"

interface Props {
  date: string
}

export function Timestamp({ date }: Props) {
  const hourMin = format(date, "h:mm:")
  const secMilli = format(date, "ss.SSS")

  return (
    <div>
      <span className="text-subtle">{hourMin}</span>
      <span>{secMilli}</span>
    </div>
  )
}
