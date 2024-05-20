<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import NavBar from './components/NavBar.vue';
import { useRoute } from 'vue-router'
const route = useRoute()
const showNav = computed(() => (route.name !== 'LogIn') && (route.name !== 'SingIn'))
const theme = useTheme()
localStorage.getItem("brunaTheme") == 'darkTheme'
  ? theme.global.name.value = 'darkTheme'
  : theme.global.name.value = 'lightTheme'
</script>

<template>
  <v-layout>
    <NavBar v-if="showNav"/>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>
