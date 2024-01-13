<script setup lang="ts">
import { computed, ref } from "vue";
import ModalImpresion from "../../components/ModalImpresion.vue"
const props = defineProps({
  students: {type: Array, default: ref<any[] | [{name: String, obs: string, date: string}]>([])
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
      // @ts-ignore
      tabla.push([props.students[s]?.name, props.students[s]?.obs, props.students[s]?.date])
    }
  }
  content.push({
      table: {
        headerRows: 1,
        body: tabla,
        widths: [100, '*', 200,]
      },
      layout: 'lightHorizontalLines'
  })
  return content
})
</script>
<template>
  <v-data-table
    :headers="header"
    :items="props.students"
    density="compact"
    :sort-by="[{ key: 'pases', order: 'desc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Observaciones</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <ModalImpresion
          :title="'Inasistencias'"
          :subtitle="'Primero A Telemática'"
          :content="contentPrint"
        />
      </v-toolbar>
    </template>
  </v-data-table>
</template>