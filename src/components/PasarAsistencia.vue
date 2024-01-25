<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { brunaApi } from '../funciones/api.ts';
import { formatoFechaYHora } from '../funciones/funciones';
formatoFechaYHora
const props = defineProps({
  seccion: {
    type: String,
    default: ''
  },
})
const dialog = ref(false)
const asisDate = ref(formatoFechaYHora(new Date, 'fecha'))
const estudiantes = ref([
  {
    ced_alum: "",
    id_estd: "",
    pape_alum: "",
    pnom_alum: "",
    sape_alum: "",
    snom_alum: "",
  },
])
const asistencias = ref([])
function cargaInicial() {
  if (props.seccion) {
    brunaApi({ s: 'estudiantes' }, 'ano=' + props.seccion)
    .then((res:any) => {
      if (res.data) {
        estudiantes.value = res.data
      }
    }).catch(() => {
      // message: 'Hubo un error cargando los datos',
    })
  }
}
onMounted(() => {
	cargaInicial();
});
</script>
<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      width="400"
    >
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-list-status" variant="text" v-bind="props" class="mx-1 px-2"/>
      </template>
      <template #default="{ isActive }">
        <v-toolbar dark>
          <v-toolbar-title>Pasar asistencia</v-toolbar-title>
            <v-toolbar-items>
              <v-btn
                icon="mdi-close"
                dark
                @click="isActive.value = false"
              />
            </v-toolbar-items>
          </v-toolbar>
        <v-card>
          <v-card-text style="height: 300px;">
            <v-text-field v-model="asisDate" type="date" label="Selecciona la fecha de la asistencia" />
            <v-checkbox
              v-model="asistencias"
              v-for="estudiante in estudiantes"
              :key="estudiante.id_estd"
              :label="`${estudiante.pnom_alum} ${estudiante.snom_alum || ''} ${estudiante.pape_alum} ${estudiante.sape_alum || ''}`"
              :value="estudiante.id_estd"
              hide-details
            />
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer />
            <v-btn
              prepend-icon="mdi-cancel"
              color="error"
              text="Cancelar"
              @click="isActive.value = false"
            />
            <v-btn
              prepend-icon="mdi-check"
              variant="tonal"
              color="primario"
              text="Guardar"
              @click="isActive.value = false"
            />
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-row>
</template>