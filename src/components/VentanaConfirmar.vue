<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps({
  dialog: Boolean,
  message: String,
  icon: String,
  colorBtn: {
    type: String,
    default: 'error'
  },
})
defineEmits(['confirmar'])

const dialog = ref(false)

watch(props, (value) => {
  dialog.value = value.dialog
});
</script>

<template>
<v-dialog
  v-model="dialog"
  activator="parent"
  width="auto"
>
  <v-card>
    <v-card-title>
      ¿Esta seguro que {{ message }}?
    </v-card-title>
    <v-card-actions class="justify-center">
      <v-btn
        color="primario"
        @click="$emit('confirmar', false), dialog = false"
      >Cancelar</v-btn>
      <v-btn
        :color="colorBtn"
        variant="tonal"
        :append-icon="props.icon"
        @click="$emit('confirmar', true), dialog = false"
      >Si, estoy seguro</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>