<script setup lang="ts">
import { ref } from 'vue';
const drawer = ref(false)
</script>
<template>
<v-app-bar color="primario" prominent>
  <v-app-bar-nav-icon
    variant="text"
    color="white"
    @click.stop="drawer = !drawer"
  ></v-app-bar-nav-icon>

  <i class="logo" />
  <v-toolbar-title>
    <RouterLink to="/">
      <span class="font-bruna text-white">Bruna</span>
    </RouterLink>
  </v-toolbar-title>

  <v-row no-gutters justify="end" align="center">
    <v-col>
      <p class="font-bruna text-white">Coordinación</p>
    </v-col>
  </v-row>
</v-app-bar>
<v-navigation-drawer v-model="drawer" location="left" temporary>
  <v-list class="d-flex flex-column">
    <RouterLink to="/" class="ma-2 nav-link">
      <v-icon icon="mdi-chair-school" />
      Secciones
    </RouterLink>
    <RouterLink to="maestros" class="ma-2 nav-link">
      <v-icon icon="mdi-human-male-board" />
      Maestros
    </RouterLink>
    <RouterLink to="reportes" class="ma-2 nav-link">
      <v-icon icon="mdi-file-chart" />
      Reportes
    </RouterLink>
    <RouterLink to="diario" class="ma-2 nav-link">
      <v-icon icon="mdi-notebook" />
      Diario
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
</template>
<style>
.v-navigation-drawer a:hover {
  transition: all .5s ease;
  box-shadow: 4px 4px 0px 0px #ffc400;
}
</style>