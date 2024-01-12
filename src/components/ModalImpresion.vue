<script setup lang="ts">
import {ref} from 'vue'
// PDFmake
// @ts-ignore
import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs
const props = defineProps({
  title: String,
  subtitle: String,
  seccion: String,
  content: Array,
})
defineEmits(['confirmar'])

const dialog = ref(false)

const pageOrientation = ref('landscape')
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
const pageMargins = ref({
  mt: 15,
  mr: 15,
  mb: 15,
  ml: 15,
})
const printDimensions = ref({
  width: 0,
  height: 0,
})
function conversorDeUnidad(mm: number) {
  const cm = mm / 10
  const pts = cm / 2.54 * 72 // Fórmula que convierte de cm a pt
  return pts
}

function imprimirReporte () {
  const docDefinition = {
    info: {
      title: props.title,
      author: "Bruna. E.T.C. 'Madre Rafols'"
    },
    content: JSON.parse(JSON.stringify(props.content)),
    styles: {
      header1: {
        fontSize: 16,
        bold: true
      },
      header2: {
        fontSize: 15,
        bold: true
      },
      header3: {
        fontSize: 14
      },
      header4: {
        fontSize: 13
      },
      header5: {
        fontSize: 12,
        bold: true
      },
      header6: {
        fontSize: 11,
        bold: true
      },
      parrafo1: {
        fontSize: 9
      }
    },
    defaultStyle: {
     columnGap: 10,
     fontSize: 10
    },
    pageSize: printDimensions.value.width || printDimensions.value.height ? {
        width: conversorDeUnidad(printDimensions.value.width),
        height: conversorDeUnidad(printDimensions.value.height)
    } : 'LETTER',
    pageOrientation: pageOrientation.value === 'landscape' || pageOrientation.value === 'portrait'
       ? pageOrientation.value : 'auto',
    pageMargins: [
      conversorDeUnidad(pageMargins.value.ml),
      conversorDeUnidad(pageMargins.value.mt),
      conversorDeUnidad(pageMargins.value.mr),
      conversorDeUnidad(pageMargins.value.mb)
    ]
  }
  pdfMake.createPdf(docDefinition).open()
}
</script>
<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <template v-slot:activator="{ props }">
      <v-btn
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
            v-model="pageOrientation"
            label="Orientacion"
            prepend-icon="mdi-phone-rotate-landscape"
            :items="pageOrientations"
            class="flex-1-1-100"
          />
          <v-text-field
            v-model="printDimensions.width"
            label="Ancho"
            prepend-icon="mdi-align-horizontal-left"
            type="number"
            :min="0"
            class="w-50 pr-2"
          />
          <v-text-field
            v-model="printDimensions.height"
            label="Alto"
            prepend-icon="mdi-align-vertical-top"
            type="number"
            :min="0"
            class="w-50 pl-2"
          />
          <div class="grid-container--margins">
            <div class="grid-area--mt">
              <v-text-field
                v-model="pageMargins.mt"
                label="Arriba"
                type="number"
                :min="0"
                class="grid-area--input"
              />
            </div>
            <div class="grid-area--mb">
              <v-text-field
                v-model="pageMargins.mb"
                label="Abajo"
                type="number"
                :min="0"
                class="grid-area--input"
              />
            </div>
            <div class="grid-area--mr">
              <v-text-field
                v-model="pageMargins.mr"
                label="Derecha"
                type="number"
                :min="0"
                class="grid-area--input"
              />
            </div>
            <div class="grid-area--ml">
              <v-text-field
                v-model="pageMargins.ml"
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
          @click="imprimirReporte"
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