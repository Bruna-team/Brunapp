<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  show: Boolean,
  mensaje: String,
})
defineEmits(['cerrar'])

const snackbar = computed(()=>{return props.show})
const mensaje = computed(()=>{return props.mensaje})

</script>
<template>
<v-snackbar
  v-model="snackbar"
  :timeout="2000"
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
</template>