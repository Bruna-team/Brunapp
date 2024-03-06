<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ModalImpresion from '../../components/ModalImpresion.vue'
import AlertaMensaje from '../../components/AlertaMensaje.vue'
import QuillEditorComponentVue from '../../components/QuillEditorComponent.vue';
import { sustituirSpandEmbed } from '../../funciones/funciones';
import { useDisplay } from 'vuetify';
import { brunaApi } from "../../funciones/api";
import { Pase } from '../../types/interfaceTypes';
const props = defineProps({
  dataPase: {
    type: Object,
    default: ref<Pase | {}>({})
  }
})
const { smAndUp } = useDisplay()

const alertaMsj = ref('')
const plantilla = computed(() => {
  if (paseTipo.value == '5') {
    return "<p><strong>E.T.C \"MADRE RAFOLS\"</strong></p><p><strong>VALERA ESTADO TRUJILLO</strong></p><h4 class=\"ql-align-center\">Pase de entrada</h4><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"Date\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">2024-03-05</span>﻿</span>﻿</span></p><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"DateTime\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">20:05</span>﻿</span>﻿</span></p><p><br></p><p>Estudiante: <span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"Ename\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">ESTUDIANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Curso: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"curso\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">CURSO</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Sección: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"seccion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">SECCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Mención: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"mencion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MENCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><br></p><p>Tiene permiso para entrar a la clase de <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"materia\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MATERIA</span>﻿</span>﻿</span>﻿</span>﻿</span> correspondiente al <span class=\"editor-var\" data-type=\"Academico\" data-id=\"modulo\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MÓDULO</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> módulo.</p><p><br></p><p><strong>Motivo del retraso: </strong></p><p><br></p><p><br></p><p>Firma del representante                       Firma del coordinador</p><p><span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"representante\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">REPRESENTANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>  <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"Pname\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">PROFESOR NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> </p>"
  } else {
    return "<p><strong>E.T.C \"MADRE RAFOLS\"</strong></p><p><strong>VALERA ESTADO TRUJILLO</strong></p><h4 class=\"ql-align-center\">Pase de salida</h4><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"Date\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">2024-03-05</span>﻿</span>﻿</span></p><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"DateTime\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">20:05</span>﻿</span>﻿</span></p><p><br></p><p>Estudiante: <span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"Ename\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">ESTUDIANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Curso: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"curso\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">CURSO</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Sección: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"seccion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">SECCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Mención: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"mencion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MENCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><br></p><p>Tiene permiso para salir de la clase de <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"materia\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MATERIA</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> correspondiente al <span class=\"editor-var\" data-type=\"Academico\" data-id=\"modulo\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MÓDULO</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> módulo.</p><p><br></p><p><strong>Motivo del retraso: </strong></p><p><br></p><p><br></p><p>Firma del representante                       Firma del coordinador</p><p><span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"representante\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">REPRESENTANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>  <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"Pname\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">PROFESOR NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> </p>"
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
</template>
<style>
.v-toolbar__content {
  flex-wrap: wrap;
}
</style>