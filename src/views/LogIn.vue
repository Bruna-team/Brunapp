<script setup lang="ts">
import { ref, watch } from 'vue';
import { brunaApi } from '../funciones/api.ts';
import router from '../router';

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
      // (v: string) => checkApi(v)
    ],
  },
  rol: {
    value: {},
    rules: [
      (v: object) => !!v || 'El rol del docente es necesario',
    ],
  },
  username: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre de usuario es necesario',
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
  brunaApi({ s: 'auth' }, `usuario=${userData.value.username.value}&clave=${btoa(userData.value.password.value)}&rec=${recSesion.value}`)
  .then((res:any) => {
    if (res.data.r || res.data.Seleccion === 'No existe') {
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
          v-model="userData.username.value"
          :rules="userData.username.rules"
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
      height="600"
      rounded
      max-width="800"
      width="100%"
    >
      <h2 class="font-weight-black text-primario font-bruna mb-4">¡Crea tu cuenta profesor!</h2>
      <v-form validate-on="submit lazy" @submit.prevent="validar">
        <v-text-field
          v-model="userData.username.value"
          :rules="userData.username.rules"
          prepend-icon="mdi-account"
          label="Cédula"
        ></v-text-field>
        <v-text-field
          v-model="userData.email.value"
          :rules="userData.email.rules"
          prepend-icon="mdi-email"
          label="Correo"
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
          <v-radio label="Profesor" value="one"></v-radio>
          <v-radio label="Guía de sección" value="two"></v-radio>
          <v-radio label="Coordinador" value="three"></v-radio>
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
