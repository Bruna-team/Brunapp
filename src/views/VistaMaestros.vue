<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConfigurarMaestro from '../components/ConfigurarMaestro.vue';
import { brunaApi } from '../funciones/api.ts';
import { Materias, Maestros, Menciones, Modulos } from '../types/interfaceTypes.ts'
import AlertaMensaje from '../components/AlertaMensaje.vue';
const alertaMsj = ref<string>('')

const materias = ref<Materias[]>([])
const profes = ref<Maestros[]>([])
const modulos= ref<Modulos[]>([])
const menciones = ref<Menciones[]>([])
const anosSinOrden = ref<any>([])

const nombreABuscar = ref('')
const materiaABuscar = ref('')
const materiaSeleccionada = ref([])
const jornadas = ref<any>([])
const prof_guias = ref<any>([])
const cargos = ref<any>([])
onMounted(() => {
	cargaInicial();
});

function cargaInicial() {
  brunaApi({ s: 'secciones' }, '')
  .then((res:any) => {
    if (res.data) {
      organizarSecciones(res.data)
      anosSinOrden.value = res.data
    }
  }).catch((e) => {
    alertaMsj.value = "Hubo un error cargando los datos" + e
  })
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
  const dataGuia:any = {}
  const dataPro:any = {}
  data.forEach((d:any) => {
    if(!dataJor[d.id_person]) {
      dataJor[d.id_person] = {}
      dataGuia[d.id_person] = {}
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
    if (d.id_ano_guia) {
      if(!dataGuia[d.id_person][d.id_ano_guia]) {
        dataGuia[d.id_person][d.id_ano_guia] = {
          id_ano_guia: d.id_ano_guia,
          men: {
            men: buscarAno(d.id_ano_guia).nom_men,
            ano: {
              ano: {
                nom_ano: buscarAno(d.id_ano_guia).nom_ano,
              }
            }
          },
          ano: {
            nom_ano: buscarAno(d.id_ano_guia).nom_ano,
            sec: {
              sec: {
                sec_nom: buscarAno(d.id_ano_guia).sec_ano
              }
            }
          },
          sec: {
            sec_nom: buscarAno(d.id_ano_guia).sec_ano,
            id_ano: buscarAno(d.id_ano_guia).id_ano
          },
          nuevo: false,
          edit: false
        }
      }
    }
  })
  jornadas.value = dataJor
  prof_guias.value = dataGuia
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
function buscarAno(id:string) {
  const ano = anosSinOrden.value.filter((a:any) => a.id_ano === id)
  return ano[0]
}
</script>
<template>
  <v-container>
    <AlertaMensaje :mensaje="alertaMsj" @limpiarMsj="alertaMsj = ''" />
    <h2>Maestros</h2>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="nombreABuscar"
          label="Buscar maestro"
          @input="actualizar"
        />
      </v-col>
      <v-col cols="12" sm="6">
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
          <v-card-text v-for="jor in jornadas[p.id_person]" class="pb-1">
            {{jor?.dia}}
            <span class="d-block text-medium-emphasis">
              {{jor?.inicio}} - {{jor?.fin}}
            </span>
            {{jor?.modulo?.modulo_hor}}
            <span :class="[jor.materia?.nom_mat ? 'pr-2' : 'd-block text-medium-emphasis']">
              {{jor?.materia?.nom_mat || 'Sin materia asignada'}}
            </span>
            <span :class="[jor?.men?.men ? 'pr-2' : 'd-block text-medium-emphasis']">
              {{jor?.men?.men || 'Sin mención asignada'}}
            </span>
            <span :class="[jor.men?.ano?.ano?.nom_ano ? 'pr-2' : 'd-block text-medium-emphasis']">
              {{jor?.men?.ano?.ano?.nom_ano || 'Sin año asignado'}}
            </span>
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
            <configurar-maestro
              :rols="cargos"
              :menciones="menciones"
              :rol="{id_car: p.id_car, nom_car: p.nom_car}"
              :jornadas="prof_guias[p.id_person]"
              :asignar-rol="true"
              :id="p.id_person"
              @recargar="cargaInicial"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>