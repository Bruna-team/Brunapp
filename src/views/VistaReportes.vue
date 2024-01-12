<script setup lang="ts">
import {ref} from 'vue'
import router from '../router';
const fechasFiltrar = ref([])
const tabActiva = ref(router.currentRoute.value.name)
const tabs = ref([
  {
    value: 'pases',
    title: 'Pases de entrada y salida',
    url: 'pases'
  },
  {
    value: 'obs',
    title: 'Observaciones',
    url: 'observaciones'
  },
  {
    value: 'ast',
    title: 'Inasistencias',
    url: 'inasistencias'
  }
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
          <RouterLink :to="`/reportes/${tab.url}`">
            <v-tab :value="tab.value">
                {{ tab.title }}
            </v-tab>
          </RouterLink>
        </div>
      </v-tabs>
      <v-card-text :class="{'tabPases': tabActiva == 'pases'}">
        <div class="grid-container--reportes">
          <div class="grid-area--slider">
            <span class="text-medium-emphasis">
              Selecciona un año
            </span>
            <v-slider
              :ticks="{0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6'}"
              :max="5"
              step="1"
              show-ticks="always"
              tick-size="6"
            />
          </div>
          <div class="grid-area--menciones">
            <v-radio-group inline label="Selecciona una mención" hide-details>
              <v-radio label="Telemática" value="t"></v-radio>
              <v-radio label="Administración" value="a"></v-radio>
              <v-radio label="Contabilidad" value="c"></v-radio>
            </v-radio-group>
          </div>
          <div class="grid-area--secciones">
            <v-radio-group inline hide-details label="Selecciona una sección">
              <v-radio label="'A'" value="a"></v-radio>
              <v-radio label="'B'" value="b"></v-radio>
            </v-radio-group>
          </div>
          <div v-if="tabActiva !== 'pases'" class="grid-area--datetime">
            <v-date-picker
              v-model="fechasFiltrar"
              show-adjacent-months
              multiple
              class="flex-fill"
            />
          </div>
          <div class="grid-area--tabActiva">
            <v-window v-model="tabActiva" >
              <v-window-item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tabActiva"
              >
                <RouterView />
              </v-window-item>
            </v-window>
          </div>
        </div>
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
.grid-container--reportes {
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
}
</style>