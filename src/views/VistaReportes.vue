<script setup lang="ts">
import {ref} from 'vue'
import router from '../router';
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
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
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
          </v-col>
          <v-col cols="12" sm="7" md="5">
            <v-radio-group inline label="Selecciona una mención" hide-details>
              <v-radio label="Telemática" value="t"></v-radio>
              <v-radio label="Administración" value="a"></v-radio>
              <v-radio label="Contabilidad" value="c"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-radio-group
              inline
              hide-details
            >
              <v-radio label="Sección A" value="a"></v-radio>
              <v-radio label="Sección B" value="b"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-window v-model="tabActiva" >
          <v-window-item
            v-for="tab in tabs"
            :key="tab.value"
            :value="tabActiva"
          >
            <RouterView />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>