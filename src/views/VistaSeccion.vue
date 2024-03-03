<script setup lang="ts">
// @ts-ignore
import { CalendarView, CalendarViewHeader, CalendarMath } from "vue-simple-calendar";
import "/node_modules/vue-simple-calendar/dist/style.css";
import "/node_modules/vue-simple-calendar/dist/css/holidays-us.css";
import "/node_modules/vue-simple-calendar/dist/css/default.css";
// import AgregarEstudiante from "../components/AgregarEstudiante.vue";
import VentanaConfirmar from '../components/VentanaConfirmar.vue';
import AlertaMensaje from '../components/AlertaMensaje.vue';
import { brunaApi } from '../funciones/api.ts';
import { formatoFechaYHora } from '../funciones/funciones.ts';

import router from "../router";
import { ref, watch, onMounted } from "vue";
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const studentDrawer = ref( mobile.value ? false : true)
const alertaMsj = ref<string>('')

const loading = ref(false)
const sectionLoading = ref(true)
const disabled = ref(false)
onMounted(() => {
	cargaInicial();
});
// Editar estudiante
const edit = ref(false)

// Variables del calendario
const motivos = ref([{
  id_mo: '',
  tipo_mo: '',
  eli_mo: ''
}])
const calendarNav = ref(false)
const editItem = ref(false)
const periodo = ref("month")

const showDate = ref(new Date())
function setShowDate(d: any) {
  showDate.value = d;
}

// Variables del scrum del calendario
const formObs = ref()
const formObsValidate = ref()
const selectedItem= ref({
  originalItem:{
    id:"",
    startDate:"",
    endDate:"",
    title:"",
    obs: "",
    obsDes: "",
    obsType: "",
    classes:"",
  },
  startDate: '',
  endDate: '',
  classes: "",
  title: "",
  id:"",
})
const selectedDate= ref('')
const newItemTitle= ref('')
const newItemObservacion= ref('')
const newItemType= ref({
  value:'',
  rules: [
      (v: string) => !!v || 'El tipo de observación es necesario',
  ]
})
const newItemStartDate= ref('')
const newItemStartDateTime= ref({
  value:'',
  rules: [
      (v: string) => !!v || 'La hora es necesaria',
  ]
})
const newItemEndDate = ref('')

