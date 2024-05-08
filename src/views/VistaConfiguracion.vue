<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatoFechaYHora } from '@/funciones/funciones';
import AlertaMensaje from '@/components/AlertaMensaje.vue';
import VentanaConfirmar from '@/components/VentanaConfirmar.vue';
import AgregarEstudiante from '@/components/AgregarEstudiante.vue'
import { brunaApi } from '@/funciones/api.ts';
import { Menciones, Modulos, Materias, Periodos } from '@/types/interfaceTypes'

const alertaMsj = ref<string>('')
onMounted(() => {
	cargaInicial();
});

function cargaInicial() {
  editMen.value = false
  brunaApi({ s: 'totalEstudiantes' }, '')
  .then((res:any) => {
    if (res.data) {
      totalEstudiantes.value = res.data
    } else {
      alertaMsj.value = "No se pudo consultar los estudiantes"
    }
  }).catch(() => {
    alertaMsj.value = "Asigna una fecha de inicio y cierre de año escolar"
  })
  brunaApi({ s: 'informacion' }, '')
  .then((res:any) => {
    if (res.data) {
      periodo.value.startF = res.data[0].ano_oct_inf
      periodo.value.endF = res.data[0].ano_dic_inf
      periodo.value.startS = res.data[0].ano_ene_inf
      periodo.value.endS = res.data[0].ano_jul_inf
    } else {
      alertaMsj.value = "Asigna una fecha de inicio y cierre de año escolar"
    }
  }).catch(() => {
    alertaMsj.value = "Asigna una fecha de inicio y cierre de año escolar"
  })
  brunaApi({ s: 'horarios' }, '')
  .then((res:any) => {
    if (res.data) {
      let hor:any = []
      res.data.forEach((h: any) => {
        hor.push({
          id_hor: h.id_hor,
          modulo_hor: h.modulo_hor,
          inicio_hor: h.inicio_hor,
          fin_hor: h.fin_hor,
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
          nom_mat: h.nom_mat,
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
      const men:any = {}
      res.data.forEach((m:any) => {
        if (!men[m.id_men]) {
          men[m.id_men] = {
            id_men: m.id_men,
            men: m.nom_men,
            edit: false,
            nuevo: false,
            ano: {}
          }
        }
        if (!men[m.id_men].ano[m.num_ano]) {
          men[m.id_men].ano[m.num_ano] = {
            id_ano: m.id_ano,
            nom_ano: m.nom_ano,
            num_ano: m.num_ano,
            nuevo: false,
            sec: {}
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
      // res.data.forEach((m:any) => {
      //   if (men[m.id_men].ano[m.num_ano]) {
      //     men[m.id_men].ano[m.num_ano].sec = men[m.id_men].ano[m.num_ano].sec.filter((s:any) => s != null)
      //   }
      // })
      // console.log('2')
      // console.log(men)
      // res.data.forEach((m:any) => {
      //   men[m.id_men].ano = men[m.id_men].ano.filter((a:any) => a != null)
      // })
      // console.log('3')
      // console.log(men)
      menciones.value = men
    } else {
      alertaMsj.value = "Hubo un error: " + res.data.e
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error consultando los datos"
  })
}
// Variable de estudiantes
const totalEstudiantes = ref('')
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
    nom_mat: '',
    edit: true,
    nuevo: true,
  })
}
function guardarMateria(id: any) {
  if (materias.value[id].nom_mat) {
    brunaApi({ s: 'materiasCrear' }, 'mat=' + materias.value[id].nom_mat)
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
  if (materias.value[id].nom_mat) {
    brunaApi({ s: 'materiaEditar' }, 'mat=' + materias.value[id].nom_mat + '&id=' + materias.value[id].id_mat)
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
    id_hor: '0',
    modulo_hor: '',
    inicio_hor: formatoFechaYHora(new Date(), 'hora'),
    fin_hor: formatoFechaYHora(new Date(), 'hora'),
    edit: true,
    nuevo: true,
  })
}
function guardaModulo(id: any) {
  if (modulos.value[id].modulo_hor) {
    brunaApi({ s: 'horarioCrear' }, 'mod=' + modulos.value[id].modulo_hor + '&ini=' + modulos.value[id].inicio_hor + '&fin=' + modulos.value[id].fin_hor)
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
  if (modulos.value[id].modulo_hor) {
    brunaApi({ s: 'editarHorario' }, 'mod=' + modulos.value[id].modulo_hor + '&ini=' + modulos.value[id].inicio_hor
    + '&fin=' + modulos.value[id].fin_hor + '&id=' + modulos.value[id].id_hor)
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
  brunaApi({ s: 'horarioEliminar' }, 'id=' + modulos.value[id].id_hor)
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
  const datosEditarApi:any = []
  if (m.men) {
    if(m.nuevo) {
      datosApi.push({
        id_men: m.id_men,
        nom_men: m.men,
        abre_men: m.men.substring(0,1),
        nuevo: true,
        ano: m.ano
      })
    } else {
      m.ano.forEach((a:any) => {
        if (a.nuevo) {
          if (!datosApi[0]) {
            datosApi.push({
              id_men: m.id_men,
              ano: []
            })
          }
          datosApi[0].ano.push(a)
        } else {
          a.sec.forEach((s:any) => {
            if (s.nuevo) {
              if (!datosApi[0]) {
                datosApi.push({
                  id_men: m.id_men,
                  ano: []
                })
              }
              datosApi[0].ano.push({
                nom_ano: a.nom_ano,
                num_ano: a.num_ano,
                sec: []
              })
              datosApi[0].ano[datosApi[0].ano.length-1].sec.push(s)
            } else {
              datosEditarApi.push({
                id_men: m.id_men,
                nom_men: m.men,
                abre_men: m.men.substring(0,1),
                nom_ano: a.nom_ano,
                num_ano: a.num_ano,
                id_ano: s.id_ano,
                sec_ano: s.sec_nom
              })
            }
          })
        }
      })
    }
  } else {
    alertaMsj.value = "Por favor, llena todos los campos"
  }
  if (datosApi.length) {
    brunaApi({ s: 'mencionCrear' }, JSON.stringify(datosApi))
    .then((res:any) => {
      if (res.data.r) {
        cargaInicial()
        alertaMsj.value = res.data.e
      } else {
        alertaMsj.value = "Hubo un error: " + res.data.e
      }
    }).catch(() => {
      alertaMsj.value = "Hubo un error agregando los datos"
    })
  }
  if (datosEditarApi.length) {
    brunaApi({ s: 'mencionEditar' }, JSON.stringify(datosEditarApi))
    .then((res:any) => {
      if (res.data.r) {
        cargaInicial()
        alertaMsj.value = res.data.e
      } else {
        alertaMsj.value = "Hubo un error: " + res.data.e
      }
    }).catch(() => {
      alertaMsj.value = "Hubo un error agregando los datos"
    })
  }
}
function eliminarMencion(id: any, m: any) {
  brunaApi({ s: 'mencionEliminar' }, 'id=' + id )
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = res.data.e
      menciones.value.splice(m, 1)
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
function eliminarAno(id: any, men:any, m: any,  a: any) {
  brunaApi({ s: 'anoEliminar' }, 'id=' + id + '&men=' + men)
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = res.data.e
      menciones.value[m].ano.splice(a, 1)
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
function eliminarSeccion(idSec: any, m: any,  a: any, s: any) {
  brunaApi({ s: 'seccionEliminar' }, 'id=' + idSec)
  .then((res:any) => {
    if (res.data.r) {
      alertaMsj.value = res.data.e
      menciones.value[m].ano[a].sec.splice(s, 1)
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
    <div>
      <h2 class="d-inline">
        Configuración
      </h2>
      <v-btn
        prepend-icon="mdi-download"
        variant=tonal
        class="float-right"
        @click.prepend
        >
        <a
          href="https://drive.google.com/file/d/1vzYjx_U2skRZ3wCfDBN1WXLEwtTJV21L/view?usp=sharing"
          download="Manual de usuario BRUNA.pdf"
        >
          Descargar manual
        </a>
      </v-btn>
    </div>
    <v-sheet color="transparent" class="d-flex flex-wrap align-start">
      <v-row class="mt-2">
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Periodo académico y estudiantes cursantes</p>
        </v-col>
        <v-col cols="12" sm="">
          <v-card class="pb-3">
            <v-row no-gutters justify="center" align="center">
              <v-col cols="">
                <v-card-title>
                  Periodo
                </v-card-title>
              </v-col>
              <v-col cols="auto" :class="['order-sm-1', {'d-flex flex-column d-sm-block': periodo.edit}]">
                <v-btn
                  variant="text"
                  :prepend-icon="periodo.edit ? 'mdi-close' : 'mdi-pen'"
                  @click="periodo.edit ? limpiarPeriodo() : periodo.edit = !periodo.edit"
                >
                  <span class="d-none d-sm-inline">
                   {{ periodo.edit ? 'Cancelar' : ''}}
                  </span>
                  {{ periodo.edit ? '' : 'Editar'}}
                </v-btn>
                <v-btn
                  v-if="periodo.edit"
                  variant="tonal"
                  prepend-icon="mdi-check"
                  color="primario"
                  @click="guardaPeriodo"
                >
                  <span class="d-none d-sm-inline">
                   Guardar
                  </span>
                </v-btn>
              </v-col>
              <v-col
                v-if="!periodo.edit"
                cols="12" sm="auto"
                class="text-center"
              >
                <v-btn
                  variant="text"
                  prepend-icon="mdi-human-handsup"
                  color="secundario"
                >
                  Subir un año
                  <VentanaConfirmar
                    :message="'desea subir un año del periodo'"
                    :subtitle="'Al realizar esta operación todos los alumnos aumentaran un año'"
                    icon="mdi-human-handsup"
                    btnicon="mdi-check"
                    color-btn="primario"
                    @confirmar="(e) => { e ? console.log('aumento') : '' }"
                  />
                </v-btn>
              </v-col>
            </v-row>
            <v-list-item>
              <v-list-item-title>
                Inicio y fin del año académico
              </v-list-item-title>
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
                <div class="text-capitalize">
                  <p class="text-caption text-medium-emphasis">
                    Octubre - Diciembre
                  </p>
                  {{ periodo.startF }} - {{ periodo.endF }}
                  <p class="text-caption text-medium-emphasis">
                    Enero - Julio
                  </p>
                  {{ periodo.startS }} - {{ periodo.endS }}
                </div>
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="pb-3">
            <v-row no-gutters justify="center" align="center">
              <v-col>
                <v-card-title>
                  Estudiantes
                </v-card-title>
              </v-col>
              <v-col cols="auto">
                <AgregarEstudiante
                  :menciones="menciones"
                  :variant="true"
                  :excel-mode="true"
                  :classBtn="'ml-2'"
                  @recargar="cargaInicial"
                  @alerta="alertaMsj = $event"
                />
              </v-col>
              <v-col cols="auto">
                <AgregarEstudiante
                  :menciones="menciones"
                  :variant="true"
                  :classBtn="'ml-2'"
                  @recargar="cargaInicial"
                  @alerta="alertaMsj = $event"
                />
              </v-col>
            </v-row>
            <v-list-item>
              <p class="text-caption text-medium-emphasis">
                Total de estudiantes
              </p>
              {{ totalEstudiantes }}
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Menciones y cursos/años de la institución</p>
        </v-col>
        <v-col cols="12">
          <v-card class="pb-3">
            <div class="d-flex align-center justify-space-between">
              <v-card-title>
                Menciones
              </v-card-title>
              <v-btn
                variant="text"
                prepend-icon="mdi-account-school"
                text="Agregar"
                color="secundario"
                @click="AgregarMencion()"
              />
            </div>
            <p v-if="editMen" class="text-center text-medium-emphasis">Solo puedes editar una mención a la vez</p>
            <v-list-item
              v-for="(men, m) in menciones"
              :key="men.id_men"
              class="justify-start"
            >
              <div :class="['d-sm-flex', {'flex-column': men.edit}]">
                <div v-if="!men.edit" class="flex-fill">
                  <v-list-item-title class="text-capitalize">{{ men.men }}</v-list-item-title>
                  <p>Cantidad de cursos: {{ Object.keys(men.ano).length }}</p>
                </div>
                <div class="mt-3 text-center">
                  <v-btn
                    :variant="men.edit ? 'elevated': 'text'"
                    :color="men.edit ? 'primario': ''"
                    :prepend-icon="men.edit ? 'mdi-check' : 'mdi-pen'"
                    :text="men.edit ? 'Guardar' : ''"
                    :disabled="editMen && !men.edit"
                    @click="men.edit ? guardarMencion(men) : (men.edit = !men.edit, editMen = true)"
                  />
                  <v-btn
                    variant="plain"
                    class="text-error"
                    :prepend-icon="men.edit ? 'mdi-close' : 'mdi-trash-can'"
                    :disabled="editMen && !men.edit"
                    @click="men.edit ? (limpiarMencion(m), editMen = false) : ''"
                  >
                    <span>{{ men.edit ? 'Cancelar' : '' }}</span>
                    <VentanaConfirmar
                      v-if="!men.edit"
                      :message="'desea eliminar esta mención'"
                      :subtitle="'Al realizar esta operación se perderán los estudiantes relacionados con esta mención'"
                      icon="mdi-alert"
                      btnicon="mdi-trash-can"
                      @confirmar="(e) => { e ? eliminarMencion(men.id_men, m) : '' }"
                    />
                  </v-btn>
                </div>
                <div v-if="men.edit">
                  <v-sheet class="d-sm-flex align-center mb-3 mx-auto px-sm-4 py-2 text-center" rounded="sm">
                    <v-text-field
                      v-model="men.men"
                      label="Nombre de la mención"
                      variant="underlined"
                      hide-details="auto"
                      class="flex-fill"
                    />
                    <v-btn
                      variant="text"
                      text="Agregar año"
                      prepend-icon="mdi-plus"
                      class="ml-sm-4"
                      @click="agregarAno(m)"
                    />
                  </v-sheet>
                  <template v-for="(anos, a) in men.ano" :key="anos.id_ano">
                    <v-sheet class="d-sm-flex justify-space-between align-center" color="muted">
                      <v-row no-gutters>
                        <v-col cols="3" sm="2">
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
                            class="flex-1-1 text-field-pa-0"
                          >
                          <template #append-inner>
                            <v-btn
                              variant="plain"
                              class="text-error"
                            >
                              <v-icon icon="mdi-trash-can" />
                              <VentanaConfirmar
                                :message="'desea eliminar este año'"
                                :subtitle="'Al realizar esta operación se perderán los estudiantes relacionados con este año'"
                                btnicon="mdi-trash-can"
                                icon="mdi-alert"
                                @confirmar="(e) => { e ? eliminarAno(anos.nom_ano, men.id_men, m, a) : '' }"
                              />
                            </v-btn>
                          </template>
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-sheet>
                    <v-row no-gutters>
                      <v-col cols="12" class="d-flex align-center">
                        <p class="flex-fill">Secciones</p>
                        <v-btn
                          variant="text"
                          text="Agregar"
                          prepend-icon="mdi-plus"
                          @click="agregarSeccion(m, a)"
                        />
                      </v-col>
                      <v-col>
                        <v-row>
                          <template v-for="(secs, s) in anos.sec" :key="secs.id_ano">
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field
                                v-model="secs.sec_nom"
                                label="Nombre"
                                hide-details="auto"
                                class="text-field__append-ma-0"
                              >
                                <template #append>
                                  <v-btn
                                    variant="plain"
                                    class="text-error"
                                  >
                                    <v-icon icon="mdi-trash-can"  size="large" />
                                    <VentanaConfirmar
                                      :message="'desea eliminar esta sección'"
                                      :subtitle="'Al realizar esta operación se perderán los estudiantes relacionados con esta sección'"
                                      btnicon="mdi-trash-can"
                                      icon="mdi-alert"
                                      @confirmar="(e) => { e ? eliminarSeccion(secs.id_ano, m, a, s) : '' }"
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
                </div>
              </div>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Horarios y materias que se cursan</p>
        </v-col>
        <v-col cols="12" sm="6" md="7">
          <v-card class="pb-3">
            <div class="d-flex align-center justify-space-between">
              <v-card-title>
                Módulos
              </v-card-title>
              <v-btn
                variant="text"
                prepend-icon="mdi-store-clock"
                text="Agregar"
                color="secundario"
                @click="AgregarModulo()"
              />
            </div>
            <v-list-item
              v-for="(modulo, m) in modulos"
              :key="m"
            >
              <template v-if="modulo.edit">
                <v-row>
                  <v-col cols="12" lg="">
                    <v-text-field
                      v-if="modulo.edit"
                      v-model="modulo.modulo_hor"
                      label="Modulo"
                      variant="underlined"
                      hide-details="auto"
                    />
                    <p v-else class="text-body">{{ modulo.modulo_hor }}</p>
                  </v-col>
                  <v-col cols="6" lg="">
                    <v-text-field
                      v-model="modulo.inicio_hor"
                      type="time"
                      label="De"
                      variant="underlined"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6" lg="">
                    <v-text-field
                      v-model="modulo.fin_hor"
                      type="time"
                      label="Hasta"
                      variant="underlined"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-list-item-title class="text-capitalize">{{ modulo.modulo_hor }}</v-list-item-title>
                <v-list-item-subtitle>{{ modulo.inicio_hor }} a {{ modulo.fin_hor }}</v-list-item-subtitle>
              </template>
              <template #append>
                <div :class="{'d-flex flex-column align-center': modulo.edit}">
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
                    variant="plain"
                    class="text-error"
                    @click="modulo.edit ? limpiarModulo(m) : ''"
                  >
                    <v-icon :icon="modulo.edit ? 'mdi-close' : 'mdi-trash-can'"  size="x-large"/>
                    <VentanaConfirmar
                      v-if="!modulo.edit"
                      :message="'desea eliminar este módulo'"
                      btnicon="mdi-trash-can"
                      @confirmar="(e) => { e ? eliminarModulo(m) : '' }"
                    />
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="5">
          <v-card class="pb-3">
            <div class="d-flex align-center justify-space-between">
              <v-card-title>
                Materias
              </v-card-title>
              <v-btn
                variant="text"
                prepend-icon="mdi-book"
                text="Agregar"
                color="secundario"
                @click="AgregarMaterias()"
              />
            </div>
            <v-list-item
              v-for="(materia, m) in materias"
              :key="m"
            >
              <template v-if="materia.edit">
                <v-text-field
                  v-model="materia.nom_mat"
                  label="Nombre de la materia"
                  variant="underlined"
                  hide-details="auto"
                  :rules="[(v: string) => !!v || 'Escribe el nombre de la materia']"
                />
              </template>
              <template v-else>
                <v-list-item-title class="text-capitalize"> {{ materia.nom_mat }}</v-list-item-title>
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
                  variant="plain"
                  class="text-error"
                  @click="materia.edit ? limpiarMateria(m) : ''"
                >
                  <v-icon
                    :icon="materia.edit ? 'mdi-close' : 'mdi-trash-can'"
                    size="x-large"
                  />
                  <VentanaConfirmar
                    v-if="!materia.edit"
                    :message="'desea eliminar esta materia'"
                    btnicon="mdi-trash-can"
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
.text-field__append-ma-0 {
  .v-input__append {
    margin: 0;
  }
}
.text-field-pa-0 {
  .v-field {
    padding: 0;
  }
}
.grid-column {
  display: grid;
  grid-template-areas:
  'column-first column-second column-second column-second'
}
.column-first { grid-area: column-first;}
.column-second { grid-area: column-second;}
</style>