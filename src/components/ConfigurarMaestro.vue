<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify'
const { smAndUp } = useDisplay()
const props = defineProps({
  materias: {
    type: Object,
    default: {}
  },
  asignarRol: {
    type: Boolean,
    default: false
  },
})
const materias = computed(()=> props.materias)
const rols = ref([
  {
    id:0,
    rol: 'Profesor',
  },
  {
    id:1,
    rol: 'Coordinación',
  },
  {
    id:2,
    rol: 'Guía',
  }
])
const rol = ref({id: 0, rol: 'Profesor'})
const jornadas= ref(1)
</script>
<template>
<v-dialog max-width="850" close-on-back scrollable :fullscreen="!smAndUp">
  <template v-slot:activator="{ props }">
    <v-btn v-bind="props" color="secundario" :text="asignarRol ? 'Asignar rol' : 'Configurar'"> </v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-toolbar dark>
        <v-toolbar-title>
          {{ asignarRol ? 'Asignar rol' : 'Configurar' }}
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn
            icon="mdi-close"
            dark
            @click="isActive.value = false"
          />
        </v-toolbar-items>
      </v-toolbar>
    <v-card>
      <v-card-text v-if="asignarRol">
        <v-row>
          <v-col cols="12" md="6">
            <v-combobox
              chips
              label="Asignar rol"
              v-model="rol"
              :items="Object.values(rols)"
              return-object
              item-title="rol"
              item-value="id"
            />
          </v-col>
          <template v-if="rol.id == 2">
            <v-col cols="12" md="6">
              <v-combobox
                chips
                label="Mención"
                :items="Object.values(materias)"
                item-title="materia"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox
                chips
                label="Año"
                :items="Object.values(materias)"
                item-title="materia"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox
                chips
                label="Sección"
                :items="Object.values(materias)"
                item-title="materia"
                item-value="id"
              />
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-card-text v-else>
        <section v-for="jornada in jornadas">
          <v-divider/>
          <p class="d-flex align-center">
            <span class="flex-fill">
              {{ jornada }} horario
            </span>
            <v-btn icon="mdi-trash-can" color="error" variant="text"/>
          </p>
          <v-divider class="mb-2"/>
          <v-row>
            <v-col cols="12" sm="6">
              <v-combobox
                chips
                label="Horarios"
                :items="Object.values(materias)"
                item-title="materia"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-combobox
                chips
                label="Materia"
                :items="Object.values(materias)"
                item-title="materia"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-combobox
                chips
                label="Mención"
                :items="Object.values(materias)"
                item-title="materia"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-combobox
                chips
                label="Año"
                :items="Object.values(materias)"
                item-title="materia"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-combobox
                chips
                label="Sección"
                :items="Object.values(materias)"
                item-title="materia"
                item-value="id"
              />
            </v-col>
          </v-row>
        </section>
        <v-btn block color="secundario" @click="jornadas++" text="Agregar otra jornada" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          prepend-icon="mdi-close"
          text="Cerrar"
          @click="isActive.value = false"
        />
        <v-btn
          prepend-icon="mdi-check"
          text="Guardar"
          variant="tonal"
          color="primario"
          @click="isActive.value = false"
        />
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>