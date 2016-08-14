import { createStyling } from 'react-base16-styling'

// https://github.com/chriskempson/base16/blob/master/styling.md

const getStylingFromBase16 = base16Theme => ({
  roles: {
    background: base16Theme.base00, // base00 - Default Background
    backgroundLighter: base16Theme.base01, // base01 - Lighter Background (Used for status bars)
    line: base16Theme.base01,
    backgroundHighlight: base16Theme.base02, // base02 - Selection Background
    highlight: base16Theme.base03, // base03 - Comments, Invisibles, Line Highlighting
    foregroundDark: base16Theme.base04, // base04 - Dark Foreground (Used for status bars)
    foreground: base16Theme.base05, // base05 - Default Foreground, Caret, Delimiters, Operators
    foregroundLight: base16Theme.base06, // base06 - Light Foreground (Not often used)
    backgroundLight: base16Theme.base07, // base07 - Light Background (Not often used)
    tag: base16Theme.base08, // base08 - Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
    constant: base16Theme.base09, // base09 - Integers, Boolean, Constants, XML Attributes, Markup Link Url
    bold: base16Theme.base0A, // base0A - Classes, Markup Bold, Search Text Background
    string: base16Theme.base0B, // base0B - Strings, Inherited Class, Markup Code, Diff Inserted
    support: base16Theme.base0C, // base0C - Support, Regular Expressions, Escape Characters, Markup Quotes
    heading: base16Theme.base0D, // base0D - Functions, Methods, Attribute IDs, Headings
    keyword: base16Theme.base0E, // base0E - Keywords, Storage, Selector, Markup Italic, Diff Changed
    warning: base16Theme.base0F // base0F - Deprecated, Opening/Closing Embedded Language Tags e.g. <?php ?>
  },
  theme: base16Theme // TODO: figure out why I'm doing this?
})

// the default theme until i figure out how to customize it on the fly
// http://chriskempson.github.io/base16/
// const defaultTheme = 'atliersavanah'
const defaultTheme = 'ocean'
// const defaultTheme = 'mocha'
// const defaultTheme = 'railscasts'
// const defaultTheme = 'greenscreen'
// const defaultTheme = 'twilight'

// the natural or inverted look
const invertTheme = false

// some kind of wierd factory?
const createStylingFromTheme = createStyling(getStylingFromBase16, {})

// here's where I think i should be allowing user customization?
const styling = createStylingFromTheme(defaultTheme, invertTheme)

// fish out the roles because I haven't committed fully to styling in the components just yet
const roles = styling('roles').style

// awkwardly expose the theme for the ObjectTree component
const theme = styling('theme').style

export default {
  ...roles,
  theme,
  invertTheme
}
