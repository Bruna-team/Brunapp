<script setup lang="ts">
import { ref } from 'vue'
import ModalImpresion from '../../components/ModalImpresion.vue'
import AlertaMensaje from '../../components/AlertaMensaje.vue'
import QuillEditorComponentVue from '../../components/QuillEditorComponent.vue';

const alertaMsj = ref('')
const content = ref('')
</script>
<template>
  <AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
  <v-toolbar flat>
    <v-toolbar-title>Configura el formato de pase que deseas generar</v-toolbar-title>
    <v-divider
      class="mx-4"
      inset
      vertical
    ></v-divider>
    <v-spacer></v-spacer>
    <ModalImpresion
      :quill="true"
      :content="content ? content : []"
      :classBtn="'float-right'"
    />
  </v-toolbar>
  <QuillEditorComponentVue @content="content=$event" />
</template>