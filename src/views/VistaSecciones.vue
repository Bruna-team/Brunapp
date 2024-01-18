<script setup lang="ts">
import {ref,onMounted} from 'vue'
import { brunaApi } from '../funciones/api.ts';
import AgregarEstudiante from '../components/AgregarEstudiante.vue'
import AlertaMensaje from '../components/AlertaMensaje.vue';
const mencion = ref(0)
const alertaMsj = ref<string>('')
const tabsLoading = ref<boolean>(true)
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
  tabsLoading.value = false
  menciones.value = dataMen
}
</script>
<template>
<v-container>
  <AlertaMensaje :mensaje="alertaMsj" @limpiar-msj="alertaMsj = ''" />
  <v-skeleton-loader v-if="tabsLoading" type="table-heading, article, paragraph" />
  <template v-else>
    <v-card>
      <v-tabs
        v-model="mencion"
        fixed-tabs
        show-arrows
        bg-color="secundario"
      >
        <v-tab
          v-for="(m) in menciones"
          :key="m.id_men"
          >
          {{ m.men }}
        </v-tab>
        <AgregarEstudiante
          :menciones="menciones"
          :classBtn="'ml-2'"
          @recargar="cargaInicial"
          @alerta="alertaMsj = $event"
        />
      </v-tabs>
      <v-window v-model="mencion">
        <v-window-item
          v-for="n in menciones"
          :key="n.id_men"
          :value="n.id_men"
        >
          <v-row no-gutters>
            <v-col
              v-for="(ano, i) in n.ano"
              :keys="ano.id_ano"
              cols="12" sm="6"
              class="pa-0"
            >
              <v-card :class="['ma-3', {'d-flex flex-wrap align-center': Object.values(n.ano[i].sec).length==1}]">
                <v-card-title>
                  <v-icon :icon="`mdi-numeric-${ano.num_ano}-circle`"/>
                  {{ ano.nom_ano }} año
                </v-card-title>
                <v-sheet class="d-flex flex-wrap pb-3 pl-2 justify-space-around">
                  <RouterLink
                    v-for="s in n.ano[i].sec"
                    :keys="`${s.num_sec}${s.sec_nom}`"
                    :to="`/seccion/${s.id_ano}`"
                  >
                  <v-list-item :title="'Sección '+s.sec_nom" :subtitle="s.num_sec+' alumnos'">
                    <template #prepend><v-icon :icon="`mdi-alpha-${(s.sec_nom).toLowerCase()}-circle-outline`"/></template>
                      <p v-if="!s.semanero.includes('null')" class="text-caption">Semanero: {{ s.semanero }}</p>
                    </v-list-item>
                  </RouterLink>
                </v-sheet>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card>
  </template>
</v-container>
</template>
<style>
.v-slide-group__content {
  align-items: center;
}
.v-list-item__prepend {
  display: inline;
}
</style>
