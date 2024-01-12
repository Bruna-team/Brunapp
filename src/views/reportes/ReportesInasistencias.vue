<script setup lang="ts">
import ModalImpresion from "../../components/ModalImpresion.vue"
import {ref} from 'vue'
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

const plants = ref([
  {
    name: 'Fern',
    abstente: 3,
    justified: 0,
    tabstense: 3,
    pases: 0,
  },
  {
    name: 'Snake Plant',
    abstente: 2,
    justified: 1,
    tabstense: 3,
    pases: 1,
  },
  {
    name: 'Monstera',
    abstente: 2,
    justified: 2,
    tabstense: 4,
    pases: 2,
  },
  {
    name: 'Pothos',
    abstente: 0,
    justified: 0,
    tabstense: 0,
    pases: 0,
  },
  {
    name: 'ZZ Plant',
    abstente: 2,
    justified: 3,
    tabstense: 5,
    pases: 3,
  },
  {
    name: 'Spider Plant',
    abstente: 1,
    justified: 0,
    tabstense: 1,
    pases: 2,
  },
  {
    name: 'Air Plant',
    abstente: 0,
    justified: 1,
    tabstense: 1,
    pases: 1,
  },
  {
    name: 'Peperomia',
    abstente: 0,
    justified: 0,
    tabstense: 0,
    pases: 0,
  },
  {
    name: 'Aloe Vera',
    abstente: 0,
    justified: 2,
    tabstense: 2,
    pases: 2,
  },
  {
    name: 'Jade Plant',
    abstente: 0,
    justified: 0,
    tabstense: 0,
    pases: 0,
  },
])

const contentPrint = ref([
  {text: 'Tables', style: 'header'},
  {
    style: 'tableExample',
    table: {
      body: [
        ['Column 1', 'Column 2', 'Column 3'],
        ['One value goes here', 'Another one here', 'OK?']
      ]
    }
  },
])
</script>
<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="plants"
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
            :subtitle="'Enero'"
            :seccion="'primero A'"
            :content="contentPrint"
          />
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>