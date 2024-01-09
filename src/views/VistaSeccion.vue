<script setup lang="ts">
// @ts-ignore
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import "/node_modules/vue-simple-calendar/dist/style.css";
import "/node_modules/vue-simple-calendar/dist/css/holidays-us.css";
import "/node_modules/vue-simple-calendar/dist/css/default.css";
import AgregarEstudiante from '../components/AgregarEstudiante.vue';
import { ref } from "vue";
import { useDisplay } from 'vuetify'
import router from "../router";

const { mobile } = useDisplay()

const estudiantes = ref([
  {
    id: "12",
    nombre: "Carla Perez",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "12",
    nombre: "Antonio Jose Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "13",
    nombre: "Maria Jose Alvarez",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
  {
    id: "14",
    nombre: "Luis Camilo Castellano",
    cedula: "23322323",
    telefono: "04243333333",
    area: "Coordinación 1",
  },
])

const selecionado = ref({
  id: "",
  nombre: "",
  avatar: "",
  cedula: "",
  telefono: "",
  area: "",
})
const studentDrawer = ref( mobile.value ? false : true)

const edit = ref(false)
const periodo = ref("month")
const Lunes = ref(1)
// const newItemTitle= ref('')
// const newItemStartDate= ref('')
// const newItemEndDate= ref('')
const showDate = ref(new Date())
function setShowDate(d: any) {
  showDate.value = d;
}
</script>

<template>
<v-navigation-drawer
  v-model="studentDrawer"
  floating
  :location="mobile ? 'bottom' : 'left'"
  :class="mobile ? 'h-75' : ''"
>
  <v-list-item
    title="1 'A' T"
    subtitle="Primero 'A' de Telemática"
  />
  <v-divider></v-divider>
  <v-list lines="one" density="compact" nav>
    <v-list-item
      v-for="estudiante in estudiantes"
      :key="estudiante.id"
      :title="estudiante.nombre"
      :subtitle="estudiante.cedula"
      class="my-3"
      >
      <!-- @click="selecionado = estudiante" -->
      <template #prepend>
        <v-avatar color="brown">
          <span class="text-h5">{{estudiante.id}}</span>
        </v-avatar>
      </template>
    </v-list-item>
  </v-list>
</v-navigation-drawer>
<v-bottom-navigation v-if="mobile">
  <v-btn @click="studentDrawer = !studentDrawer">
    <v-icon icon="mdi-account-school-outline" />
    Lista de estudiantes
  </v-btn>
</v-bottom-navigation>
<section class="mb-15">
  <v-container>
    <section class="d-flex">
      <v-btn
        prepend-icon="mdi-arrow-left"
        text="Regresar"
        @click="router.push('/')"
      ></v-btn>
      <v-spacer></v-spacer>
      <AgregarEstudiante
        :año="'1'"
        :seccion="'A'"
        :mencion="'Telemática'"
      />
    </section>
    <template v-if="selecionado">
      <v-card variant="tonal" class="ma-3 pa-2">
        <v-card-item class="pa-0">
          <v-row class="pa-3">
            <v-col cols="auto" class="d-none d-sm-block">
              <v-badge icon="mdi-gender-female" color="pink">
                <v-avatar color="brown">
                  <span class="text-h5">CP</span>
                </v-avatar>
              </v-badge>
            </v-col>
            <v-col sm="8">
              <p>
                <v-card-title class="text-h4">
                  <v-tooltip text="Número de lista">
                    <template #activator="{ props }">
                      <span v-bind="props" class="text-primario">28</span>
                    </template>
                  </v-tooltip>
                  Carla Perez
                  <v-btn
                    variant="text"
                    prepend-icon="mdi-pen"
                    text="Editar"
                    @click="edit = !edit"
                  />
                </v-card-title>
                <v-tooltip text="Cédula">
                  <template #activator="{ props }">
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
            <v-col cols="12" sm="4">
              <v-list lines="two">
                <p class="ml-4 text-caption font-weight-bold text-medium-emphasis">Representantes</p>
                <v-list-item
                  v-for="n in [{nom_per:'Sergio Perez', parentesco: 'Padre', telefono: '04245555555'}, {nom_per:'Lucia Amparo', parentesco: 'Abuela', telefono: '04245555555'}]"
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
            <v-col cols="12" sm="4">
              <v-list>
                <p class="ml-4 text-caption font-weight-bold text-medium-emphasis">Estatus</p>
                <v-list-item>
                  <span class="text-caption font-weight-bold text-medium-emphasis">
                    Pases
                  </span>
                  <span class="font-weight-bold letter-spacing">
                    2
                  </span>
                </v-list-item>
                <v-list-item>
                  <span class="text-caption font-weight-bold text-medium-emphasis">
                    Salud
                  </span>
                  <span class="font-weight-bold letter-spacing">
                    En buen estado
                  </span>
                </v-list-item>
                <v-list-item>
                  <span class="text-caption font-weight-bold text-medium-emphasis">
                    Condiciones medicas
                  </span>
                  <span class="font-weight-bold letter-spacing">
                    Lesión en rodilla
                  </span>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
      <v-row>
        <v-col cols="12" md="">
          <v-radio-group v-model="periodo" inline label="Periodo">
            <v-radio label="Semana" value="week"></v-radio>
            <v-radio label="Mes" value="month"></v-radio>
            <v-radio label="Año" value="year"></v-radio>
          </v-radio-group>
        </v-col>
        <!-- <v-col cols="12" md="">
          <v-text-field v-model="newItemTitle" variant="solo" label="Titulo"/>
        </v-col>
        <v-col cols="12" md="">
          <v-text-field v-model="newItemStartDate" variant="solo" label="Fecha inicio"/>
        </v-col>
        <v-col cols="12" md="">
          <v-text-field v-model="newItemEndDate" variant="solo" label="Fecha final"/>
        </v-col> -->
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
    </template>
    <template v-else>
      <v-sheet rounded="xl" class="text-center mt-3 pb-2 mx-auto" width="40vw">
        <v-icon icon="mdi-account-school-outline" class="text-primario-claro large-icon"/>
        <p class="text-h6">Selecciona un estudiante para ver su información</p>
      </v-sheet>
    </template>
  </v-container>
</section>
</template>