<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, onMounted, watch, computed } from 'vue'
import ReportesInasistencias from './reportes/ReportesInasistencias.vue';
import ReportesObservaciones from './reportes/ReportesObservaciones.vue';
import ReportesPases from './reportes/ReportesPases.vue';
import { brunaApi } from '../funciones/api.ts';
import { formatoFechaYHora } from '../funciones/funciones';
import { useTheme, useDisplay } from 'vuetify'
const { lgAndUp } = useDisplay()
const theme = ref(useTheme().name)
const tabActiva = ref('pases')
const tabs = ref([
  {
    value: 'pases',
    title: 'Pases de entrada y salida',
  },
  {
    value: 'obs',
    title: 'Observaciones',
  },
  {
    value: 'ast',
    title: 'Inasistencias',
  }
])
const fechasFiltrar = ref()
const fechas = ref([''])
const ano = ref('')
const mencion = ref('')
const seccion = ref('')

const estudiantes = ref<[{id_estd: String, nombre: String}] | []>([]);
const menciones = ref<any[any]>()
const inasistencias = ref<any[]>([])
const observaciones = ref<any[]>([])
const estudiante = ref<any>('')

const paseFecha = ref(formatoFechaYHora(new Date(), 'FechayHora'))
const dataPase = computed(()=> {
  const hor = paseFecha.value.split('T')
  return {
    ano: ano.value || estudiante.value.num_ano,
    mencion: mencion.value ? menciones.value[Number(mencion.value)].men : estudiante.value.nom_men,
    seccion: seccion.value || estudiante.value.sec_ano,
    pasefecha: hor[0],
    pasehor: hor[1],
    id: estudiante.value.id_estd,
    estudiante: estudiante.value.nombre,
    estudianteCedula: estudiante.value.ced_alum,
    representante: estudiante.value.representantes,
    modulo: estudiante.value.modulo_hor,
    profesor: estudiante.value.profesor,
    materia: estudiante.value.nom_mat,
  }
})
const printSubtitle = computed(() => {
  if (inasistencias.value.length || observaciones.value.length) {
    if (mencion.value && ano.value && seccion.value) {
      return `${mencion.value ? menciones.value[Number(mencion.value)].men : estudiante.value.nom_men} ${ano.value} - ${seccion.value}`
    } else ''
  } else ''
})
function cargaInicial() {
  brunaApi({ s: 'menciones' }, '')
  .then((res:any) => {
    if (res.data) {
      organizarSecciones(res.data)
    }
  }).catch(() => {
  })
}
function organizarSecciones(data:string[]) {
  const dataMen:any = {}
  data.forEach((d:any) => {
    if (!dataMen[d.id_men]) {
      dataMen[d.id_men] = {
        id_men: d.id_men,
        men: d.nom_men,
        ano: {}
      }
    }
    if(!dataMen[d.id_men].ano[d.nom_ano]) {
      dataMen[d.id_men].ano[d.nom_ano] = {
        id_ano: d.id_ano,
        nom_ano: d.nom_ano,
        num_ano: d.num_ano,
        sec: {}
      }
    }
    if(!dataMen[d.id_men].ano[d.nom_ano].sec[d.sec_ano]) {
      dataMen[d.id_men].ano[d.nom_ano].sec[d.sec_ano] = {
        id_ano: d.id_ano,
        sec_nom: d.sec_ano,
      }
    }
  })
  menciones.value = dataMen
}
function buscarEstudiante() {
  const hor = paseFecha.value.split('T')
  brunaApi({ s: 'burcarEstudiante' }, 'nom=' + estudiante.value + '&ano=' + seccion.value + '&hor=' + hor[1])
  .then((res:any) => {
    if (res.data) {
      estudiantes.value = res.data
    }
  }).catch(() => {
  })
}
function cargaInasistencias() {
  brunaApi({ s: 'inasistencias' }, 'desde=' + fechas.value[0] + '&hasta=' + fechas.value[1] + '&men=' + mencion.value + '&ano=' + ano.value + '&sec=' + seccion.value)
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
  brunaApi({ s: 'observaciones' }, 'desde=' + fechas.value[0] + '&hasta=' + fechas.value[1] + '&men=' + mencion.value + '&ano=' + ano.value + '&sec=' + seccion.value)
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
function actualizar() {
  estudiante.value = {
    ced_alum: '',
    nombre: '',
    representantes: '',
  }
  if (tabActiva.value == 'ast') {
    cargaInasistencias()
  } else if (tabActiva.value == 'obs') {
    cargaObservaciones()
  }
}
watch(()=>tabActiva.value, ()=>{
  actualizar()
})
watch(()=>mencion.value, ()=>{
  actualizar()
})
watch(()=>ano.value, ()=>{
  actualizar()
})
watch(()=>seccion.value, ()=>{
  actualizar()
})
watch(()=>fechasFiltrar.value, ()=>{
  fechas.value = []
  fechasFiltrar.value.forEach((f: Date) => {
    if (f) {
      fechas.value.push(formatoFechaYHora(f, 'fecha'))
    }
  })
  actualizar()
})
onMounted(() => {
	cargaInicial();
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 4));
  fechasFiltrar.value = [startDate, endDate];
});
</script>
<template>
  <v-container class="px-0 px-md-2">
    <h2 class="pl-3">Reportes</h2>
    <v-card>
      <v-tabs
        show-arrows
        v-model="tabActiva"
        bg-color="secundario-claro"
      >
        <div
          v-for="tab in tabs"
          :key="'t'+tab.value"
        >
          <v-tab :value="tab.value">{{ tab.title }}</v-tab>
        </div>
      </v-tabs>
      <v-card-text :class="{'tabPases': tabActiva == 'pases'}">
        <v-row class="d-flex flex-wrap">
          <v-col cols="12" sm="5" lg="auto" class="px-0">
              <v-radio-group
                v-model="mencion"
                :inline="lgAndUp"
                label="Mención"
                hide-details
              >
              <v-radio
                v-for="menc in menciones"
                :key="menc.id_men"
                :label="menc.men"
                :value="menc.id_men"
              />
            </v-radio-group>
          </v-col>
          <v-col cols="12" sm="7" class="px-0 d-lg-flex">
            <v-radio-group
              v-model="ano"
              inline
              label="Año"
              hide-details
            >
              <v-radio
                v-if="mencion"
                v-for="ano in menciones[mencion].ano"
                :key="ano.id_ano"
                :label="ano.num_ano"
                :value="ano.nom_ano"
              />
              <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención primero</span>
            </v-radio-group>
            <v-radio-group
              v-model="seccion"
              inline
              label="Sección"
              hide-details
            >
              <v-radio
                v-if="ano"
                v-for="sec in menciones[mencion]?.ano[ano]?.sec"
                :key="sec.id_ano"
                :label="sec.sec_nom"
                :value="sec.id_ano"
              />
              <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención primero</span>
              <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención y un año primero</span>
            </v-radio-group>
          </v-col>
          <v-col cols="12" lg="auto" v-if="tabActiva !== 'pases'">
            <VueDatePicker
              v-model="fechasFiltrar"
              :range="tabActiva !== 'pases'"
              text-input
              :inline="lgAndUp"
              :dark="theme == 'darkTheme'"
              :action-row="{ showNow: true }"
              now-button-label="Hoy"
              locale="es"
              selectText="Seleccionar"
              :enable-time-picker="false"
            />
          </v-col>
          <template v-else>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="paseFecha"
                label="Fecha y hora del pase"
                type="datetime-local"
                persistent-hint
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Escribe el nombre del estudiante"
                v-model="estudiante"
                :items="Object.values(estudiantes)"
                item-value="nombre"
                item-title="nombre"
                no-data-text="Sin estudiantes que coincidan "
                @input="buscarEstudiante"
              ></v-combobox>
            </v-col>
            <!-- <v-col cols="12" md="4">
              <v-combobox
                label="Materia"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              ></v-combobox>
            </v-col> -->
          </template>
          <v-col cols="12" sm="" :md="tabActiva !== 'pases' ? '' : '12'">
            <v-window v-model="tabActiva" >
              <v-window-item value="pases">
                <ReportesPases :dataPase="dataPase" />
              </v-window-item>
              <v-window-item value="ast">
                <ReportesInasistencias
                  :students="inasistencias"
                  :subtitle="printSubtitle"
                  />
              </v-window-item>
              <v-window-item value="obs">
                <ReportesObservaciones
                  :students="observaciones"
                  :subtitle="printSubtitle"
                  />
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>