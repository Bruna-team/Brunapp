<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConfigurarMaestro from '../components/ConfigurarMaestro.vue';
import { brunaApi } from '../funciones/api.ts';
import AlertaMensaje from '../components/AlertaMensaje.vue';
const alertaMsj = ref<string>('')
const materias = ref([
  {
    id_mat: '',
    nom_mat: '',
  },
])
const profes = ref([{
  id_person: '',
  dia_hor: '',
  fin_hor: '',
  inicio_hor: '',
  nom_mat: '',
  nom_men: '',
  num_ano: '',
  profesor: '',
  sec_ano: '',
  id_car: '',
  nom_car: ''
}])
const nombreABuscar = ref('')
const materiaABuscar = ref('')
const materiaSeleccionada = ref([])
const jornadas = ref<any>([])
const cargos = ref<any>([])
const modulos= ref([{
  id_hor: '',
  modulo_hor: '',
  inicio_hor: '',
  fin_hor: '',
}])
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
onMounted(() => {
	cargaInicial();
});

function cargaInicial() {
  brunaApi({ s: 'maestros' }, '')
  .then((res:any) => {
    if (res.data) {
      organizarJornadas(res.data)
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
  brunaApi({ s: 'materias' }, '')
  .then((res:any) => {
    if (res.data) {
      materias.value = res.data
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
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
  brunaApi({ s: 'cargos' }, '')
  .then((res:any) => {
    if (res.data) {
      cargos.value = res.data
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
}
function organizarJornadas(data:string[]) {
  const dataJor:any = {}
  const dataPro:any = {}
  data.forEach((d:any) => {
    if(!dataJor[d.id_person]) {
      dataJor[d.id_person] = {}
      dataPro[d.id_person] = d
    }
    if (d.id_jor) {
      if(!dataJor[d.id_person][d.id_jor]) {
        dataJor[d.id_person][d.id_jor] = {
          id_jor: d.id_jor,
          dia: d.dia_jor,
          fin: d.fin_hor,
          inicio: d.inicio_hor,
          modulo: {
            modulo_hor: d.modulo_hor,
            id_hor: d.id_hor
          },
          materia: {
            nom_mat: d.nom_mat,
            id_mat: d.id_mat
          },
          men: {
            men:d.nom_men,
            ano: {
              ano: {
                nom_ano: d.nom_ano,
              }
            }
          },
          ano: {
            nom_ano: d.nom_ano,
            sec: {
              sec: {
                sec_nom: d.sec_ano
              }
            }
          },
          sec: {
            sec_nom: d.sec_ano,
            id_ano: d.id_ano
          },
          nuevo: false,
          edit: false
        }
      }
    }
  })
  jornadas.value = dataJor
  profes.value = dataPro
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
function actualizar() {
  brunaApi({ s: 'maestros' }, 'nom=' + (nombreABuscar.value !== 'null' ? nombreABuscar.value : '') + '&mat=' + materiaABuscar.value)
  .then((res:any) => {
    if (res.data) {
      organizarJornadas(res.data)
    } else {
      alertaMsj.value = "Hubo un error cargando los datos"
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
}
function filtroMaterias() {
  let materiaFiltro:any = []
  materiaSeleccionada.value.forEach((m: any) => {
    materiaFiltro.push(m.id_mat)
  })
  materiaABuscar.value = materiaFiltro
  actualizar()
}
</script>
<template>
  <v-container>
    <AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
    <h2>Maestros</h2>
    <v-row>
      <v-col>
        <v-text-field
          v-model="nombreABuscar"
          label="Buscar maestro"
          @input="actualizar"
        />
      </v-col>
      <v-col>
        <v-combobox
          multiple
          chips
          v-model="materiaSeleccionada"
          label="Materia"
          :items="Object.values(materias)"
          item-title="nom_mat"
          item-value="id_mat"
          @update:model-value="filtroMaterias"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="p in profes" :key="p.id_person">
        <v-card>
          <v-card-item>
            <v-card-title>{{ p.profesor }}</v-card-title>
            <v-card-subtitle>{{ p.nom_mat }}</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            horario
          </v-card-text>
          <v-card-actions class="justify-center">
            <configurar-maestro
              :materias="materias"
              :modulos="modulos"
              :menciones="menciones"
              :jornadas="jornadas[p.id_person]"
              :id="p.id_person"
              @recargar="cargaInicial"
            />
            <configurar-maestro :rols="cargos" :menciones="menciones" :rol="{id_car: p.id_car, nom_car: p.nom_car}" :asignar-rol="true" :id="p.id_person"/>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>