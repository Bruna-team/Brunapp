<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import BlotFormatter from 'quill-blot-formatter'

const emit = defineEmits(['content'])

const Embed = Quill.import('blots/embed')
/**
 * SpanEmbed
 */
class SpanEmbed extends Embed {
  /**
   * Create span template
   * @param {*} value {text: String, id: String, type: String,}
   * @return {*} node
   */
  static create(value: any) {
    const node = super.create();
    node.setAttribute('data-type', value.type);
    node.setAttribute('data-id', value.id);
    node.innerText = value.text;
    return node;
  }
}
// @ts-ignore
SpanEmbed.blotName = 'spanEmbed';
// @ts-ignore
SpanEmbed.tagName = 'span';
// @ts-ignore
SpanEmbed.className='editor-var';

Quill.register(SpanEmbed)

const editor = ref()
const focusEditor = ref(false)
const content = ref("<p><strong>E.T.C \"MADRE RAFOLS\"</strong></p><p><strong>VALERA ESTADO TRUJILLO</strong></p><h4 class=\"ql-align-center\">Pase de entrada</h4><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"Date\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">FECHA DE HOY</span>﻿</span>﻿</span>﻿</span></p><p><span class=\"editor-var\" data-type=\"Fecha\" data-id=\"DateTime\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">HORA</span>﻿</span>﻿</span>﻿</span></p><p><br></p><p>Estudiante: <span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"Ename\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">ESTUDIANTE NOMBRES</span>﻿</span>﻿</span>﻿</span></p><p>Curso: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"Curso\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">CURSO</span>﻿</span>﻿</span>﻿</span></p><p>Sección: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"seccion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">SECCIÓN</span>﻿</span>﻿</span>﻿</span></p><p>Mención: <span class=\"editor-var\" data-type=\"Academico\" data-id=\"mencion\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MENCIÓN</span>﻿</span>﻿</span>﻿</span></p><p><br></p><p>Tiene permiso para entrar a la clase de <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"materia\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MATERIA</span>﻿</span>﻿</span> correspondiente al <span class=\"editor-var\" data-type=\"Academico\" data-id=\"modulo\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">MÓDULO</span>﻿</span>﻿</span>﻿</span> módulo.</p><p><br></p><p><strong>Motivo del retraso: </strong>alkdsfjalkdjflaskjdfasdjf</p><p><br></p><p><u>                                             </u>            <u>                                      </u></p><p>Firma del representante                       Firma del coordinador</p><p><span class=\"editor-var\" data-type=\"Estudiante\" data-id=\"representante\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">REPRESENTANTE NOMBRES</span>﻿</span>﻿</span>﻿</span>  <span class=\"editor-var\" data-type=\"Profesor\" data-id=\"Pname\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">PROFESOR NOMBRES</span>﻿</span>﻿</span>﻿</span> </p>")
const modules = ref({
  name: 'blotFormatter',
  module: BlotFormatter,
  options: {}
})

function insertSomething(value:Object) {
  const e = editor.value.getQuill()
  const p = e.selection.savedRange.index
   e.insertEmbed(p, 'spanEmbed', value);
}

watch(content, (value) => {
  emit('content', value)
})
onMounted(() => emit('content', content.value))
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
          <v-chip variant="outlined" color="primario-claro">
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
              id: 'Curso',
              type: 'Academico',
            })"
        >
          <v-chip variant="outlined" color="primario-claro">
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
          <v-chip variant="outlined" color="primario-claro">
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
          <v-chip variant="outlined" color="primario-claro">
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
    :modules="modules"
    theme="snow"
    toolbar="full"
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
  color: rgb(var(--v-theme-primario-claro));
  border-color: rgb(var(--v-theme-primario-claro));
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