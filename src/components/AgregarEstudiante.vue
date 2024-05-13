<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { brunaApi } from '@/funciones/api.ts';
import { capitalizar, validateCed, validateBornDate, } from "@/funciones/funciones.ts";
import { Menciones } from '@/types/interfaceTypes'
import EstudiantesExcel from './EstudiantesExcel.vue'
const { mobile, smAndUp } = useDisplay()
const emit = defineEmits([
	'recargar', 'alerta'
]);
const props = defineProps({
  dataAcademica: {
    type: Object,
    default: {
      ano: '',
      id_ano: ''
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
    type: Object,
    default: ref<Menciones>()
  },
  excelMode: {
    type: Boolean,
    default: false,
  }
})
const agregar = computed(()=>{return props.dataAcademica})
const steps = computed(()=>{
  if(props.dataAcademica.id_ano) return [
    {title:'Datos del estudiante', value:2},
    {title:'Datos del representante', value:3}
  ]
  return [
    {title:'Información estudiantil', value:1},
    {title:'Datos del estudiante', value:2},
    {title:'Datos del representante', value:3}
  ]
})
const step = ref(steps.value.length == 2 ? 2 : 1)
const loading = ref(false)
const dialog = ref(false)
const form = ref()
const formExcel = ref()
const disabled = ref(false)
const cedRe = ref({
  value: '',
  rules: [
      (v: string) => !!v || 'La cédula es necesaria',
      (v: string) => /^[^.]*$/.test(v)  || 'La cédula no debe tener puntos',
      (v: string) => /^\d{7,8}$/.test(v)  || 'La cédula no tiene la longitud correcta',
  ]
});
const representante = ref<any>({
  id: {value: ''},
  nomRe: {
    value: '',
    rules: [
      (v: string) => !!v || 'El nombre es necesario',
      (v: string) => v.length>3 || 'El nombre es muy corto',
    ],
  },
  apeRe: {
    value: '',
    rules: [
      (v: string) => !!v || 'El apellido es necesario',
      (v: string) => v.length>3 || 'El apellido es muy corto',
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
const alumno = ref<any>({
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
  sexo: {
    value: '',
    rules: [
      (v: string) => !!v || 'El sexo del joven es necesario',
    ],
  },
  ced: {
    value: '',
    rules: [
      (v: string) => !!v || 'La cédula es necesaria',
      (v: string) => validateCed(v),
    ],
  },
  fec: {
    value: '',
    rules: [
      (v: string) => validateBornDate(v),
    ],
  },
  obs: {
    value: '',
  },
  men: {
    value: props.dataAcademica.id_ano || '',
    rules: [
      (v: string) => !!v || 'La mención es necesaria',
    ],
  },
  ano: {
    value: props.dataAcademica.id_ano || '',
    rules: [
      (v: string) => !!v || 'El año que cursa es necesario',
    ],
  },
  sec: {
    value: props.dataAcademica.id_ano || '',
    rules: [
      (v: string) => !!v || 'La sección es necesaria',
    ],
  },
})
const curso = ref<any>({
  men: {
    value: '',
    rules: [
      (v: string) => !!v || 'La mención es necesaria',
    ]
  },
  ano: {
    value: '',
    rules: [
      (v: string) => !!v || 'El año que cursa es necesario',
    ]
  },
  sec: {
    value: '',
    rules: [
      (v: string) => !!v || 'La sección es necesaria',
    ]
  },
})
const estudiantes = ref<any[]>([])
async function validacion () {
  loading.value = true
  const { valid } = await form.value.validate()
  if ((step.value == 3) && valid) {
    guardarAlumno()
  }
  else if (valid) step.value++
  loading.value = false
}
function guardarAlumno() {
  let data =  'pnom=' +  capitalizar(alumno.value.pnom.value) + '&snom=' +  capitalizar(alumno.value.snom.value) || ''
  data +=  '&pape=' +  capitalizar(alumno.value.pape.value) + '&sape=' +  capitalizar(alumno.value.sape.value) || ''
  data +=  '&fec_nac=' +  alumno.value.fec.value + '&ced=' +  alumno.value.ced.value
  data +=  '&paren=' +  capitalizar(alumno.value.paren.value) + '&idAno=' + alumno.value.sec.value
  data += '&obs=' + alumno.value.obs.value + '&sex=' + alumno.value.sexo.value
  if (representante.value.id.value) {
    data += '&idRe=' +  representante.value.id.value
  } else {
    data += '&nomRe=' + capitalizar(representante.value.nomRe.value) + '&apeRe=' + capitalizar(representante.value.apeRe.value)
    data += '&cedRe=' + cedRe.value.value + '&telRe=' + representante.value.tel.value
    data += '&sTelRe=' + representante.value.telRe.value + '&dirRe=' + representante.value.dir.value
  }
  brunaApi({ s: 'agregarAlum' }, data)
  .then((res:any) => {
    if (res.data.r) {
      emit('alerta', res.data.e)
      limpiarDatos()
      emit('recargar')
    }
  }).catch(() => {
    emit('alerta', 'Hubo un error agregando el alumno')
  })
}
function guardarEstudiantes() {
  let data = ''
  estudiantes.value.forEach(estudiante => {
    data =  'pnom=' +  capitalizar(estudiante.alumno.pnom) + '&snom=' +  capitalizar(estudiante.alumno.snom) || ''
    data +=  '&pape=' +  capitalizar(estudiante.alumno.pape) + '&sape=' +  capitalizar(estudiante.alumno.sape) || ''
    data +=  '&fec_nac=' +  estudiante.alumno.fec + '&ced=' +  estudiante.alumno.ced
    data +=  '&paren=' +  capitalizar(estudiante.alumno.paren) + '&idAno=' + curso.value.sec.value
    data += '&obs=' + estudiante.alumno.obs || '' + '&sex=' + estudiante.alumno.sexo
    data += '&nomRe=' + capitalizar(estudiante.rep.nomRe) + '&apeRe=' + capitalizar(estudiante.rep.apeRe)
    data += '&cedRe=' + estudiante.rep.cedRe + '&telRe=' + estudiante.rep.tel
    data += '&sTelRe=' + estudiante.rep.telRe || '' + '&dirRe=' + estudiante.rep.dir
    brunaApi({ s: 'agregarAlum' }, data)
    .then((res:any) => {
      if (res.data.r) {
        data = ''
      }
    }).catch(() => {
      emit('alerta', 'Hubo un error agregando el alumno')
    })
    emit('alerta', 'Se han registrado todos los alumnos')
    limpiarDatos()
    emit('recargar')
  });
}
function limpiarDatos() {
  dialog.value = false
  step.value = steps.value.length == 2 ? 1 : 0
  for (let key in alumno.value) {
    alumno.value[key].value = '';
  }
  for (let key in representante.value) {
    representante.value[key].value = '';
  }
  cedRe.value.value = ''
}
watch(()=>cedRe.value.value, ()=>{
  disabled.value = false
  representante.value.id.value = ''
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
      representante.value.id.value = res.data[0].id_rep
      representante.value.nomRe.value = res.data[0].nom_rep
      representante.value.apeRe.value = res.data[0].ape_rep
      representante.value.tel.value = res.data[0].tel_rep
      representante.value.dir.value = res.data[0].dir_rep
      representante.value.telRe.value = res.data[0].tel_re_rep || ''
    }
  }).catch(() => {
    emit('alerta', 'No se encontró un representante con esos datos.')
  })
})
</script>
<template>
<v-dialog
  v-model="dialog"
  :fullscreen="!smAndUp"
  max-width="768"
>
  <template #activator="{ props }">
    <template v-if="!excelMode">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-account-school-outline"
        :variant="variant ? 'text' : 'tonal'"
        :class="classBtn"
      >
        Agregar
      </v-btn>
    </template>
    <template v-else>
      <v-btn
        v-bind="props"
        variant="text"
        prepend-icon="mdi-file-excel"
        text="excel"
        color="secundario"
      />
    </template>
  </template>
  <template #default="{ isActive }">
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title v-if="!excelMode">
          {{ agregar.ano && agregar.id_ano
            ? `Agrega un estudiante para ${agregar.ano}`
            : 'Agrega un estudiante'}}
        </v-toolbar-title>
        <v-toolbar-title v-else>
          Agrega estudiantes por tabla de excel
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn
            icon="mdi-close"
            dark
            @click="isActive.value = false"
          />
        </v-toolbar-items>
      </v-toolbar>
      <v-sheet v-if="!excelMode" class="pa-md-3">
        <v-form ref="form">
          <v-stepper
            v-model="step"
            :mobile="mobile"
            :items="steps"
            item-title="title"
            item-value="value"
          >
            <v-stepper-window>
              <Transition mode="out-in" name="rotate" type="animation">
                <v-stepper-window-item key="1" :value="1" v-if="step==1">
                  <v-card class="box-shadow-none" flat>
                    <v-card-title class="text-wrap text-center text-sm-start">Ingresa la información estudiantil</v-card-title>
                    <v-divider></v-divider>
                    <v-row class="mt-2" justify="space-around">
                      <v-col cols="12">
                        <v-radio-group
                          v-model="alumno.men.value"
                          :rules="alumno.men.rules"
                          inline
                          label="Mención"
                        >
                          <v-radio
                            v-for="(menc, imenc) in props.menciones"
                            :key="menc.id_men"
                            :label="menc.men"
                            :value="imenc+1"
                          />
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" sm="7">
                        <v-radio-group
                          v-model="alumno.ano.value"
                          :rules="alumno.ano.rules"
                          inline
                          label="Año"
                        >
                          <v-radio
                            v-if="alumno.men.value"
                            v-for="(ano, iano) in props.menciones[alumno.men.value-1].ano"
                            :key="ano.id_ano"
                            :label="ano.nom_ano"
                            :value="iano+1"
                          />
                          <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención primero</span>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" sm="5">
                        <v-radio-group
                          v-model="alumno.sec.value"
                          :rules="alumno.sec.rules"
                          inline
                          label="Sección"
                        >
                          <v-radio
                            v-if="alumno.ano.value"
                            v-for="sec in props.menciones[alumno.men.value-1]?.ano[alumno.ano.value-1]?.sec"
                            :key="sec.id_ano"
                            :label="sec.sec_nom"
                            :value="sec.id_ano"
                          />
                          <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención primero</span>
                          <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención y un año primero</span>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-stepper-window-item>
                <v-stepper-window-item key="2" :value="2" v-else-if="step==2">
                  <v-card class="box-shadow-none" title="Ingresa los datos del estudiante" flat>
                    <v-divider></v-divider>
                    <v-row class="mt-2">
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="alumno.pnom.value"
                          label="Primer nombre"
                          :rules="alumno.pnom.rules"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="alumno.snom.value"
                          label="Segundo nombre"
                          :rules="alumno.snom.rules"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="alumno.pape.value"
                          label="Primer apellido"
                          :rules="alumno.pape.rules"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="alumno.sape.value"
                          label="Segundo apellido"
                          :rules="alumno.sape.rules"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="alumno.ced.value"
                          label="Cédula"
                          hint="Ej: V-12345678"
                          prefix="V-"
                          :rules="alumno.ced.rules"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-radio-group
                          v-model="alumno.sexo.value"
                          label="Sexo"
                          :rules="alumno.sexo.rules"
                          inline
                        >
                          <v-radio
                            label="F"
                            value="F"
                          />
                          <v-radio
                            label="M"
                            value="M"
                          />
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" sm="" md="4">
                        <v-text-field
                          v-model="alumno.fec.value"
                          label="Fecha de nacimiento"
                          type="date"
                          :rules="alumno.fec.rules"
                        />
                      </v-col>
                      <v-col cols="12" md="">
                        <v-text-field
                          v-model="alumno.obs.value"
                          label="Observaciones"
                          type="text"
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </v-stepper-window-item>
                <v-stepper-window-item key="3" :value="3" v-else-if="step==3">
                  <v-card title="Ingresa los datos del representante" flat>
                    <v-divider></v-divider>
                    <v-row class="mt-2">
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="cedRe.value"
                          label="Cédula"
                          hint="Ej: V-12345678"
                          prefix="V-"
                          :rules="cedRe.rules"
                        />
                      </v-col>
                      <v-divider></v-divider>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="representante.nomRe.value"
                          label="Nombre"
                          :rules="representante.nomRe.rules"
                          :disabled="disabled"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="representante.apeRe.value"
                          label="Apellido"
                          :rules="representante.apeRe.rules"
                          :disabled="disabled"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="alumno.paren.value"
                          label="Parentesco"
                          :rules="alumno.paren.rules"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="representante.tel.value"
                          label="Teléfono"
                          :rules="representante.tel.rules"
                          :disabled="disabled"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="representante.telRe.value"
                          label="Teléfono repuesto"
                          :rules="representante.telRe.rules"
                          :disabled="disabled"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="representante.dir.value"
                          label="Dirección"
                          :rules="representante.dir.rules"
                          :disabled="disabled"
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </v-stepper-window-item>
              </Transition>
            </v-stepper-window>
            <template #actions>
              <v-card-actions class="d-flex justify-space-around">
                <v-btn
                  text="Atrás"
                  prepend-icon="mdi-arrow-left"
                  :disabled="step==1"
                  @click="step--"
                />
                <v-btn
                  :loading="loading"
                  :append-icon="step == 3 ? 'mdi-check' : 'mdi-arrow-right'"
                  :text="step !== 3 ? 'Siguiente' : 'Agregar'"
                  :color="step == 3 ? 'primario' : ''"
                  @click="validacion"
                  :variant="step == 3 ? 'elevated' : 'text'"
                />
              </v-card-actions>
            </template>
          </v-stepper>
        </v-form>
      </v-sheet>
      <v-sheet v-else class="pa-md-3">
        <v-card
          title="Selecciona los datos del curso para agregar los estudiantes"
          flat
        >
          <v-form ref="formExcel" @submit.prevent>
            <v-container>
              <v-row class="mt-2" justify="space-around">
                <v-col cols="12">
                  <v-radio-group
                    v-model="curso.men.value"
                    :rules="curso.men.rules"
                    inline
                    label="Mención"
                  >
                    <v-radio
                      v-for="(menc, imenc) in props.menciones"
                      :key="menc.id_men"
                      :label="menc.men"
                      :value="imenc+1"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="7">
                  <v-radio-group
                    v-model="curso.ano.value"
                    :rules="curso.ano.rules"
                    inline
                    label="Año"
                  >
                    <v-radio
                      v-if="curso.men.value"
                      v-for="(ano, iano) in props.menciones[curso.men.value-1].ano"
                      :key="ano.id_ano"
                      :label="ano.nom_ano"
                      :value="iano+1"
                    />
                    <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención primero</span>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="5">
                  <v-radio-group
                    v-model="curso.sec.value"
                    :rules="curso.sec.rules"
                    inline
                    label="Sección"
                  >
                    <v-radio
                      v-if="curso.ano.value"
                      v-for="sec in props.menciones[curso.men.value-1]?.ano[curso.ano.value-1]?.sec"
                      :key="sec.id_ano"
                      :label="sec.sec_nom"
                      :value="sec.id_ano"
                    />
                    <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención primero</span>
                    <span class="medium-emphasis text-muted ml-2" v-else>Selecciona una mención y un año primero</span>
                  </v-radio-group>
                </v-col>
              </v-row>
              <EstudiantesExcel
                @estudiantes="estudiantes = $event"
              />
            </v-container>
            <v-card-actions>
              <v-btn
                block
                type="submit"
                text="Agregar estudiantes"
                color="primario"
                variant="elevated"
                prepend-icon="mdi-plus"
                :disabled="!estudiantes.length || !curso.sec.value"
                @click="guardarEstudiantes()"
              />
            </v-card-actions>
          </v-form>
        </v-card>
      </v-sheet>
    </v-card>
  </template>
</v-dialog>
</template>
<style>
#drop_zone {
  border: 5px solid blue;
  width: 200px;
  height: 100px;
}
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