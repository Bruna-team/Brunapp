<script setup lang="ts">
import { ref } from "vue";
import QuillEditorComponent from "../components/QuillEditorComponent.vue";

const vistas = ref('diario')
const fecha = ref('')
const titulo = ref('')
const diarios = ref([
  {
    title: 'Asignar planificación',
    date: '05/05/2020',
    des: 'un poco del texto de la planificación'
  }
])
</script>
<template>
  <v-container>
    <h2>Diario</h2>
    <v-window v-model="vistas">
      <v-window-item :value="'diario'">
        <v-row class="mt-2">
          <v-col cols="12" sm="3" class="mr-2">
            <v-card title="Escribe tu planificación" subtitle="para la fecha de hoy o de otro dia...">
              <v-card-actions class="justify-end">
                <v-btn icon="mdi-plus" class="bg-primario" @click="vistas = 'editor'"/>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col
            v-for="(diario, d) in diarios"
            :key="d"
            cols="12"
            sm="3"
            class="mr-2"
          >
            <v-card :title="diario.title" :subtitle="diario.date">
              <p class="px-3 text-truncate">{{ diario.des }}</p>
              <v-card-actions class="justify-end">
                <!-- botón de editar -->
                <v-btn icon="mdi-pen" class="bg-primario" @click="vistas = 'editor'"/>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :value="'editor'">
        <div class="d-flex">
          <v-btn prepend-icon="mdi-arrow-left" text="regresar" @click="vistas = 'diario'" class="my-2" />
          <v-spacer />
          <v-text-field v-model="titulo" label="Titulo" />
          <v-spacer />
          <v-text-field v-model="fecha" type="date" label="Fecha de tu diario" class="flex-0-0" />
        </div>
        <QuillEditorComponent />
      </v-window-item>
    </v-window>
  </v-container>
</template>