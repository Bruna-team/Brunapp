<script setup lang="ts">
import { useTheme } from 'vuetify'
import router from './router';
const theme = useTheme()

localStorage.getItem("brunaTheme") == 'darkTheme'
  ? theme.global.name.value = 'darkTheme'
  : theme.global.name.value = 'lightTheme'

  console.log(router.currentRoute.value.name !== 'Login')
</script>

<template>
  <v-layout>
    <RouterView />
  </v-layout>
</template>

<style>
i.logo::before {
  display: block;
  width: 100%;
  content: url("assets/logo.svg");
}
i.logo {
  display: block;
  position: absolute;
  top: -2.3rem;
  left: 10rem;
}
div.v-row.v-row--no-gutters > div > div > div.v-input__details {
  display: none;
}
.nav-link {
  padding: 1.5rem 2rem;
  font-size: 1.2rem;
}
a:hover {
  transition: all .5s ease;
  box-shadow: 4px 4px 0px 0px #ffc400;
}
</style>
