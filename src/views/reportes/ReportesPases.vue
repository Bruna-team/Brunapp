<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ModalImpresion from '../../components/ModalImpresion.vue'
import AlertaMensaje from '../../components/AlertaMensaje.vue'
import QuillEditorComponentVue from '../../components/QuillEditorComponent.vue';
import { formatoFechaYHora } from '../../funciones/funciones';
import { useDisplay } from 'vuetify';
const props = defineProps({
  dataPase: {
    type: Object,
    default: ref<{
      ano: string,
      mencion: string,
      seccion: string,
      pasefecha: string,
      estudiante: string,
      estudianteCedula: String,
      representante: string,
    } | {}>({})
  }
})
const { smAndUp } = useDisplay()

const alertaMsj = ref('')
const content = ref('')
const paseTipo = ref(true)
const valido = computed(() => {
  return Object.values(props.dataPase).every((d: any) => d !== '')
})

function sustituirSpandEmbed() {
  document.querySelectorAll('.editor-var').forEach((e: any) => {
    const id = e.getAttribute('data-id')
    switch (e.getAttribute('data-type')) {
      case 'Estudiante':
        switch(id) {
          case 'Ename':
            if(props.dataPase.estudiante) {
              e.getElementsByTagName('span')[0].textContent =
              props.dataPase.estudiante
            }
            break;
          case 'representante':
            if(props.dataPase.representante) {
               e.getElementsByTagName('span')[0].textContent =
               props.dataPase.representante
            }
            break;
          case 'Ecedula':
            if(props.dataPase.estudianteCedula) {
              e.getElementsByTagName('span')[0].textContent =
              props.dataPase.estudianteCedula
            }
            break;
        }
        break;
      case 'Academico':
        switch(id) {
           case 'modulo':
            if(props.dataPase.modulo) {
              e.getElementsByTagName('span')[0].textContent =
              props.dataPase.modulo
            }
            break;
          case 'seccion':
            if(props.dataPase.seccion) {
              e.getElementsByTagName('span')[0].textContent =
              props.dataPase.seccion
            }
            break;
          case 'mencion':
            if(props.dataPase.mencion) {
              e.getElementsByTagName('span')[0].textContent =
              props.dataPase.mencion
            }
            break;
          case 'curso':
            if(props.dataPase.ano) {
              e.getElementsByTagName('span')[0].textContent =
              props.dataPase.ano
            }
            break;
        }
        break;
      case 'Profesor':
         switch(id) {
          case'Pname':
            if(props.dataPase.profesor) {
              e.getElementsByTagName('span')[0].textContent =
              props.dataPase.profesor
            }
            break;
          case'materia':
            if(props.dataPase.materia) {
              e.getElementsByTagName('span')[0].textContent =
              props.dataPase.materia
            }
            break;
          }
          break;
      case 'Fecha':
      switch(id) {
        case('Date'):
          if(props.dataPase.pasefecha) {
            e.getElementsByTagName('span')[0].textContent =
            formatoFechaYHora(new Date(props.dataPase.pasefecha), 'fecha')
          }
          break;
        case('DateTime'):
          if(props.dataPase.pasefecha) {
            e.getElementsByTagName('span')[0].textContent =
            formatoFechaYHora(new Date(props.dataPase.pasefecha), 'hora')
          }
          break;
      }
      break;
    }
  })
}
watch(()=> props.dataPase,()=> {
  sustituirSpandEmbed()
  const elements = document.getElementsByClassName('ql-editor');
  const elementContents = Array.from(elements).map(element => element.innerHTML)[0];
  content.value = JSON.stringify(elementContents).replace(/"/g, '')
})
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
      :datos-validos="valido"
    />
  </v-sheet>
  <!-- <v-btn @click="sustituirSpandEmbed">A</v-btn> -->
  <QuillEditorComponentVue @content="content=$event" />
</template>
<style>
.v-toolbar__content {
  flex-wrap: wrap;
}
</style>