<script setup lang="ts">
import ModalImpresion from "../../components/ModalImpresion.vue"
const headers = [
  { title: 'Estudiante', align: 'start', sortable: false, key: 'name' },
  { title: 'Inasistencias', align: 'end', key: 'light' },
  { title: 'Justificadas', align: 'end', key: 'height' },
  { title: 'Pases', align: 'end', key: 'petFriendly' },
]
const plants = [
  {
    name: 'Fern',
    light: 'Low',
    height: '20cm',
    petFriendly: 'Yes',
  },
  {
    name: 'Snake Plant',
    light: 'Low',
    height: '50cm',
    petFriendly: 'No',
  },
  {
    name: 'Monstera',
    light: 'Medium',
    height: '60cm',
    petFriendly: 'No',
  },
  {
    name: 'Pothos',
    light: 'Low to medium',
    height: '40cm',
    petFriendly: 'Yes',
  },
  {
    name: 'ZZ Plant',
    light: 'Low to medium',
    height: '90cm',
    petFriendly: 'Yes',
  },
  {
    name: 'Spider Plant',
    light: 'Bright, indirect',
    height: '30cm',
    petFriendly: 'Yes',
  },
  {
    name: 'Air Plant',
    light: 'Bright, indirect',
    height: '15cm',
    petFriendly: 'Yes',
  },
  {
    name: 'Peperomia',
    light: 'Bright, indirect',
    height: '25cm',
    petFriendly: 'Yes',
  },
  {
    name: 'Aloe Vera',
    light: 'Bright, direct',
    height: '30cm',
    petFriendly: 'Yes',
  },
  {
    name: 'Jade Plant',
    light: 'Bright, direct',
    height: '40cm',
    petFriendly: 'Yes',
  },
]
</script>
<template>
  <v-container>
    <h3>Inasistencias</h3>
    <v-data-table
      :headers="headers"
      :items="plants"
      density="compact"
      item-key="name"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <ModalImpresion />
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>