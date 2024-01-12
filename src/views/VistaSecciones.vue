<script setup lang="ts">
import {ref,onMounted} from 'vue'
import { brunaApi } from '../funciones/api.ts';
import AgregarEstudiante from '../components/AgregarEstudiante.vue'
const mencion = ref('')
const menciones = ref([{
  id_men: '',
  men: '',
  ano: [
    {
      id_ano: '',
      num_ano: '',
      sec: [
        {
          sec_nom: '',
          semanero: '',
          num_sec: ''
        }
      ]
    }
  ]
}])
onMounted(() => {
	cargaInicial();
});

function cargaInicial() {
  brunaApi({ s: 'secciones' }, '')
  .then((res:any) => {
    if (res.data) {
      organizarSecciones(res.data)
    }
  }).catch(() => {
    // message: 'Hubo un error cargando los datos',
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
    if(!dataMen[d.id_men].ano[d.num_ano]) {
      dataMen[d.id_men].ano[d.num_ano] = {
        id_ano: d.id_ano,
        num_ano: d.num_ano,
        sec: {}
      }
    }
    if(!dataMen[d.id_men].ano[d.num_ano].sec[d.sec_ano]) {
      dataMen[d.id_men].ano[d.num_ano].sec[d.sec_ano] = {
        sec_nom: d.sec_ano,
        semanero: d.pnom_per + d.pape_per,
        num_sec: d.num_est
      }
    }
  })
  menciones.value = dataMen
}
</script>
<template>
<v-container>
  <AgregarEstudiante
    :classBtn="'ml-auto mr-0'"
  />
  <v-card>
    <v-tabs
      v-model="mencion"
      fixed-tabs
      bg-color="secundario"
    >
      <v-tab
        v-for="(m) in menciones"
        :key="m.id_men"
      >
        {{ m.men }}
      </v-tab>
    </v-tabs>
    <v-window v-model="mencion">
      <v-window-item
        v-for="n in menciones"
        :key="n.id_men"
        :value="n.id_men"
      >
        <v-container fluid>
          <v-expansion-panels v-for="(ano, i) in n.ano" :keys="ano.id_ano">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-row no-gutters>
                  <v-col cols="12" class="text-center"> {{ ano.num_ano }} año</v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-row no-gutters>
                <v-col v-for="s in n.ano[i].sec" :keys="`${s.num_sec}${s.sec_nom}`">
                  <RouterLink :to="'/seccion'">
                    <v-expansion-panel-text>
                      <v-card width="300">
                        <v-card-item>
                          <v-card-title>Sección {{ s.sec_nom }}</v-card-title>
                          <v-card-subtitle>{{ s.num_sec }} alumnos</v-card-subtitle>
                        </v-card-item>
                        <v-card-text> Semanero: {{ s.semanero }} </v-card-text>
                      </v-card>
                    </v-expansion-panel-text>
                  </RouterLink>
                </v-col>
              </v-row>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-window-item>
    </v-window>
  </v-card>
</v-container>
</template>
