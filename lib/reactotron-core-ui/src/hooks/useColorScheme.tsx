import React from "react"
import { ColorScheme } from "../themes"

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

function getColorScheme({ matches }: MediaQueryList | MediaQueryListEvent): ColorScheme {
  return matches ? "dark" : "light"
}

function useColorScheme(): ColorScheme {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(() => {
    if (typeof window === "undefined") return "dark"
    return getColorScheme(mediaQuery)
  })

  React.useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(getColorScheme(e))
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return colorScheme
}

export default useColorScheme
