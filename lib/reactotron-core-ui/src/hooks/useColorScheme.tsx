import React from "react"
import { ColorScheme } from "../themes"

function getColorScheme({ matches }: MediaQueryList | MediaQueryListEvent): ColorScheme {
  return matches ? "dark" : "light"
}

function useColorScheme(): ColorScheme {
  const mediaQueryRef = React.useRef<MediaQueryList | null>(window?.matchMedia?.("(prefers-color-scheme: dark)") || null)

  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(() => {
    if (typeof window === "undefined" || !mediaQueryRef.current) return "dark"
    return getColorScheme(mediaQueryRef.current)
  })

  React.useEffect(() => {
    const mediaQuery = mediaQueryRef.current

    if (!mediaQuery) return () => {}

    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(getColorScheme(e))
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return colorScheme
}

export default useColorScheme
