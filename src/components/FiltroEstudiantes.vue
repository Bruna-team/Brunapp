<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useTheme } from 'vuetify'
import { brunaApi } from '@/funciones/api.ts';
import { formatoFechaYHora, organizarSecciones } from '@/funciones/funciones';
import { MencionesReportes, EstudiantePase } from '@/types/interfaceTypes'
import AlertaMensaje from '@/components/AlertaMensaje.vue';
const theme = ref(useTheme().name)

const emit = defineEmits(['men', 'ano', 'sec', 'rep', 'fec', 'est', 'actualizar'])
const props = defineProps({
  men: {
    type: Boolean,
    default: true
  },
  anos: {
    type: Boolean,
    default: true
  },
  sec: {
    type: Boolean,
    default: true
  },
  fec: {
    type: Boolean,
    default: false
  },
  est: {
    type: Boolean,
    default: false
  },
  rep: {
    type: Boolean,
    default: false
  }
})
const alertaMsj = ref<string>('')
const estudiantes = ref<EstudiantePase[]>([]);
const estudiante = ref<EstudiantePase>();
const reporte = ref('')
const ano = ref('')
const mencion = ref('')
const seccion = ref('')
const menciones = ref<MencionesReportes[]>([]);

const paseFecha = ref(formatoFechaYHora(new Date(), 'FechayHora'))
const fechasFiltrar = ref()
const fechas = ref([''])
async function cargaInicial() {
  await brunaApi({ s: 'secciones' }, '')
  .then((res:any) => {
    if (res.data) {
      menciones.value = organizarSecciones(res.data)
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
}
function buscarEstudiante() {
  const hor = paseFecha.value.split('T')
  brunaApi({ s: 'burcarEstudiante' }, 'nom=' + estudiante.value + '&ano=' + seccion.value + '&hor=' + hor[1])
  .then((res:any) => {
    if (res.data) {
      estudiantes.value = res.data
    }
  }).catch(() => {
  })
}
watch(()=>estudiante.value, (value)=>{
  emit('est', value)
  emit('actualizar')
})
watch(()=>reporte.value, (value)=>{
  emit('rep', value)
  emit('actualizar')
})
watch(()=>mencion.value, (value)=>{
  emit('men', value)
  emit('actualizar')
})
watch(()=>ano.value, (value)=>{
  emit('ano', value)
  emit('actualizar')
})
watch(()=>seccion.value, (value)=>{
  emit('sec', value)
  emit('actualizar')
})
watch(()=>fechasFiltrar.value, ()=>{
  fechas.value = []
  fechasFiltrar.value.forEach((f: Date) => {
    if (f) {
      fechas.value.push(formatoFechaYHora(f, 'fecha'))
    }
  })
  emit('fec', fechas.value)
  emit('actualizar')
})
onMounted(() => {
	cargaInicial();
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 4));
  fechasFiltrar.value = [startDate, endDate];
});
</script>
<template>
  <AlertaMensaje :mensaje="alertaMsj" @limpiar-msj="alertaMsj = ''" />
  <v-container>
    <v-row>
      <v-col
        v-if="props.men"
        cols="12"
        sm="4"
        lg="3"
      >
        <v-autocomplete
          label="Mención"
          v-model="mencion"
          :items="Object.values(menciones)"
          item-title="men"
          item-value="id_men"
          hide-details
        />
      </v-col>
      <v-col
        v-if="props.men && props.anos && mencion?.length"
        cols="12"
        sm="4"
        lg="3"
      >
        <v-autocomplete
          label="Año"
          v-model="ano"
          :items="Object.keys(menciones[Number(mencion)]?.ano)"
          item-title="nom_ano"
          item-value="id_ano"
          hide-details
        />
      </v-col>
      <v-col
        v-if="props.men && props.anos && props.sec && ano?.length"
        cols="12"
        sm="4"
        lg="2"
      >
        <v-radio-group
          v-model="seccion"
          inline
          label="Sección"
          hide-details
        >
          <v-radio
            v-if="ano"
            v-for="sec in menciones[Number(mencion)]?.ano[ano]?.sec"
            :key="sec.id_ano"
            :label="sec.sec_nom"
            :value="sec.id_ano"
          />
          <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención primero</span>
          <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención y un año primero</span>
        </v-radio-group>
      </v-col>
      <v-col
        v-if="props.est"
        cols="12"
        sm="12"
        lg="4"
      >
        <v-combobox
          label="Escribe el nombre del estudiante"
          v-model="estudiante"
          :items="Object.values(estudiantes)"
          item-value="nombre"
          item-title="nombre"
          no-data-text="Sin estudiantes que coincidan"
          persistent-hint
          hint="Selecciona la sección del estudiante primero"
          @input="buscarEstudiante"
          :disabled="!seccion"
        />
      </v-col>
      <v-col
        v-if="props.fec"
        cols="12"
        sm="auto"
      >
        <VueDatePicker
          v-model="fechasFiltrar"
          text-input
          range
          :dark="theme == 'darkTheme'"
          :action-row="{ showNow: true }"
          now-button-label="Hoy"
          locale="es"
          selectText="Seleccionar"
          :enable-time-picker="false"
        />
      </v-col>
      <v-col
        v-if="props.rep"
        cols="12"
        sm="auto"
      >
        <v-chip-group v-model="reporte" filter >
          <v-chip value="obs">Observaciones</v-chip>
          <v-chip value="ina">Inasistencias</v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
</template>