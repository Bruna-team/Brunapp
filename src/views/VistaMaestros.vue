<script setup lang="ts">
import { ref } from 'vue';
import ConfigurarMaestro from '../components/ConfigurarMaestro.vue';
const profes = ref([
  {
    id: 1,
    nombre: 'Adolfo Manolo Gonzalez Hernandez' ,
    nom_per: 'Adolfo',
    snom_per: 'Manolo',
    ape_per: 'Gonzalez',
    sape_per: 'Hernandez',
    materia: 'Biologia',
  },
  {
    id: 2,
    nombre: 'Maria Sofia Canolo Salado' ,
    nom_per: 'Adolfo',
    snom_per: 'Manolo',
    ape_per: 'Gonzalez',
    sape_per: 'Hernandez',
    materia: 'Biologia',
  },
  {
    id: 3,
    nombre: 'Gregorio Gonzalo' ,
    nom_per: 'Adolfo',
    snom_per: 'Manolo',
    ape_per: 'Gonzalez',
    sape_per: 'Hernandez',
    materia: 'Biologia',
  },
  {
    id: 4,
    nombre: 'Luiza Peña' ,
    nom_per: 'Adolfo',
    snom_per: 'Manolo',
    ape_per: 'Gonzalez',
    sape_per: 'Hernandez',
    materia: 'Biologia',
  }
])
const materias = ref([
  {
    id: 1,
    materia: 'Biologia',
  },
  {
    id: 2,
    materia: 'Matemática',
  },
  {
    id: 3,
    materia: 'Ingles',
  },
  {
    id: 4,
    materia: 'Geografia',
  }
])
</script>
<template>
  <v-container>
    <h2>Maestros</h2>
    <v-row>
      <v-col>
        <v-combobox
          multiple
          label="Buscar maestro"
          no-data-text="No se encontro maestros con ese nombre"
          :items="Object.values(profes)"
          item-title="nombre"
          item-value="id"
          return-object
        />
      </v-col>
      <v-col>
        <v-combobox
          multiple
          chips
          label="Materia"
          :items="Object.values(materias)"
          item-title="materia"
          item-value="id"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="p in profes" :key="p.id">
        <v-card>
          <v-card-item>
            <v-card-title>{{ p.nombre }}</v-card-title>
            <v-card-subtitle>{{ p.materia }}</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            horario
          </v-card-text>
          <v-card-actions class="justify-center">
            <configurar-maestro :materias="materias" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>