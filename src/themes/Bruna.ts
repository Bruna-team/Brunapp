import colors from 'vuetify/util/colors'

const darkTheme = {
  dark: true,
  colors: {
    primario: colors.amber.darken1,
    'primario-claro': colors.amber.lighten3,
    secundario: colors.lightGreen.darken4,
    'secundario-claro': colors.lightGreen.darken3,
    white: '#f3f3f3',
    muted: '#424242',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'observation': colors.red.lighten1,
    'absentee': colors.red.lighten1,
    'justified': '#FB8C00',
    'repose': '#FB8C00',
  },
}
const lightTheme = {
  dark: false,
  colors: {
    primario: colors.amber.accent3,
    'primario-claro': colors.amber.accent2,
    secundario: colors.lightGreen.darken2,
    'secundario-claro': colors.green.lighten2,
    white: '#f3f3f3',
    muted: '#e4e4e4',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'observation': '#FB8C00',
    'absentee': '#FB8C00',
    'justified': '#FB8C00',
    'repose': '#FB8C00',
  },
}

export {
  lightTheme,
  darkTheme,
};