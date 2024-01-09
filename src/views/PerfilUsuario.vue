<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify'
import { brunaApi } from '../funciones/api.js';
import router from '../router';

import VentanaConfirmar from '../components/VentanaConfirmar.vue';

const theme = useTheme()
const temaLight = ref(true)

const información = ref({
  telefono: "04243333333",
  area: "Coordinación 1",
})

localStorage.getItem("brunaTheme") == 'dark'
? temaLight.value = false
: temaLight.value = true

watch(temaLight, () => {
  theme.global.name.value = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'
  localStorage.setItem("brunaTheme", theme.global.current.value.dark ? 'darkTheme' : 'lightTheme')
});

function cerrarSesion() {
  brunaApi({ s: 'salir' }, '')
  .then(r => {
    if (r.status === 200) {
      router.push('LogIn')
    }
  }).catch(() => {
    // message: 'No se pudo cerrar la sesión',
  })
}
</script>

<template>
<v-container>
  <div class="d-flex justify-center align-center">
    <v-avatar size="70" class="flex-fill">
      <v-img
        src="https://cdn.vuetifyjs.com/images/john.jpg"
        alt="Mildred"
      ></v-img>
    </v-avatar>
    <v-btn append-icon="mdi-logout">
      Cerrar sesión
    </v-btn>
    <VentanaConfirmar
      :message="'desea cerrar sesión'"
      :icon="'mdi-logout'"
      @confirmar="(e) => { e ? cerrarSesion() : '' }"
    />
  </div>
  <p class="text-h4 text-center my-3">Mildred</p>
  <v-divider></v-divider>
  <v-switch v-model="temaLight" inset :label="temaLight ? 'Tema claro' : 'Tema oscuro'"/>
  <v-list>
    <v-list-item
      v-for="info in información"
      :key="info"
      :title="info"
      :subtitle="info"
    ></v-list-item>
  </v-list>
</v-container>
</template>