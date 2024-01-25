<script setup lang="ts">
import { ref } from 'vue'
import { formatoFechaYHora } from '../funciones/funciones';

const periodo = ref({start: '2024-02-02', end: '2024-03-10', edit: false})
const semana = ref([{value:'Lunes', id: 0}, {value:'Martes', id: 1}, {value:'Miercoles', id: 2}, {value:'Jueves', id: 3}, {value:'Viernes', id: 4}])
const horarios = ref([
  {
    id_day: 1,
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: false,
    active: true,
  },
  {
    id_day: 2,
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: false,
    active: true,
  },
  {
    id_day: 0,
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: false,
    active: true,
  }
])
const materias = ref([
  {
    id_mat: 1,
    title: 'Geografía',
    edit: false,
    active: true,
  },
  {
    id_mat: 2,
    title: 'Ingles',
    edit: false,
    active: true,
  },
  {
    id_mat: 0,
    title: 'Computación',
    edit: false,
    active: true,
  }
])
function AgregarMaterias() {
  materias.value.push({
    id_mat: materias.value.length+1,
    title: '',
    edit: true,
    active: true,
  })
}
function AgregarHorario() {
  horarios.value.push({
    id_day: 0,
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: true,
    active: true,
  })
}
</script>
<template>
  <v-container>
    <h2>Configuración</h2>
    <v-sheet color="transparent" class="d-flex flex-wrap align-start">
      <v-card
        title="Año académico"
        class="flex-1-1-100 mb-3 pb-3"
      >
        <v-list-item>
          <template v-if="periodo.edit">
            <v-row>
              <v-col>
                <v-text-field
                  label="Ingresa el inicio"
                  type="date"
                  v-model="periodo.start"
                />
              </v-col>
              <v-col>
                <v-text-field
                  label="Ingresa el fin"
                  type="date"
                  v-model="periodo.end"
                />
              </v-col>
            </v-row>
          </template>
          <template v-else>
            <v-list-item-title class="text-capitalize">{{ periodo.start }} - {{ periodo.end }}</v-list-item-title>
          </template>
          <template #append>
            <v-btn flat icon="mdi-pen" @click="periodo.edit = !periodo.edit" />
          </template>
        </v-list-item>
      </v-card>
      <v-card
        title="Horarios"
        class="flex-1-0 mr-3 mb-3 pb-3"
      >
        <template #append>
          <v-btn
            block
            variant="tonal"
            prepend-icon="mdi-plus"
            text="Agregar horario"
            color="secundario"
            @click="AgregarHorario()"
          />
        </template>
        <v-list-item
          v-for="(horario, h) in horarios"
          :key="h"
          :class="{'text-muted' : !horario.active}"
        >
          <template v-if="horario.edit">
            <v-row>
              <v-col cols="12" lg="">
                <v-select
                  v-model="horario.id_day"
                  :items="semana"
                  item-title="value"
                  item-value="id"
                  label="Dia"
                  variant="underlined"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="6" lg="">
                <v-text-field
                  v-model="horario.timeStart"
                  type="time"
                  label="De"
                  variant="underlined"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="6" lg="">
                <v-text-field
                  v-model="horario.timeEnd"
                  type="time"
                  label="Hasta"
                  variant="underlined"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </template>
          <template v-else>
            <v-list-item-title class="text-capitalize">{{ semana[horario.id_day].value }}</v-list-item-title>
            <v-list-item-subtitle>{{ horario.timeStart }} a {{ horario.timeEnd }}</v-list-item-subtitle>
          </template>
          <template #append>
            <v-btn
              variant="text"
              :disabled="!horario.active"
              icon="mdi-pen"
              @click="horario.edit = !horario.edit"
            />
            <v-btn
              variant="text"
              :icon="horario.active ? 'mdi-circle' : 'mdi-minus-circle'"
              :class="horario.active ? 'text-secundario' : 'text-muted'"
              @click="horario.active = !horario.active"
            />
            <v-btn
              variant="text"
              icon="mdi-trash-can"
              class="text-error"
              @click="horario.edit = !horario.edit"
            />
          </template>
        </v-list-item>
      </v-card>
      <v-card
        title="Materias"
        class="flex-1-0 mr-3 mb-3 pb-3"
      >
        <template #append>
          <v-btn
            block
            variant="tonal"
            prepend-icon="mdi-plus"
            text="Agregar materia"
            color="secundario"
            @click="AgregarMaterias()"
          />
        </template>
        <v-list-item
          v-for="(materia, m) in materias"
          :key="m"
        >
          <template v-if="materia.edit">
            <v-text-field
              v-model="materia.title"
              label="Nombre de la materia"
              variant="underlined"
              hide-details="auto"
              :rules="[(v: string) => !!v || 'Escribe el nombre de la materia']"
            />
          </template>
          <template v-else>
            <v-list-item-title :class="['text-capitalize', {'text-muted' : !materia.active}]"> {{ materia.title }}</v-list-item-title>
          </template>
          <template #append>
            <v-btn
              variant="text"
              :disabled="!materia.active"
              icon="mdi-pen"
              @click="materia.edit = !materia.edit"
            />
            <v-btn
              variant="text"
              :icon="materia.active ? 'mdi-circle' : 'mdi-minus-circle'"
              :class="materia.active ? 'text-secundario' : 'text-muted'"
              @click="materia.active = !materia.active"
            />
            <v-btn
              variant="text"
              icon="mdi-trash-can"
              class="text-error"
              @click="materia.edit = !materia.edit"
            />
          </template>
        </v-list-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>