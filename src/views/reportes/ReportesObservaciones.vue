<script setup lang="ts">
import { computed, ref } from "vue";
import ModalImpresion from "@/components/ModalImpresion.vue"
import { EstudianteInasistencias } from "@/types/interfaceTypes";
const props = defineProps({
  students: {
    type: Array as () => EstudianteInasistencias[],
    default: []
  },
  subtitle: String,
  dataPase: {
    type: Object,
    default: {}
  },
})
const header = ref([
  {
    title: 'Estudiante',
    sortable: false,
    key: 'name'
  },
  {
    title: 'Observaciones',
    key: 'obs'
  },
  {
    title: 'Fecha',
    key: 'date'
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
    {text: 'Observación', style: 'tableHeader'},
    {text: 'Fecha', style: 'tableHeader'}
  ])
  if (props.students?.length) {
    for (let s = 0; s < props.students?.length; s++) {
      tabla.push([
        props.students[s]?.name,
        props.students[s]?.obs,
        props.students[s]?.date
      ])
    }
  }
  content.push({
      table: {
        headerRows: 1,
        body: tabla,
        widths: [200, '*', 150,]
      },
      layout: 'lightHorizontalLines'
  })
  return content
})
</script>
<template>
  <section class="d-inline">
    <v-data-table
      :headers="header"
      :items="props.students"
      no-data-text="Sin estudiantes con observaciones en esta fecha"
      density="compact"
      items-per-page-text="Alumnos por pagina:"
      :sort-by="[{ key: 'pases', order: 'desc' }]"
    >
      <template v-slot:top>
        <v-sheet flat color="muted" class="d-flex align-center pa-3 rounded-t-lg">
          <p class="text-h6 flex-1-1-100 flex-md-fill">
            Observaciones
          </p>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <ModalImpresion
            :title="'Observaciones'"
            :subtitle="props.subtitle"
            :datos-validos="!!props.students?.length"
            :content="contentPrint"
          />
        </v-sheet>
      </template>
    </v-data-table>
  </section>
</template>