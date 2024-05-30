<script setup lang="ts">
import {ref, computed} from 'vue'
import ModalImpresion from "@/components/ModalImpresion.vue"
import { EstudianteObservaciones } from '@/types/interfaceTypes';
const props = defineProps({
  students: {
    type: Array as () => EstudianteObservaciones[],
    default: []
  },
  subtitle: String,
  dataPase: {
    type: Object,
    default: {}
  },
})
const headers = ref([
  {
    title: 'Estudiante',
    sortable: false,
    key: 'name'
  },
  {
    title: 'Inasistencias',
    key: 'abstente'
  },
  {
    title: 'Justificadas',
    key: 'justified'
  },
  {
    title: 'Total inasistencias',
    key: 'tabstense'
  },
  {
    title: 'Pases',
    key: 'pases'
  },
])

const contentPrint = computed(() => {
  const content: any[] = []
  const tabla: any[] = []
  content.push({
    text: 'Reporte de observaciones', style: 'tableTitle'
  })
  tabla.push([
    {text: 'Estudiante', style: 'tableHeader'},
    {text: 'Inasistencias', style: 'tableHeader'},
    {text: 'Justificadas', style: 'tableHeader'},
    {text: 'Total inasistencias', style: 'tableHeader'},
    {text: 'Pases', style: 'tableHeader'}
  ])
  if (props.students?.length) {
    for (let s = 0; s < props.students?.length; s++) {
      tabla.push([
        props.students[s]?.name,
        props.students[s]?.abstente,
        props.students[s]?.justified,
        props.students[s]?.tabstense,
        props.students[s]?.pases
      ])
    }
  }
  content.push({
      table: {
        headerRows: 1,
        body: tabla,
        widths: ['*', 70, 70, 70, 70]
      },
      layout: 'lightHorizontalLines'
  })
  return content
})
</script>
<template>
  <section class="d-inline">
    <v-data-table
      :headers="headers"
      :items="props.students"
      density="compact"
      no-data-text="Sin estudiantes con inasistencias en esta fecha"
      items-per-page-text="Alumnos por pagina:"
      :sort-by="[{ key: 'pases', order: 'desc' }]"
    >
      <template v-slot:top>
        <v-sheet flat color="muted" class="d-flex align-center pa-3 rounded-t-lg">
          <p class="text-h6 flex-1-1-100 flex-md-fill">
            Inasistencias
          </p>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <ModalImpresion
            :title="'Inasistencias'"
            :subtitle="props.subtitle"
            :datos-validos="!!props.students?.length"
            :content="contentPrint"
          />
        </v-sheet>
      </template>
    </v-data-table>
  </section>
</template>