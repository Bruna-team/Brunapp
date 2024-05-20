<script setup lang="ts">
import { ref } from 'vue'
import FiltroEstudiantes from '@/components/FiltroEstudiantes.vue'
import ReportesInasistencias from './reportes/ReportesInasistencias.vue';
import ReportesObservaciones from './reportes/ReportesObservaciones.vue';
import { brunaApi } from '@/funciones/api.ts';

const reporte = ref('')
const inasistencias = ref<any[]>([])
const observaciones = ref<any[]>([])
const fechas = ref([])
const ano = ref('')
const mencion = ref('')
const seccion = ref('')
// const printSubtitle = computed(() => {
//   if (mencion.value && ano.value && seccion.value.id_ano) {
//     return `${menciones.value[Number(mencion.value)].men} ${ano.value} ${seccion.value.sec_nom}`
//   } else if (mencion.value && ano.value) {
//     return `${menciones.value[Number(mencion.value)].men} ${ano.value}`
//   } else if (mencion.value) {
//     return `${menciones.value[Number(mencion.value)].men}`
//   }
// })

function cargaInasistencias() {
  brunaApi({ s: 'inasistencias' },
    'desde=' + fechas.value[0] +
    '&hasta=' + fechas.value[1] +
    '&men=' + mencion.value +
    '&ano=' + ano.value +
    '&sec=' + seccion.value)
  .then((res:any) => {
    if (res.data) {
      organizarDatosInasistencias(res.data)
    }
  }).catch(() => {
  })
}
function organizarDatosInasistencias(data:any) {
  inasistencias.value = []
  data.forEach((i:any) => {
    if (i.id_obs) {
      inasistencias.value.push({
        name: i.pnom_alum + ' ' + (i.snom_alum !== 'undefined' ? i.snom_alum : '')
          + ' ' + i.pape_alum + ' ' + (i.sape_alum !== 'undefined' ? i.sape_alum : ''),
        abstente: i.inasistencia,
        justified: i.justificada,
        tabstense: i.total,
        pases: i.pases
      })
    }
  })
}
function cargaObservaciones() {
    brunaApi({ s: 'observaciones' },
      'desde=' + fechas.value[0] +
      '&hasta=' + fechas.value[1] +
      '&men=' + mencion.value +
      '&ano=' + ano.value +
      '&sec=' + seccion.value)
    .then((res:any) => {
      if (res.data) {
        organizarDatosObservaciones(res.data)
      }
    }).catch(() => {
    })
}
function organizarDatosObservaciones(data:any) {
  observaciones.value = []
  data.forEach((i:any) => {
    if (i.id_obs) {
      observaciones.value.push({
        name: i.pnom_alum + ' ' + (i.snom_alum !== 'undefined' ? i.snom_alum : '')
          + ' ' + i.pape_alum + ' ' + (i.sape_alum !== 'undefined' ? i.sape_alum : ''),
        obs: i.nota_obs,
        date: i.fec_obs + (i.fec_fin_obs !== i.fec_obs ? " hasta " + i.fec_fin_obs : ''),
      })
    }
  })
}

</script>
<template>
  <v-container>
    <h2 class="pl-3">Reportes</h2>
    <FiltroEstudiantes
      :fec="true"
      :rep="true"
      @fec="fechas = $event"
      @rep="reporte = $event"
      @men="mencion = $event"
      @ano="ano = $event"
      @sec="seccion = $event"
      @actualizar="reporte == 'obs' ? cargaObservaciones() : cargaInasistencias()"
    />
    <template v-if="reporte == 'ina'">
      <ReportesInasistencias :students="inasistencias"/>
    </template>
    <template v-else>
      <ReportesObservaciones :students="observaciones"/>
    </template>
  </v-container>
</template>