<script setup lang="ts">
import { ref, watch } from 'vue';
import * as XLSX from 'xlsx';
/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);
const excelFile = ref()

watch(() => excelFile, (value: any) =>{
console.log(value)
})

</script>
<template>
  <section class="text-center">
    <v-btn
      variant="text"
      prepend-icon="mdi-download"
      class="mb-2"
    >
      Descargar formato guía
    </v-btn>
    <v-file-input
      v-model="excelFile"
      label="Selecciona el archivo de excel"
      prepend-icon="mdi-file-excel"
    />
  </section>
</template>