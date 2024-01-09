<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify'
import { brunaApi } from '../funciones/api.ts';
import router from '../router';

import VentanaConfirmar from '../components/VentanaConfirmar.vue';

const theme = useTheme()
const temaLight = ref(true)

const información = ref({
  telefono: "04243333333",
  correo: "mildred@gmail.com",
  rol: "Coordinación 1",
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
  .then((r:any) => {
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
  <div class="d-flex justify-center align-center mb-3">
    <div class="flex-fill text-center">
      <v-avatar size="70" color="brown">
        <span class="text-h5">MB</span>
      </v-avatar>
      <span class="text-h4 text-center ml-3 my-3">Mildred Benítez</span>
    </div>
    <v-btn append-icon="mdi-logout">
      Cerrar sesión
    </v-btn>
    <VentanaConfirmar
      :message="'desea cerrar sesión'"
      :icon="'mdi-logout'"
      @confirmar="(e) => { e ? cerrarSesion() : '' }"
    />
  </div>
  <v-divider></v-divider>
  <v-switch class="float-right" v-model="temaLight" inset :label="temaLight ? 'Tema claro' : 'Tema oscuro'"/>
  <v-list>
    <v-list-item
      v-for="(info, value) in información"
      :key="info"
      :title="value.charAt(0).toUpperCase() + value.slice(1)"
      :subtitle="info"
    ></v-list-item>
  </v-list>
</v-container>
</template>