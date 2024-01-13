<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import BlotFormatter from 'quill-blot-formatter'
import ModalImpresion from "../../components/ModalImpresion.vue"

const content = ref('<h1>Hello world</h1>')
const modules = ref({
 name: 'blotFormatter',
 module: BlotFormatter,
 options: {}
})

</script>
<template>
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
  <QuillEditor
    v-model:content="content"
    :modules="modules"
    theme="snow"
    toolbar="full"
    content-type="html"
    class="quill-height"
  />
</template>
<style>
.quill-height {
  min-height: min-content;
}
</style>