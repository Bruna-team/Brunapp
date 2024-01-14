<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { brunaApi } from '../funciones/api.ts';
const { mobile } = useDisplay()

const emit = defineEmits([
	'recargar',
]);
const props = defineProps({
  año: String,
  seccion: String,
  mencion: String,
  variant: {
    type: Boolean,
    default: false
  },
  classBtn: String,
  menciones: Object,
})

const loading  = ref(false)
const agregar = computed(()=>{return props})

const cedRe = ref({
  value: '',
  rules: [
      (v: string) => !!v || 'La cédula es necesaria',
  ]
});
const representante = ref({
  id: '',
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
  pnom: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre es necesario',
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
    ],
  },
  fec: {
    value: new Date(),
    rules: [
      // (v: Date) => !!v || 'La fecha de nacimiento es necesaria',
    ],
  },
  obs: {
    value: '',
  },
  men: {
    value: '',
    rules: [
      (v: string) => !!v || 'La cédula es necesaria',
    ],
  },
  ano: {
    value: '',
    rules: [
      (v: string) => !!v || 'La cédula es necesaria',
    ],
  },
  sec: {
    value: '',
    rules: [
      (v: string) => !!v || 'La cédula es necesaria',
    ],
  },
})

async function validar (event:any) {
  loading.value = true
  const results = await event
  loading.value = false
  alert(JSON.stringify(results, null, 2))
}

function guardarAlumno() {
  let data =  'pnom=' +  alumno.value.pnom.value + '&snom=' +  alumno.value.snom.value
  data +=  '&pape=' +  alumno.value.pape.value + '&sape=' +  alumno.value.sape.value
  data +=  '&fec_nac=' +  alumno.value.fec.value + '&ced=' +  alumno.value.ced.value
  data +=  '&paren=' +  alumno.value.paren.value + '&idAno=' + alumno.value.sec.value
  if (representante.value.id) {
    data += '&idRe=' +  representante.value.id
  } else {
    data += '&nomRe=' + representante.value.nomRe.value + '&apeRe=' + representante.value.apeRe.value
    data += '&cedRe=' + cedRe.value.value + '&telRe=' + representante.value.tel.value
    data += '&sTelRe=' + representante.value.telRe.value + '&dirRe=' + representante.value.dir.value
  }
  brunaApi({ s: 'agregarAlum' }, data)
  .then((res:any) => {
    if (res.data.r) {
      emit('recargar')
    }
  }).catch(() => {
    // message: 'Hubo un error agregando el alumno',
  })
}

watch(()=>cedRe.value.value, ()=>{
  if (cedRe.value.value.length < 8) return
  brunaApi({ s: 'buscarRepresentante' }, 'ced=' + cedRe.value.value)
  .then((res:any) => {
    if (res.data) {
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
  <v-dialog :fullscreen="mobile">
  <template #activator="{ props }">
    <v-btn
      v-bind="props"
      append-icon="mdi-account-school-outline"
      :variant="agregar.variant ? 'text' : 'tonal'"
      :class="agregar.classBtn"
    >
      Agregar
    </v-btn>
  </template>

  <template #default="{ isActive }">
    <v-card>
      <v-toolbar
        dark
      >
      <v-toolbar-title>
        {{ agregar.año && agregar.seccion
          ? `Agrega un estudiante para la seccion ${agregar.seccion}
          año ${agregar.año} mención ${agregar.mencion}`
          : 'Agrega un estudiante'}}
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn
            icon="mdi-close"
            dark
            @click="isActive.value = false"
          />
        </v-toolbar-items>
      </v-toolbar>
      <v-sheet class="pa-3">
        <v-form fast-fail @submit.prevent="validar">
          <v-stepper
            :items="['Datos del estudiante', 'Datos del representante']"
          >
            <template v-slot:item.1>
              <v-card class="box-shadow-none" title="Ingresa los datos del estudiante" flat>
                <v-divider></v-divider>
                <v-row class="mt-2">
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alumno.pnom.value"
                      label="Primer nombre"
                      :rules="alumno.pnom.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alumno.snom.value"
                      label="Segundo nombre"
                      :rules="alumno.snom.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alumno.pape.value"
                      label="Primer apellido"
                      :rules="alumno.pape.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alumno.sape.value"
                      label="Segundo apellido"
                      :rules="alumno.sape.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alumno.paren.value"
                      label="Parentesco"
                      :rules="alumno.paren.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alumno.ced.value"
                      label="Cédula"
                      :rules="alumno.ced.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alumno.fec.value"
                      label="Fecha de nacimiento"
                      type="date"
                      :rules="alumno.fec.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="alumno.obs.value"
                      label="Observaciones"
                      type="text"
                    />
                  </v-col>
                  <v-radio-group
                    v-model="alumno.men.value"
                    :rules="alumno.men.rules"
                    inline
                    label="Mención"
                  >
                    <v-radio v-for="menc in $props.menciones" :key="menc.id_men" :label="menc.men" :value="menc.id_men"></v-radio>
                  </v-radio-group>
                  <v-radio-group
                    v-if="alumno.men.value"
                    v-model="alumno.ano.value"
                    :rules="alumno.ano.rules"
                    inline
                    label="Año"
                  >
                    <v-radio v-for="ano in $props.menciones[alumno.men.value].ano" :key="ano.id_ano" :label="ano.num_ano" :value="ano.nom_ano"></v-radio>
                  </v-radio-group>
                  <v-radio-group
                    v-if="alumno.ano.value"
                    v-model="alumno.sec.value"
                    :rules="alumno.sec.rules"
                    inline
                    label="Sección"
                  >
                    <v-radio v-for="sec in $props.menciones[alumno.men.value].ano[alumno.ano.value].sec" :key="sec.id_ano" :label="sec.sec_nom" :value="sec.id_ano"></v-radio>
                  </v-radio-group>
                </v-row>
              </v-card>
            </template>
            <template v-slot:item.2>
              <v-card title="Ingresa los datos del representante" flat>
                <v-divider></v-divider>
                <v-row class="mt-2">
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="cedRe.value"
                      label="Cédula"
                      :rules="cedRe.rules"
                    />
                  </v-col>
                  <v-divider></v-divider>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="representante.nomRe.value"
                      label="Nombre"
                      :rules="representante.nomRe.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="representante.apeRe.value"
                      label="Apellido"
                      :rules="representante.apeRe.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="representante.tel.value"
                      label="Teléfono"
                      :rules="representante.tel.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="representante.telRe.value"
                      label="Teléfono repuesto"
                      :rules="representante.telRe.rules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="representante.dir.value"
                      label="Dirección"
                      :rules="representante.dir.rules"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <template #actions="{prev, next}">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text="Atras"
                  @click="prev"
                />
                <v-btn
                  text="Siguiente"
                  @click="next"
                />
                <v-btn
                  :loading="loading"
                  type="submit"
                  prepend-icon="mdi-check"
                  variant="tonal"
                  text="Agregar"
                  color="primario"
                  @click="guardarAlumno"
                />
              </v-card-actions>
            </template>
          </v-stepper>
        </v-form>
      </v-sheet>
    </v-card>
  </template>
</v-dialog>
</template>

<style>
.v-stepper-header, .v-stepper.v-sheet, .box-shadow-none {
  box-shadow: none;
}
</style>
