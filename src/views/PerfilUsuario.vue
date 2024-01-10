<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify'
import { brunaApi } from '../funciones/api.ts';
import router from '../router';

import VentanaConfirmar from '../components/VentanaConfirmar.vue';

const theme = useTheme()
const temaLight = ref(true)
const edit = ref(false)

const usuario = ref({
  nombre: 'Mildred Benitez',
  información: {
    telefono: "04243333333",
    correo: "mildred@gmail.com",
    rol: "Coordinación 1",
  }
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
    <template v-if="!edit">
      <v-avatar size="70" color="brown">
        <span class="text-h5">MB</span>
      </v-avatar>
      <span class="text-h4 flex-fill text-center ml-3 my-3">{{ usuario.nombre }}</span>
      <v-btn
        variant="text"
        append-icon="mdi-logout"
        >
        <span class="d-none d-md-inline">Cerrar sesión</span>
        <VentanaConfirmar
        :message="'desea cerrar sesión'"
        :icon="'mdi-logout'"
        @confirmar="(e) => { e ? cerrarSesion() : '' }"
        />
      </v-btn>
    </template>
    <v-text-field v-else label="Nombre" v-model="usuario.nombre" variant="underlined" hint="Escribe tu nombre y apellido completo" />
  </div>
  <v-divider></v-divider>
  <div class="d-flex">
    <v-switch
      v-model="temaLight"
      hide-details
      inset
      :label="temaLight ? 'Tema oscuro' : 'Tema claro'"
      :class="temaLight ? 'icon-moon' : 'icon-sun'"
    />
    <v-checkbox
      v-model="edit"
      hide-details
      :prepend-icon="edit ? 'mdi-sync' :'mdi-pen'"
      :label="edit ? 'Guardar' : 'Editar'"
      :class="['custom-checkbox-edit flex-0-0', {'checked': edit}]"
    />
  </div>
  <v-list>
    <v-list-item
      v-if="!edit"
      v-for="(info, value) in usuario.información"
      :key="info"
      :title="value.charAt(0).toUpperCase() + value.slice(1)"
      :subtitle="info"
    ></v-list-item>
    <v-list-item
      v-else
      v-for="(info, value) in usuario.información"
      :key="info"
    >
      <v-text-field
        :label="value.charAt(0).toUpperCase() + value.slice(1)"
        variant="underlined"
        v-model="usuario.información[value]"
      />
    </v-list-item>
  </v-list>
</v-container>
</template>
<style>
.v-switch__thumb::before {
  display: inline-block;
  font: normal normal normal 24px/1 "Material Design Icons";
  font-size: inherit;
  text-rendering: auto;
  line-height: inherit;
  -webkit-font-smoothing: antialiased;
}
.icon-moon {
  .v-switch__thumb::before {
    content: "\F0599";
  }
}
.icon-sun {
  .v-switch__thumb {
    transform: none;
  }
  .v-switch__thumb::before {
    content: "\F0594";
  }

}
</style>