const items = ref([
  {
    id: "",
    startDate: "",
    endDate: "",
    title: "",
    obs: '',
    obsType: '',
    classes: [],
  }
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
  selectedDate.value = d
  newItemStartDate.value = formatoFechaYHora(d, 'fecha')
}
function onClickItem(d: any) {
  calendarNav.value = true
  selectedItem.value = d
}
// Funciones del SCRUM del calendario
async function validarFormObs () {
  loading.value = true
  const { valid } = await formObs.value.validate()
  if (formObsValidate.value && valid) {
    agregarItem()
  }
  loading.value = false
}
function limpiarItems() {
  editItem.value = false
  calendarNav.value = false
  newItemTitle.value = ''
  newItemObservacion.value = ''
  newItemType.value.value = ''
  newItemStartDate.value = ''
  newItemStartDateTime.value.value = ''
  newItemEndDate.value = ''
  selectedItem.value = {
    originalItem:{
      id:"",
      startDate:"",
      endDate:"",
      title:"",
      obs: "",
      obsDes: "",
      obsType: "",
      classes:"",
    },
    startDate: '',
    endDate: '',
    classes: "",
    title: "",
    id:"",
  }
}
function agregarItem() {
  newItemTitle.value = newItemTitle.value.length ? newItemTitle.value : motivos.value[Number(newItemType.value.value)-1].tipo_mo
  let data = "estd=" + alumno.value.estd + '&mot=' + newItemType.value.value + '&fec=' + newItemStartDate.value
  data += '&hor=' + newItemStartDateTime.value.value + '&nom=' + newItemTitle.value + '&obs=' + newItemObservacion.value
  data += newItemEndDate.value ? '&fecFin=' + newItemEndDate.value : '&fecFin=' + newItemStartDate.value

  brunaApi({ s: 'crearObservacion' }, data)
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = "Observación guardada"
      buscarEstudiante(alumno.value.estd)
      limpiarItems()
    } else {
      alertaMsj.value = "Hubo un error guardando la observación"
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error guardando la observación"
  })
}
function actualizarItem(item: any) {
  const hor = newItemStartDate.value.split('T')
  let data = 'mot=' + newItemType.value.value + '&fec=' + hor[0] + '&id=' + item.originalItem.id
  data += '&hor=' + hor[1] + '&nom=' + newItemTitle.value + '&obs=' + newItemObservacion.value
  data += newItemEndDate.value.length ? '&fecFin=' + newItemEndDate.value : '&fecFin=' + newItemStartDate.value

  brunaApi({ s: 'editarObservacion' }, data)
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = res.data.e
      buscarEstudiante(alumno.value.estd)
      limpiarItems()
    } else {
      alertaMsj.value = res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error editando la observación"
  })
}
function editarItem(item: any) {
  newItemTitle.value = item.originalItem.title
  newItemObservacion.value = item.originalItem.obs
  newItemType.value.value = item.originalItem.obsType
  newItemStartDate.value = formatoFechaYHora(item.originalItem.startDate, 'fechaYhora')
  newItemEndDate.value = formatoFechaYHora(item.originalItem.endDate, 'fechaYhora')
  editItem.value = true
}
function asignarClases(type: string) {
  switch (type) {
    case '1':
      return 'bg-justified'
    case '2':
      return 'bg-repose'
    case '3':
      return 'bg-observation'
    default:
      return 'bg-absentee'
  }
}
function eliminarItem(item: any) {
  brunaApi({ s: 'eliminarObservacion' }, 'obs=' + item.originalItem.id)
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = res.data.e
      buscarEstudiante(alumno.value.estd)
      limpiarItems()
    } else {
      alertaMsj.value = res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error guardando la observación"
  })
}
watch(calendarNav, (value) => {
  if (!value) {limpiarItems()}
})
// Funciones de la vista
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
const representante = ref({
  id: '',
  nombre: '',
  nomRe: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre es necesario',
    ],
  },
  apeRe: {
    value: '',
    rules: [
      (v: string) => !!v || 'El apellido es necesario',
    ],
  },
  tel: {
    value: '',
    rules: [
      (v: string) => !!v || 'El teléfono es necesario',
    ],
  },
  telRe: {
    value: '',
    rules: [],
  },
  dir: {
    value: '',
    rules: [
      (v: string) => !!v || 'La dirección es necesaria',
    ],
  }
})
const alumno = ref({
  id: '',
  estd: '',
  num: '',
  nombre: '',
  pnom: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre es necesario',
      (v: string) => v.length>3 || 'El nombre es muy corto',
    ],
  },
  snom: {
    value: '',
    rules: [],
  },
  pape: {
    value: '',
    rules: [
      (v: string) => !!v || 'El apellido es necesario',
      (v: string) => v.length>3 || 'El apellido es muy corto',
    ],
  },
  sape: {
    value: '',
    rules: [],
  },
  paren: {
    value: '',
    rules: [
      (v: string) => !!v || 'El parentesco es necesario',
    ],
  },
  ced: {
    value: '',
    rules: [
      (v: string) => !!v || 'La cédula es necesaria',
      (v: string) => /^[^.]*$/.test(v)  || 'La cédula no debe tener puntos',
      (v: string) => /^\d{7,8}$/.test(v)  || 'La cédula no tiene la longitud correcta',
    ],
  },
  fec: {
    value: '',
    rules: [
      (v: string) => {
        let fecha = new Date(v)
        let hoy = new Date()
        let edad = hoy.getFullYear() - fecha.getFullYear()
        fecha.setFullYear(hoy.getFullYear())
        hoy < fecha ? edad-- : ''
        return edad>=10 && edad<=18 || 'La fecha de nacimiento no es valida, debe ser mayor de 10 años y menor de 18'
      },
    ],
  },
  obs: {
    value: '',
  },
  entrada: {
    value: 0,
  },
  salida: {
    value: 0,
  },
  men: '',
  men_abre: ''
})
const cedRe = ref({
  value: '',
  rules: [
      (v: string) => !!v || 'La cédula es necesaria',
      (v: string) => /^[^.]*$/.test(v)  || 'La cédula no debe tener puntos',
      (v: string) => /^\d{7,8}$/.test(v)  || 'La cédula no tiene la longitud correcta',
  ]
});
const form = ref()
async function validarFormEst () {
  loading.value = true
  const { valid } = await form.value.validate()
  if (valid) {
    editarAlumno()
  }
  loading.value = false
}
function cargaInicial() {
  sectionLoading.value = true
  brunaApi({ s: 'motivos' }, '')
  .then((res:any) => {
    if (res.data) {
      motivos.value = res.data
    }
  }).catch(() => {
    sectionLoading.value = false
    // message: 'Hubo un error cargando los datos',
  })
  brunaApi({ s: 'sesion' }, 'ano=' + router.currentRoute.value.params.sec)
  .then((res:any) => {
    if (res.data) {
      organizarDatos(res.data)
      estudiantes.value = res.data.estd
    }
  }).catch(() => {
    sectionLoading.value = false
    // message: 'Hubo un error cargando los datos',
  })
  sectionLoading.value = false
}
function buscarEstudiante(id:string) {
  brunaApi({ s: 'sesion' }, 'ano=' + router.currentRoute.value.params.sec + "&estd=" + id)
  .then((res:any) => {
    if (res.data) {
      organizarDatos(res.data)
      estudiantes.value = res.data.estd
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
}
function organizarDatos(data:any) {
  sectionLoading.value = true
  alumno.value.nombre = data.alum[0].pnom_alum + ' ' + (data.alum[0].snom_alum !== 'undefined' ? data.alum[0].snom_alum : '')
  + ' ' + data.alum[0].pape_alum + ' ' + (data.alum[0].sape_alum !== 'undefined' ? data.alum[0].sape_alum : '')
  alumno.value.id = data.alum[0].id_alum
  alumno.value.estd = data.alum[0].id_estd
  alumno.value.pnom.value = data.alum[0].pnom_alum
  alumno.value.snom.value = data.alum[0].snom_alum
  alumno.value.pape.value = data.alum[0].pape_alum
  alumno.value.sape.value = data.alum[0].sape_alum
  alumno.value.ced.value = data.alum[0].ced_alum
  alumno.value.fec.value = data.alum[0].fec_nac_alum
  alumno.value.obs.value = data.alum[0].obs_alum
  alumno.value.entrada.value = data.alum[0].entrada
  alumno.value.salida.value = data.alum[0].salida
  alumno.value.men_abre = data.alum[0].num_ano + ' "' + data.alum[0].sec_ano + '" ' + data.alum[0].abre_men
  alumno.value.men = data.alum[0].nom_ano + ' "' + data.alum[0].sec_ano + '" ' + data.alum[0].nom_men
  representante.value.nombre = data.alum[0].nom_rep + ' ' + data.alum[0].ape_rep
  representante.value.id = data.alum[0].id_rep
  cedRe.value.value = data.alum[0].ced_rep
  representante.value.nomRe.value = data.alum[0].nom_rep
  representante.value.apeRe.value = data.alum[0].ape_rep
  alumno.value.paren.value = data.alum[0].paren_alum
  representante.value.tel.value = data.alum[0].tel_rep
  representante.value.telRe.value = data.alum[0].tel_re_rep
  representante.value.dir.value = data.alum[0].dir_rep
  data.estd.forEach((d:any) => {
    if (d.id_estd == data.alum[0].id_estd) {
      alumno.value.num = data.estd.indexOf(d) + 1
    }
  })
  menciones.value.ano = data.alum[0].nom_ano + ' "' + data.alum[0].sec_ano + '" ' + data.alum[0].nom_men
  menciones.value.id_ano = data.alum[0].id_ano

  if(data.cal) {
    const item:any = []
    data.cal.forEach((c:any) => {
      item.push({
        id: c.id_obs,
        startDate: new Date(c.fec_obs.toString() + ' ' + c.hor_obs),
        endDate: c.fec_fin_obs.length ? new Date(c.fec_fin_obs.toString()) : new Date(c.fec_obs.toString()+' '+c.hor_obs),
        title: c.nom_obs,
        obsDes: c.nota_obs,
        obsType: c.id_mo_obs,
        obs: motivos.value[c.id_mo_obs-1].tipo_mo,
        classes: [asignarClases(c.id_mo_obs)]
      })
    });
    items.value = item
  }
  sectionLoading.value = false
}
function editarAlumno() {
  let data =  'pnom=' +  alumno.value.pnom.value + '&snom=' +  alumno.value.snom.value
  data +=  '&pape=' +  alumno.value.pape.value + '&sape=' +  alumno.value.sape.value
  data +=  '&fec_nac=' +  alumno.value.fec.value + '&ced=' +  alumno.value.ced.value
  data +=  '&paren=' +  alumno.value.paren.value + '&id=' + alumno.value.id
  data += '&obs=' + alumno.value.obs.value + '&idRe=' +  representante.value.id
  data += '&nomRe=' + representante.value.nomRe.value + '&apeRe=' + representante.value.apeRe.value
  data += '&cedRe=' + cedRe.value.value + '&telRe=' + representante.value.tel.value
  data += '&sTelRe=' + representante.value.telRe.value + '&dirRe=' + representante.value.dir.value

  brunaApi({ s: 'editarAlum' }, data)
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = "Datos actualizados"
      edit.value = !edit.value
      buscarEstudiante(alumno.value.estd)
    } else {
      alertaMsj.value = "Hubo un error actualizano los datos: " + res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error actualizano los datos"
  })
}
watch(()=>cedRe.value.value, ()=>{
  disabled.value = false
  representante.value.id = ''
  representante.value.nomRe.value = ''
  representante.value.apeRe.value = ''
  representante.value.tel.value = ''
  representante.value.dir.value = ''
  representante.value.telRe.value = ''
  if (cedRe.value.value.length < 8) return
  brunaApi({ s: 'buscarRepresentante' }, 'ced=' + cedRe.value.value)
  .then((res:any) => {
    if (res.data[0].id_rep) {
      disabled.value = true
      representante.value.id = res.data[0].id_rep
      representante.value.nomRe.value = res.data[0].nom_rep
      representante.value.apeRe.value = res.data[0].ape_rep
      representante.value.tel.value = res.data[0].tel_rep
      representante.value.dir.value = res.data[0].dir_rep
      representante.value.telRe.value = res.data[0].tel_re_rep || ''
    }
  }).catch(() => {
    // message: 'Hubo un error actualizando los datos',
  })
})
</script>

<template>
<v-card color="transparent">
  <AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
  <v-navigation-drawer
    v-model="studentDrawer"
    floating
    :location="mobile ? 'bottom' : 'left'"
    :class="mobile ? 'h-75' : ''"
    touchless
  >
    <v-list-item class="text-center item-text-inline item-sticky px-0">
      <template v-if="mobile" #prepend>
        <v-btn variant="text" icon="mdi-arrow-down" class="d-inline" @click="studentDrawer = false"/>
      </template>
      <span class="d-inline-block">
        {{  alumno.men_abre }}
        <span class="text-caption d-block">
        {{  alumno.men }}
        </span>
      </span>
      <!-- <AgregarEstudiante
        :data-academica="menciones"
        :variant="true"
        :classBtn="'float-right float-lg-none mt-2 mt-lg-1'"
        @recargar="cargaInicial"
      /> -->
    </v-list-item>
    <v-list v-if="estudiantes[0].id_estd" lines="one" density="compact" nav>
      <v-list-item
        v-for="estudiante in estudiantes"
        :key="estudiante.id_estd"
        :title="`${estudiante.pnom_alum}
                ${estudiante.snom_alum !== 'undefined' ? estudiante.snom_alum : ''}
                ${estudiante.pape_alum}
                ${estudiante.sape_alum !== 'undefined' ? estudiante.sape_alum : ''}`"
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
    <v-sheet class="pa-2">
      <v-btn variant="plain" prepend-icon="mdi-close" text="Cerrar" block @click="calendarNav = !calendarNav" />
      <template v-if="selectedItem.id && !editItem">
        <p class="text-center text-capitalize text-medium-emphasis">
          {{new Date(selectedItem.startDate).toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric'})}}
          <template v-if="selectedItem.endDate.toString() !== selectedItem.startDate.toString()">
            <span class="text-caption">
              al
            </span>
            {{new Date(selectedItem.endDate).toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric'})}}
          </template>
        </p>
        <p class="text-h5 text-center mb-2">{{ selectedItem.originalItem.title }}</p>
        <p class="text-center"><v-chip :class="asignarClases(selectedItem.originalItem.obsType)">{{ selectedItem.originalItem.obs }}</v-chip></p>
        <p>{{ selectedItem.originalItem.obsDes }}</p>
      </template>
      <template v-else>
        <v-form v-model="formObsValidate" ref="formObs">
          <p class="text-h5 text-center text-capitalize mb-4">
            {{new Date(selectedDate).toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long'})}}
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
            v-model="newItemStartDateTime.value"
            :rules="newItemStartDateTime.rules"
            label="Hora de la observación (opcional)"
            type="time"
            hint="Ej: Pasó a las..."
            persistent-hint
            class="mb-3"
          />
          <v-radio-group
            v-model="newItemType.value"
            :rules="newItemType.rules"
            label="Tipo de observación"
            class="mb-2"
          >
            <v-radio v-for="m in motivos" :keys="m.id_mo" :label="m.tipo_mo" :value="m.id_mo"></v-radio>
          </v-radio-group>
          <v-text-field
            v-model="newItemEndDate"
            label="Observación hasta el..."
            type="datetime-local"
            persistent-hint hint="Preferiblemente usar cuando se trata de un reposo"
            class="mb-3"
          />
          <v-textarea label="Observación" v-model="newItemObservacion"/>
        </v-form>
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
            btnicon="mdi-trash-can"
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
        <v-btn class="py-7" color="primario-claro" block @click="validarFormObs()">Agregar</v-btn>
      </template>
    </template>
  </v-navigation-drawer>
  <section>
    <v-container class="px-0">
      <section  class="d-flex flex-wrap">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="router.push('/')"
        >
          <span class="d-none d-sm-inline">
            Regresar
          </span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="alumno.num && !sectionLoading"
          :variant="edit ? 'tonal' : 'text'"
          :prepend-icon="edit ? 'mdi-close' :'mdi-pen'"
          :text="edit ? 'Cancelar' : 'Editar'"
          :color="edit ? 'error' : ''"
          class="mx-2"
          @click="edit = !edit"
        />
        <v-btn
          v-if="edit"
          :loading="loading"
          variant="tonal"
          prepend-icon="mdi-sync"
          text="Guardar"
          color="secundario"
          class="mx-2"
          @click="validarFormEst"
        />
      </section>
      <v-skeleton-loader v-if="sectionLoading" type="table-heading, article, paragraph" />
      <template v-else-if="alumno.num">
        <v-card variant="tonal" class="ma-1 ma-sm-3 pa-2">
          <v-card-item class="pa-0">
            <template v-if="!edit">
              <v-row class="pa-3">
                <v-col cols="auto" class="d-none d-sm-block">
                  <v-badge icon="mdi-gender-female" color="pink">
                    <v-avatar color="brown">
                      <span class="text-h5">
                        {{ alumno.nombre.split(" ").map(parte => parte.charAt(0))[0] + alumno.nombre.split(" ").map(parte => parte.charAt(0))[1] }}
                      </span>
                    </v-avatar>
                  </v-badge>
                </v-col>
                <v-col cols="auto" sm="10" class="px-0">
                  <v-card-title class="text-h4">
                    <v-tooltip text="Número de lista">
                      <template #activator="{ props }">
                        <span v-bind="props" class="text-primario">{{ alumno.num }}</span>
                      </template>
                    </v-tooltip>
                    {{ alumno.nombre }}
                  </v-card-title>
                  <p>
                    <span class="text-caption font-weight-bold text-medium-emphasis">
                      C.I.
                    </span>
                    <span class="font-weight-bold letter-spacing">{{ alumno.ced.value }}</span>
                  </p>
                  <p>
                    <span class="text-caption font-weight-bold text-medium-emphasis">
                      Fecha de nacimiento
                    </span>
                    <span class="font-weight-bold letter-spacing">
                      {{ alumno.fec.value }}
                    </span>
                  </p>
                </v-col>
                <v-col cols="12" sm="4" class="pa-0 px-sm-2 py-sm-0">
                  <p class="text-caption font-weight-bold text-medium-emphasis">Representante</p>
                  <v-divider/>
                  <div class="d-sm-flex">
                    <v-list-item
                      :title="representante.nombre"
                      class="px-0 pr-sm-3"
                    >
                      <template #subtitle>
                        <p>
                          <span class="text-caption font-weight-bold text-medium-emphasis">
                            Parentesco:
                          </span>
                          <span class="font-weight-bold letter-spacing">
                            {{ alumno.paren.value }}
                          </span>
                        </p>
                        <p>
                          <span class="text-caption font-weight-bold text-medium-emphasis">
                            Teléfono:
                          </span>
                          <span class="font-weight-bold letter-spacing">
                            {{ representante.tel.value }}
                          </span>
                        </p>
                        <p v-if="representante.telRe.value">
                          <span class="text-caption font-weight-bold text-medium-emphasis">
                            Teléfonode repuesto:
                          </span>
                          <span class="font-weight-bold letter-spacing">
                            {{ representante.telRe.value }}
                          </span>
                        </p>
                        <p>
                          <span class="text-caption font-weight-bold text-medium-emphasis">
                            Dirección:
                          </span>
                          <span class="font-weight-bold letter-spacing">
                            {{ representante.dir.value }}
                          </span>
                        </p>
                      </template>
                    </v-list-item>
                  </div>
                </v-col>
                <v-col cols="12" sm="3" class="pa-0 px-sm-2 py-sm-0">
                  <p class="text-caption font-weight-bold text-medium-emphasis">Estatus</p>
                  <v-divider/>
                  <div class="d-sm-flex flex-wrap align-start">
                    <v-list-item
                      class="flex-1-0 px-0 pr-sm-2"
                    >
                      <template #subtitle>
                        <p>
                          <span class="text-caption font-weight-bold text-medium-emphasis">
                            Pases de entrada:
                          </span>
                          <span class="font-weight-bold letter-spacing">
                            {{  alumno.entrada.value }}
                          </span>
                        </p>
                        <p>
                          <span class="text-caption font-weight-bold text-medium-emphasis">
                            Pases de salida
                          </span>
                          <span class="font-weight-bold letter-spacing">
                            {{  alumno.salida.value }}
                          </span>
                        </p>
                      </template>
                    </v-list-item>
                  </div>
                </v-col>
                <v-col cols="12" sm="5" class="pa-0 px-sm-2 py-sm-0">
                  <p class="text-caption font-weight-bold text-medium-emphasis">Observaciones</p>
                  <v-divider/>
                  <v-list-item
                    :subtitle="alumno.obs.value || 'Sin Observaciones'"
                    class="flex-1-0 px-0 pr-sm-2"
                  ></v-list-item>
                </v-col>
              </v-row>
              </template>
              <template v-else>
                <v-form ref="form">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Primer nombre"
                        v-model="alumno.pnom.value"
                        :rules="alumno.pnom.rules"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Segundo nombre"
                        v-model="alumno.snom.value"
                        :rules="alumno.snom.rules"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Primer apellido"
                        v-model="alumno.pape.value"
                        :rules="alumno.pape.rules"
                        />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Segundo apellido"
                        v-model="alumno.sape.value"
                        :rules="alumno.sape.rules"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Cédula"
                        v-model="alumno.ced.value"
                        hint="Ej: V-12345678"
                        prefix="V-"
                        :rules="alumno.ced.rules"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        type="date"
                        label="Fecha de nacimiento"
                        v-model="alumno.fec.value"
                        :rules="alumno.fec.rules"
                      />
                    </v-col>
                    <v-col cols="12">
                      <p class="text-caption font-weight-bold text-medium-emphasis">Representante</p>
                      <v-divider/>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Cédula"
                        v-model="cedRe.value"
                        hint="Ej: V-12345678"
                        prefix="V-"
                        :rules="cedRe.rules"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Nombre del representante"
                        v-model="representante.nomRe.value"
                        :rules="representante.nomRe.rules"
                        :disabled="disabled"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Apellido del representante"
                        v-model="representante.apeRe.value"
                        :rules="representante.apeRe.rules"
                        :disabled="disabled"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Parentesco"
                        v-model="alumno.paren.value"
                        :rules="alumno.paren.rules"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Teléfono"
                        v-model="representante.tel.value"
                        :rules="representante.tel.rules"
                        :disabled="disabled"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Teléfono de repuesto"
                        v-model="representante.telRe.value"
                        :rules="representante.telRe.rules"
                        :disabled="disabled"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Dirección"
                        v-model="representante.dir.value"
                        :rules="representante.dir.rules"
                        :disabled="disabled"
                      />
                    </v-col>
                    <v-col cols="12" sm="">
                      <v-text-field
                        label="Observaciones"
                        v-model="alumno.obs.value"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </template>
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
          show-times
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
  min-width: 300px;
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