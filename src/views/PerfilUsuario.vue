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
    cedula: "",
    dirección: "",
    telefono: "",
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
        usuario.value.informacion.telefono = d.tel_per
        usuario.value.informacion.cedula = d.ced_per
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
  data += "&tel=" + usuario.value.informacion.telefono + '&ced=' + usuario.value.informacion.cedula
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
  <template v-if="!edit">
    <div class="d-flex justify-center align-center mb-3">
      <v-avatar size="70" color="brown">
        <span class="text-h5">{{ iniciales.toUpperCase() }}</span>
      </v-avatar>
      <span class="text-h4 flex-fill text-center ml-3 my-3">{{ usuario.nombre }} {{ usuario.apellido }}</span>
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
    </div>
  </template>
  <template v-else>
    <v-row>
      <v-col>
        <v-text-field label="Nombre" v-model="usuario.nombre" variant="underlined" hint="Escribe tu nombre" />
      </v-col>
      <v-col>
        <v-text-field label="Apellido" v-model="usuario.apellido" variant="underlined" hint="Escribe tu apellido" />
      </v-col>
    </v-row>
  </template>
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
    <template v-else>
      <v-list-item>
        <v-text-field
          label="Cédula"
          v-model="usuario.informacion.cedula"
        />
      </v-list-item>
      <v-list-item>
        <v-text-field
          label="Dirección"
          v-model="usuario.informacion.dirección"
        />
      </v-list-item>
      <v-list-item>
        <v-text-field
          label="telefono"
          v-model="usuario.informacion.telefono"
        />
      </v-list-item>
      <v-list-item>
        <v-text-field
          label="Correo"
          v-model="usuario.informacion.correo"
        />
      </v-list-item>
    </template>
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