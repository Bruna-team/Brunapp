<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  año: String,
  seccion: String,
  mencion: String,
  variant: {
    type: Boolean,
    default: false
  },
  classBtn: String
})
defineEmits(['confirmar'])

const agregar = computed(()=>{return props})

const firstName = ref('')
const firstNameRules = [
  (value: string) => {
    if (value?.length > 3) return true
    return 'First name must be at least 3 characters.'
  },
]

const lastName = ref('')
const lastNameRules = [
  (value: string) => {
    if (/[^0-9]/.test(value)) return true
    return 'Last name can not contain digits.'
  },
]
</script>
<template>
  <v-dialog :fullscreen="mobile">
  <template #activator="{ props }">
    <v-btn
      v-bind="props"
      append-icon="mdi-account-school-outline"
      :variant="agregar.variant ? 'text' : 'tonal'"
      :class="agregar.classBtn"
    >
      Agregar
    </v-btn>
  </template>

  <template #default="{ isActive }">
    <v-card>
      <v-toolbar
        dark
      >
      <v-toolbar-title>
        {{ agregar.año && agregar.seccion
          ? `Agrega un estudiante para la seccion ${agregar.seccion}
          año ${agregar.año} mención ${agregar.mencion}`
          : 'Agrega un estudiante'}}
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn
            icon="mdi-close"
            dark
            @click="isActive.value = false"
          />
        </v-toolbar-items>
      </v-toolbar>
      <v-sheet class="pa-3">
        <v-form fast-fail @submit.prevent>
          <v-stepper
            :items="['Datos del estudiante', 'Datos del representante', 'asdfasdf']"
          >
            <template v-slot:item.1>
              <v-card class="box-shadow-none" title="Ingresa los datos del estudiante" flat>
                <v-divider></v-divider>
                <v-row class="mt-2">
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="firstName"
                      label="Nombres"
                      :rules="firstNameRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="lastName"
                      label="Apellidos"
                      :rules="lastNameRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="lastName"
                      label="Cédula"
                      :rules="lastNameRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="lastName"
                      label="Fecha de nacimiento"
                      type="date"
                      :rules="lastNameRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="lastName"
                      label="Teléfono"
                      type="date"
                      :rules="lastNameRules"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <template v-slot:item.2>
              <v-card title="Ingresa los datos del representante" flat>
                <v-divider></v-divider>
                <v-row class="mt-2">
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="firstName"
                      label="Nombres"
                      :rules="firstNameRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="lastName"
                      label="Apellidos"
                      :rules="lastNameRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="lastName"
                      label="Cédula"
                      :rules="lastNameRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="lastName"
                      label="Fecha de nacimiento"
                      type="date"
                      :rules="lastNameRules"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="lastName"
                      label="Teléfono"
                      type="date"
                      :rules="lastNameRules"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <template #actions="{prev, next}">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text="Atras"
                  @click="prev"
                />
                <v-btn
                  text="Siguiente"
                  @click="next"
                />
                <!-- <v-btn
                  type="submit"
                  prepend-icon="mdi-check"
                  variant="tonal"
                  text="Agregar"
                  color="primario"
                /> -->
              </v-card-actions>
            </template>
          </v-stepper>
        </v-form>
      </v-sheet>
    </v-card>
  </template>
</v-dialog>
</template>

<style>
.v-stepper-header, .v-stepper.v-sheet, .box-shadow-none {
  box-shadow: none;
}
</style>
