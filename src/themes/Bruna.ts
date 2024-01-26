import colors from 'vuetify/util/colors'

const darkTheme = {
  dark: true,
  colors: {
    primario: colors.amber.darken1,
    'primario-claro': colors.amber.lighten3,
    secundario: colors.lightGreen.darken4,
    'secundario-claro': colors.green.darken1,
    white: '#f3f3f3',
    muted: '#424242',
    error: colors.red.darken1,
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'observation': colors.orange.darken3,
    'absentee': colors.red.lighten1,
    'justified': colors.blue.lighten1,
    'repose': colors.green.lighten1,
  },
}
const lightTheme = {
  dark: false,
  colors: {
    primario: colors.amber.accent3,
    'primario-claro': colors.amber.accent1,
    secundario: colors.lightGreen.darken2,
    'secundario-claro': colors.green.lighten1,
    white: '#f3f3f3',
    muted: colors.grey.lighten3,
    error: colors.red.lighten2,
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'observation': colors.orange.darken3,
    'absentee': colors.red.lighten1,
    'justified': colors.blue.lighten1,
    'repose': colors.green.lighten1,
  },
}

export {
  lightTheme,
  darkTheme,
};