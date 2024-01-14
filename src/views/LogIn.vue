<script setup lang="ts">
import { ref, watch } from 'vue';
import { brunaApi } from '../funciones/api.ts';
import router from '../router';
// import { capitalizar, validarEmail, validarTel } from "../funciones/funciones.ts";
import { capitalizar } from "../funciones/funciones.ts";

const loading  = ref(false)
const seePassword  = ref(false)
const recSesion  = ref(false)
const logType  = ref(router.currentRoute.value.name)

const segurityCode  = ref('')
const userData = ref({
  email: {
    value: '',
    rules: [
      (v: string) => !!v || 'El correo es necesario',
      // (v: string) => validarEmail(v)
    ],
  },
  rol: {
    value: {},
    rules: [
      (v: object) => !!v || 'El rol del docente es necesario',
    ],
  },
  cedula: {
    value: '',
    rules: [
      (v: string) => !!v || 'El número de cedula es necesario',
      // (v: string) => checkApi(v)
    ],
  },
  nombre: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre es necesario',
      // (v: string) => checkApi(v)
    ],
  },
  apellido: {
    value: '',
    rules: [
      (v: string) => !!v || 'El apellido es necesario',
      // (v: string) => checkApi(v)
    ],
  },
  telefono: {
    value: '',
    rules: [
      (v: string) => !!v || 'El teléfono es necesario',
      // (v: string) => validarTel(v)
    ],
  },
  direccion: {
    value: '',
    rules: [
      (v: string) => !!v || 'La dirección es necesario',
      // (v: string) => checkApi(v)
    ],
  },
  password: {
    value: '',
    rules: [
      (v: string) => !!v || 'La contraseña es necesaria',
      // (v: string) => checkApi(v),
    ]
  }
});

async function validar (event:any) {
  loading.value = true
  const results = await event
  loading.value = false
  alert(JSON.stringify(results, null, 2))
}
// async function checkApi (userName:string) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       if (userName === 'johnleider') return resolve('User name already taken. Please try another one.')
//       return resolve(true)
//     }, 1000)
//   })
// }
function iniciarSesion() {
  if (userData.value.cedula.value && userData.value.password.value) {
    brunaApi({ s: 'auth' }, `usuario=${userData.value.cedula.value}&clave=${btoa(userData.value.password.value)}&rec=${recSesion.value}`)
    .then((res:any) => {
      if (res.data.r) {
        router.push('/')
      } else {
        // mensaje de error
      }
    })
  }
}
function registro() {
  let data = 'nom=' + capitalizar(userData.value.nombre.value) + '&ape=' + capitalizar(userData.value.apellido.value)
  data += '&ced=' + userData.value.cedula.value + '&ema=' + userData.value.email.value
  data += '&tel=' + userData.value.telefono.value + '&dir=' + userData.value.direccion.value
  data += '&car=' + userData.value.rol.value + '&clave=' + userData.value.password.value
  data += '&cod=' + btoa(segurityCode.value)
  brunaApi({ s: 'register' }, data)
  .then((res:any) => {
    if (res.data.r) {
      router.push('/')
    } else {
      // mensaje de error
    }
  })
}

watch(router.currentRoute, (value) => {
  logType.value = value.name
});

