<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';

const loading  = ref(false)
const logType  = ref(router.currentRoute.value.name)

const userData = ref({
  username: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre de usuario es necesario',
      (v: string) => checkApi(v)
    ],
  },
  password: {
    value: '',
    rules: [
      (v: string) => !!v || 'La contraseña es necesaria',
      (v: string) => checkApi(v),
    ]
  }
});

async function validar (event:any) {
  loading.value = true
  const results = await event
  loading.value = false
  alert(JSON.stringify(results, null, 2))
}
async function checkApi (userName:string) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (userName === 'johnleider') return resolve('User name already taken. Please try another one.')

      return resolve(true)
    }, 1000)
  })
}

console.log(logType)
</script>
<template>
<v-container>
  <v-sheet
    class="d-flex flex-column align-center justify-center text-center mx-auto px-4"
    elevation="4"
    height="300"
    rounded
    max-width="800"
    width="100%"
  >
    <h2 class="font-weight-black text-primario font-bruna">Inicia Sesión</h2>
    <v-form validate-on="submit lazy" @submit.prevent="validar">
      <v-text-field
        v-model="userData.username.value"
        :rules="userData.username.rules"
        label="Nombre de usuario"
      ></v-text-field>
      <v-text-field
        v-model="userData.password.value"
        :rules="userData.password.rules"
        label="Contraseña"
      ></v-text-field>
      <v-divider class="mb-4"></v-divider>
      <v-btn
        class="my-2"
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
        class="my-2"
        prepend-icon="mdi-check"
        variant="tonal"
        color="primario"
        type="submit"
      >Iniciar sesión</v-btn>
    </v-form>

  </v-sheet>
</v-container>
</template>
