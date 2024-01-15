<script setup lang="ts">
// @ts-ignore
import { CalendarView, CalendarViewHeader, CalendarMath } from "vue-simple-calendar";
import "/node_modules/vue-simple-calendar/dist/style.css";
import "/node_modules/vue-simple-calendar/dist/css/holidays-us.css";
import "/node_modules/vue-simple-calendar/dist/css/default.css";
import AgregarEstudiante from "../components/AgregarEstudiante.vue";
import VentanaConfirmar from '../components/VentanaConfirmar.vue';
import { brunaApi } from '../funciones/api.ts';

import router from "../router";
import { ref, watch, onMounted } from "vue";
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const studentDrawer = ref( mobile.value ? false : true)

// Consulta de estudiantes
const menciones = ref({
  ano: '',
  seccion: '',
  mencion: '',
  id_ano: ''
})
const estudiantes = ref([
  {
    ced_alum: "",
    id_estd: "",
    pape_alum: "",
    pnom_alum: "",
    sape_alum: "",
    snom_alum: "",
  },
])
const seleccionado = ref({
  id: "",
  nombre: "",
  avatar: "",
  cedula: "",
  fecha: "",
  obs: "",
  men: "",
  men_abre: "",
  representante: {
    nombre: '',
    paren: '',
    tel: '',
    telRe: '',
    dir: ''
  }
})
onMounted(() => {
	cargaInicial();
});
// Editar estudiante
const edit = ref(false)

// Variables del calendario
const calendarNav = ref(false)
const editItem = ref(false)
const periodo = ref("month")
const selectedItem= ref({
  originalItem:{
    id:"",
    startDate:"",
    endDate:"",
    title:"",
    obs: "",
    obsType: "",
    classes:"",
  },
  startDate: new Date(0),
  endDate: new Date(0),
  classes: "",
  title: "",
  id:"",
})

const showDate = ref(new Date())
function setShowDate(d: any) {
  showDate.value = d;
}

// Variables del scrum del calendario
const newItemTitle= ref('')
const newItemObservacion= ref('')
const newItemType= ref('')
const newItemStartDate= ref(new Date(0))
const newItemStartDateTime= ref(new Date(0))
const newItemEndDate = ref(new Date(0))

// eliminar cuando este la funcionalidad del back
function thisMonth(d:any, h:any, m:any) {
 const t = new Date()
 return (new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0))
}
const items = ref([
  {
    id: "e2",
    startDate: thisMonth(2, 4, 6),
    endDate: thisMonth(3, 4, 6),
    title: "Inasistencia justificada",
    obs: '',
    obsType: '',
    classes: ['bg-justified'],
  },
  {
    id: "e3",
    startDate: thisMonth(5, 4, 6),
    endDate: thisMonth(7, 4, 6),
    title: "De reposo",
    obs: '',
    obsType: '',
    classes: ['bg-repose'],
  },
  {
    id: "e4",
    startDate: thisMonth(12, 4, 6),
    title: "Inasistente",
    obs: '',
    obsType: '',
    classes: ['bg-absentee'],
  },
  {
    id: "e5",
    startDate: thisMonth(22, 4, 6),
    endDate: thisMonth(24, 4, 6),
    title: "Justificado",
    obs: '',
    obsType: '',
    classes: ['bg-justified'],
  },
  {
    id: "foo",
    startDate: thisMonth(10, 4, 6),
    title: "Inasistente",
    obs: '',
    obsType: '',
    classes: ['bg-observation'],
  },
])

