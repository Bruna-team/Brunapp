<script setup lang="ts">
import { ref, watch } from 'vue';
import * as XLSX from 'xlsx';
/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
import { validateCed, validateBornDate } from '@/funciones/funciones';
XLSX.set_fs(fs);
const emit = defineEmits([
	'estudiantes',
]);

const estudiantes = ref<any[]>([])
const alertMSJ = ref<any[]>([])

function handleFileUpload(e: any) {
  const file = e.target.files[0]
  const reader = new FileReader()
  if (alertMSJ.value.length){alertMSJ.value = []}
  reader.onload = function(e:any) {
    const workbook = XLSX.read(e.target.result)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const estudiantesXLS = XLSX.utils.sheet_to_json(worksheet, {header: 1})
    estudiantesXLS.shift()
    estudiantesXLS.shift()
    datosEstudiantes(estudiantesXLS)
  }
  reader.readAsArrayBuffer(file)
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
      if(validateCed(estudiante[4]) !== true) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene el formato correcto de cédula. ' + validateCed(estudiante[11]),
        })
      }
      if(!estudiante[5]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene fecha de nacimiento',
        })
      }
      if(typeof estudiante[5] !== 'string') {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene un formato de fecha de nacimiento correcta. Asegúrese que en el excel este dentro de "comillas" luego de un signo = igual Ej: ="2010-12-30"',
        })
      } else {
        estudiante[5].replace(/\//g, '-')
        if(validateBornDate(estudiante[5]) !== true) {
          alertMSJ.value.push({
            estudiante: estudiante[0] || 'El estudiante',
            posicion: e+3,
            dato: 'no tiene una fecha de nacimiento correcta. '+validateBornDate(estudiante[5]),
          })
        }
      }
      if(!estudiante[7]) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene sexo',
        })
      }
      if(!/^[fFmM]$/.test(estudiante[7])) {
        alertMSJ.value.push({
          estudiante: estudiante[0] || 'El estudiante',
          posicion: e+3,
          dato: 'no tiene sexo valido, debe ser "F" o "M"',
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
      if(validateCed(estudiante[11]) !== true) {
        alertMSJ.value.push({
          estudiante: estudiante[0] ? `El representante de ${estudiante[0]}` : 'El representante',
          posicion: e+3,
          dato: 'no tiene el formato correcto de cédula. ' + validateCed(estudiante[11]),
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
      estudiantes.value[e] = {
        alumno: {
          pnom: estudiante[0],
          snom: estudiante[1],
          pape: estudiante[2],
          sape: estudiante[3],
          paren: estudiante[12],
          sexo: estudiante[7],
          ced: estudiante[4],
          fec: estudiante[5],
          obs: estudiante[6],
        },
        rep: {
          nomRe: estudiante[9],
          apeRe: estudiante[10],
          cedRe: estudiante[11],
          tel: estudiante[13],
          telRe: estudiante[14],
          dir: estudiante[15]
        }
      }
    }
  });
}

watch(estudiantes.value, (value) => {
  if (alertMSJ.value.length) return emit('estudiantes', []);
  emit('estudiantes', value)
})

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
      {{ alert.estudiante }}
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