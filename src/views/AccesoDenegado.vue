<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const message = computed(() => {
  switch (route.query.message) {
    case 'noAccess':
      return {text: 'Ups... parece que no tienes permisos para ver esta sección', icon: 'mdi-book-alert'}
    case 'locked':
      return { text: 'Ups... parece que tu usuario esta bloqueado', icon: 'mdi-book-alert'}
    case 'err':
      return { text: 'Hubo un error al cargar la pagina', icon: 'mdi-alert'}
    default:
      return { text: 'Parece que no puedes acceder a esta ruta', icon: 'mdi-book-alert'}
  }
})
</script>

<template>
  <v-sheet
    rounded="xl"
    class="text-center mt-3 pb-2 mx-auto px-2"
    max-width="600px"
  >
    <v-icon :icon="message.icon" class="text-primario-claro large-icon"/>
    <p class="text-h6">{{ message.text }}</p>
  </v-sheet>
</template>