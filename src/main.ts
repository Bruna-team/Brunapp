import { createApp } from 'vue'
import router from "./router";
import App from './App.vue'

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components,
  directives,
});
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.mount("#app");

// createApp(App).mount('#app')
