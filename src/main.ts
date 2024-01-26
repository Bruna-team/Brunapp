import { createApp } from 'vue'
import router from "./router";
import App from "./App.vue";
import { QuillConfig } from './funciones/utilidades'

QuillConfig()
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import '@mdi/font/css/materialdesignicons.css'

// Themes
import { lightTheme, darkTheme } from "./themes/Bruna"

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
import './assets/app.css'

app.use(router);
app.use(vuetify);
app.mount("#app");
