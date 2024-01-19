<script setup lang="ts">
import { ref, computed } from 'vue';
const props = defineProps({
  materias: {
    type: Object,
    default: {}
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
</script>
<template>
<v-dialog width="700">
  <template v-slot:activator="{ props }">
    <v-btn v-bind="props" color="secundario" text="Configurar maestro"> </v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card title="Dialog">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-combobox
              chips
              label="Materia"
              :items="Object.values(materias)"
              item-title="materia"
              item-value="id"
            />
          </v-col>
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
          <v-col cols="12" md="6">
            <v-combobox
              v-if="rol.id == 2"
              chips
              label="Asignar sección como guía"
              :items="Object.values(materias)"
              item-title="materia"
              item-value="id"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-combobox
              chips
              label="Horarios"
              :items="Object.values(materias)"
              item-title="materia"
              item-value="id"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          prepend-icon="mdi-close"
          text="Cerrar"
          @click="isActive.value = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>