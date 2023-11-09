import "rn-css"

const theme = {
  fontFamily:
    '"Fira Code", "SF Mono", "Consolas", "Segoe UI", "Roboto", "-apple-system", "Helvetica Neue", sans-serif',
  background: "#1e1e1e",
  backgroundDarker: "hsl(0, 0%, 10.6%)",
  backgroundHighlight: "#464b50",
  backgroundLight: "#ffffff",
  backgroundLighter: "#323537",
  backgroundSubtleDark: "hsl(0, 0%, 8.2%)",
  backgroundSubtleLight: "hsl(0, 0%, 12.4%)",
  bold: "#f9ee98",
  chrome: "rgb(33, 33, 33)",
  chromeLine: "rgb(37, 37, 37)",
  constant: "#cda869",
  foreground: "#a7a7a7",
  foregroundDark: "#838184",
  foregroundLight: "#c3c3c3",
  glow: "hsla(0, 0%, 9.4%, 0.8)",
  heading: "#7587a6",
  highlight: "rgb(123, 117, 125)",
  keyword: "#9b859d",
  line: "rgb(45, 48, 49)",
  modalOverlay: "hsla(0, 0%, 7.1%, 0.95)",
  string: "#8f9d6a",
  subtleLine: "hsl(204, 4.8%, 16.5%)",
  support: "#afc4db",
  tag: "#cf6a4c",
  tagComplement: "hsl(13.699999999999989, 57.7%, 91.6%)",
  warning: "#9b703f",
}

declare module "rn-css" {
  type MyTheme = typeof theme
  export interface DefaultTheme extends MyTheme {}
}

export default theme
