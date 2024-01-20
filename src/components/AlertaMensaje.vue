<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({
  type: String,
  mensaje: String,
})
const emit = defineEmits(['limpiarMsj'])

const show = ref(false)
const mensaje = ref<string | undefined>('')

watch(props, (value)=> {
  mensaje.value = value.mensaje
  show.value = !!value.mensaje
  setTimeout(() => {
    mensaje.value= ''
    show.value = false
    emit('limpiarMsj')
  }, 2000);
})
</script>
<template>
  <Teleport to="body">
    <v-snackbar
      v-model="show"
      :close-on-content-click="true"
      location="top right"
      multi-line
    >
      {{ mensaje }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="$emit('limpiarMsj')"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </Teleport>
</template>