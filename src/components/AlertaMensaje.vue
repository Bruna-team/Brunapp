<script setup lang="ts">
import { computed } from 'vue';
import { ref, watch } from 'vue'
const props = defineProps({
  type: String,
  mensaje: String,
})
defineEmits(['cerrar'])

const show = ref(false)
const mensaje = computed(()=> props.mensaje || '')

watch(mensaje, (value: String)=> {
  show.value = !!value
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
          @click="$emit('cerrar')"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </Teleport>
</template>