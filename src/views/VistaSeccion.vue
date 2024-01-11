<script setup lang="ts">
// @ts-ignore
import { CalendarView, CalendarViewHeader, CalendarMath } from "vue-simple-calendar";
import "/node_modules/vue-simple-calendar/dist/style.css";
import "/node_modules/vue-simple-calendar/dist/css/holidays-us.css";
import "/node_modules/vue-simple-calendar/dist/css/default.css";
import AgregarEstudiante from "../components/AgregarEstudiante.vue";
import router from "../router";
import { ref } from "vue";
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const studentDrawer = ref( mobile.value ? false : true)

// Consulta de estudiantes
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
const seleccionado = ref({
  id: "",
  nombre: "",
  avatar: "",
  cedula: "",
  telefono: "",
  area: "",
  fecha: "",
})
// Editar estudiante
const edit = ref(false)

// Funcionalidades del calendario
const calendarNav = ref(false)
const message = ref("")
const periodo = ref("month")
const newItemTitle= ref('')
const newItemType= ref('')
const newItemStartDateTime= ref(new Date())
const newItemStartDate= ref(new Date())
const newItemEndDate= ref('')
const showDate = ref(new Date())
function setShowDate(d: any) {
  showDate.value = d;
}
function thisMonth(d:any, h:any, m:any) {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
}
function onDrop(item: any, date: any) {
  message.value = `You dropped ${item.id} on ${date.toLocaleDateString()}`
  // Determine the delta between the old start date and the date chosen,
  // and apply that delta to both the start and end date to move the item.
  const eLength = CalendarMath.dayDiff(item.startDate, date)
  item.originalItem.startDate = CalendarMath.addDays(item.startDate, eLength)
  item.originalItem.endDate = CalendarMath.addDays(item.endDate, eLength)
}

function onClickDay(d: any) {
  calendarNav.value = true
  newItemStartDate.value = d
  message.value = `You clicked: ${d.toLocaleDateString()}`
}

const items = ref([
  {
    id: "e2",
    startDate: thisMonth(15, 0, 0),
    endDate: thisMonth(16, 16, 30),
    title: "Single-day item with a long title",
  },
  {
    id: "e3",
    startDate: thisMonth(2, 9, 25),
    endDate: thisMonth(6, 16, 30),
    title: "De reposo",
    classes: "color-repose",
  },
  {
    id: "e4",
    startDate: thisMonth(20, 0, 0),
    title: "Inasistente",
    classes: "color-absentee",
  },
  {
    id: "e5",
    startDate: thisMonth(12, 0, 0),
    endDate: thisMonth(14, 0, 0),
    title: "Justificado",
    classes: "purple",
    tooltip: "This spans multiple days",
  },
  {
    id: "foo",
    startDate: thisMonth(29, 0, 0),
    title: "Inasistente",
  },
])
</script>

