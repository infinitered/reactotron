export const Palette = {
  almostBlack: '#111111',
  matteBlack: '#555555',
  black: '#000000',
  white: '#ffffff',
  lightestGrey: '#e6e6e6',
  lightGrey: '#e0e0e0',
  transparent: 'rgba(0, 0, 0, 0)',
  primary: '#4a90e2',
  ghost15: 'rgba(0,0,0,0.10)',
  green: '#0aa260'
}

const roles = {
  screen: Palette.lightestGrey,
  toolbar: Palette.white,
  primary: Palette.primary,
  subtleShadow: Palette.ghost15,
  text: Palette.matteBlack,
  line: Palette.lightGrey,
  good: Palette.green
}

export default {
  Palette,
  ...roles
}
