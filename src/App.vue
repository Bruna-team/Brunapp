<script setup lang="ts">
import { useTheme } from 'vuetify'
const theme = useTheme()
localStorage.getItem("brunaTheme") == 'darkTheme'
  ? theme.global.name.value = 'darkTheme'
  : theme.global.name.value = 'lightTheme'
</script>

<template>
  <v-layout>
    <RouterView />
  </v-layout>
</template>
