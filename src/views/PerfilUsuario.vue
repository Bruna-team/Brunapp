<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useTheme } from 'vuetify'
import { brunaApi } from '../funciones/api.ts';
import { capitalizar } from "../funciones/funciones.ts";
import router from '../router';
import AlertaMensaje from '../components/AlertaMensaje.vue';

import VentanaConfirmar from '../components/VentanaConfirmar.vue';

const form = ref()
const loading  = ref(false)
const alertaMsj = ref<string>('')
const theme = useTheme()
const temaLight = ref(true)
const edit = ref(false)
onMounted(() => {
	cargaInicial();
});

const usuario = ref({
  nombre: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre es necesario',
    ],
  },
  apellido: {
    value: '',
    rules: [
      (v: string) => !!v || 'El apellido es necesario',
    ],
  },
  informacion: {
    cedula: {
    value: '',
    rules: [
        (v: string) => !!v || 'La cédula es necesaria',
        (v: string) => /^[^.]*$/.test(v)  || 'La cédula no debe tener puntos',
        (v: string) => /^\d{7,8}$/.test(v)  || 'La cédula no tiene la longitud correcta',
      ],
    },
    dirección: {
    value: '',
    rules: [
        (v: string) => !!v || 'La dirección es necesaria',
      ],
    },
    telefono: {
    value: '',
    rules: [
        (v: string) => !!v || 'El teléfono es necesario',
        (v: string) => /^\d{10,11}$/.test(v)  || 'El teléfono no es válido',
      ],
    },
    correo: {
    value: '',
      rules: [
        (v: string) => !!v || 'El correo es necesario',
        (v: string) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v) || 'El correo no es válido',
      ],
    },
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

async function validar () {
  loading.value = true
  const { valid } = await form.value.validate()
  if (valid) {
    guardarCambios()
  }
  loading.value = false
}

function cargaInicial() {
  brunaApi({ s: 'perfil' }, '')
  .then((res:any) => {
    if (res.data) {
      res.data.forEach((d:any) => {
        usuario.value.nombre.value = d.nom_per
        usuario.value.apellido.value = d.ape_per
        usuario.value.informacion.telefono.value = d.tel_per
        usuario.value.informacion.cedula.value = d.ced_per
        usuario.value.informacion.dirección.value = d.dir_per
        usuario.value.informacion.correo.value = d.ema_per
        usuario.value.rol = d.nom_car
        iniciales.value = d.nom_per.substring(0,1)+d.ape_per.substring(0,1)
      });
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
}

function guardarCambios() {
  let data = "nom=" + capitalizar(usuario.value.nombre.value) + '&ape=' + capitalizar(usuario.value.apellido.value)
  data += "&tel=" + usuario.value.informacion.telefono.value + '&ced=' + usuario.value.informacion.cedula.value
  data += "&dir=" + usuario.value.informacion.dirección.value + '&ema=' + usuario.value.informacion.correo.value
  brunaApi({ s: 'editarPerfil' }, data)
  .then((res:any) => {
    if (res.data.r) {
      iniciales.value = usuario.value.nombre.value.substring(0,1)+usuario.value.apellido.value .substring(0,1)
      edit.value = !edit.value
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error actualizando los datos"
  })
}

function cerrarSesion() {
  brunaApi({ s: 'salir' }, '')
  .then((r:any) => {
    if (r.data.r) {
      router.push('LogIn')
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cerrando sesión"
  })
}
</script>

<template>
<v-container>
  <AlertaMensaje :mensaje="alertaMsj" />
  <template v-if="!edit">
    <div class="d-flex justify-center align-center mb-3">
      <span class="text-h5 text-sm-h4 flex-fill text-center ml-md-3 my-md-3">
        <v-avatar size="70" color="brown">
          <span class="text-h5">{{ iniciales.toUpperCase() }}</span>
        </v-avatar>
        {{ usuario.nombre.value }} {{ usuario.apellido.value }}
      </span>
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
  <template ref="form" v-else>
    <v-row>
      <v-col>
        <v-text-field label="Nombre" v-model="usuario.nombre.value" :rules="usuario.nombre.rules" variant="underlined" hint="Escribe tu nombre" />
      </v-col>
      <v-col>
        <v-text-field label="Apellido" v-model="usuario.apellido.value" :rules="usuario.apellido.rules" variant="underlined" hint="Escribe tu apellido" />
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
      :loading="loading"
      :variant="edit ? 'tonal' : 'text'"
      :prepend-icon="edit ? 'mdi-sync' :'mdi-pen'"
      :text="edit ? 'Guardar' : 'Editar'"
      :color="edit ? 'secundario' : ''"
      @click="edit ? validar() : edit=!edit"
    />
  </div>
  <v-list ref="form">
    <v-list-item
      v-if="!edit"
      v-for="(info, value) in usuario.informacion"
      :key="info.value"
      :title="value.charAt(0).toUpperCase() + value.slice(1)"
      :subtitle="info.value"
      ></v-list-item>
    <template v-else>
      <v-list-item>
        <v-text-field
          label="Cédula"
          v-model="usuario.informacion.cedula.value"
          :rules="usuario.informacion.cedula.rules"
          prefix="V-"
          hint="Ej: V-12345678"
        />
      </v-list-item>
      <v-list-item>
        <v-text-field
          label="Dirección"
          v-model="usuario.informacion.dirección.value"
          :rules="usuario.informacion.dirección.rules"
        />
      </v-list-item>
      <v-list-item>
        <v-text-field
          label="Teléfono"
          v-model="usuario.informacion.telefono.value"
          :rules="usuario.informacion.telefono.rules"
          hint="Ej: 04121234567"
        />
      </v-list-item>
      <v-list-item>
        <v-text-field
          label="Correo"
          v-model="usuario.informacion.correo.value"
          :rules="usuario.informacion.correo.rules"
          hint="Ej: ejemplo@gmail.com"
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
</style>../funciones y constantes/api.ts