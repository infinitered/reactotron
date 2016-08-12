export const Palette = {
  almostBlack: '#111111',
  matteBlack: '#555555',
  black: '#000000',
  white: '#ffffff',
  lightestGrey: '#eaeaea',
  lightGrey: '#e0e0e0',
  dimGrey: '#cccccc',
  grey: '#999999',
  transparent: 'rgba(0, 0, 0, 0)',
  primary: '#4a90e2',
  ghost15: 'rgba(0,0,0,0.10)',
  green: '#0aa260',
  red: '#9B0013',
  orange: '#D6A605'
}

const roles = {
  screen: Palette.lightestGrey,
  toolbar: Palette.white,
  primary: Palette.primary,
  subtleShadow: Palette.ghost15,
  text: Palette.matteBlack,
  mutedText: Palette.grey,
  line: Palette.dimGrey,
  subtleLine: Palette.lightGrey,
  good: Palette.green,
  error: Palette.red,
  warning: Palette.orange
}

export default {
  Palette,
  ...roles
}
