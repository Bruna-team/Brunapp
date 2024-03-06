<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify'
import { brunaApi } from '../funciones/api.ts';
import AlertaMensaje from '../components/AlertaMensaje.vue';
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
const materias = computed(()=> props.materias)
const jornadasPersonal = ref(props.jornadas)
const rol = ref(props.rol)
const cursos= ref(1)
function AgregarJornada() {
  jornadasPersonal.value[obtenerUltimoId() + 1] = {
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
  jornadasPersonal.value = props.jornadas
}
function obtenerUltimoId() {
    let ultimoId = Object.keys(jornadasPersonal.value).length;
    for (const object in jornadasPersonal.value) {
      if (jornadasPersonal.value[object].id_jor && jornadasPersonal.value[object].id_jor > ultimoId) {
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
</script>
<template>
<AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
<v-dialog v-model="dialog" max-width="850" close-on-back scrollable :fullscreen="!smAndUp">
  <template v-slot:activator="{ props }">
    <v-btn
      v-bind="props"
      color="secundario"
      :prepend-icon="asignarRol ? 'mdi-account-convert' : 'mdi-account-file-text'"
      :text="asignarRol ? 'Asignar rol' : 'Configurar'"
    />
  </template>

  <template v-slot:default="{ isActive }">
    <v-toolbar dark>
      <v-toolbar-title>
        {{ asignarRol ? 'Asignar rol' : 'Configurar' }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn
          icon="mdi-close"
          dark
          @click="isActive.value = false; limpiarJornada()"
        />
      </v-toolbar-items>
    </v-toolbar>
    <v-card>
      <v-card-text v-if="asignarRol">
        <v-row>
          <v-col cols="12" md="6">
            <v-combobox
              label="Asignar rol"
              v-model="rol"
              :items="Object.values(props.rols)"
              return-object
              item-title="nom_car"
              item-value="id_car"
            />
          </v-col>
        </v-row>
        <template v-if="rol.id_car == 4">
          <section v-for="curso in cursos" :key="curso">
            <v-divider/>
            <p class="d-flex align-center">
              <span class="flex-fill">
                {{ curso }} curso asignado
              </span>
              <v-btn icon="mdi-trash-can" color="error" variant="text"/>
            </p>
            <v-divider class="mb-2"/>
            <v-row>
              <v-col cols="12" md="4">
                <v-combobox
                  label="Mención"
                  :items="Object.values(materias)"
                  item-title="materia"
                  item-value="id"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-combobox
                  label="Año"
                  :items="Object.values(materias)"
                  item-title="materia"
                  item-value="id"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-combobox
                  label="Sección"
                  :items="Object.values(materias)"
                  item-title="materia"
                  item-value="id"
                />
              </v-col>
            </v-row>
          </section>
          <v-btn block color="secundario" @click="cursos++" text="Asignar otra sección" />
        </template>
      </v-card-text>
      <v-card-text v-else>
        <section v-for="(jornada, j) in jornadasPersonal" key="j">
          <v-divider/>
          <p class="d-flex align-center">
            <span class="flex-fill">
              Horario
            </span>
            <v-btn
              :variant="jornada.edit ? 'text' : 'tonal'"
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
        <v-btn block color="secundario" @click="AgregarJornada" text="Agregar otra jornada" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          prepend-icon="mdi-close"
          text="Cerrar"
          @click="limpiarJornada(); isActive.value = false"
        />
        <v-btn
          prepend-icon="mdi-check"
          text="Guardar"
          variant="tonal"
          color="primario"
          @click="guardarJornada"
        />
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>