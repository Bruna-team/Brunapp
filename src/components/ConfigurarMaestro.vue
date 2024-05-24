<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDisplay } from 'vuetify'
import { brunaApi } from '@/funciones/api.ts';
import AlertaMensaje from '@/components/AlertaMensaje.vue';
import VentanaConfirmar from '@/components/VentanaConfirmar.vue';
const emit = defineEmits([
	'recargar'
]);
const alertaMsj = ref<string>('')
const dialog = ref(false)
const { smAndUp } = useDisplay()
const props = defineProps({
  materias: {
    type: Object,
    default: {}
  },
  asignarRol: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  },
  estatus: {
    type: String,
    default: ''
  },
  modulos: {
    type: Object,
    default: {}
  },
  menciones: {
    type: Object,
    default: {}
  },
  jornadas: {
    type: Object,
    default: {}
  },
  rols: {
    type: Array,
    default: []
  },
  rol: {
    type: Object,
    default: {}
  }
})
const estatus = computed(()=> props.estatus)
const materias = computed(()=> props.materias)
const cambios = computed(()=> {
  if (props.rol.id_car !== rol.value.id_car) {
    if (props.rol.id_car == '2') {
      return 'Este docente esta configurado como coordinador, al asignarle otro rol le estas limitando las acciones que puede hacer en el sistema'
    }
    else if (rol.value.id_car == '2') {
      return 'Has cambiado el rol del maestro a coordinador, ahora podrá hacer muchas mas acciones administrativas'
    }
    else {
      return 'Has cambiado el rol del maestro'
    }
  } else if (Object.keys(props.jornadas).length < Object.keys(jornadasPersonal.value).length) {
    return 'Has agregado más secciones a este maestro guía'
  } else if (Object.keys(props.jornadas).length < Object.keys(jornadasPersonal.value).length) {
    return 'Has eliminado secciones a este maestro guía'
  } else {
    return ''
  }
})
const validarCambios = computed(() => {
  if(rol.value.id_car == '4') {
    if (!Object.values(jornadasPersonal.value).length) {
      return true
    }
    return Object.values(jornadasPersonal.value).some(item => !item.sec || !item.sec.id_ano)
  } else {
    return false
  }
})
const jornadasPersonal = ref({...props.jornadas})
const rol = ref({...props.rol})
function AgregarRol() {
  jornadasPersonal.value[obtenerUltimoIdRol() + 1] = {
    modulo: '',
    materia: '',
    men: '',
    ano: '',
    sec: '',
    dia: '',
    edit: true,
  }
}
function AgregarJornada() {
  jornadasPersonal.value[obtenerUltimoIdJor() + 1] = {
    modulo: '',
    materia: '',
    men: '',
    ano: '',
    sec: '',
    dia: '',
    edit: true,
  }
}
function limpiarJornada() {
  emit('recargar')
  jornadasPersonal.value = {...props.jornadas}
}
function obtenerUltimoIdRol() {
    let ultimoId = Object.keys(jornadasPersonal.value).length;
    for (const object in jornadasPersonal.value) {
      if (jornadasPersonal.value[object].id_ano_guia && Number(jornadasPersonal.value[object].id_ano_guia)> ultimoId) {
        ultimoId += Number(jornadasPersonal.value[object].id_ano_guia) ;
      }
    }
    return ultimoId;
}
function obtenerUltimoIdJor() {
    let ultimoId = Object.keys(jornadasPersonal.value).length;
    for (const object in jornadasPersonal.value) {
      if (jornadasPersonal.value[object].id_jor && Number(jornadasPersonal.value[object].id_jor) > ultimoId) {
        ultimoId += Number(jornadasPersonal.value[object].id_jor) ;
      }
    }
    return ultimoId;
}
function eliminarJornada(id: any) {
  if (jornadasPersonal.value[id].id_jor) {
    brunaApi({ s: 'jornadaEliminar' }, 'id=' + jornadasPersonal.value[id].id_jor)
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = res.data.e
        delete jornadasPersonal.value[id]
      } else {
        alertaMsj.value = "Hubo un error: " + res.data.e
      }
    }).catch(() => {
      alertaMsj.value = "Hubo un error eliminando los datos"
    })
  } else {
    delete jornadasPersonal.value[id]
  }
}
function guardarJornada() {
  const dataApi:any = []
  const dataEditApi:any = []
  for (const j in jornadasPersonal.value) {
    if (jornadasPersonal.value[j].ano && jornadasPersonal.value[j].materia && jornadasPersonal.value[j].men
    && jornadasPersonal.value[j].modulo && jornadasPersonal.value[j].sec && jornadasPersonal.value[j].dia) {
      if (jornadasPersonal.value[j].edit) {
        if (jornadasPersonal.value[j].id_jor) {
          dataEditApi.push({
            ano: jornadasPersonal.value[j].sec.id_ano,
            mat: jornadasPersonal.value[j].materia.id_mat,
            hor: jornadasPersonal.value[j].modulo.id_hor,
            dia: jornadasPersonal.value[j].dia,
            jor: jornadasPersonal.value[j].id_jor,
            id: props.id
          })
        } else {
          dataApi.push({
            ano: jornadasPersonal.value[j].sec.id_ano,
            mat: jornadasPersonal.value[j].materia.id_mat,
            hor: jornadasPersonal.value[j].modulo.id_hor,
            dia: jornadasPersonal.value[j].dia,
            id: props.id
          })
        }
      }
    }
  }
  if (dataApi.length) {
    brunaApi({ s: 'jornadaCrear' }, JSON.stringify(dataApi))
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = "Se ha registrado el horario correctamente"
      } else {
        alertaMsj.value = "Ha ocurrido un error registrando el horario"
      }
    }).catch(() => {
      alertaMsj.value = "Ha ocurrido un error registrando el horario"
    })
  }
  if (dataEditApi.length) {
    brunaApi({ s: 'jornadaEditar' }, JSON.stringify(dataEditApi))
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = "Se ha actualizado el horario correctamente"
      } else {
        alertaMsj.value = "Ha ocurrido un error actualizando el horario"
      }
    }).catch(() => {
      alertaMsj.value = "Ha ocurrido un error actualizando el horario"
    })
  }
  if (!dataEditApi.length && !dataApi.length) {
    alertaMsj.value = "Complete la información"
  } else {
    limpiarJornada()
    dialog.value = false
  }
}
function guardarRol() {
  const dataApi:any = []
  if (rol.value.id_car == "4") {
    for (const j in jornadasPersonal.value) {
      if (jornadasPersonal.value[j].ano && jornadasPersonal.value[j].men && jornadasPersonal.value[j].sec) {
        if (jornadasPersonal.value[j].edit) {
          dataApi.push({
            ano: jornadasPersonal.value[j].sec.id_ano,
            id: props.id,
            rol: rol.value.id_car
          })
        }
      }
    }
  } else {
    dataApi.push({
      ano: '',
      id: props.id,
      rol: rol.value.id_car
    })
  }
  if (dataApi) {
    brunaApi({ s: 'rolCambiar' }, JSON.stringify(dataApi))
      .then((res:any) => {
        if (res.data.r) {
          alertaMsj.value = "Se ha modificado el rol correctamente"
        } else {
          alertaMsj.value = "Ha ocurrido un error modificando el rol"
        }
      }).catch(() => {
        alertaMsj.value = "Hubo un error modificando los datos"
      })
  }
  if (!dataApi.length) {
    alertaMsj.value = "Complete la información"
  } else {
    limpiarJornada()
    dialog.value = false
  }
}
function eliminarRol(id: any) {
  if (jornadasPersonal.value[id].id_ano_guia) {
    brunaApi({ s: 'rolGuiaEliminar' }, 'ano=' + jornadasPersonal.value[id].id_ano_guia)
    .then((res:any) => {
      if (res.data.r) {
        alertaMsj.value = res.data.e
        delete jornadasPersonal.value[id]
        emit('recargar')
      } else {
        alertaMsj.value = "Hubo un error: " + res.data.e
      }
    }).catch(() => {
      alertaMsj.value = "Hubo un error eliminando los datos"
    })
  } else {
    delete jornadasPersonal.value[id]
  }
}
function actualizarEstatusMaestro() {
  const nuevoEstatus = estatus.value == '0' ? '1' : '0'
  brunaApi({ s: 'ModificarEstatusMaestro' }, 'id_person='+props.id+'&est='+nuevoEstatus)
      .then((res:any) => {
        if (res.data.r) {
          alertaMsj.value = res.data.e
        } else {
          alertaMsj.value = res.data.e
        }
      }).catch(() => {
        alertaMsj.value = "Hubo un error modificando los datos"
      })
  emit('recargar')
}
watch(()=> props.jornadas,()=> {
  jornadasPersonal.value = {...props.jornadas}
})
</script>
<template>
<AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
<v-dialog
  v-model="dialog"
  :max-width="smAndUp ? '850' : 'auto'"
  close-on-back scrollable
  :fullscreen="!smAndUp"
