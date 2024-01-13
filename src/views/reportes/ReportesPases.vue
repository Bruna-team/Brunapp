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
  <v-container>
    <h3>Pases</h3>
    <v-sheet height="500px">
      <ModalImpresion
        :quill="true"
        :content="content ? content : []"
      />
      <QuillEditor
        v-model:content="content"
        :modules="modules"
        theme="snow"
        toolbar="full"
        content-type="html"
        class="quill-height"
      />
    </v-sheet>
  </v-container>
</template>
<style>
.quill-height {
  min-height: min-content;
}
</style>