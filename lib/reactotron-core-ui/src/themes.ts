interface ReactotronTheme {
  fontFamily: string
  background: string
  backgroundDarker: string
  backgroundHighlight: string
  backgroundLight: string
  backgroundLighter: string
  backgroundSubtleDark: string
  backgroundSubtleLight: string
  bold: string
  chrome: string
  chromeLine: string
  constant: string
  foreground: string
  foregroundDark: string
  foregroundLight: string
  glow: string
  heading: string
  highlight: string
  keyword: string
  line: string
  modalOverlay: string
  string: string
  subtleLine: string
  support: string
  tag: string
  tagComplement: string
  warning: string
  delete: string
}

const colorSchemes = ["dark", "light"] as const

type ColorScheme = (typeof colorSchemes)[number]

const themes: Record<ColorScheme, ReactotronTheme> = {
  dark: {
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
    chrome: "hsl(0, 0%, 12.9%)",
    chromeLine: "hsl(0, 0%, 14.7%)",
    constant: "#cda869",
    foreground: "#a7a7a7",
    foregroundDark: "#838184",
    foregroundLight: "#c3c3c3",
    glow: "hsla(0, 0%, 9.4%, 0.8)",
    heading: "#7587a6",
    highlight: "hsl(290, 3.2%, 47.4%)",
    keyword: "#9b859d",
    line: "hsl(204, 4.8%, 18.5%)",
    modalOverlay: "hsla(0, 0%, 7.1%, 0.95)",
    string: "#8f9d6a",
    subtleLine: "hsl(204, 4.8%, 16.5%)",
    support: "#afc4db",
    tag: "#cf6a4c",
    tagComplement: "hsl(13.699999999999989, 57.7%, 91.6%)",
    warning: "#9b703f",
    delete: "rgb(239,135,131)",
  },
  light: {
    fontFamily:
      '"Fira Code", "SF Mono", "Consolas", "Segoe UI", "Roboto", "-apple-system", "Helvetica Neue", sans-serif',
    background: "#ffffff",
    backgroundDarker: "hsl(0, 0%, 90%)",
    backgroundHighlight: "#f0f0f0",
    backgroundLight: "#f9f9f9",
    backgroundLighter: "#e6e6e6",
    backgroundSubtleDark: "hsl(0, 0%, 95%)",
    backgroundSubtleLight: "hsl(0, 0%, 97%)",
    bold: "#222222",
    chrome: "hsl(0, 0%, 90%)",
    chromeLine: "hsl(0, 0%, 85%)",
    constant: "#d17d00",
    foreground: "#333333",
    foregroundDark: "#555555",
    foregroundLight: "#666666",
    glow: "hsla(0, 0%, 90%, 0.8)",
    heading: "#4b5f85",
    highlight: "hsl(210, 10%, 70%)",
    keyword: "#9b0000",
    line: "hsl(204, 4.8%, 95%)",
    modalOverlay: "hsla(0, 0%, 100%, 0.95)",
    string: "#718c00",
    subtleLine: "hsl(204, 4.8%, 90%)",
    support: "#597ab8",
    tag: "#d9484f",
    tagComplement: "hsl(13.7, 57.7%, 45%)",
    warning: "#b35900",
    delete: "rgb(239,135,131)",
  },
}

export { themes }
export type { ColorScheme, ReactotronTheme }