>
  <template v-slot:activator="{ props }">
    <v-btn
      v-bind="props"
      color="secundario"
      :prepend-icon="asignarRol ? 'mdi-account-convert' : 'mdi-account-file-text'"
      :text="asignarRol ? 'Configurar' : 'Jornadas'"
    />
  </template>

  <template v-slot:default="{ isActive }">
    <v-card class="pb-16 pb-sm-2">
      <v-toolbar dark>
        <v-toolbar-title>
          {{ asignarRol ? 'Configurar docente' : 'Jornadas' }}
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn
            icon="mdi-close"
            dark
            @click="isActive.value = false; limpiarJornada()"
          />
        </v-toolbar-items>
      </v-toolbar>
      <v-container v-if="asignarRol">
        <v-row align="center" justify="center" justify-sm="space-between">
          <v-col cols="12" sm="" md="7">
            <v-select
              label="Asignar rol"
              v-model="rol"
              :items="Object.values(props.rols)"
              return-object
              item-title="nom_car"
              item-value="id_car"
              hide-details
            />
          </v-col>
          <v-col cols="auto">
            <v-btn
              :text="estatus == '0' ? 'Bloquear docente' : 'Desbloquear docente'"
              color="error"
              :variant="estatus == '0' ? 'plain' : 'elevated'"
              title="Bloquea o deshabilita un maestro en el sistema."
              :prepend-icon="estatus == '0' ? 'mdi-lock-open' : 'mdi-lock'"
            />
            <VentanaConfirmar
              :message="estatus == '0' ? 'bloquear a este maestro' : 'desbloquear a este maestro'"
              :subtitle="estatus == '0'
                ? 'Al desbloquear al maestro podrá retomar las actividades con respecto al rol asignado.'
                : 'Al bloquear al maestro, este no podrá realizar ninguna acción en el sistema, ni podrá ver información almacenada'"
              btnicon="mdi-check"
              colorBtn="primario"
              @confirmar="(e) => { e ? actualizarEstatusMaestro() : '' }"
            />
          </v-col>
        </v-row>
        <template v-if="rol.id_car == 4">
          <v-divider class="my-3"/>
          <div
            v-for="(curso, i) in jornadasPersonal"
            :key="curso"
          >
            <v-row align="center">
              <v-col v-if="!curso.edit">
                {{curso.men.men}} {{curso.ano.nom_ano}} {{curso.ano.sec.sec.sec_nom}}
              </v-col>
              <template v-if="curso.edit">
                <v-col cols="12" sm="4">
                  <v-combobox
                    label="Mención"
                    v-model="curso.men"
                    :items="Object.values(props.menciones)"
                    item-title="men"
                    item-value="id_men"
                    hide-details
                    @click="curso.ano = ''; curso.sec = ''"
                  />
                </v-col>
                <v-col cols="12" sm="4" v-if="curso.men">
                  <v-combobox
                    label="Año"
                    v-model="curso.ano"
                    :items="Object.values(curso.men.ano)"
                    item-title="nom_ano"
                    item-value="id_ano"
                    hide-details
                    @click="curso.sec = ''"
                  />
                </v-col>
                <v-col cols="12" sm="" v-if="curso.ano">
                  <v-combobox
                    label="Sección"
                    v-model="curso.sec"
                    :items="Object.values(curso.ano.sec)"
                    item-title="sec_nom"
                    item-value="id_ano"
                    hide-details
                  />
                </v-col>
              </template>
              <v-col cols="1" v-if="Object.keys(jornadasPersonal).length > 1">
                <v-btn icon="mdi-trash-can" color="error" variant="text" @click="eliminarRol(i)"/>
              </v-col>
            </v-row>
            <v-divider class="my-3"/>
          </div>
          <v-btn
            block
            color="secundario"
            :text="Object.values(jornadas).length ? 'Asignar otra sección' : 'Asignar sección'"
            @click="AgregarRol"
          />
          <template v-if="!Object.keys(jornadasPersonal).length">
            <p class="text-center text-medium-emphasis">No puedes asignar un dicente guía sin asignarle una sección</p>
          </template>
        </template>
      </v-container>
      <v-container v-else>
        <section v-for="(jornada, j) in jornadasPersonal" key="j">
          <v-divider/>
          <p class="d-flex align-center">
            <span class="flex-fill">
              Horario
            </span>
            <v-btn
              variant="text"
              :prepend-icon="jornada.edit ? 'mdi-close' :'mdi-pen'"
              :text="jornada.edit ? 'Cancelar' :'Editar'"
              @click="jornada.edit = !jornada.edit"
            />
            <v-btn icon="mdi-trash-can" @click="eliminarJornada(j)" color="error" variant="text"/>
          </p>
          <v-divider class="mb-2"/>
          <v-row>
            <v-col cols="12" sm="4">
              <v-combobox
                label="Horarios"
                v-model="jornada.modulo"
                :items="Object.values(props.modulos)"
                item-title="modulo_hor"
                item-value="id_mod"
                :disabled="!jornada.edit"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-combobox
                label="Día"
                v-model="jornada.dia"
                :disabled="!jornada.edit"
                :items="['Lunes','Martes','Miércoles','Jueves','Viernes']"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-combobox
                label="Materia"
                v-model="jornada.materia"
                :items="Object.values(materias)"
                item-title="nom_mat"
                item-value="id_mat"
                :disabled="!jornada.edit"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-combobox
                label="Mención"
                v-model="jornada.men"
                :items="Object.values(props.menciones)"
                item-title="men"
                item-value="id_men"
                :disabled="!jornada.edit"
                @click="jornada.ano = ''; jornada.sec = ''"
              />
            </v-col>
            <v-col cols="12" sm="4" v-if="jornada.men">
              <v-combobox
                label="Año"
                v-model="jornada.ano"
                :items="Object.values(jornada.men.ano)"
                item-title="nom_ano"
                item-value="id_ano"
                :disabled="!jornada.edit"
                @click="jornada.sec = ''"
              />
            </v-col>
            <v-col cols="12" sm="4" v-if="jornada.ano">
              <v-combobox
                label="Sección"
                v-model="jornada.sec"
                :items="Object.values(jornada.ano.sec)"
                item-title="sec_nom"
                item-value="id_ano"
                :disabled="!jornada.edit"
              />
            </v-col>
          </v-row>
        </section>
        <v-btn
          block
          color="secundario"
          @click="AgregarJornada"
          text="Agregar otra jornada"
        />
      </v-container>
      <v-card-actions class="bottom-dialog-actions">
        <v-spacer />
        <v-btn
          prepend-icon="mdi-close"
          text="Cerrar"
          @click="limpiarJornada(); isActive.value = false"
        />
        <v-btn
          prepend-icon="mdi-check"
          variant="elevated"
          color="primario"
          :disabled="!cambios.length || validarCambios"
          @click=""
        >
          Guardar
          <VentanaConfirmar
            :message="'desea aplicar esta configuración'"
            :subtitle="cambios"
            btnicon="mdi-check"
            colorBtn="primario"
            @confirmar="(e) => { e ? asignarRol ? guardarRol() : guardarJornada() : '' }"
          />
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>