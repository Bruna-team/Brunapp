<script setup lang="ts">
// @ts-ignore
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import "/node_modules/vue-simple-calendar/dist/style.css";
import "/node_modules/vue-simple-calendar/dist/css/holidays-us.css";
import "/node_modules/vue-simple-calendar/dist/css/default.css";
import { ref } from "vue";

const estudiantes = ref([
  {
    id: "12",
    nombre: "Antonio Jose Castellano",
    avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "12",
    nombre: "Maria Jose Alvarez",
    avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "12",
    nombre: "Luis Camilo Castellano",
    avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
])

const selecionado = ref({})
const periodo = ref("month")
const Lunes = ref(1)
const newItemTitle= ref('')
const newItemStartDate= ref('')
const newItemEndDate= ref('')
const showDate = ref(new Date())
function setShowDate(d: any) {
  showDate.value = d;
}
</script>

<template>
  <v-row>
    <v-col cols="3">
      <v-list lines="one">
        <v-list-item
          v-for="estudiante in estudiantes"
          :key="estudiante.id"
          :title="estudiante.nombre"
          :subtitle="estudiante.cedula"
          :prepend-avatar="estudiante.avatar"
          @click="selecionado = estudiante"
          class="my-3"
        ></v-list-item>
      </v-list>
    </v-col>
    <v-col
      v-if="selecionado"
      class="px-0"
    >
      <v-sheet class="px-5 pt-5">
        <v-card variant="tonal">
          <v-card-item class="pa-0">
            <v-row class="pa-3">
              <v-col cols="auto">
                <v-badge icon="mdi-gender-female" color="pink">
                  <v-avatar image="https://cdn.vuetifyjs.com/images/john.jpg" size="80"></v-avatar>
                  <!-- <v-avatar color="brown">
                    <span class="text-h5">JD</span>
                  </v-avatar> -->
                </v-badge>
              </v-col>
              <v-col>
                <p>
                  <v-card-title class="text-h4">
                    <v-tooltip text="Número de lista">
                      <template v-slot:activator="{ props }">
                        <span v-bind="props" class="text-primario">28</span>
                      </template>
                    </v-tooltip>
                    Carla Marrano
                  </v-card-title>
                  <v-tooltip text="Cédula">
                    <template v-slot:activator="{ props }">
                      <span class="text-caption font-weight-bold text-medium-emphasis" v-bind="props">
                        C.I.
                      </span>
                      <span class="font-weight-bold letter-spacing">28888888</span>
                    </template>
                  </v-tooltip>
                </p>
                <p>
                  <span class="text-caption font-weight-bold text-medium-emphasis">
                    Fecha de nacimiento
                  </span>
                  <span class="font-weight-bold letter-spacing">
                    14/06/2001
                  </span>
                </p>
              </v-col>
              <v-col class="d-flex text-center">
                <p class="flex-fill">
                  Año
                  <span class="d-block text-primario font-size-big">1</span>
                </p>
                <p class="flex-fill">
                  Sección
                  <span class="d-block text-primario font-size-big">A</span>
                </p>
                <p class="flex-fill">
                  Mención
                  <v-tooltip text="Telemática">
                  <template v-slot:activator="{ props }">
                    <span v-bind="props" class="d-block text-primario font-size-big">T</span>
                  </template>
                </v-tooltip>
                </p>
              </v-col>
            </v-row>
          </v-card-item>
          <v-card-item>
            <v-row>
              <v-col md="4">
                <p class="text-caption font-weight-bold text-medium-emphasis">Representantes</p>
                <v-list lines="two">
                  <v-list-item
                    v-for="n in [{nom_per:'Sergio Marrano', parentesco: 'Padre', telefono: '04245555555'}, {nom_per:'Lucia Pe', parentesco: 'Abuela', telefono: '04245555555'}]"
                    :key="n.nom_per"
                    :title="n.nom_per"
                  >
                    <template #subtitle>
                      <p>
                        <span class="text-caption font-weight-bold text-medium-emphasis">
                          Parentesco:
                        </span>
                        <span class="font-weight-bold letter-spacing">
                          {{ n.parentesco }}
                        </span>
                      </p>
                      <p>
                        <span class="text-caption font-weight-bold text-medium-emphasis">
                          Teléfono:
                        </span>
                        <span class="font-weight-bold letter-spacing">
                          {{ n.telefono }}
                        </span>
                      </p>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col>
                <span class="text-caption font-weight-bold text-medium-emphasis">
                  Pases
                </span>
                <span class="font-weight-bold letter-spacing">
                  2
                </span>
              </v-col>
              <v-col>
                <span class="text-caption font-weight-bold text-medium-emphasis">
                  Salud
                </span>
                <span class="font-weight-bold letter-spacing">
                  En buen estado
                </span>
              </v-col>
              <v-col>
                <span class="text-caption font-weight-bold text-medium-emphasis">
                  Condiciones medicas
                </span>
                <span class="font-weight-bold letter-spacing">
                  Lesión en rodilla
                </span>
              </v-col>
              <!-- <p class="text-caption font-weight-bold text-medium-emphasis">Estatus</p> -->
              <!-- <v-list lines="two">
                <v-list-item>
                  <template #title>
                    Pases:
                  </template>
                  <template #subtitle>
                    2
                  </template>
                </v-list-item>
                <v-list-item>
                  <template #title>
                    Salud
                  </template>
                  <template #subtitle>
                    En buen estado
                  </template>
                </v-list-item>
                <v-list-item>
                  <template #title>
                    Condiciones medicas
                  </template>
                  <template #subtitle>
                    Lesión en rodilla
                  </template>
                </v-list-item>
              </v-list> -->
            </v-row>
          </v-card-item>
        </v-card>
        <v-row>
          <v-col>
            <v-radio-group v-model="periodo" inline label="Periodo">
            <v-radio label="Semana" value="week"></v-radio>
            <v-radio label="Mes" value="month"></v-radio>
            <v-radio label="Año" value="year"></v-radio>
          </v-radio-group>
          </v-col>
          <v-col>
            <v-text-field v-model="newItemTitle" variant="solo" label="Titulo"/>
          </v-col>
          <v-col>
            <v-text-field v-model="newItemStartDate" variant="solo" label="Fecha inicio"/>
          </v-col>
          <v-col>
            <v-text-field v-model="newItemEndDate" variant="solo" label="Fecha final"/>
          </v-col>
        </v-row>
        <v-sheet theme="lightTheme">
          <calendar-view
            :display-period-uom="periodo"
            :starting-day-of-week="Lunes"
            :show-date="showDate"
            class="theme-default holiday-us-traditional holiday-us-official"
          >
            <template #header="{ headerProps }">
              <calendar-view-header :header-props="headerProps" @input="setShowDate" />
            </template>
          </calendar-view>
        </v-sheet>
      </v-sheet>
    </v-col>
    <v-col v-else>
      <v-sheet rounded="xl" class="text-center mt-3 pb-2 mx-auto" width="40vw">
        <v-icon icon="mdi-account-school-outline" class="text-primario-claro large-icon"/>
        <p class="text-h6">Selecciona un estudiante para ver su información</p>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style>
.font-size-big {
  font-size: 4rem;
  line-height: 3rem;
}
</style>