// Funcionalidades del calendario
function onDrop(item: any, date: any) {
  // Determine the delta between the old start date and the date chosen,
  // and apply that delta to both the start and end date to move the item.
  const eLength = CalendarMath.dayDiff(item.startDate, date)
  item.originalItem.startDate = CalendarMath.addDays(item.startDate, eLength)
  item.originalItem.endDate = CalendarMath.addDays(item.endDate, eLength)
}
function onClickDay(d: any) {
  calendarNav.value = true
  newItemStartDate.value = d
}
function onClickItem(d: any) {
  calendarNav.value = true
  selectedItem.value = d
}
// Funciones del SCRUM del calendario
function limpiarItems() {
  newItemTitle.value = ''
  newItemObservacion.value = ''
  newItemType.value = ''
  newItemStartDate.value = new Date(0)
  newItemStartDateTime.value = new Date(0)
  newItemEndDate.value = new Date(0)
  selectedItem.value = {
    originalItem:{
      id:"",
      startDate:"",
      endDate:"",
      title:"",
      obs: "",
      obsType: "",
      classes:"",
    },
    startDate: new Date(0),
    endDate: new Date(0),
    classes: "",
    title: "",
    id:"",
  }
  calendarNav.value = false
}
function agregarItem() {
  const validarfecha = new Date(0).toString()
  if (newItemEndDate.value.toString() !== validarfecha) {
    items.value.push({
      id: "r8",
      startDate: newItemStartDate.value,
      endDate: newItemEndDate.value,
      title: newItemTitle.value,
      obs: newItemObservacion.value,
      obsType: newItemType.value,
      classes: [asignarClases(newItemType.value)]
    })
  } else {
    items.value.push({
      id: "r8",
      startDate: newItemStartDate.value,
      title: newItemTitle.value,
      obs: newItemObservacion.value,
      obsType: newItemType.value,
      classes: [asignarClases(newItemType.value)]
    })
  }
  limpiarItems()
}
function actualizarItem(item: any) {
  items.value = items.value.map((i) => {
    if(i.id === item.originalItem.id) {
      return {
        id: item.originalItem.id,
        startDate: newItemStartDate.value,
        endDate: newItemEndDate.value,
        title: newItemTitle.value,
        obs: newItemObservacion.value,
        obsType: newItemType.value,
        classes: [asignarClases(newItemType.value)]
      }
    } else {
      return {...i}
    }
  })
  limpiarItems()
}
function editarItem(item: any) {
  newItemTitle.value = item.originalItem.title
  newItemObservacion.value = item.originalItem.obs
  newItemType.value = item.originalItem.obsType
  newItemStartDate.value = item.originalItem.startDate
  newItemEndDate.value = item.originalItem.endDate
  editItem.value = true
}
function asignarClases(type: string) {
  switch (type) {
    case 'absentee':
      return 'bg-absentee'
    case 'justified':
      return 'bg-absentee'
    case 'repose':
      return 'bg-absentee'
    default:
      return 'bg-observation'
  }
}
function eliminarItem(item: any) {
  items.value = items.value.filter(i => i.id != item.originalItem.id)
  limpiarItems()
}
watch(calendarNav, (value) => {
  if (!value) {limpiarItems()}
})

function cargaInicial() {
  brunaApi({ s: 'sesion' }, 'ano=' + router.currentRoute.value.params.sec)
  .then((res:any) => {
    if (res.data) {
      organizarDatos(res.data)
      estudiantes.value = res.data.estd
    }
  }).catch(() => {
    // message: 'Hubo un error cargando los datos',
  })
}
function buscarEstudiante(id:string) {
  brunaApi({ s: 'sesion' }, 'ano=' + router.currentRoute.value.params.sec + "&estd=" + id)
  .then((res:any) => {
    if (res.data) {
      organizarDatos(res.data)
      estudiantes.value = res.data.estd
    }
  }).catch(() => {
    // message: 'Hubo un error cargando los datos',
  })
}

