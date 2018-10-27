import React from "react"

function Button({ children, onPress }: { children: any; onPress: () => void }) {
  return (
    <div
      className="cursor-pointer flex flex-col items-center p-2"
      onClick={onPress}
    >
      {children}
    </div>
  )
}

export { Button }
