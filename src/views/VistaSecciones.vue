<script setup lang="ts">
import {ref,onMounted} from 'vue'
import { brunaApi } from '@/funciones/api.ts';
import AlertaMensaje from '@/components/AlertaMensaje.vue';
import PasarAsistencia from '@/components/PasarAsistencia.vue';
import { organizarSecciones } from '@/funciones/funciones';
import { Menciones, MensajesApi } from '@/types/interfaceTypes';
const mencion = ref(0)
const alertaMsj = ref<string>('')
const mensaje = ref<MensajesApi>()
const tabsLoading = ref<boolean>(true)
const menciones = ref<Menciones[]>([]);

onMounted(() => {
	cargaInicial();
});
function cargaInicial() {
  brunaApi({ s: 'secciones' }, '')
  .then((res:any) => {
    if (res.data) {
      if(!res.data.r) {
        menciones.value = organizarSecciones(res.data, true)
      } else {
        mensaje.value = res.data
      }
      tabsLoading.value = false
    }
  }).catch(() => {
    alertaMsj.value = "Hubo un error cargando los datos"
  })
}
</script>

<template>
<v-container>
  <AlertaMensaje :mensaje="alertaMsj" @limpiar-msj="alertaMsj = ''" />
  <v-skeleton-loader v-if="tabsLoading" type="table-heading, article, paragraph" />
  <template v-else>
    <template v-if="!Object.keys(menciones).length && mensaje">
      <v-sheet
        rounded="xl"
        class="text-center mt-3 pb-2 mx-auto"
        max-width="600px"
      >
        <v-icon icon="mdi-book-alert" class="text-primario-claro large-icon"/>
        <p class="text-h6">{{ mensaje?.e }}</p>
      </v-sheet>
    </template>
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
                    {{ ano.nom_ano }}
                  </v-card-title>
                  <v-sheet :class="['d-flex flex-wrap pb-3 pl-2 justify-space-around', {'flex-fill': Object.values(n.ano[i].sec).length==1}]">
                    <article
                      v-for="s in n.ano[i].sec"
                      :keys="`${s.num_sec}${s.sec_nom}`"
                      :class="['flex-fill d-inline-flex align-center', {'flex-lg-0-0': Object.values(n.ano[i].sec).length!==1}]"
                    >
                      <RouterLink :to="`/seccion/${s.id_ano}`" class="flex-fill">
                        <v-list-item
                          :title="'Sección '+s.sec_nom"
                          :subtitle="s.num_sec+' alumnos'"
                        >
                          <template #prepend>
                            <v-icon :icon="`mdi-alpha-${(s.sec_nom).toLowerCase()}-circle-outline`"/>
                          </template>
                          <p v-if="!s.semanero?.includes('null')" class="text-caption">
                            <span class="d-block text-caption">
                              Semanero:
                            </span>
                            {{ s.semanero }}
                          </p>
                        </v-list-item>
                      </RouterLink>
                      <PasarAsistencia :seccion="s.id_ano" />
                    </article>
                  </v-sheet>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card>
    </template>
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
