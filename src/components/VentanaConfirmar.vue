<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps({
  dialog: Boolean,
  message: String,
  subtitle: String,
  icon: String,
  btnicon: String,
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
    <v-card-title class="text-wrap text-center">
      ¿Esta seguro que {{ message }}?
    </v-card-title>
    <v-card-subtitle v-if="subtitle" class="text-center text-wrap">
      <v-icon v-if="icon" :icon="icon" class="d-block mx-auto" size="x-large"/>
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-actions class="justify-center flex-column flex-sm-row">
      <v-btn
        @click="$emit('confirmar', false), dialog = false"
      >Cancelar</v-btn>
      <v-btn
        :color="colorBtn"
        variant="tonal"
        :append-icon="props.btnicon"
        @click="$emit('confirmar', true), dialog = false"
      >Si, estoy seguro</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>