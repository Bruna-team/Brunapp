<script setup lang="ts">
import {imprimirPdf} from '../funciones/utilidades'
import {ref} from 'vue'
const props = defineProps({
  title: {type: String, default: ''},
  subtitle: {type: String, default: ''},
  content: [Array, String],
  quill: {type: Boolean, default: false}
})
defineEmits(['confirmar'])
const dialog = ref(false)
const pageOrientations = ref([
  {
    value: 'landscape',
    title: 'Horizontal'
  },
  {
    value: 'portrait',
    title: 'Vertical'
  },
  {
    value: 'personalizada',
    title: 'Personalizada'
  },
])
const header = ref({title: props.title, subtitle: props.subtitle})
const docConfiguration = ref({
  orientation: 'landscape',
  margins: {
    mt: 15,
    mr: 15,
    mb: 15,
    ml: 15,
  },
  dimensions: {
    width: 0,
    height: 0,
  }
})
</script>
<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        variant="tonal"
        prepend-icon="mdi-printer"
        text="Imprimir"
        class="mb-2"
        v-bind="props"
      />
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Imprimir</span>
      </v-card-title>
      <v-card-text>
        <v-container class="d-flex flex-wrap justify-center">
          <v-select
            v-model="docConfiguration.orientation"
            label="Orientacion"
            prepend-icon="mdi-phone-rotate-landscape"
            :items="pageOrientations"
            class="flex-1-1-100"
          />
          <v-text-field
            v-model="docConfiguration.dimensions.width"
            label="Ancho"
            prepend-icon="mdi-align-horizontal-left"
            type="number"
            :min="0"
            class="w-50 pr-2"
          />
          <v-text-field
            v-model="docConfiguration.dimensions.height"
            label="Alto"
            prepend-icon="mdi-align-vertical-top"
            type="number"
            :min="0"
            class="w-50 pl-2"
          />
          <div class="grid-container--margins">
            <div class="grid-area--mt">
              <v-text-field
                v-model="docConfiguration.margins.mt"
                label="Arriba"
                type="number"
                :min="0"
                class="grid-area--input"
              />
            </div>
            <div class="grid-area--mb">
              <v-text-field
                v-model="docConfiguration.margins.mb"
                label="Abajo"
                type="number"
                :min="0"
                class="grid-area--input"
              />
            </div>
            <div class="grid-area--mr">
              <v-text-field
                v-model="docConfiguration.margins.mr"
                label="Derecha"
                type="number"
                :min="0"
                class="grid-area--input"
              />
            </div>
            <div class="grid-area--ml">
              <v-text-field
                v-model="docConfiguration.margins.ml"
                label="Izquierda"
                type="number"
                :min="0"
                class="grid-area--input"
              />
            </div>
            <v-icon icon="mdi-format-wrap-square" size="90" class="grid-area--mIcon"/>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          @click="dialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primario"
          prepend-icon="mdi-printer"
          variant="tonal"
          @click="imprimirPdf(header, content, docConfiguration, props.quill)"
        >
          Imprimir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.grid-container--margins {
  display: grid;
  grid-template-areas:
  'mt mt mt'
  'ml mIcon mr'
  'mb mb mb'
}
.grid-area--mt { grid-area: mt;}
.grid-area--mb { grid-area: mb;}
.grid-area--mr { grid-area: mr;}
.grid-area--mb { grid-area: mb;}
.grid-area--mIcon { grid-area: mIcon;}
.grid-area--input {
  width: 8rem;
  margin: auto;
}
</style>