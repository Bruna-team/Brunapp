<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// @ts-ignore
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import {SpanEmbed} from '@/funciones/quillConfigModule'
import { Quill } from '@vueup/vue-quill'
Quill.register(SpanEmbed);

const emit = defineEmits(['content', 'actualizar'])
const props = defineProps({
  contentData: {
    type: String,
    default: ''
  }
})
onMounted(() => {
  content.value = props.contentData
})

const editor = ref()
const modules = ref({
  name: 'blotFormatter',
  module: BlotFormatter,
  options: {}
})
const toolbar = ref([
  [{'header': [1, 2, 3, 4, 5, 6, false]}, { 'font': [] }, 'bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{'color': []}, {'background': []}, 'clean'],
  [{ 'direction': 'rtl' }, {'align': []}, {'indent': '-1'}, {'indent': '+1'}, {'list': 'ordered'}, {'list': 'bullet'}, 'image'],
])
const focusEditor = ref(false)
const content = ref('')

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
              text: 'TIPO DE PASE',
              id: 'pase',
              type: 'Pase',
            })"
        >
          <v-chip variant="outlined" color="white">
            Tipo de pase
          </v-chip>
        </v-btn>
      </v-col>
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
    :toolbar="toolbar"
    :modules="modules"
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