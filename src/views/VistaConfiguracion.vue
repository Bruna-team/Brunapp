<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatoFechaYHora } from '../funciones/funciones';
import AlertaMensaje from '../components/AlertaMensaje.vue';
import { brunaApi } from '../funciones/api.ts';
import { Menciones } from '../types/interfaceTypes';

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
    id_mat: '',
    title: '',
    edit: false,
    nuevo: false,
  }
])

const menciones = ref<Menciones[]>([
  {
    id_men: '1',
    men: 'Telematica',
    edit: false,
    ano: [
      {
        id_ano: '1',
        nom_ano: 'Primero',
        num_ano: '1',
        sec: [
          {
            id_ano: '1',
            sec_nom: 'A',
            num_sec: '1'
          }
        ]
      },
      {
        id_ano: '2',
        nom_ano: 'Segundo',
        num_ano: '2',
        sec: [
          {
            id_ano: '1',
            sec_nom: 'A',
            num_sec: '1'
          }
        ]
      }
    ]
  },
  {
    id_men: '1',
    men: 'Administración',
    edit: false,
    ano: [
      {
        id_ano: '1',
        nom_ano: 'primero',
        num_ano: '1',
        sec: [
          {
            id_ano: '1',
            sec_nom: 'A',
            num_sec: '1'
          }
        ]
      }
    ]
  },
  {
    id_men: '1',
    men: 'Contabilidad',
    edit: false,
    ano: [
      {
        id_ano: '1',
        nom_ano: 'primero',
        num_ano: '1',
        sec: [
          {
            id_ano: '1',
            sec_nom: 'A',
            num_sec: '1'
          }
        ]
      }
    ]
  }
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
  brunaApi({ s: 'materias' }, '')
  .then((res:any) => {
    if (res.data) {
      let mat:any = []
      res.data.forEach((h: any) => {
        mat.push({
          id_mat: h.id_mat,
          title: h.nom_mat,
          edit: false,
          nuevo: false
        })
      })
      materias.value = mat
    } else {
      alertaMsj.value = "Hubo un error: " + res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error consultando los datos"
  })
}
function AgregarMaterias() {
  materias.value.push({
    id_mat: '0',
    title: '',
    edit: true,
    nuevo: true,
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
    id_men: (menciones.value.length+1).toString(),
    men: '',
    edit: true,
    ano: [
      {
        id_ano: '0',
        nom_ano: 'Primero',
        num_ano: '1',
        sec: [
          {
            id_ano: '1',
            sec_nom: 'A',
            num_sec: '1'
          }
        ]
      }
    ]
  })
}
function agregarSeccion(menId:string, anoId: string) {
  menciones.value[Number(menId)].ano[Number(anoId)].sec.push({
    id_ano: '1',
    sec_nom: 'A',
    num_sec: '1'
  })
}
function agregarAno(menId: string) {
  menciones.value[Number(menId)].ano.push({
    id_ano: '0',
    nom_ano: 'Primero',
    num_ano: '1',
    sec: [
      {
        id_ano: '1',
        sec_nom: 'A',
        num_sec: '1'
      }
    ]
  })
}
function limpiarMateria(m: any) {
  if (materias.value[m].nuevo) {
    materias.value.splice(m, 1)
  } else {
    cargaInicial()
  }
}
function limpiarModulo(m: any) {
  if (modulos.value[m].nuevo) {
    modulos.value.splice(m, 1)
  } else {
    cargaInicial()
  }
}
function limpiarPeriodo() {
  periodo.value.edit = false
  cargaInicial()
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
        cargaInicial()
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
function guardarMateria(id: any) {
  if (materias.value[id].title) {
    brunaApi({ s: 'materiasCrear' }, 'mat=' + materias.value[id].title)
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = res.data.e
        cargaInicial()
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
function editarMateria(id: any) {
  if (materias.value[id].title) {
    brunaApi({ s: 'materiaEditar' }, 'mat=' + materias.value[id].title + '&id=' + materias.value[id].id_mat)
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = res.data.e
        materias.value[id].edit = false
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
function eliminarMateria(id: any) {
  brunaApi({ s: 'materiaEliminar' }, 'id=' + materias.value[id].id_mat)
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
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      label="Ingresa el inicio del periodo Oct-Dic"
                      type="date"
                      v-model="periodo.startF"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      label="Ingresa el fin del periodo Oct-Dic"
                      type="date"
                      v-model="periodo.endF"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      label="Ingresa el inicio del periodo Ene-Jul"
                      type="date"
                      v-model="periodo.startS"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
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
                <v-list-item-title class="text-capitalize">
                  <p class="text-caption text-medium-emphasis">
                    Octubre - Diciembre
                  </p>
                  {{ periodo.startF }} - {{ periodo.endF }}
                  <p class="text-caption text-medium-emphasis">
                    Enero - Julio
                  </p>
                  {{ periodo.startS }} - {{ periodo.endS }}
                </v-list-item-title>
              </template>
              <template #append>
                <v-btn flat :icon="periodo.edit ? 'mdi-cancel' : 'mdi-pen'" @click="periodo.edit ? limpiarPeriodo() : periodo.edit = !periodo.edit" />
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
        <v-col cols="12">
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
              v-for="men in menciones"
              :key="men.id_men"
              class="justify-start"
            >
              <div class="float-right">
                <v-btn
                  variant="text"
                  :prepend-icon="men.edit ? 'mdi-check' : 'mdi-pen'"
                  :text="men.edit ? 'Guardar' : 'Editar'"
                  @click="men.edit = !men.edit"
                />
                <v-btn
                  variant="text"
                  :prepend-icon="men.edit ? 'mdi-cancel' : 'mdi-trash-can'"
                  :text="men.edit ? 'Cancelar' : 'Eliminar'"
                  class="text-error"
                  @click="men.edit = !men.edit"
                />
              </div>
              <template v-if="men.edit">
                <v-sheet class="d-flex align-center mb-3 mx-auto px-4 py-2" max-width="350px" color="muted" rounded="sm">
                  <v-text-field
                    v-model="men.men"
                    label="Nombre de la mención"
                    variant="underlined"
                    hide-details="auto"
                  />
                  <v-btn variant="tonal" text="+ año" class="ml-4" @click="agregarAno(men.id_men)" />
                </v-sheet>
                <template v-for="anos in men.ano" :key="anos.id_ano">
                  <v-row class="d-flex">
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="anos.nom_ano"
                        label="Cantidad de años o cursos"
                        hide-details="auto"
                      />
                    </v-col>
                    <v-col>
                      <v-row>
                        <template v-for="secs in anos.sec">
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="secs.sec_nom"
                              label="Cantidad de años o cursos"
                              hide-details="auto"
                            />
                          </v-col>
                        </template>
                      </v-row>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn variant="tonal" text="+ sección" @click="agregarSeccion(men.id_men, anos.id_ano)" />
                    </v-col>
                  </v-row>
                </template>
              </template>
              <template v-else>
                <div>
                  <v-list-item-title class="text-capitalize">{{ men.men }}</v-list-item-title>
                  <p>Cantidad de cursos: {{ men.ano.length }}</p>
                </div>
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Horarios y materias que se cursan</p>
        </v-col>
        <v-col cols="12" sm="7">
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
                  @click="modulo.edit ? limpiarModulo(m) : eliminarModulo(m)"
                />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="5">
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
                <v-list-item-title class="text-capitalize"> {{ materia.title }}</v-list-item-title>
              </template>
              <template #append>
                <v-btn
                  v-if="materia.nuevo"
                  variant="text"
                  :icon="materia.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="materia.edit ? guardarMateria(m) : materia.edit = !materia.edit"
                />
                <v-btn
                  v-else
                  variant="text"
                  :icon="materia.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="materia.edit ? editarMateria(m) : materia.edit = !materia.edit"
                />
                <v-btn
                  variant="text"
                  :icon="materia.edit ? 'mdi-cancel' : 'mdi-trash-can'"
                  class="text-error"
                  @click="materia.edit ? limpiarMateria(m) : eliminarMateria(m)"
                />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<style>
.grid-column {
  display: grid;
  grid-template-areas:
  'column-first column-second column-second column-second'
}
.column-first { grid-area: column-first;}
.column-second { grid-area: column-second;}
</style>