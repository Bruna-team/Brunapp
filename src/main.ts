import { createApp } from 'vue'
import router from "./router";
import App from './App.vue'
import './assets/app.css'

// Vuetify
import "vuetify/styles";
import { ThemeDefinition, createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import '@mdi/font/css/materialdesignicons.css'

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primario: '#ffc400',
    'primary-darken-1': '#3700B3',
    // secondary: '#03DAC6',
    // 'secondary-darken-1': '#018786',
    white: '#f3f3f3',
    // background: '#FFFFFF',
    // surface: '#FFFFFF',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}
const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primario: '#ffc400',
    'primary-darken-1': '#3700B3',
    // secondary: '#03DAC6',
    // 'secondary-darken-1': '#018786',
    white: '#f3f3f3',
    // background: '#FFFFFF',
    // surface: '#FFFFFF',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      darkTheme,
      lightTheme
    },
  },
  components,
  directives,
});
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.mount("#app");
