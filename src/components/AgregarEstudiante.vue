<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { brunaApi } from '../funciones/api.ts';
const { mobile } = useDisplay()
const emit = defineEmits([
	'recargar', 'alerta'
]);
const props = defineProps({
  dataAcademica: {
    type: Object,
    default: {
      año: '',
      seccion: '',
      mencion: '',
    }
  },
  variant: {
    type: Boolean,
    default: false
  },
  classBtn: {
    type: String,
    default: ''
  },
  menciones: {
    type: [Object],
    default: ref<any[]>()
  }
})
const agregar = computed(()=>{return props.dataAcademica})
const steps = computed(()=>{
  if(Object.values(props.dataAcademica)[0].length) return [{title:'Datos del estudiante', value:1}, {title:'Datos del representante', value:2}]
  return [{title:'Información estudiantil', value:0}, {title:'Datos del estudiante', value:1}, {title:'Datos del representante', value:2}]
})
const step = ref(steps.value.length == 2 ? 1 : 0)
const loading = ref(false)
const dialog = ref(false)
const form = ref()
const cedRe = ref({
  value: '',
  rules: [
      (v: string) => !!v || 'La cédula es necesaria',
      (v: string) => /^[^.]*$/.test(v)  || 'La cédula no debe tener puntos',
      (v: string) => /^\d{7,8}$/.test(v)  || 'La cédula no tiene la longitud correcta',
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
  men: {
    value: ref<any>(''),
    rules: [
      (v: string) => !!v || 'La mención es necesaria',
    ],
  },
  ano: {
    value: ref<any>(),
    rules: [
      (v: string) => !!v || 'El año que cursa es necesario',
    ],
  },
  sec: {
    value: ref<any>(''),
    rules: [
      (v: string) => !!v || 'La sección es necesaria',
    ],
  },
})
async function validacion () {
  loading.value = true
  const { valid } = await form.value.validate()
  if ((step.value == 2) && valid) {
    guardarAlumno()
  }
  else if (valid) step.value++
  loading.value = false
}
function guardarAlumno() {
  let data =  'pnom=' +  alumno.value.pnom.value + '&snom=' +  alumno.value.snom.value
  data +=  '&pape=' +  alumno.value.pape.value + '&sape=' +  alumno.value.sape.value
  data +=  '&fec_nac=' +  alumno.value.fec.value + '&ced=' +  alumno.value.ced.value
  data +=  '&paren=' +  alumno.value.paren.value + '&idAno=' + alumno.value.sec.value
  data += '&obs=' + alumno.value.obs.value
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
      emit('alerta', res.data.e)
      emit('recargar')
      dialog.value=false
    }
  }).catch(() => {
    emit('alerta', 'Hubo un error agregando el alumno')
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
<v-dialog v-model="dialog" :fullscreen="mobile">
  <template #activator="{ props }">
    <v-btn
      v-bind="props"
      append-icon="mdi-account-school-outline"
      :variant="props.variant ? 'text' : 'tonal'"
      :class="props.classBtn"
    >
      Agregar
    </v-btn>
  </template>
  <template #default="{ isActive }">
    <v-card>
      <v-toolbar dark>
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
        <v-form ref="form">
          <v-stepper v-model="step" :mobile="mobile" :items="steps" item-title="title" item-value="value">
            <v-stepper-window>
              <Transition mode="out-in" name="rotate" type="animation">
                <v-stepper-window-item key="0" :value="0" v-if="step==0">
                  <v-card class="box-shadow-none" title="Ingresa la información estudiantil" flat>
                    <v-divider></v-divider>
                    <v-row class="mt-2">
                      <v-col>
                        <v-radio-group
                          v-model="alumno.men.value"
                          :rules="alumno.men.rules"
                          inline
                          label="Mención"
                        >
                          <v-radio
                            v-for="menc in props.menciones"
                            :key="menc.id_men"
                            :label="menc.men"
                            :value="menc.id_men"
                          />
                        </v-radio-group>
                      </v-col>
                      <v-col>
                        <v-radio-group
                          v-model="alumno.ano.value"
                          :rules="alumno.ano.rules"
                          inline
                          label="Año"
                        >
                          <v-radio
                            v-if="alumno.men.value"
                            v-for="ano in props.menciones[alumno.men.value].ano"
                            :key="ano.id_ano"
                            :label="ano.num_ano"
                            :value="ano.nom_ano"
                          />
                        </v-radio-group>
                      </v-col>
                      <v-col>
                        <v-radio-group
                          v-model="alumno.sec.value"
                          :rules="alumno.sec.rules"
                          inline
                          label="Sección"
                        >
                          <v-radio
                            v-if="alumno.ano.value"
                            v-for="sec in props.menciones[alumno.men.value]?.ano[alumno.ano.value]?.sec"
                            :key="sec.id_ano"
                            :label="sec.sec_nom"
                            :value="sec.id_ano"
                          />
                        </v-radio-group>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-stepper-window-item>
                <v-stepper-window-item key="1" :value="1" v-else-if="step==1">
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
                          v-model="alumno.ced.value"
                          label="Cédula"
                          hint="Ej: V-12345678"
                          prefix="V-"
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
                    </v-row>
                  </v-card>
                </v-stepper-window-item>
                <v-stepper-window-item key="2" :value="2" v-else-if="step==2">
                  <v-card title="Ingresa los datos del representante" flat>
                    <v-divider></v-divider>
                    <v-row class="mt-2">
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="cedRe.value"
                          label="Cédula"
                          hint="Ej: V-12345678"
                          prefix="V-"
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
                          v-model="alumno.paren.value"
                          label="Parentesco"
                          :rules="alumno.paren.rules"
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
                </v-stepper-window-item>
              </Transition>
            </v-stepper-window>
            <template #actions>
              <div class="d-flex">
                <v-btn
                  text="Atrás"
                  flat
                  prepend-icon="mdi-arrow-left"
                  :disabled="step==0"
                  @click="step--"
                />
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  flat
                  :append-icon="step == 2 ? 'mdi-check' : 'mdi-arrow-right'"
                  :text="step !== 2 ? 'Siguiente' : 'Agregar'"
                  :color="step == 2 ? 'primario' : ''"
                  @click="validacion"
                />
              </div>
            </template>
          </v-stepper>
        </v-form>
      </v-sheet>
    </v-card>
  </template>
</v-dialog>
</template>
<style>
.v-stepper-window {
   margin-top: 0;
   margin-bottom: 0;
}
.v-stepper-header, .v-stepper.v-sheet, .box-shadow-none {
  box-shadow: none;
}
.rotate-enter-active {
  animation: rotate-in 0.5s;
}
.rotate-leave-active {
  animation: rotate-in 0.5s reverse;
}
@keyframes rotate-in {
  0% {
    transform: rotateY(180deg);
    opacity: 0;
  }
  100% {
    transform: rotateY(0);
    opacity: 1;
  }
}
</style>