<script setup lang="ts">
import { ref, computed } from 'vue';
const drawer = ref(false)
const car = ref(localStorage.getItem("bruna"))
const navItems = computed(() => {
  return car.value == '2' || car.value == '1' ?
    [
      {
        title: 'Secciones',
        props: {
          to: '/',
          prependIcon: 'mdi-chair-school',
        }
      },
      {
        title: 'Maestros',
        props: {
          to: '/maestros',
          prependIcon: 'mdi-human-male-board',
        }
      },
      {
        title: 'Reportes',
        props: {
          to: '/reportes',
          prependIcon: 'mdi-file-chart',
        }
      },
      {
        title: 'Pases',
        props: {
          to: '/pases',
          prependIcon: 'mdi-file-certificate',
        }
      },
      {
        title: 'Configuración',
        props: {
          to: '/configuracion',
          prependIcon: 'mdi-cog',
        }
      },
      {
        title: 'Perfil',
        props: {
          to: '/usuario',
          prependIcon: 'mdi-account',
        }
      },
    ]
  :
    [
      {
        title: 'Secciones',
        props: {
          to: '/',
          prependIcon: 'mdi-chair-school',
        }
      },
      {
        title: 'Reportes',
        props: {
          to: 'reportes',
          prependIcon: 'mdi-file-chart',
        }
      },
      {
        title: 'Perfil',
        props: {
          to: 'usuario',
          prependIcon: 'mdi-account',
        }
      },
    ]
})
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
      <p v-if="car == '2'" class="font-bruna text-white">Coordinación</p>
      <p v-else class="font-bruna text-white">Profesor</p>
    </v-col>
  </v-row>
</v-app-bar>
<v-navigation-drawer v-model="drawer" location="left" temporary>
  <v-list
    density="compact"
    :items="navItems"
    nav
    />
</v-navigation-drawer>
</template>
<style>
.v-navigation-drawer a:hover {
  transition: all .5s ease;
  box-shadow: 4px 4px 0px 0px #ffc400;
}
</style>