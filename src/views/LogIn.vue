<script setup lang="ts">
import { ref, watch } from 'vue';
import { brunaApi } from '../funciones/api.ts';
import router from '../router';
import { capitalizar } from "../funciones/funciones.ts";
import AlertaMensaje from '../components/AlertaMensaje.vue';

const alertaMsj = ref<string>('')
const form = ref()
const loading  = ref(false)
const seePassword  = ref(false)
const recSesion  = ref(false)
const logType  = ref(router.currentRoute.value.name)

const segurityCode  = ref('')
const logData = ref({
  cedula: {
    value: '',
    rules: [
      (v: string) => !!v || 'La cédula es necesaria',
      (v: string) => /^[^.]*$/.test(v)  || 'La cédula no debe tener puntos',
    ],
  },
  password: {
    value: '',
    rules: [
      (v: string) => !!v || 'La contraseña es necesaria',
    ]
  }
});
const regData = ref({
  email: {
    value: '',
    rules: [
      (v: string) => !!v || 'El correo es necesario',
      (v: string) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v) || 'El correo no es válido',
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
      (v: string) => /^[^.]*$/.test(v)  || 'La cédula no debe tener puntos',
      (v: string) => /^\d{7,8}$/.test(v)  || 'La cédula no tiene la longitud correcta',
    ],
  },
  nombre: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre es necesario',
      (v: string) => v.length>3 || 'El nombre es muy corto',
    ],
  },
  apellido: {
    value: '',
    rules: [
      (v: string) => !!v || 'El apellido es necesario',
      (v: string) => v.length>3 || 'El apellido es muy corto',
    ],
  },
  telefono: {
    value: '',
    rules: [
      (v: string) => !!v || 'El teléfono es necesario',
      (v: string) => /^(0412|0414|0416|0424|0426|0271|0272)\d{7}$/.test(v)  || 'El número de teléfono parece ser incorrecto',
    ],
  },
  direccion: {
    value: '',
    rules: [
      (v: string) => !!v || 'La dirección es necesario',
    ],
  },
  password: {
    value: '',
    rules: [
      (v: string) => !!v || 'La contraseña es necesaria',
      (v: string) => /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(v)  || 'La contraseña puede ser mejor.',
    ]
  }
});

async function validar (acc:string) {
  loading.value = true
  const { valid } = await form.value.validate()
  if (valid) {
    if (acc == 'log') {
      iniciarSesion()
    } else {
      registro()
    }
  }
  loading.value = false
}

function iniciarSesion() {
  if (logData.value.cedula.value && logData.value.password.value) {
    brunaApi({ s: 'auth' }, `usuario=${logData.value.cedula.value}&clave=${btoa(logData.value.password.value)}&rec=${recSesion.value}`)
    .then((res:any) => {
      if (res.data.r) {
        router.push('/')
      } else {
        alertaMsj.value = "Hubo un error: " + res.data.e
      }
    })
  }
}
function registro() {
  let data = 'nom=' + capitalizar(regData.value.nombre.value) + '&ape=' + capitalizar(regData.value.apellido.value)
  data += '&ced=' + regData.value.cedula.value + '&ema=' + regData.value.email.value
  data += '&tel=' + regData.value.telefono.value + '&dir=' + regData.value.direccion.value
  data += '&car=' + regData.value.rol.value + '&clave=' + btoa(regData.value.password.value)
  data += '&cod=' + btoa(segurityCode.value)
  brunaApi({ s: 'register' }, data)
  .then((res:any) => {
    if (res.data.r) {
      router.push('LogIn')
    } else {
      alertaMsj.value = "Hubo un error: " + res.data.e
    }
  })
}

watch(router.currentRoute, (value) => {
  logType.value = value.name
});

</script>
<template>
<v-container>
  <AlertaMensaje :mensaje="alertaMsj" />
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
      <v-form ref="form" validate-on="submit lazy" @submit.prevent>
        <v-text-field
          v-model="logData.cedula.value"
          :rules="logData.cedula.rules"
          prepend-icon="mdi-account"
          label="Cédula"
          prefix="V-"
        ></v-text-field>
        <v-text-field
          v-model="logData.password.value"
          prepend-icon="mdi-lock"
          :rules="logData.password.rules"
          :append-inner-icon="seePassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="seePassword ? 'text' : 'password'"
          @click:append-inner="seePassword = !seePassword"
          label="Contraseña"
        />
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
          @click="validar('log')"
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
      <v-form ref="form" validate-on="submit lazy" @submit.prevent>
        <v-text-field
          v-model="regData.nombre.value"
          :rules="regData.nombre.rules"
          prepend-icon="mdi-account"
          label="Nombre"
        ></v-text-field>
        <v-text-field
          v-model="regData.apellido.value"
          :rules="regData.apellido.rules"
          prepend-icon="mdi-account"
          label="Apellido"
        ></v-text-field>
        <v-text-field
          v-model="regData.cedula.value"
          :rules="regData.cedula.rules"
          prefix="V-"
          hint="Ej: V-12345678"
          prepend-icon="mdi-id-card"
          label="Cédula"
        ></v-text-field>
        <v-text-field
          v-model="regData.telefono.value"
          :rules="regData.telefono.rules"
          hint="Ej: 04121234567"
          prepend-icon="mdi-phone"
          label="N° telefónico"
        ></v-text-field>
        <v-text-field
          v-model="regData.email.value"
          :rules="regData.email.rules"
          hint="Ej: ejemplo@gmail.com"
          prepend-icon="mdi-email"
          label="Correo"
        ></v-text-field>
        <v-text-field
          v-model="regData.direccion.value"
          :rules="regData.direccion.rules"
          prepend-icon="mdi-map-marker"
          label="Dirección"
        ></v-text-field>
        <v-text-field
          v-model="regData.password.value"
          prepend-icon="mdi-lock"
          :rules="regData.password.rules"
          :append-inner-icon="seePassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="seePassword ? 'text' : 'password'"
          hint="Debe tener una letra mayúscula, un numero y un signo"
          @click:append-inner="seePassword = !seePassword"
          label="Contraseña"
        ></v-text-field>
        <v-radio-group
          v-model="regData.rol.value"
          :rules="regData.rol.rules"
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
          @click="validar('reg')"
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
../funciones y constantes/api.ts../funciones y constantes/funciones.ts