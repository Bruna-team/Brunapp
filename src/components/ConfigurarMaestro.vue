<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify'
import { brunaApi } from '../funciones/api.ts';
import AlertaMensaje from '../components/AlertaMensaje.vue';
const alertaMsj = ref<string>('')
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
})
onMounted(() => {
	cargaInicial();
});
const materias = computed(()=> props.materias)
const menciones = ref<any[]>([{
  id_men: '',
  men: '',
  ano: [
    {
      id_ano: '',
      nom_ano: '',
      num_ano: '',
      sec: [
        {
          id_ano: '',
          sec_nom: '',
        }
      ]
    }
  ]
}])
const rols = ref([
  {
    id:0,
    rol: 'Profesor',
  },
  {
    id:1,
    rol: 'Coordinación',
  },
  {
    id:2,
    rol: 'Guía',
  }
])
const rol = ref({id: 0, rol: 'Profesor'})
const jornadasPersonal= ref<any[]>([{
  modulo: '',
  materia: '',
  men: '',
  ano: '',
  sec: ''
}])
const modulos= ref([{
  id_hor: '',
  modulo_hor: '',
  inicio_hor: '',
  fin_hor: '',
}])
const cursos= ref(1)
function cargaInicial() {
  brunaApi({ s: 'horarios' }, '')
  .then((res:any) => {
    if (res.data) {
      modulos.value = res.data
    }
  }).catch(() => {
    // message: 'Hubo un error cargando los datos',
  })
  brunaApi({ s: 'secciones' }, '')
  .then((res:any) => {
    if (res.data) {
      organizarSecciones(res.data)
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
}
function organizarSecciones(data:string[]) {
  const dataMen:any = {}
  data.forEach((d:any) => {
    if (!dataMen[d.id_men]) {
      dataMen[d.id_men] = {
        id_men: d.id_men,
        men: d.nom_men,
        ano: {}
      }
    }
    if(!dataMen[d.id_men].ano[d.nom_ano]) {
      dataMen[d.id_men].ano[d.nom_ano] = {
        id_ano: d.id_ano,
        nom_ano: d.nom_ano,
        num_ano: d.num_ano,
        sec: {}
      }
    }
    if(!dataMen[d.id_men].ano[d.nom_ano].sec[d.sec_ano]) {
      dataMen[d.id_men].ano[d.nom_ano].sec[d.sec_ano] = {
        id_ano: d.id_ano,
        sec_nom: d.sec_ano,
        semanero: d.pnom_alum + ' ' + d.pape_alum,
        num_sec: d.num_est
      }
    }
  })
  menciones.value = dataMen
}
function AgregarJornada() {
  jornadasPersonal.value.push({
    modulo: '',
    materia: '',
    men: '',
    ano: '',
    sec: ''
  })
}
function limpiarJornada() {
  jornadasPersonal.value = [{
    modulo: '',
    materia: '',
    men: '',
    ano: '',
    sec: ''
  }]
}
function eliminarJornada(i: any) {
  jornadasPersonal.value.splice(i, 1)
}
</script>
<template>
<AlertaMensaje :mensaje="alertaMsj" />
<v-dialog max-width="850" close-on-back scrollable :fullscreen="!smAndUp">
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
              chips
              label="Asignar rol"
              v-model="rol"
              :items="Object.values(rols)"
              return-object
              item-title="rol"
              item-value="id"
            />
          </v-col>
        </v-row>
        <template v-if="rol.id == 2">
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
                  chips
                  label="Mención"
                  :items="Object.values(materias)"
                  item-title="materia"
                  item-value="id"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-combobox
                  chips
                  label="Año"
                  :items="Object.values(materias)"
                  item-title="materia"
                  item-value="id"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-combobox
                  chips
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
              {{ j+1 }} horario
            </span>
            <v-btn icon="mdi-trash-can" @click="eliminarJornada(j)" color="error" variant="text"/>
          </p>
          <v-divider class="mb-2"/>
          <v-row>
            <v-col cols="12" sm="6">
              <v-combobox
                chips
                label="Horarios"
                v-model="jornada.modulo"
                :items="Object.values(modulos)"
                item-title="modulo_hor"
                item-value="id_mod"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-combobox
                chips
                label="Materia"
                v-model="jornada.materia"
                :items="Object.values(materias)"
                item-title="nom_mat"
                item-value="id_mat"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-combobox
                chips
                label="Mención"
                v-model="jornada.men"
                :items="Object.values(menciones)"
                item-title="men"
                item-value="id_men"
                />
              </v-col>
              <v-col cols="12" sm="4" v-if="jornada.men">
                <v-combobox
                chips
                label="Año"
                v-model="jornada.ano"
                :items="Object.values(jornada.men.ano)"
                item-title="nom_ano"
                item-value="id_ano"
              />
            </v-col>
            <v-col cols="12" sm="4" v-if="jornada.ano">
              <v-combobox
                chips
                label="Sección"
                v-model="jornada.sec"
                :items="Object.values(jornada.ano.sec)"
                item-title="sec_nom"
                item-value="id_ano"
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
          @click="isActive.value = false; limpiarJornada()"
        />
        <v-btn
          prepend-icon="mdi-check"
          text="Guardar"
          variant="tonal"
          color="primario"
          @click="isActive.value = false"
        />
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>