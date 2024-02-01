<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatoFechaYHora } from '../funciones/funciones';
import AlertaMensaje from '../components/AlertaMensaje.vue';
import { brunaApi } from '../funciones/api.ts';

const alertaMsj = ref<string>('')
const periodo = ref({startF: '', endF: '', startS: '', endS: '', edit: false})
const modulos = ref([{
  id_mod: '',
  name_mod: '',
  timeStart: '',
  timeEnd: '',
  edit: false,
  nuevo: false
}])
onMounted(() => {
	cargaInicial();
});
const materias = ref([
  {
    id_mat: 1,
    title: 'Geografía',
    edit: false,
    active: true,
  },
  {
    id_mat: 2,
    title: 'Ingles',
    edit: false,
    active: true,
  },
  {
    id_mat: 0,
    title: 'Computación',
    edit: false,
    active: true,
  }
])
const menciones = ref([
  {
    id: 0,
    nom: 'Telemática',
    edit: false,
  },
  {
    id: 1,
    nom: 'Contabilidad',
    edit: false,
  },
  {
    id: 2,
    nom: 'Administración',
    edit: false,
  },
])
const cursos = ref([
  {id: 1, nom: 'Primero', edit: false},
  {id: 2, nom: 'Segundo', edit: false},
  {id: 3, nom: 'Tercero', edit: false},
  {id: 4, nom: 'Cuarto', edit: false},
  {id: 5, nom: 'Quinto', edit: false},
  {id: 6, nom: 'Sexto', edit: false},
])
function cargaInicial() {
  brunaApi({ s: 'informacion' }, '')
  .then((res:any) => {
    if (res.data) {
      periodo.value.startF = res.data[0].ano_oct_inf
      periodo.value.endF = res.data[0].ano_dic_inf
      periodo.value.startS = res.data[0].ano_ene_inf
      periodo.value.endS = res.data[0].ano_jul_inf
    } else {
      alertaMsj.value = "Hubo un error: " + res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error consultando los datos"
  })
  brunaApi({ s: 'horarios' }, '')
  .then((res:any) => {
    if (res.data) {
      let hor:any = []
      res.data.forEach((h: any) => {
        hor.push({
          id_mod: h.id_hor,
          name_mod: h.modulo_hor,
          timeStart: h.inicio_hor,
          timeEnd: h.fin_hor,
          edit: false,
          nuevo: false
        })
      })
      modulos.value = hor
    } else {
      alertaMsj.value = "Hubo un error: " + res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error consultando los datos"
  })
}
function AgregarMaterias() {
  materias.value.push({
    id_mat: materias.value.length+1,
    title: '',
    edit: true,
    active: true,
  })
}
function AgregarModulo() {
  modulos.value.push({
    id_mod: '0',
    name_mod: '',
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: true,
    nuevo: true,
  })
}
function AgregarMencion() {
  menciones.value.push({
    id: menciones.value.length+1,
    nom: '',
    edit: true,
  })
}
function AgregarCurso() {
  cursos.value.push({
    id: cursos.value.length+1,
    nom: '',
    edit: true,
  })
}
function guardaPeriodo() {
  brunaApi({ s: 'informacionGuardar' }, 'oct=' + periodo.value.startF + '&dic=' + periodo.value.endF + '&ene='
  + periodo.value.startS + '&jul=' + periodo.value.endS)
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = res.data.e
      periodo.value.edit = false
    } else {
      alertaMsj.value = "Hubo un error: " + res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error guardando los datos"
  })
}
function guardaModulo(id: any) {
  if (modulos.value[id].name_mod) {
    brunaApi({ s: 'horarioCrear' }, 'mod=' + modulos.value[id].name_mod + '&ini=' + modulos.value[id].timeStart + '&fin=' + modulos.value[id].timeEnd)
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = res.data.e
        modulos.value[id].edit = false
        modulos.value[id].nuevo = false
      } else {
        alertaMsj.value = "Hubo un error: " + res.data.e
      }
    }).catch(() => {
      alertaMsj.value = "Hubo un error guardando los datos"
    })
  } else {
    alertaMsj.value = "Rellene todos los campos"
  }
}
function editarModulo(id: any) {
  if (modulos.value[id].name_mod) {
    brunaApi({ s: 'editarHorario' }, 'mod=' + modulos.value[id].name_mod + '&ini=' + modulos.value[id].timeStart 
    + '&fin=' + modulos.value[id].timeEnd + '&id=' + modulos.value[id].id_mod)
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = res.data.e
        modulos.value[id].edit = false
      } else {
        alertaMsj.value = "Hubo un error: " + res.data.e
      }
    }).catch(() => {
      alertaMsj.value = "Hubo un error editando los datos"
    })
  } else {
    alertaMsj.value = "Rellene todos los campos"
  }
}
function eliminarModulo(id: any) {
  brunaApi({ s: 'horarioEliminar' }, 'id=' + modulos.value[id].id_mod)
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = res.data.e
      cargaInicial()
    } else {
      alertaMsj.value = "Hubo un error: " + res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error eliminando los datos"
  })
}
</script>
<template>
  <v-container>
    <AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
    <h2 class="flex-fill">Configuración</h2>
    <v-sheet color="transparent" class="d-flex flex-wrap align-start">
      <v-row class="mt-2">
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Estudiantes y periodo académico</p>
        </v-col>
        <v-col cols="12" sm="">
          <v-card title="Año académico" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                text="Subir un año"
                prepend-icon="mdi-human-handsup"
                color="secundario"
              />
            </template>
            <v-list-item title="Inicio y fin del año académico">
              <template v-if="periodo.edit">
                <v-row>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      label="Ingresa el inicio del periodo Oct-Dic"
                      type="date"
                      v-model="periodo.startF"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      label="Ingresa el fin del periodo Oct-Dic"
                      type="date"
                      v-model="periodo.endF"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      label="Ingresa el inicio del periodo Ene-Jul"
                      type="date"
                      v-model="periodo.startS"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      label="Ingresa el fin del periodo Ene-Jul"
                      type="date"
                      v-model="periodo.endS"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-list-item-title class="text-capitalize">{{ periodo.startF }} - {{ periodo.endF }}</v-list-item-title>
                <v-list-item-title class="text-capitalize">{{ periodo.startS }} - {{ periodo.endS }}</v-list-item-title>
              </template>
              <template #append>
                <v-btn flat :icon="periodo.edit ? 'mdi-cancel' : 'mdi-pen'" @click="periodo.edit = !periodo.edit" />
                <v-btn v-if="periodo.edit" flat icon="mdi-check" @click="guardaPeriodo" />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <!-- <v-col>
          <v-card title="Estudiantes" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-file-excel"
                text="Agregar estudiantes como excel"
                color="secundario"
              />
            </template>
            <v-list-item>
              Total de estudiantes: 650
            </v-list-item>
          </v-card>
        </v-col> -->
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Menciones y cursos/años de la institución</p>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card title="Menciones" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-account-school"
                text="Agregar mención"
                color="secundario"
                @click="AgregarMencion()"
              />
            </template>
            <v-list-item
              v-for="(men, m) in menciones"
              :key="m"
            >
            <template v-if="men.edit">
              <v-text-field
                v-model="men.nom"
                label="Nombre de la mención"
                variant="underlined"
                hide-details="auto"
              />
              </template>
              <template v-else>
                <v-list-item-title class="text-capitalize">{{ men.nom }}</v-list-item-title>
              </template>
              <template #append>
                <v-btn
                  variant="text"
                  :icon="men.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="men.edit = !men.edit"
                />
                <v-btn
                  variant="text"
                  icon="mdi-trash-can"
                  class="text-error"
                  @click="men.edit = !men.edit"
                />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="">
          <v-card title="Cursos" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-town-hall"
                text="Agregar curso"
                color="secundario"
                @click="AgregarCurso()"
              />
            </template>
            <div class="d-flex flex-wrap">
              <v-list-item
                v-for="(cur, a) in cursos"
                :key="a"
                class="flex-fill w-50"
              >
                <template v-if="cur.edit">
                  <v-text-field
                    v-model="cur.nom"
                    label="Titulo del curso"
                    variant="underlined"
                    hide-details="auto"
                  />
                </template>
                <template v-else>
                  <v-list-item-title class="text-capitalize">{{ cur.nom }}</v-list-item-title>
                </template>
                <template #append>
                  <v-btn
                    variant="text"
                    :icon="cur.edit ? 'mdi-check' : 'mdi-pen'"
                    @click="cur.edit = !cur.edit"
                  />
                  <v-btn
                    variant="text"
                    icon="mdi-trash-can"
                    class="text-error"
                    @click="cur.edit = !cur.edit"
                  />
                </template>
              </v-list-item>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Horarios y materias que se cursan</p>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card title="Módulos" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-store-clock"
                text="Agregar modulo"
                color="secundario"
                @click="AgregarModulo()"
              />
            </template>
            <v-list-item
              v-for="(modulo, m) in modulos"
              :key="m"
            >
              <template v-if="modulo.edit">
                <v-row>
                  <v-col cols="12" lg="">
                    <v-text-field
                      v-if="modulo.edit"
                      v-model="modulo.name_mod"
                      label="Modulo"
                      variant="underlined"
                      hide-details="auto"
                    />
                    <p v-else class="text-body">{{ modulo.name_mod }}</p>
                  </v-col>
                  <v-col cols="6" lg="">
                    <v-text-field
                      v-model="modulo.timeStart"
                      type="time"
                      label="De"
                      variant="underlined"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6" lg="">
                    <v-text-field
                      v-model="modulo.timeEnd"
                      type="time"
                      label="Hasta"
                      variant="underlined"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-list-item-title class="text-capitalize">{{ modulo.name_mod }}</v-list-item-title>
                <v-list-item-subtitle>{{ modulo.timeStart }} a {{ modulo.timeEnd }}</v-list-item-subtitle>
              </template>
              <template #append>
                <v-btn
                  v-if="modulo.nuevo"
                  variant="text"
                  :icon="modulo.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="modulo.edit ? guardaModulo(m) : modulo.edit = !modulo.edit"
                />
                <v-btn
                  v-else
                  variant="text"
                  :icon="modulo.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="modulo.edit ? editarModulo(m) : modulo.edit = !modulo.edit"
                />
                <v-btn
                  variant="text"
                  :icon="modulo.edit ? 'mdi-cancel' : 'mdi-trash-can'"
                  class="text-error"
                  @click="modulo.edit ? modulo.edit = !modulo.edit : eliminarModulo(m)"
                />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card title="Materias" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-book"
                text="Agregar materia"
                color="secundario"
                @click="AgregarMaterias()"
              />
            </template>
            <v-list-item
              v-for="(materia, m) in materias"
              :key="m"
            >
              <template v-if="materia.edit">
                <v-text-field
                  v-model="materia.title"
                  label="Nombre de la materia"
                  variant="underlined"
                  hide-details="auto"
                  :rules="[(v: string) => !!v || 'Escribe el nombre de la materia']"
                />
              </template>
              <template v-else>
                <v-list-item-title :class="['text-capitalize', {'text-muted' : !materia.active}]"> {{ materia.title }}</v-list-item-title>
              </template>
              <template #append>
                <v-btn
                  variant="text"
                  :disabled="!materia.active"
                  :icon="materia.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="materia.edit = !materia.edit"
                />
                <v-btn
                  variant="text"
                  :icon="materia.active ? 'mdi-circle' : 'mdi-minus-circle'"
                  :class="materia.active ? 'text-secundario' : 'text-muted'"
                  @click="materia.active = !materia.active, materia.edit = false"
                />
                <v-btn
                  variant="text"
                  icon="mdi-trash-can"
                  class="text-error"
                  @click="materia.edit = !materia.edit"
                />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>