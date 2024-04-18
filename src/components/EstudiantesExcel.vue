<script setup lang="ts">
import { ref } from 'vue';
import * as XLSX from 'xlsx';
/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);
const emit = defineEmits([
	'estudiantes',
]);

const estudiantes = ref<any[]>([])
const alertMSJ = ref<any[]>([])

function handleFileUpload(e: any) {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = function(e:any) {
    const workbook = XLSX.read(e.target.result)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const estudiantesXLS = XLSX.utils.sheet_to_json(worksheet, {header: 1})
    estudiantesXLS.shift()
    estudiantesXLS.shift()
    datosEstudiantes(estudiantesXLS)
  }
  reader.readAsArrayBuffer(file)
  if (!alertMSJ.value.length) {
    emit('estudiantes', estudiantes)
  }
}

function datosEstudiantes(estudiantesXLS: any[] ) {
  estudiantesXLS.forEach((estudiante, e: number) => {
    if(estudiante.length) {
      if(!estudiante[0]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene nombre',
        })
      }
      if(!estudiante[2]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene apellido',
        })
      }
      if(!estudiante[4]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene cédula',
        })
      }
      if(!estudiante[5]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene fecha de nacimiento',
        })
      }
      if(!estudiante[7]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene sexo',
        })
      }
      if(!estudiante[9]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] ? `El representante de ${estudiante[0]}` : 'El representante',
          posicion: e+3,
          dato: 'no tiene nombre',
        })
      }
      if(!estudiante[10]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] ? `El representante de ${estudiante[0]}` : 'El representante',
          posicion: e+3,
          dato: 'no tiene apellido',
        })
      }
      if(!estudiante[11]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] ? `El representante de ${estudiante[0]}` : 'El representante',
          posicion: e+3,
          dato: 'no tiene cédula',
        })
      }
      if(!estudiante[12]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] ? `El representante de ${estudiante[0]}` : 'El representante',
          posicion: e+3,
          dato: 'no tiene parentesco',
        })
      }
      if(!estudiante[13]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] ? `El representante de ${estudiante[0]}` : 'El representante',
          posicion: e+3,
          dato: 'no tiene teléfono',
        })
      }
      if(!estudiante[15]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] ? `El representante de ${estudiante[0]}` : 'El representante',
          posicion: e+3,
          dato: 'no tiene dirección',
        })
      }
      estudiantes.value.push(estudiante)
    }
  });

}

</script>
<template>
  <section class="text-center">
    <v-file-input
      @change="handleFileUpload"
      label="Selecciona el archivo de excel"
      prepend-icon="mdi-file-excel"
      class="mx-3"
    />
    <p class="text-caption text-medium-emphasis">¿No tienes el formato adecuado?</p>
    <v-btn
      variant="text"
      prepend-icon="mdi-download"
      class="mb-2"
      @click.prepend
    >
      <a
        href="https://docs.google.com/spreadsheets/d/1BQSp3dj2ClWJyYUYFCuqQDH_ml2Up813/edit?usp=sharing&ouid=114006793419522988289&rtpof=true&sd=true"
        download="Formato XLSX para agregar estudiantes"
      >
        Descargar Formato
      </a>
    </v-btn>
    <v-list-item
      v-for="alert in alertMSJ"
      class="text-left"
      density="compact"
    >
      <template #prepend>
        <v-icon icon="mdi-alert" color="warning" />
      </template>
      {{ alert.estudiante }} no tiene
      <span class="font-weight-bold">
        {{ alert.dato }}
      </span>
      <small class="d-block text-caption text-medium-emphasis">
        En la fila {{ alert.posicion }}
      </small>
      <v-divider />
    </v-list-item>
  </section>
</template>