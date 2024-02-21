<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatoFechaYHora } from '../funciones/funciones';
import AlertaMensaje from '../components/AlertaMensaje.vue';
import VentanaConfirmar from '../components/VentanaConfirmar.vue';
import { brunaApi } from '../funciones/api.ts';
import { Menciones, Modulos, Materias, Periodos } from '../types/interfaceTypes'

const alertaMsj = ref<string>('')
onMounted(() => {
	cargaInicial();
});

function cargaInicial() {
  editMen.value = false
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
  brunaApi({ s: 'menciones' }, '')
  .then((res:any) => {
    if (res.data) {
      const men:any = []
      res.data.forEach((m:any) => {
        if (!men[m.id_men]) {
          men[m.id_men] = {
            id_men: m.id_men,
            men: m.nom_men,
            edit: false,
            nuevo: false,
            ano: []
          }
        }
        if (!men[m.id_men].ano[m.num_ano]) {
          men[m.id_men].ano[m.num_ano] = {
            id_ano: m.id_ano,
            nom_ano: m.nom_ano,
            num_ano: m.num_ano,
            nuevo: false,
            sec: []
          }
        }
        if (!men[m.id_men].ano[m.num_ano].sec[m.id_ano]) {
          men[m.id_men].ano[m.num_ano].sec[m.id_ano] = {
            id_ano: m.id_ano,
            sec_nom: m.sec_ano,
            nuevo: false
          }
        }
      });
      res.data.forEach((m:any) => {
        if (men[m.id_men].ano[m.num_ano]) {
          men[m.id_men].ano[m.num_ano].sec = men[m.id_men].ano[m.num_ano].sec.filter((s:any) => s != null)
        }
      })
      res.data.forEach((m:any) => {
        men[m.id_men].ano = men[m.id_men].ano.filter((a:any) => a != null)
      })
      menciones.value = men.filter((m:any) => m != null)
    } else {
      alertaMsj.value = "Hubo un error: " + res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error consultando los datos"
  })
}
// SCRUM de periodo
const periodo = ref<Periodos>({startF: '', endF: '', startS: '', endS: '', edit: false})
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
// SCRUM de materias
const materias = ref<Materias[]>([])
function AgregarMaterias() {
  materias.value.push({
    id_mat: '0',
    title: '',
    edit: true,
    nuevo: true,
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
function limpiarMateria(m: any) {
  if (materias.value[m].nuevo) {
    materias.value.splice(m, 1)
  } else {
    cargaInicial()
  }
}
// SCRUM de módulos
const modulos = ref<Modulos[]>([])
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
function limpiarModulo(m: any) {
  if (modulos.value[m].nuevo) {
    modulos.value.splice(m, 1)
  } else {
    cargaInicial()
  }
}
// SCRUM de menciones
const menciones = ref<Menciones[]>([]);
const editMen = ref(false);
function AgregarMencion() {
  menciones.value.push({
    id_men: '0',
    men: '',
    edit: true,
    nuevo: true,
    ano: [
      {
        id_ano: '0',
        nom_ano: 'Primero',
        num_ano: '1',
        nuevo: true,
        sec: [
          {
            id_ano: '1',
            sec_nom: 'A',
            nuevo: true
          }
        ]
      }
    ]
  })
}
function guardarMencion(m:any) {
  const datosApi:any = []
  if (m.men) {
    datosApi.push({
      id_men: m.id_men,
      nom_men: m.men,
      abre_men: m.men.substring(0,1),
      nuevo: true,
      ano: m.ano
    })
    eliminarMencion(m.id_men)
  } else {
    alertaMsj.value = "Rellena todos los campos"
  }
  if (datosApi.length) {
    brunaApi({ s: 'mencionCrear' }, JSON.stringify(datosApi))
    .then((res:any) => {
      if (res.data.r) {
        cargaInicial()
      } else {
        alertaMsj.value = "Hubo un error: " + res.data.e
      }
    }).catch(() => {
      alertaMsj.value = "Hubo un error agregando los datos"
    })
  }
}
function eliminarMencion(id: any) {
  brunaApi({ s: 'mencionEliminar' }, 'id=' + id )
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
function limpiarMencion(m: any) {
  if (menciones.value[m].nuevo) {
    menciones.value.splice(m, 1)
  } else {
    cargaInicial()
  }
}
// SCRUM de años
function agregarAno(menId: any) {
  menciones.value[Number(menId)].ano.push({
    id_ano: '0',
    nom_ano: 'Primero',
    num_ano: '1',
    nuevo: true,
    sec: [
      {
        id_ano: '1',
        sec_nom: 'A',
        nuevo: true,
      }
    ]
  })
}
function eliminarAno(id: any, men:any) {
  brunaApi({ s: 'anoEliminar' }, 'id=' + id + '&men=' + men)
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
// SCRUM de seccion
function agregarSeccion(menId:any, anoId: any) {
  menciones.value[Number(menId)].ano[Number(anoId)].sec.push({
    id_ano: '1',
    sec_nom: 'A',
    nuevo: true
  })
}
function eliminarSeccion(idSec: any) {
  // menciones.value[men].ano[ano].sec.splice(sec, 1)
  brunaApi({ s: 'seccionEliminar' }, 'id=' + idSec)
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
            <p v-if="editMen" class="text-center text-medium-emphasis">Solo puedes editar una mención a la vez</p>
            <v-list-item
              v-for="(men, m) in menciones"
              :key="men.id_men"
              class="justify-start"
            >
              <div class="float-right mt-3">
                <v-btn
                  :variant="men.edit ? 'tonal': 'text'"
                  :color="men.edit ? 'primario': ''"
                  :prepend-icon="men.edit ? 'mdi-check' : 'mdi-pen'"
                  :text="men.edit ? 'Guardar' : 'Editar'"
                  :disabled="editMen && !men.edit"
                  @click="men.edit ? guardarMencion(men) : (men.edit = !men.edit, editMen = true)"
                />
                <v-btn
                  variant="text"
                  :prepend-icon="men.edit ? 'mdi-cancel' : 'mdi-trash-can'"
                  :disabled="editMen && !men.edit"
                  class="text-error"
                  @click="men.edit ? (limpiarMencion(m), editMen = false) : ''"
                >
                  <span>{{ men.edit ? 'Cancelar' : 'Eliminar' }}</span>
                  <VentanaConfirmar
                    v-if="!men.edit"
                    :message="'desea eliminar esta mención'"
                    icon="mdi-trash-can"
                    @confirmar="(e) => { e ? eliminarMencion(men.id_men) : '' }"
                  />
                </v-btn>
              </div>
              <template v-if="men.edit">
                <v-sheet class="d-flex align-center mb-3 mx-auto px-4 py-2" rounded="sm">
                  <v-text-field
                    v-model="men.men"
                    label="Nombre de la mención"
                    variant="underlined"
                    hide-details="auto"
                    class="flex-fill"
                  />
                  <v-btn variant="text" text="Agregar año" prepend-icon="mdi-plus" class="ml-4" @click="agregarAno(m)" />
                </v-sheet>
                <template v-for="(anos, a) in men.ano" :key="anos.id_ano">
                  <v-sheet class="d-flex justify-space-between align-center" color="muted">
                    <v-row no-gutters>
                      <v-col cols="2">
                        <v-text-field
                          v-model="anos.num_ano"
                          prefix="#"
                          type="number"
                          hide-details="auto"
                        />
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="anos.nom_ano"
                          label="Nombre del año"
                          hide-details="auto"
                          class="flex-1-1"
                          />
                      </v-col>
                    </v-row>
                    <div>
                      <v-btn
                        variant="text"
                        prepend-icon="mdi-trash-can"
                      >
                        Eliminar año
                        <VentanaConfirmar
                          :message="'desea eliminar este año'"
                          icon="mdi-trash-can"
                          @confirmar="(e) => { e ? eliminarAno(anos.nom_ano, men.id_men) : '' }"
                        />
                      </v-btn>
                    </div>
                  </v-sheet>
                  <v-row no-gutters>
                    <v-col cols="12" class="d-flex align-center">
                      <p class="flex-fill">Secciones</p>
                      <v-btn
                        variant="text"
                        text="Agregar sección"
                        prepend-icon="mdi-plus"
                        @click="agregarSeccion(m, a)"
                      />
                    </v-col>
                    <v-col>
                      <v-row>
                        <template v-for="(secs) in anos.sec" :key="secs.id_ano">
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="secs.sec_nom"
                              label="Nombre"
                              hide-details="auto"
                            >
                              <template #append>
                                <v-btn
                                  variant="text"
                                  color="text-error"
                                >
                                  <v-icon icon="mdi-trash-can"  size="x-large" />
                                  <VentanaConfirmar
                                    :message="'desea eliminar esta sección'"
                                    icon="mdi-trash-can"
                                    @confirmar="(e) => { e ? eliminarSeccion(secs.id_ano) : '' }"
                                  />
                                </v-btn>
                              </template>
                            </v-text-field>
                          </v-col>
                        </template>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-2 mt-1" />
                </template>
              </template>
              <template v-else>
                <div>
                  <v-list-item-title class="text-capitalize">{{ men.men }}</v-list-item-title>
                  <p>Cantidad de cursos: {{ Object.keys(men.ano).length }}</p>
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
                  class="text-error"
                  @click="modulo.edit ? limpiarModulo(m) : ''"
                >
                  <v-icon :icon="modulo.edit ? 'mdi-cancel' : 'mdi-trash-can'"  size="x-large"/>
                  <VentanaConfirmar
                    v-if="!modulo.edit"
                    :message="'desea eliminar este módulo'"
                    icon="mdi-trash-can"
                    @confirmar="(e) => { e ? eliminarModulo(m) : '' }"
                  />
                </v-btn>
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
                  class="text-error"
                  @click="materia.edit ? limpiarMateria(m) : ''"
                >
                  <v-icon :icon="materia.edit ? 'mdi-cancel' : 'mdi-trash-can'"  size="x-large"/>
                  <VentanaConfirmar
                    v-if="!materia.edit"
                    :message="'desea eliminar esta materia'"
                    icon="mdi-trash-can"
                    @confirmar="(e) => { e ? eliminarMateria(m) : '' }"
                  />
                </v-btn>
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