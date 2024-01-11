<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useTheme } from 'vuetify'
import { brunaApi } from '../funciones/api.ts';
import router from '../router';

import VentanaConfirmar from '../components/VentanaConfirmar.vue';

const theme = useTheme()
const temaLight = ref(true)
const edit = ref(false)
onMounted(() => {
	cargaInicial();
});

const usuario = ref({
  nombre: '',
  apellido: '',
  informacion: {
    cédula: "",
    dirección: "",
    teléfono: "",
    correo: "",
  },
  rol: ""
})
const iniciales = ref('')

localStorage.getItem("brunaTheme") == 'dark'
? temaLight.value = false
: temaLight.value = true

watch(temaLight, () => {
  theme.global.name.value = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'
  localStorage.setItem("brunaTheme", theme.global.current.value.dark ? 'darkTheme' : 'lightTheme')
});

function cargaInicial() {
  brunaApi({ s: 'perfil' }, '')
  .then((res:any) => {
    if (res.data) {
      res.data.forEach((d:any) => {
        usuario.value.nombre = d.nom_per
        usuario.value.apellido = d.ape_per
        usuario.value.informacion.teléfono = d.tel_per
        usuario.value.informacion.cédula = d.ced_per
        usuario.value.informacion.dirección = d.dir_per
        usuario.value.informacion.correo = d.ema_per
        usuario.value.rol = d.nom_car
        iniciales.value = d.nom_per.substring(0,1)+d.ape_per.substring(0,1)
      });
    }
  }).catch(() => {
    // message: 'Hubo un error cargando los datos',
  })
}

function guardarCambios() {
  let data = "nom=" + usuario.value.nombre + '&ape=' + usuario.value.apellido
  data += "&tel=" + usuario.value.informacion.teléfono + '&ced=' + usuario.value.informacion.cédula
  data += "&dir=" + usuario.value.informacion.dirección + '&ema=' + usuario.value.informacion.correo
  brunaApi({ s: 'editarPerfil' }, data)
  .then((res:any) => {
    if (res.data.r) {
      iniciales.value = usuario.value.nombre.substring(0,1)+usuario.value.apellido .substring(0,1)
      edit.value = !edit.value
    }
  }).catch(() => {
    // message: 'Hubo un error actualizando los datos',
  })
}

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
        <span class="text-h5">{{ iniciales.toUpperCase() }}</span>
      </v-avatar>
      <span class="text-h4 flex-fill text-center ml-3 my-3">{{ usuario.nombre }}</span>
      <span class="text-h4 flex-fill text-center ml-3 my-3">{{ usuario.apellido }}</span>
      <v-btn
        variant="text"
        append-icon="mdi-logout"
      >
        <span class="d-none d-md-inline">Cerrar sesión</span>
        <VentanaConfirmar
          :message="'desea cerrar sesión'"
          icon="mdi-logout"
          @confirmar="(e) => { e ? cerrarSesion() : '' }"
        />
      </v-btn>
    </template>
    <v-text-field v-if="edit" label="Nombre" v-model="usuario.nombre" variant="underlined" hint="Escribe tu nombre" />
    <v-text-field v-if="edit" label="Apellido" v-model="usuario.apellido" variant="underlined" hint="Escribe tu apellido" />
  </div>
  <v-divider></v-divider>
  <div class="d-flex align-center">
    <v-switch
      v-model="temaLight"
      hide-details
      inset
      :label="temaLight ? 'Tema claro' : 'Tema oscuro'"
      :class="temaLight ? 'icon-moon' : 'icon-sun'"
    />
    <v-btn
      :variant="edit ? 'tonal' : 'text'"
      :prepend-icon="edit ? 'mdi-sync' :'mdi-pen'"
      :text="edit ? 'Guardar' : 'Editar'"
      :color="edit ? 'secundario' : ''"
      @click="edit ? guardarCambios() : edit=!edit"
    />
  </div>
  <v-list>
    <v-list-item
      v-if="!edit"
      v-for="(info, value) in usuario.informacion"
      :key="info"
      :title="value.charAt(0).toUpperCase() + value.slice(1)"
      :subtitle="info"
    ></v-list-item>
    <v-list-item
      v-else
      v-for="(info, value) in usuario.informacion"
      :key="'i'+info"
    >
      <v-text-field
        :label="value.charAt(0).toUpperCase() + value.slice(1)"
        v-model="usuario.informacion[value]"
      />
    </v-list-item>
    <v-list-item
      title="Rol"
      :subtitle="usuario.rol"
    ></v-list-item>
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