<script setup lang="ts">
import ModalImpresion from "../../components/ModalImpresion.vue"
import {ref, computed} from 'vue'
const props = defineProps({
  students: {type: Array, default: []},
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
      // @ts-ignore
      tabla.push([props.students[s]?.name, props.students[s]?.abstente, props.students[s]?.justified, props.students[s]?.tabstense, props.students[s]?.pases])
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
  <v-data-table
    :headers="headers"
    :items="props.students"
    density="compact"
    :sort-by="[{ key: 'pases', order: 'desc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Inasistencias</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <ModalImpresion
          :title="'Inasistencias'"
          :seccion="'primero A'"
          :content="contentPrint"
        />
      </v-toolbar>
    </template>
  </v-data-table>
</template>