<template>
<v-card>
  <v-navigation-drawer
    v-model="studentDrawer"
    floating
    :location="mobile ? 'bottom' : 'left'"
    :class="mobile ? 'h-75' : ''"
  >
    <v-list-item class="text-center item-text-inline item-sticky px-0">
      <template v-if="mobile" #prepend>
        <v-btn variant="text" icon="mdi-arrow-down" class="d-inline" @click="studentDrawer = false"/>
      </template>
      <template #title>
        <span class="d-inline-block">
          1 "A" T
          <span class="text-caption d-block">
            Primero "A" de Telemática
          </span>
        </span>
      </template>
      <AgregarEstudiante
        :año="'1'"
        :seccion="'A'"
        :mencion="'Telemática'"
        :variant="true"
        :classBtn="'float-right float-lg-none mt-2 mt-lg-1'"
      />
    </v-list-item>
    <v-list lines="one" density="compact" nav>
      <v-list-item
        v-for="estudiante in estudiantes"
        :key="estudiante.id"
        :title="estudiante.nombre"
        :subtitle="estudiante.cedula"
        class="my-3"
        >
        <!-- @click="seleccionado = estudiante" -->
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
  <v-navigation-drawer
    v-model="calendarNav"
    temporary
    location="right"
    class="sidebar-width"
  >
    <v-sheet width="450" class="pa-2">
      <p class="text-h5 text-center text-capitalize mb-4">
        {{newItemStartDate.toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long'})}}
      </p>
      <v-text-field v-model="newItemTitle" label="Titulo de la observación"/>
      <v-radio-group v-model="newItemType" label="Tipo de observación">
        <v-radio label="Inasistencia" value="Inasistencia"></v-radio>
        <v-radio label="Inasistencia justificada" value="Inasistencia justificada"></v-radio>
        <v-radio label="Reposo" value="Reposo"></v-radio>
        <v-radio label="Observación" value="Observación"></v-radio>
      </v-radio-group>
      <v-text-field
        v-model="newItemStartDateTime"
        label="Hora de la observación (opcional)"
        type="time"
      />
      <v-text-field
        v-model="newItemEndDate"
        :label="(newItemType.length ? newItemType : 'Observación') + ' hasta el...'"
        type="datetime-local"
        persistent-hint hint="Preferiblemente usar cuando se trata de un reposo"
      />
    </v-sheet>
  </v-navigation-drawer>
  <section>
    <v-container>
      <section class="d-flex flex-wrap">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="router.push('/')"
        >
          <span class="d-none d-md-inline">
            Regresar
          </span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="seleccionado"
          :variant="edit ? 'tonal' : 'text'"
          :prepend-icon="edit ? 'mdi-sync' :'mdi-pen'"
          :text="edit ? 'Guardar' : 'Editar'"
          :color="edit ? 'secundario' : ''"
          @click="edit = !edit"
        />
      </section>
      <template v-if="seleccionado">
        <v-card variant="tonal" class="ma-3 pa-2">
          <v-card-item class="pa-0">
            <v-row class="pa-3">
              <template v-if="!edit">
                <v-col cols="auto" class="d-none d-sm-block">
                  <v-badge icon="mdi-gender-female" color="pink">
                    <v-avatar color="brown">
                      <span class="text-h5">
                        {{ seleccionado.nombre.split(" ").map(parte => parte.charAt(0)).join('').toUpperCase() }}
                      </span>
                    </v-avatar>
                  </v-badge>
                </v-col>
                <v-col sm="8" class="px-0">
                  <v-card-title class="text-h4">
                    <v-tooltip text="Número de lista">
                      <template #activator="{ props }">
                        <span v-bind="props" class="text-primario">28</span>
                      </template>
                    </v-tooltip>
                    {{ seleccionado.nombre }}
                  </v-card-title>
                  <p>
                    <span class="text-caption font-weight-bold text-medium-emphasis">
                      C.I.
                    </span>
                    <span class="font-weight-bold letter-spacing">{{ seleccionado.cedula }}</span>
                  </p>
                  <p>
                    <span class="text-caption font-weight-bold text-medium-emphasis">
                      Fecha de nacimiento
                    </span>
                    <span class="font-weight-bold letter-spacing">
                      {{ seleccionado.fecha }}
                    </span>
                  </p>
                </v-col>
              </template>
              <template v-else>
                <v-col cols="12">
                  <v-text-field
                    label="Nombres y apellidos"
                    v-model="seleccionado.nombre"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Cédula"
                    v-model="seleccionado.cedula"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    type="date"
                    label="Fecha de nacimiento"
                    v-model="seleccionado.fecha"
                  />
                </v-col>
              </template>
              <v-divider/>
              <v-col cols="12" sm="4" class="pa-0 px-sm-2 py-sm-0">
                <p class="text-caption  font-weight-bold text-medium-emphasis">Representantes</p>
                <v-list-item
                  v-for="n in [{nom_per:'Sergio Perez', parentesco: 'Padre', telefono: '04245555555'}, {nom_per:'Lucia Amparo', parentesco: 'Abuela', telefono: '04245555555'}]"
                  :key="n.nom_per"
                  :title="n.nom_per"
                  class="px-0"
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
              </v-col>
              <v-divider :vertical="!mobile" class="d-sm-none d-lg-block"/>
              <v-col cols="12" sm="4" class="pa-0 px-sm-2 py-sm-0">
                <p class="text-caption  font-weight-bold text-medium-emphasis">Estatus</p>
                <v-list-item
                  class="px-0"
                  title="Pases"
                >
                  <template #subtitle>
                    <p>
                      <span class="text-caption font-weight-bold text-medium-emphasis">
                        De entrada:
                      </span>
                      <span class="font-weight-bold letter-spacing">
                        1
                      </span>
                    </p>
                    <p>
                      <span class="text-caption font-weight-bold text-medium-emphasis">
                        De salida
                      </span>
                      <span class="font-weight-bold letter-spacing">
                        1
                      </span>
                    </p>
                  </template>
                </v-list-item>
                <v-list-item
                  class="px-0"
                  title="Salud"
                  subtitle="En buen estado"
                  ></v-list-item>
                  <v-list-item
                  title="Condiciones medicas"
                  subtitle="Lesión en rodilla"
                  class="px-0"
                ></v-list-item>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
        <v-row>
          <v-col cols="12" md="">
            <v-radio-group v-model="periodo" inline label="Periodo">
              <v-radio label="Semana" value="week"></v-radio>
              <v-radio label="Mes" value="month"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <calendar-view
          :items="items"
          :display-period-uom="periodo"
          :starting-day-of-week="1"
          :show-date="showDate"
          :enable-drag-drop="true"
          :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
          @drop-on-date="onDrop"
          @click-date="onClickDay"
          class="calendar theme-default holiday-us-traditional holiday-us-official"
        >
          <template #header="{ headerProps }">
            <calendar-view-header :header-props="headerProps" @input="setShowDate" />
          </template>
        </calendar-view>
      </template>
      <template v-else>
        <v-sheet rounded="xl" class="text-center mt-3 pb-2 mx-auto" width="40vw">
          <v-icon icon="mdi-account-school-outline" class="text-primario-claro large-icon"/>
          <p class="text-h6">Selecciona un estudiante para ver su información</p>
        </v-sheet>
      </template>
    </v-container>
  </section>
</v-card>
</template>

<style>
.v-navigation-drawer--temporary.sidebar-width {
  width: fit-content !important;
}
.item-sticky {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgb(var(--v-theme-background));
  border-bottom: 1px solid rgb(var(--v-theme-muted));
}
.item-text-inline {
  .v-list-item-title, .v-list-item-subtitle {
    margin: 7px 5px 0 5px;
    line-height: 1.5rem;
    display: inline-block;
    @media (min-width: 1280px) {
      margin: 0;
      display: block;
    }
  }
}
</style>