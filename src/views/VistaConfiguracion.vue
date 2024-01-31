<script setup lang="ts">
import { ref } from 'vue'
import { formatoFechaYHora } from '../funciones/funciones';

const periodo = ref({start: '2024-02-02', end: '2024-03-10', edit: false})
const modulos = ref<{
  id_mod: number;
  name_mod: string;
  timeStart: string;
  timeEnd: string;
  edit: boolean;
  active: boolean;
  nuevo?: boolean
}[]>([
  {
    id_mod: 1,
    name_mod: 'Primer modulo',
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: false,
    active: true,
  },
  {
    id_mod: 2,
    name_mod: 'Segundo modulo',
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: false,
    active: true,
  },
  {
    id_mod: 0,
    name_mod: 'Tercer modulo',
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: false,
    active: true,
  }
])
const materias = ref([
  {
    id_mat: 1,
    title: 'Geografía',
    edit: false,
    active: true,
  },
  {
    id_mat: 2,
    title: 'Ingles',
    edit: false,
    active: true,
  },
  {
    id_mat: 0,
    title: 'Computación',
    edit: false,
    active: true,
  }
])
const menciones = ref([
  {
    id: 0,
    nom: 'Telemática',
    edit: false,
  },
  {
    id: 1,
    nom: 'Contabilidad',
    edit: false,
  },
  {
    id: 2,
    nom: 'Administración',
    edit: false,
  },
])
const cursos = ref([
  {id: 1, nom: 'Primero', edit: false},
  {id: 2, nom: 'Segundo', edit: false},
  {id: 3, nom: 'Tercero', edit: false},
  {id: 4, nom: 'Cuarto', edit: false},
  {id: 5, nom: 'Quinto', edit: false},
  {id: 6, nom: 'Sexto', edit: false},
])
function AgregarMaterias() {
  materias.value.push({
    id_mat: materias.value.length+1,
    title: '',
    edit: true,
    active: true,
  })
}
function AgregarModulo() {
  modulos.value.push({
    id_mod: 0,
    name_mod: '',
    timeStart: formatoFechaYHora(new Date(), 'hora'),
    timeEnd: formatoFechaYHora(new Date(), 'hora'),
    edit: true,
    active: true,
    nuevo: true,
  })
}
function AgregarMencion() {
  menciones.value.push({
    id: menciones.value.length+1,
    nom: '',
    edit: true,
  })
}
function AgregarCurso() {
  cursos.value.push({
    id: cursos.value.length+1,
    nom: '',
    edit: true,
  })
}
</script>
<template>
  <v-container>
    <h2 class="flex-fill">Configuración</h2>
    <v-sheet color="transparent" class="d-flex flex-wrap align-start">
      <v-row class="mt-2">
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Estudiantes y periodo académico</p>
        </v-col>
        <v-col cols="12" sm="">
          <v-card title="Año académico" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                text="Subir un año"
                prepend-icon="mdi-human-handsup"
                color="secundario"
              />
            </template>
            <v-list-item title="Inicio y fin del año académico">
              <template v-if="periodo.edit">
                <v-row>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      label="Ingresa el inicio"
                      type="date"
                      v-model="periodo.start"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      label="Ingresa el fin"
                      type="date"
                      v-model="periodo.end"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-list-item-title class="text-capitalize">{{ periodo.start }} - {{ periodo.end }}</v-list-item-title>
              </template>
              <template #append>
                <v-btn flat :icon="periodo.edit ? 'mdi-cancel' : 'mdi-pen'" @click="periodo.edit = !periodo.edit" />
                <v-btn v-if="periodo.edit" flat icon="mdi-check" @click="periodo.edit = !periodo.edit" />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <!-- <v-col>
          <v-card title="Estudiantes" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-file-excel"
                text="Agregar estudiantes como excel"
                color="secundario"
              />
            </template>
            <v-list-item>
              Total de estudiantes: 650
            </v-list-item>
          </v-card>
        </v-col> -->
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Menciones y cursos/años de la institución</p>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card title="Menciones" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-account-school"
                text="Agregar mención"
                color="secundario"
                @click="AgregarMencion()"
              />
            </template>
            <v-list-item
              v-for="(men, m) in menciones"
              :key="m"
            >
            <template v-if="men.edit">
              <v-text-field
                v-model="men.nom"
                label="Nombre de la mención"
                variant="underlined"
                hide-details="auto"
              />
              </template>
              <template v-else>
                <v-list-item-title class="text-capitalize">{{ men.nom }}</v-list-item-title>
              </template>
              <template #append>
                <v-btn
                  variant="text"
                  :icon="men.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="men.edit = !men.edit"
                />
                <v-btn
                  variant="text"
                  icon="mdi-trash-can"
                  class="text-error"
                  @click="men.edit = !men.edit"
                />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="">
          <v-card title="Cursos" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-town-hall"
                text="Agregar curso"
                color="secundario"
                @click="AgregarCurso()"
              />
            </template>
            <div class="d-flex flex-wrap">
              <v-list-item
                v-for="(cur, a) in cursos"
                :key="a"
                class="flex-fill w-50"
              >
                <template v-if="cur.edit">
                  <v-text-field
                    v-model="cur.nom"
                    label="Titulo del curso"
                    variant="underlined"
                    hide-details="auto"
                  />
                </template>
                <template v-else>
                  <v-list-item-title class="text-capitalize">{{ cur.nom }}</v-list-item-title>
                </template>
                <template #append>
                  <v-btn
                    variant="text"
                    :icon="cur.edit ? 'mdi-check' : 'mdi-pen'"
                    @click="cur.edit = !cur.edit"
                  />
                  <v-btn
                    variant="text"
                    icon="mdi-trash-can"
                    class="text-error"
                    @click="cur.edit = !cur.edit"
                  />
                </template>
              </v-list-item>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <p class="text-caption text-uppercase text-medium-emphasis my-0">Horarios y materias que se cursan</p>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card title="Módulos" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-store-clock"
                text="Agregar modulo"
                color="secundario"
                @click="AgregarModulo()"
              />
            </template>
            <v-list-item
              v-for="(modulo, m) in modulos"
              :key="m"
              :class="{'text-muted' : !modulo.active}"
            >
              <template v-if="modulo.edit">
                <v-row>
                  <v-col cols="12" lg="">
                    <v-text-field
                      v-if="modulo.nuevo"
                      v-model="modulo.name_mod"
                      label="Modulo"
                      variant="underlined"
                      hide-details="auto"
                    />
                    <p v-else class="text-body">{{ modulo.name_mod }}</p>
                  </v-col>
                  <v-col cols="6" lg="">
                    <v-text-field
                      v-model="modulo.timeStart"
                      type="time"
                      label="De"
                      variant="underlined"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6" lg="">
                    <v-text-field
                      v-model="modulo.timeEnd"
                      type="time"
                      label="Hasta"
                      variant="underlined"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-list-item-title class="text-capitalize">{{ modulo.name_mod }}</v-list-item-title>
                <v-list-item-subtitle>{{ modulo.timeStart }} a {{ modulo.timeEnd }}</v-list-item-subtitle>
              </template>
              <template #append>
                <v-btn
                  variant="text"
                  :disabled="!modulo.active"
                  :icon="modulo.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="modulo.edit = !modulo.edit"
                />
                <v-btn
                  variant="text"
                  :icon="modulo.active ? 'mdi-circle' : 'mdi-minus-circle'"
                  :class="modulo.active ? 'text-secundario' : 'text-muted'"
                  @click="modulo.active = !modulo.active, modulo.edit = false"
                />
                <v-btn
                  variant="text"
                  icon="mdi-trash-can"
                  class="text-error"
                  @click="modulo.edit = !modulo.edit"
                />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card title="Materias" class="pb-3">
            <template #append>
              <v-btn
                variant="text"
                prepend-icon="mdi-book"
                text="Agregar materia"
                color="secundario"
                @click="AgregarMaterias()"
              />
            </template>
            <v-list-item
              v-for="(materia, m) in materias"
              :key="m"
            >
              <template v-if="materia.edit">
                <v-text-field
                  v-model="materia.title"
                  label="Nombre de la materia"
                  variant="underlined"
                  hide-details="auto"
                  :rules="[(v: string) => !!v || 'Escribe el nombre de la materia']"
                />
              </template>
              <template v-else>
                <v-list-item-title :class="['text-capitalize', {'text-muted' : !materia.active}]"> {{ materia.title }}</v-list-item-title>
              </template>
              <template #append>
                <v-btn
                  variant="text"
                  :disabled="!materia.active"
                  :icon="materia.edit ? 'mdi-check' : 'mdi-pen'"
                  @click="materia.edit = !materia.edit"
                />
                <v-btn
                  variant="text"
                  :icon="materia.active ? 'mdi-circle' : 'mdi-minus-circle'"
                  :class="materia.active ? 'text-secundario' : 'text-muted'"
                  @click="materia.active = !materia.active, materia.edit = false"
                />
                <v-btn
                  variant="text"
                  icon="mdi-trash-can"
                  class="text-error"
                  @click="materia.edit = !materia.edit"
                />
              </template>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>