<script setup lang="ts">
import {ref} from 'vue'
const mencion = ref('')
const menciones = ref([
  {
    value: 't',
    title: 'Telemática'
  },
  {
    value: 'a',
    title: 'Administración'
  },
  {
    value: 'c',
    title: 'Contabilidad'
  }
])
</script>
<template>
<v-container>
  <v-card>
    <v-tabs
      v-model="mencion"
      fixed-tabs
      bg-color="secundario"
    >
      <v-tab
        v-for="(m) in menciones"
        :key="m.value"
      >
        {{ m.title }}
      </v-tab>
    </v-tabs>
    <v-window v-model="mencion">
      <v-window-item
        v-for="n in 3"
        :key="n"
        :value="n"
      >
        <v-container fluid>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-row no-gutters>
                  <v-col cols="12" class="text-center"> Primer año </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-row no-gutters>
                <v-col>
                  <RouterLink :to="'/seccion'">
                    <v-expansion-panel-text>
                      <v-card width="300">
                        <v-card-item>
                          <v-card-title>Sección A</v-card-title>
                          <v-card-subtitle>30 alumnos</v-card-subtitle>
                        </v-card-item>
                        <v-card-text> Semanero: Angel Moreno </v-card-text>
                      </v-card>
                    </v-expansion-panel-text>
                  </RouterLink>
                </v-col>
              </v-row>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-window-item>
    </v-window>
  </v-card>
</v-container>
</template>
