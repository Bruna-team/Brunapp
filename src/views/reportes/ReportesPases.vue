<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ModalImpresion from '../../components/ModalImpresion.vue'
import AlertaMensaje from '../../components/AlertaMensaje.vue'
import QuillEditorComponentVue from '../../components/QuillEditorComponent.vue';
import { sustituirSpandEmbed } from '../../funciones/funciones';
import { useDisplay } from 'vuetify';
import { brunaApi } from "../../funciones/api";
import { Pase } from '../../types/interfaceTypes';
import { paseEntrada, paseSalida } from '../../constantes/plantillas';
const props = defineProps({
  dataPase: {
    type: Object,
    default: ref<Pase | {}>({})
  },
  students: {type: Array, default: ref<any[] | [{name: String, obs: string, date: string}]>([])},
  subtitle: String
})
const { smAndUp } = useDisplay()

const alertaMsj = ref('')
const plantilla = computed(() => {
  if (paseTipo.value == '5') {
    return paseEntrada
  } else {
    return paseSalida
  }
})
const content = ref('')
const paseTipo = ref('5')
const valido = computed(() => {
  return Object.values(props.dataPase).every((d: any) => d !== '')
})

function registrarPase() {
  if (props.dataPase.id && paseTipo.value && props.dataPase.pasefecha) {
    brunaApi({ s: 'registrarPases' }, 'alum=' + props.dataPase.id + '&pase=' + paseTipo.value + '&fec=' + props.dataPase.pasefecha + '&mot=' + ' ' + '&hor=' + props.dataPase.pasehor)
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
watch(()=> props.dataPase,()=> {
  sustituirSpandEmbed(props.dataPase)
  const elements = document.getElementsByClassName('ql-editor');
  const elementContents = Array.from(elements).map(element => element.innerHTML)[0];
  content.value = JSON.stringify(elementContents).replace(/"/g, '')
})
</script>
<template>
  <section class="d-inline">
    <AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
    <v-sheet class="d-flex">
      <div class="flex-fill">
        <p class="text-caption">Especifica el tipo de pase</p>
        <v-radio-group v-model="paseTipo" inline>
          <v-radio value="5" label="Pase de entrada" />
          <v-radio value="6" label="Pase de salida" />
        </v-radio-group>
      </div>
      <div class="text-center">
        <p class="text-caption">Registra el pase sin imprimir</p>
        <v-btn
          variant="tonal"
          color="primario"
          prepend-icon="mdi-content-save"
          text="Registar"
          @click="registrarPase"
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
        :title="`${dataPase.estudiante}`"
        :subtitle="paseTipo == '5' ? 'Pase de entrada' : 'Pase de salida'"
        :content="content ? content : []"
        :datos-validos="valido"
      />
    </v-sheet>
    <QuillEditorComponentVue
      :plantilla="plantilla"
      @content="content=$event"
      @actualizar="sustituirSpandEmbed(props.dataPase)"
    />
  </section>
</template>
<style>
.v-toolbar__content {
  flex-wrap: wrap;
}
</style>