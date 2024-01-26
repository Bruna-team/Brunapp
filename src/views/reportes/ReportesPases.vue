<script setup lang="ts">
import { ref } from 'vue'
import ModalImpresion from '../../components/ModalImpresion.vue'
import AlertaMensaje from '../../components/AlertaMensaje.vue'
import QuillEditorComponentVue from '../../components/QuillEditorComponent.vue';
import { useDisplay } from 'vuetify';

const { smAndUp } = useDisplay()

const alertaMsj = ref('')
const content = ref('')
const paseTipo = ref(true)
</script>
<template>
  <AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
  <v-sheet class="d-flex">
    <div class="flex-fill">
      <p class="text-caption">Especifica el tipo de pase</p>
      <v-radio-group v-model="paseTipo" inline>
        <v-radio :value="true" label="Pase de entrada" />
        <v-radio :value="false" label="Pase de salida" />
      </v-radio-group>
    </div>
    <div class="text-center">
      <p class="text-caption">Registra el pase sin imprimir</p>
      <v-btn
        variant="tonal"
        color="primario"
        prepend-icon="mdi-content-save"
        text="Registar"
      />
    </div>
  </v-sheet>
  <v-sheet flat color="muted" class="d-sm-flex text-center text-sm-start align-center pa-3 rounded-t-lg">
    <p class="text-h6 flex-1-1-100 flex-md-fill">
      Configura el formato de pase que deseas generar
    </p>
    <v-divider
      class="mx-auto my-1 mx-sm-2"
      :vertical="smAndUp"
    />
    <ModalImpresion
      :quill="true"
      :content="content ? content : []"
    />
  </v-sheet>
  <QuillEditorComponentVue @content="content=$event" />
</template>
<style>
.v-toolbar__content {
  flex-wrap: wrap;
}
</style>