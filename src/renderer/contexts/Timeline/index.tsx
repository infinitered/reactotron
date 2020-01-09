import React, { FunctionComponent } from "react"

const TimelineContext = React.createContext({})

const Provider: FunctionComponent<any> = ({ children }) => {
  return <TimelineContext.Provider value={{}}>{children}</TimelineContext.Provider>
}

export default TimelineContext
export const TimelineProvider = Provider
