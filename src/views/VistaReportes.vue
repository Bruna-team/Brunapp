<script setup lang="ts">
import {ref} from 'vue'
import ReportesInasistencias from './reportes/ReportesInasistencias.vue';
import ReportesObservaciones from './reportes/ReportesObservaciones.vue';
import ReportesPases from './reportes/ReportesPases.vue';
const fechasFiltrar = ref([])
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
const año = ref([])
const mencion = ref([])
const seccion = ref([])
const paseFecha = ref(`${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2, '0')}-${new Date().getDay().toString().padStart(2, '0')}`)

const plants = ref([
  {
    name: 'Fern',
    abstente: 3,
    justified: 0,
    tabstense: 3,
    pases: 0,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'Snake Plant',
    abstente: 2,
    justified: 1,
    tabstense: 3,
    pases: 1,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'Monstera',
    abstente: 2,
    justified: 2,
    tabstense: 4,
    pases: 2,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'Pothos',
    abstente: 0,
    justified: 0,
    tabstense: 0,
    pases: 0,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'ZZ Plant',
    abstente: 2,
    justified: 3,
    tabstense: 5,
    pases: 3,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'Spider Plant',
    abstente: 1,
    justified: 0,
    tabstense: 1,
    pases: 2,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'Air Plant',
    abstente: 0,
    justified: 1,
    tabstense: 1,
    pases: 1,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'Peperomia',
    abstente: 0,
    justified: 0,
    tabstense: 0,
    pases: 0,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'Aloe Vera',
    abstente: 0,
    justified: 2,
    tabstense: 2,
    pases: 2,
    obs: 'AaaAaAaA',
    date: '',
  },
  {
    name: 'Jade Plant',
    abstente: 0,
    justified: 0,
    tabstense: 0,
    pases: 0,
    obs: 'AaaAaAaA',
    date: '',
  },
])
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
          <v-col cols="12" md="auto" class="grid-area--slider">
            <v-radio-group v-model="año" inline label="Selecciona un año" hide-details>
              <v-radio label="1" value="1"></v-radio>
              <v-radio label="2" value="2"></v-radio>
              <v-radio label="5" value="4"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="auto" class="grid-area--menciones">
            <v-radio-group v-model="mencion" inline label="Selecciona una mención" hide-details>
              <v-radio label="Telemática" value="t"></v-radio>
              <v-radio label="Administración" value="a"></v-radio>
              <v-radio label="Contabilidad" value="c"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4" class="grid-area--secciones">
            <v-radio-group v-model="seccion" inline hide-details label="Selecciona una sección">
              <v-radio label="'A'" value="a"></v-radio>
              <v-radio label="'B'" value="b"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="auto" v-if="tabActiva !== 'pases'" class="grid-area--datetime">
            <v-date-picker
              v-model="fechasFiltrar"
              show-adjacent-months
              multiple
              class="flex-fill"
            />
          </v-col>
          <template v-else>
            <v-col cols="12" md="6">
              <v-combobox
                label="Escribe el nombre del estudiante"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Especifica si la fecha es de hoy"
                type="date"
                v-model="paseFecha"
              />
            </v-col>
          </template>
          <v-col cols="12" :md="tabActiva !== 'pases' ? '' : '12'" class="grid-area--tabActiva">
            <v-window v-model="tabActiva" >
              <v-window-item value="pases">
                <ReportesPases />
              </v-window-item>
              <v-window-item value="ast">
                <ReportesInasistencias :students="plants"  />
              </v-window-item>
              <v-window-item value="obs">
                <ReportesObservaciones :students="plants" />
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style>
.v-date-picker-header {
  padding-bottom: 0;
}
.v-picker-title {
  display: none !important;
}
/* .grid-container--reportes {
  @media (min-width: 600px) {
    display: grid;
    grid-template-areas:
    'slider slider'
    'datetime menciones'
    'datetime secciones'
    'datetime secciones'
    'tabActiva tabActiva';
  }
  @media (min-width: 960px) {
    grid-template-areas:
    'datetime slider'
    'datetime menciones'
    'datetime secciones'
    'tabActiva tabActiva';
  }
  @media (min-width: 1280px) {
    grid-template-areas:
    'slider menciones secciones'
    'datetime tabActiva tabActiva';
  }
}
.grid-area--slider { grid-area: slider;}
.grid-area--menciones { grid-area: menciones;}
.grid-area--secciones { grid-area: secciones;}
.grid-area--datetime { grid-area: datetime;}
.grid-area--tabActiva {
  grid-area: tabActiva;
  grid-auto-columns: min-content;
}
.tabPases .grid-container--reportes {
  @media (min-width: 600px) {
    grid-template-areas:
    'slider slider'
    'menciones menciones'
    'secciones secciones'
    'tabActiva tabActiva';
  }
  @media (min-width: 960px) {
    grid-template-areas:
      'slider slider menciones secciones'
      'tabActiva tabActiva tabActiva tabActiva';
  }
} */
</style>