function organizarDatos(data:any) {
  seleccionado.value.nombre = data.alum[0].pnom_alum + ' ' + data.alum[0].snom_alum + ' ' + data.alum[0].pape_alum + ' ' + data.alum[0].sape_alum
  seleccionado.value.cedula = data.alum[0].ced_alum
  seleccionado.value.fecha = data.alum[0].fec_nac_alum
  seleccionado.value.obs = data.alum[0].obs_alum
  seleccionado.value.men_abre = data.alum[0].num_ano + ' "' + data.alum[0].sec_ano + '" ' + data.alum[0].abre_men
  seleccionado.value.men = data.alum[0].nom_ano + ' "' + data.alum[0].sec_ano + '" ' + data.alum[0].nom_men
  seleccionado.value.representante.nombre = data.alum[0].nom_rep + ' ' + data.alum[0].ape_rep
  seleccionado.value.representante.paren = data.alum[0].paren_alum
  seleccionado.value.representante.tel = data.alum[0].tel_rep
  seleccionado.value.representante.telRe = data.alum[0].tel_re_rep
  seleccionado.value.representante.dir = data.alum[0].dir_rep
  data.estd.forEach((d:any) => {
    if (d.id_estd == data.alum[0].id_estd) {
      seleccionado.value.id = data.estd.indexOf(d) + 1
    }
  })
  menciones.value.ano = data.alum[0].nom_ano + ' "' + data.alum[0].sec_ano + '" ' + data.alum[0].nom_men
  menciones.value.id_ano = data.alum[0].id_ano
}
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
          {{  seleccionado.men_abre }}
          <span class="text-caption d-block">
          {{  seleccionado.men }}
          </span>
        </span>
      </template>
      <AgregarEstudiante
        :data-academica="menciones"
        :variant="true"
        :classBtn="'float-right float-lg-none mt-2 mt-lg-1'"
        @recargar="cargaInicial"
      />
    </v-list-item>
    <v-list v-if="estudiantes[0].id_estd" lines="one" density="compact" nav>
      <v-list-item
        v-for="estudiante in estudiantes"
        :key="estudiante.id_estd"
        :title="`${estudiante.pnom_alum} ${estudiante.snom_alum} ${estudiante.pape_alum} ${estudiante.sape_alum}`"
        :subtitle="estudiante.ced_alum"
        class="my-3"
        @click="buscarEstudiante(estudiante.id_estd)"
      >
        <template #prepend>
          <v-avatar color="brown">
            <span class="text-h5">{{estudiantes.indexOf(estudiante) + 1}}</span>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-bottom-navigation v-if="mobile && estudiantes[0].id_estd">
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
    <v-sheet :width="mobile?'':'450'" class="pa-2">
      <template v-if="selectedItem.id && !editItem">
        <p class="text-center text-capitalize text-medium-emphasis">
          {{selectedItem.startDate.toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric'})}}
          <template v-if="selectedItem.endDate !== selectedItem.startDate">
            <span class="text-caption">
              al
            </span>
            {{selectedItem.endDate.toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric'})}}
          </template>
        </p>
        <p class="text-h5 text-center">{{ selectedItem.originalItem.title }}</p>
        <p>{{ selectedItem.originalItem.obs }}</p>
      </template>
      <template v-else>
        <p class="text-h5 text-center text-capitalize mb-4">
          {{newItemStartDate.toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long'})}}
        </p>
        <v-text-field v-model="newItemTitle" label="Titulo de la observación"/>
        <v-text-field
          v-if="editItem"
          v-model="newItemStartDate"
          label="Fecha y hora de la observación"
          type="datetime-local"
          hint="Ej: Pasó el dia... a las..."
          persistent-hint
          class="mb-3"
        />
        <v-text-field
          v-else
          v-model="newItemStartDateTime"
          label="Hora de la observación (opcional)"
          type="time"
          hint="Ej: Pasó a las..."
          persistent-hint
          class="mb-3"
        />
        <v-radio-group v-model="newItemType" label="Tipo de observación">
          <v-radio label="Inasistencia" value="absentee"></v-radio>
          <v-radio label="Inasistencia justificada" value="justified"></v-radio>
          <v-radio label="Reposo" value="repose"></v-radio>
          <v-radio label="Observación" value="observation"></v-radio>
        </v-radio-group>
        <v-text-field
          v-model="newItemEndDate"
          label="Observación hasta el..."
          type="datetime-local"
          persistent-hint hint="Preferiblemente usar cuando se trata de un reposo"
          class="mb-3"
        />
        <v-textarea label="Observación" v-model="newItemObservacion"/>
      </template>
    </v-sheet>
    <template #append>
      <template  v-if="selectedItem.id">
        <v-btn
          class="flex-fill py-3"
          variant="tonal"
          block
          :append-icon="editItem ? 'mdi-cancel' : 'mdi-trash-can'"
          color="error"
          @click="editItem ? (editItem = false, limpiarItems()) : ''"
        >
          <span>{{ editItem ? 'Cancelar' : 'Eliminar' }}</span>
          <VentanaConfirmar
            v-if="!editItem"
            :message="'desea eliminar esta observación'"
            icon="mdi-trash-can"
            @confirmar="(e) => { e ? eliminarItem(selectedItem) : '' }"
          />
        </v-btn>
        <v-btn
          class="flex-fill py-3"
          block
          :append-icon="editItem ? 'mdi-sync' :'mdi-pen'"
          :text="editItem ? 'Actualizar' : 'Editar'"
          :color="editItem ? 'primario' : 'secundario-claro'"
          @click="editItem ? actualizarItem(selectedItem) : editarItem(selectedItem)"
        />
      </template>
      <template  v-else>
        <v-btn class="py-7" color="primario-claro" block @click="agregarItem()">Agregar</v-btn>
      </template>
    </template>
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
      <template v-if="seleccionado.id">
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
                <v-col cols="auto" sm="10" class="px-0">
                  <v-card-title class="text-h4">
                    <v-tooltip text="Número de lista">
                      <template #activator="{ props }">
                        <span v-bind="props" class="text-primario">{{ seleccionado.id }}</span>
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
              <v-col cols="12" md="6" class="pa-0 px-sm-2 py-sm-0">
                <p class="text-caption  font-weight-bold text-medium-emphasis">Representante</p>
                <v-divider/>
                <div class="d-sm-flex">
                  <v-list-item
                    :title="seleccionado.representante.nombre"
                    class="px-0 pr-sm-3"
                  >
                    <template #subtitle>
                      <p>
                        <span class="text-caption font-weight-bold text-medium-emphasis">
                          Parentesco:
                        </span>
                        <span class="font-weight-bold letter-spacing">
                          {{ seleccionado.representante.paren }}
                        </span>
                      </p>
                      <p>
                        <span class="text-caption font-weight-bold text-medium-emphasis">
                          Teléfono:
                        </span>
                        <span class="font-weight-bold letter-spacing">
                          {{ seleccionado.representante.tel }}
                        </span>
                      </p>
                      <p v-if="seleccionado.representante.telRe">
                        <span class="text-caption font-weight-bold text-medium-emphasis">
                          Teléfonode repuesto:
                        </span>
                        <span class="font-weight-bold letter-spacing">
                          {{ seleccionado.representante.telRe }}
                        </span>
                      </p>
                      <p>
                        <span class="text-caption font-weight-bold text-medium-emphasis">
                          Dirección:
                        </span>
                        <span class="font-weight-bold letter-spacing">
                          {{ seleccionado.representante.dir }}
                        </span>
                      </p>
                    </template>
                  </v-list-item>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pa-0 px-sm-2 py-sm-0">
                <p class="text-caption  font-weight-bold text-medium-emphasis">Estatus</p>
                <v-divider/>
                <div class="d-sm-flex flex-wrap align-start">
                  <v-list-item
                    title="Pases"
                    class="flex-1-0 px-0 pr-sm-2"
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
                    title="Observaciones"
                    :subtitle="seleccionado.obs"
                    class="flex-1-0 px-0 pr-sm-2"
                  ></v-list-item>
                </div>
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
          @click-item="onClickItem"
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
          <p class="text-h6">No hay estudiantes registrados</p>
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
</style>../funciones y constantes/api.ts