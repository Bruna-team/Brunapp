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
  sec_ano: ''
}])
const nombreABuscar = ref('')
const materiaABuscar = ref('')
const materiaSeleccionada = ref([])
onMounted(() => {
	cargaInicial();
});

function cargaInicial() {
  brunaApi({ s: 'maestros' }, '')
  .then((res:any) => {
    if (res.data) {
      profes.value = res.data
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
}
function actualizar() {
  brunaApi({ s: 'maestros' }, 'nom=' + (nombreABuscar.value !== 'null' ? nombreABuscar.value : '') + '&mat=' + materiaABuscar.value)
  .then((res:any) => {
    if (res.data) {
      profes.value = res.data
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
            <configurar-maestro :materias="materias" :id="p.id_person"/>
            <configurar-maestro :materias="materias" :asignar-rol="true" :id="p.id_person"/>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>