</script>
<template>
<v-container>
  <Transition
    name="slide-fade"
    mode="out-in"
  >
    <v-sheet
      v-if="logType == 'LogIn'"
      class="d-flex flex-column align-center justify-center text-center mx-auto px-4"
      elevation="4"
      height="400"
      rounded
      max-width="800"
      width="100%"
    >
      <h2 class="font-weight-black text-primario font-bruna mb-4">Inicia Sesión</h2>
      <v-form validate-on="submit lazy" @submit.prevent="validar">
        <v-text-field
          v-model="userData.cedula.value"
          :rules="userData.cedula.rules"
          prepend-icon="mdi-account"
          label="Cédula"
          ></v-text-field>
          <v-text-field
          v-model="userData.password.value"
          prepend-icon="mdi-lock"
          :rules="userData.password.rules"
          :append-inner-icon="seePassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="seePassword ? 'text' : 'password'"
          @click:append-inner="seePassword = !seePassword"
          label="Contraseña"
        ></v-text-field>
        <v-checkbox label="Recordar" title="Mantener la sesión iniciada" v-model="recSesion"/>
        <v-divider class="my-2"></v-divider>
        <v-btn
          class="my-2 mx-1"
          rounded
          variant="flat"
          @click="router.push('SingIn')"
        >
          <span class="text-caption">
            ¿No tienes cuenta? crea la tuya aquí
          </span>
        </v-btn>
        <v-btn
          :loading="loading"
          class="my-2 mx-1"
          prepend-icon="mdi-check"
          variant="tonal"
          color="primario"
          type="submit"
          @click="iniciarSesion"
        >Iniciar sesión</v-btn>
      </v-form>
    </v-sheet>
    <v-sheet
      v-else
      class="d-flex flex-column align-center justify-center text-center mx-auto px-4"
      elevation="4"
      rounded
      max-width="800"
      width="100%"
    >
      <h2 class="font-weight-black text-primario font-bruna mb-4">¡Crea tu cuenta profesor!</h2>
      <v-form validate-on="submit lazy" @submit.prevent="validar">
        <v-text-field
          v-model="userData.nombre.value"
          :rules="userData.nombre.rules"
          prepend-icon="mdi-account"
          label="Nombre"
        ></v-text-field>
        <v-text-field
          v-model="userData.apellido.value"
          :rules="userData.apellido.rules"
          prepend-icon="mdi-account"
          label="Apellido"
        ></v-text-field>
        <v-text-field
          v-model="userData.cedula.value"
          :rules="userData.cedula.rules"
          prepend-icon="mdi-account"
          label="Cédula"
        ></v-text-field>
        <v-text-field
          v-model="userData.telefono.value"
          :rules="userData.telefono.rules"
          prepend-icon="mdi-email"
          label="N° telefónico"
        ></v-text-field>
        <v-text-field
          v-model="userData.email.value"
          :rules="userData.email.rules"
          prepend-icon="mdi-email"
          label="Correo"
        ></v-text-field>
        <v-text-field
          v-model="userData.direccion.value"
          :rules="userData.direccion.rules"
          prepend-icon="mdi-email"
          label="Dirección"
        ></v-text-field>
        <v-text-field
          v-model="userData.password.value"
          prepend-icon="mdi-lock"
          :rules="userData.password.rules"
          :append-inner-icon="seePassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="seePassword ? 'text' : 'password'"
          @click:append-inner="seePassword = !seePassword"
          label="Contraseña"
        ></v-text-field>
        <v-radio-group
          v-model="userData.rol.value"
          :rules="userData.rol.rules"
          inline
          label="Rol de docente"
        >
          <v-radio label="Profesor" value="3"></v-radio>
          <v-radio label="Guía de sección" value="4"></v-radio>
          <v-radio label="Coordinador" value="2"></v-radio>
        </v-radio-group>
        <v-text-field
          v-model="segurityCode"
          prepend-icon="mdi-key"
          :rules="[(v) => !!v || 'El código de seguridad es necesario para crear una cuenta']"
          type="password"
          label="Código de seguridad"
          hint="Este te lo debe dar la institución para crear tu cuenta"
        ></v-text-field>
        <v-divider class="my-4"></v-divider>
        <v-btn
          class="my-2 mx-1"
          rounded
          variant="flat"
          @click="router.push('LogIn')"
        >
          <span class="text-caption">
            ¿Ya tienes cuenta? Inicia sesión aquí
          </span>
        </v-btn>
        <v-btn
          :loading="loading"
          class="my-2 mx-1"
          prepend-icon="mdi-check"
          variant="tonal"
          color="primario"
          type="submit"
          @click="registro"
        >Crear Cuenta</v-btn>
      </v-form>
    </v-sheet>
  </Transition>
</v-container>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
