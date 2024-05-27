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
import { formatoFechaYHora } from '@/funciones/funciones';

const { smAndUp } = useDisplay()

const alertaMsj = ref('')
const estudiante = ref<EstudiantePase>();

const paseFecha = ref(formatoFechaYHora(new Date(), 'fechaYhora'))
const content = ref("<p><strong>E.T.C \"MADRE RAFOLS\"</strong></p><p><strong>VALERA ESTADO TRUJILLO</strong></p><h4 class=\"ql-align-center\"><span class=\"editor-var\" data-type=\"Pase\" data-id=\"pase\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">Pase de entrada</span>﻿</span>﻿</span></h4><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"Date\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">2024-03-05</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"DateTime\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">20:05</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><br></p><p>Estudiante: <span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"Ename\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">ESTUDIANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Curso: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"curso\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">CURSO</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Sección: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"seccion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">SECCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Mención: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"mencion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MENCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><br></p><p>Tiene permiso para entrar a la clase de <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"materia\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MATERIA</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> correspondiente al <span class=\"editor-var\" data-type=\"Academico\" data-id=\"modulo\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MÓDULO</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> módulo.</p><p><br></p><p><strong>Motivo del retraso: </strong></p><p><br></p><p><br></p><p>Firma del representante                       Firma del coordinador</p><p><span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"representante\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">REPRESENTANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>  <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"Pname\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">PROFESOR NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span> </p>")
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
watch(()=> paseTipo.value,(value)=> {
  sustituirSpandEmbed({pase: value == '5' ? 'Pase de entrada' : 'Pase de salida'})
})
watch(()=> estudiante.value,(value)=> {
  sustituirSpandEmbed(value)
  sustituirSpandEmbed({pase: paseTipo.value == '5' ? 'Pase de entrada' : 'Pase de salida'})
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
      :contentData="content"
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