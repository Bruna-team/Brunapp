<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme, useDisplay } from 'vuetify'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import AlertaMensaje from '../components/AlertaMensaje.vue';
import { MencionesReportes } from '../types/interfaceTypes'
import { formatoFechaYHora } from '../funciones/funciones';
import { brunaApi } from '../funciones/api.ts';

const { lgAndUp } = useDisplay()
const route = useRoute()
const theme = ref(useTheme().name)
const car = ref(localStorage.getItem("bruna"))
const alertaMsj = ref<string>('')

const tabActiva = ref(route.name?.toString())
const tabs = ref( (car.value == '1' || car.value == '2')
  ?
    [
      {
        link: 'pases' ,
        title: 'Pases de entrada y salida',
      },
      {
        link: 'observaciones' ,
        title: 'Observaciones',
      },
      {
        link: 'inasistencias' ,
        title: 'Inasistencias',
      }
    ]
  :
    [
      {
        link: 'observaciones' ,
        title: 'Observaciones',
      },
      {
        link: 'inasistencias' ,
        title: 'Inasistencias',
      }
    ]
)
const fechasFiltrar = ref()
const fechas = ref([''])
const ano = ref('')
const mencion = ref('')
const seccion = ref({
  sec_nom: '',
  id_ano: ''
})

const estudiantes = ref<[{id_estd: String, nombre: String}] | []>([]);
const menciones = ref<MencionesReportes[]>([]);
const inasistencias = ref<any[]>([])
const observaciones = ref<any[]>([])
const estudiante = ref<any>('')

const paseFecha = ref(formatoFechaYHora(new Date(), 'FechayHora'))
const dataPase = computed(()=> {
  const hor = paseFecha.value.split('T')
  return {
    ano: ano.value || estudiante.value.num_ano,
    mencion: mencion.value ? menciones.value[Number(mencion.value)].men : estudiante.value.nom_men,
    seccion: seccion.value.id_ano || estudiante.value.sec_ano,
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
  if (mencion.value && ano.value && seccion.value.id_ano) {
    return `${menciones.value[Number(mencion.value)].men} ${ano.value} ${seccion.value.sec_nom}`
  } else if (mencion.value && ano.value) {
    return `${menciones.value[Number(mencion.value)].men} ${ano.value}`
  } else if (mencion.value) {
    return `${menciones.value[Number(mencion.value)].men}`
  }
})
function cargaInicial() {
  brunaApi({ s: 'secciones' }, '')
  .then((res:any) => {
    if (res.data) {
      organizarSecciones(res.data)
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
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
  brunaApi({ s: 'burcarEstudiante' }, 'nom=' + estudiante.value + '&ano=' + seccion.value.id_ano + '&hor=' + hor[1])
  .then((res:any) => {
    if (res.data) {
      estudiantes.value = res.data
    }
  }).catch(() => {
  })
}
function cargaInasistencias() {
  brunaApi({ s: 'inasistencias' }, 'desde=' + fechas.value[0] + '&hasta=' + fechas.value[1] + '&men=' + mencion.value + '&ano=' + ano.value + '&sec=' + seccion.value.id_ano)
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
  brunaApi({ s: 'observaciones' }, 'desde=' + fechas.value[0] + '&hasta=' + fechas.value[1] + '&men=' + mencion.value + '&ano=' + ano.value + '&sec=' + seccion.value.id_ano)
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
  if (tabActiva.value == 'inasistencias') {
    cargaInasistencias()
  } else if (tabActiva.value == 'observaciones') {
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
  <AlertaMensaje :mensaje="alertaMsj" @limpiar-msj="alertaMsj = ''" />
  <v-container class="px-0 px-md-2">
    <h2 class="pl-3">Reportes</h2>
    <v-card class="overflow-visible">
      <v-tabs
        v-model="tabActiva"
        show-arrows
        bg-color="secundario"
        color="white"
      >
        <div
          v-for="tab in tabs"
          :key="'t'+tab.link"
        >
          <RouterLink :to="tab.link">
            <v-tab
              :value="tab.link">
              {{ tab.title }}
            </v-tab>
          </RouterLink>
        </div>
      </v-tabs>
      <v-card-text :class="{'tabPases': tabActiva == 'pases'}">
        <v-row class="d-flex flex-wrap">
          <v-col cols="12" sm="5" lg="5" class="px-0">
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
          <v-col cols="12" sm="7" lg="7" class="px-0 d-lg-flex">
            <v-radio-group
              v-model="ano"
              inline
              label="Año"
              hide-details
            >
              <v-radio
                v-if="mencion"
                v-for="ano in menciones[Number(mencion)]?.ano"
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
                v-for="sec in menciones[Number(mencion)]?.ano[ano]?.sec"
                :key="sec.id_ano"
                :label="sec.sec_nom"
                :value="sec"
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
          </template>
          <v-col cols="12" sm="" :md="tabActiva !== 'pases' ? '' : '12'">
            <RouterView v-slot="{Component}">
              <v-slide-x-transition hide-on-leave>
                <component
                  :is="Component"
                  :dataPase="dataPase"
                  :students="tabActiva == 'inasistencias' ? inasistencias : observaciones"
                  :subtitle="printSubtitle"
                />
              </v-slide-x-transition>
            </RouterView>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>