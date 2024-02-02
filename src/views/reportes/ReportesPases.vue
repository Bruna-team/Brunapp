<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import AlertaMensaje from '../../components/AlertaMensaje.vue'
import QuillEditorComponentVue from '../../components/QuillEditorComponent.vue';
import { brunaApi } from "../../funciones/api";
const props = defineProps({
  dataPase: {
    type: Object as PropType<{
      ano?: string,
      mencion?: string,
      seccion?: string,
      pasefecha?: string,
      pasehor?: string,
      id?: string,
      estudiante?: string,
      estudianteCedula?: string,
      representante?: string,
    }>,
    default: () => ({})
  }
})
const alertaMsj = ref('')
const plantilla = ref("<p><strong>E.T.C \"MADRE RAFOLS\"</strong></p><p><strong>VALERA ESTADO TRUJILLO</strong></p><h4 class=\"ql-align-center\"><span class=\"editor-var\" data-type=\"pase\" data-id=\"pase\">﻿<span contenteditable=\"false\">TIPO DE PASE</span>﻿</span></h4><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"Date\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">2024-01-31</span>﻿</span>﻿</span></p><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"DateTime\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">20:31</span>﻿</span>﻿</span></p><p><br></p><p>Estudiante: <span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"Ename\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">ESTUDIANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Curso: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"curso\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">CURSO</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Sección: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"seccion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">SECCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Mención: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"mencion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MENCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><br></p><p>Tiene permiso para entrar a la clase de <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"materia\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MATERIA</span>﻿</span>﻿</span>﻿</span>﻿</span> correspondiente al <span class=\"editor-var\" data-type=\"Academico\" data-id=\"modulo\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MÓDULO</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> módulo.</p><p><br></p><p><strong>Motivo del retraso: </strong></p><p><br></p><p><u>                                             </u>            <u>                                      </u></p><p>Firma del representante                       Firma del coordinador</p><p><span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"representante\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">REPRESENTANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>  <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"Pname\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">PROFESOR NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> </p>")
const paseTipo = ref('')
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
const dataImpresion = computed(() => {
  const data:any = props.dataPase
  if (paseTipo.value) {
    data.paseTipo = paseTipo.value == '5' ? 'Pase de entrada' : 'Pase de salida'
    return data
  } else {return data}
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
  <QuillEditorComponentVue
    :plantilla="plantilla"
    :data="dataImpresion"
  />
</template>
<style>
.v-toolbar__content {
  flex-wrap: wrap;
}
</style>