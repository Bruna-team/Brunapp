<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ModalImpresion from '@/components/ModalImpresion.vue'
import FiltroEstudiantes from '@/components/FiltroEstudiantes.vue';
import AlertaMensaje from '@/components/AlertaMensaje.vue'
import QuillEditorComponentVue from '@/components/QuillEditorComponent.vue';
import { sustituirSpandEmbed } from '@/funciones/funciones';
import { useDisplay } from 'vuetify';
import { brunaApi } from "@/funciones/api";
import { EstudiantePase } from '@/types/interfaceTypes';
import { paseEntrada, paseSalida } from '@/constantes/plantillas';
import { formatoFechaYHora } from '@/funciones/funciones';

const { smAndUp } = useDisplay()

const alertaMsj = ref('')
const estudiante = ref<EstudiantePase>();

const plantilla = computed(() => {
  if (paseTipo.value == '5') {
    return paseEntrada
  } else {
    return paseSalida
  }
})

// const dataPase:any = computed(()=> {
//   const hor = paseFecha.value.split('T')
//   return {
//     ano: estudiante.value?.num_ano,
//     mencion: estudiante.value?.nom_men,
//     seccion: estudiante.value?.sec_ano,
//     pasefecha: hor[0],
//     pasehor: hor[1],
//     id: estudiante.value?.id_estd,
//     estudiante: estudiante.value?.nombre,
//     estudianteCedula: estudiante.value?.ced_alum,
//     representante: estudiante.value?.representantes,
//     modulo: estudiante.value?.modulo_hor,
//     profesor: estudiante.value?.profesor,
//     materia: estudiante.value?.nom_mat,
//   }
// })
const paseFecha = ref(formatoFechaYHora(new Date(), 'fechaYhora'))
const content = ref('')
const paseTipo = ref('5')
const valido = computed(() => {
  return estudiante.value ? Object.values(estudiante.value).every((d: any) => d !== '') : false
})

function registrarPase() {
  const hor = paseFecha.value.split('T')
  if (estudiante.value?.id_estd && paseTipo.value) {
    brunaApi({ s: 'registrarPases' },
      'alum=' + estudiante.value.id_estd +
      '&pase=' + paseTipo.value +
      '&fec=' + hor[0] +
      '&mot=' + ' ' +
      '&hor=' + hor[1])
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = res.data.e
      } else {
        alertaMsj.value = res.data.e
      }
    }).catch(() => {
      alertaMsj.value = "Ocurrió un error"
    })
  } else {
    alertaMsj.value = "Faltan datos"
  }
}
watch(()=> estudiante.value,(value)=> {
  sustituirSpandEmbed(value)
  const elements = document.getElementsByClassName('ql-editor');
  const elementContents = Array.from(elements).map(element => element.innerHTML)[0];
  content.value = JSON.stringify(elementContents).replace(/"/g, '')
})
</script>
<template>
  <AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
  <v-container>
    <h2 class="pl-3">Pases de entrada y salida</h2>
    <FiltroEstudiantes
      :est="true"
      @est="estudiante = $event"
    />
    <v-row>
      <v-col cols="12" sm="auto">
        <p class="text-caption">Especifica el tipo de pase</p>
        <v-radio-group v-model="paseTipo" inline>
          <v-radio value="5" label="Pase de entrada" />
          <v-radio value="6" label="Pase de salida" />
        </v-radio-group>
      </v-col>
      <v-col cols="12" sm="auto">
        <v-text-field
          v-model="paseFecha"
          label="Fecha y hora del pase"
          type="datetime-local"
          persistent-hint
          class="mb-3"
        />
      </v-col>
    </v-row>
    <v-sheet
      flat
      color="muted"
      class="d-sm-flex text-center text-sm-start align-center pa-3 rounded-t-lg"
    >
      <p class="text-h6 flex-1-1-100 flex-md-fill">
        Configura el formato de pase que deseas generar
      </p>
      <v-divider
        class="mx-auto my-1 mx-sm-2"
        :vertical="smAndUp"
      />
      <v-btn
        variant="tonal"
        color="primario"
        prepend-icon="mdi-content-save"
        text="Registrar pase"
        class="ma-2"
        @click="registrarPase"
      />
      <ModalImpresion
        :quill="true"
        :title="`${estudiante?.nombre}`"
        :subtitle="paseTipo == '5' ? 'Pase de entrada' : 'Pase de salida'"
        btn-class="ma-2"
        :content="content ? content : []"
        :datos-validos="valido"
      />
    </v-sheet>
    <QuillEditorComponentVue
      :plantilla="plantilla"
      @content="content=$event"
      @actualizar="sustituirSpandEmbed(estudiante)"
    />
  </v-container>
</template>
<style>
.v-toolbar__content {
  flex-wrap: wrap;
}
</style>