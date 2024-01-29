<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import QuillConfig from '../funciones/quillConfigModule'
QuillConfig()

const emit = defineEmits(['content'])

onMounted(() => {
  emit('content', content.value)
})

const editor = ref()
const editorOptions = ref({
  modules: {
    toolbar: [
      [{'header': [1, 2, 3, 4, 5, 6, false]}, { 'font': [] }, 'bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'color': []}, {'background': []}, 'clean'],
      [{ 'direction': 'rtl' }, {'align': []}, {'indent': '-1'}, {'indent': '+1'}, {'list': 'ordered'}, {'list': 'bullet'}, 'image'],
    ],
    blotFormatter: {},
  },
  placeholder: 'Escribe que deseas imprimir...',
  theme: 'snow'
})
const focusEditor = ref(false)
const content = ref("<p><strong>E.T.C \"MADRE RAFOLS\"</strong></p><p><strong>VALERA ESTADO TRUJILLO</strong></p><h4 class=\"ql-align-center\">Pase de entrada</h4><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"Date\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">FECHA DE HOY</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"DateTime\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">HORA</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><br></br><p>Estudiante: <span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"Ename\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">ESTUDIANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Curso: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"curso\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">CURSO</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Sección: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"seccion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">SECCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p>Mención: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"mencion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MENCIÓN</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p><br></br><p>Tiene permiso para entrar a la clase de <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"materia\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MATERIA</span>﻿</span>﻿</span>﻿</span> correspondiente al <span class=\"editor-var\" data-type=\"Academico\" data-id=\"modulo\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MÓDULO</span>﻿</span>﻿</span>﻿</span>﻿</span> módulo.</p><p><br></p><p><strong>Motivo del retraso: </strong></p><p><br></p><p><u>                                             </u>            <u>                                      </u></p><p>Firma del representante                       Firma del coordinador</p><p><span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"representante\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">REPRESENTANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span>  <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"Pname\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">PROFESOR NOMBRES</span>﻿</span>﻿</span>﻿</span>﻿</span> </p>")

function insertSomething(value:Object) {
  const e = editor.value.getQuill()
  const p = e.selection.savedRange.index
   e.insertEmbed(p, 'spanEmbed', value);
}
watch(content, (value) => {
  emit('content', value)
})
</script>

<template>
  <v-sheet color="muted">
    <v-row no-gutters>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'ESTUDIANTE NOMBRES',
              id: 'Ename',
              type: 'Estudiante',
            })"
        >
          <v-chip variant="outlined" color="primario">
            Estudiante
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'REPRESENTANTE NOMBRES',
              id: 'representante',
              type: 'Estudiante',
            })"
        >
          <v-chip variant="outlined" color="primario">
            Representante
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'ESTUDIANTE CÉDULA',
              id: 'Ecedula',
              type: 'Estudiante',
            })"
        >
          <v-chip variant="outlined" color="primario">
            Estudiante Cédula
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'MÓDULO',
              id: 'modulo',
              type: 'Academico',
            })"
        >
          <v-chip variant="outlined" color="warning">
            Módulo
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'CURSO',
              id: 'curso',
              type: 'Academico',
            })"
        >
          <v-chip variant="outlined" color="warning">
            Curso
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'SECCIÓN',
              id: 'seccion',
              type: 'Academico',
            })"
        >
          <v-chip variant="outlined" color="warning">
            Sección
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'MENCIÓN',
              id: 'mencion',
              type: 'Academico',
            })"
        >
          <v-chip variant="outlined" color="warning">
            Mención
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'PROFESOR NOMBRES',
              id: 'Pname',
              type: 'Profesor',
            })"
        >
          <v-chip variant="outlined" color="info">
            Profesor
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'MATERIA',
              id: 'materia',
              type: 'Profesor',
            })"
        >
          <v-chip variant="outlined" color="info">
            MATERIA
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'FECHA DE HOY',
              id: 'Date',
              type: 'Fecha',
            })"
        >
          <v-chip variant="outlined" color="secundario-claro">
            Fecha de hoy
          </v-chip>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          flat
          class="px-1"
          color="muted"
          @click="insertSomething({
              text: 'HORA',
              id: 'DateTime',
              type: 'Fecha',
            })"
        >
          <v-chip variant="outlined" color="secundario-claro">
            Hora
          </v-chip>
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
  <QuillEditor
    ref="editor"
    v-model:content="content"
    :options="editorOptions"
    content-type="html"
    class="quill-height"
    @focus="focusEditor= !focusEditor"
  />
</template>
<style>
.quill-height {
  min-height: 30vh;
}
[data-type] {
  padding: 1px 8px;
  border-radius: 1.5rem;
  border: 2px solid;
}
[data-type="Estudiante"] {
  color: rgb(var(--v-theme-primario));
  border-color: rgb(var(--v-theme-primario));
}
[data-type="Academico"] {
  color: rgb(var(--v-theme-warning));
  border-color: rgb(var(--v-theme-warning));
}
[data-type="Profesor"] {
  color: rgb(var(--v-theme-info));
  border-color: rgb(var(--v-theme-info));
}
[data-type="Fecha"] {
  color: rgb(var(--v-theme-secundario-claro));
  border-color: rgb(var(--v-theme-secundario-claro));
}
</style>