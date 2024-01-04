<template>
  <v-layout>
    <v-app-bar color="amber-accent-3" prominent>
      <v-app-bar-nav-icon
        variant="text"
        color="white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <i class="logo" />
      <v-toolbar-title>
        <RouterLink to="/">
          <span class="titulo-logo"> Bruna </span>
        </RouterLink>
      </v-toolbar-title>
      <v-row no-gutters justify="end" align="center">
        <v-col>
          <p class="color-heading bold">Coordinación</p>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="left" temporary>
      <v-list class="d-flex flex-column">
        <RouterLink to="/" class="ma-2 nav-link">
          <v-icon icon="mdi-home" />
          Inicio
        </RouterLink>
        <RouterLink to="usuario" class="ma-2 nav-link">
          <v-icon icon="mdi-account" />
          Perfil
        </RouterLink>
      </v-list>
    </v-navigation-drawer>
    <v-main class="h-screen">
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify'

const theme = useTheme()

const drawer = ref(false)

localStorage.getItem("brunaTheme") == 'dark'
  ? theme.global.name.value = 'dark'
  : theme.global.name.value = 'light'
</script>

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
