<script setup lang="ts">
import {ref} from 'vue'
const dialog = ref(false)
</script>
<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        color="primary"
        class="mb-2"
        v-bind="props"
      >
        Imprimir
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Imprimir</span>
      </v-card-title>

      <v-card-text>
        <v-container>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="dialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click=""
        >
          Imprimir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>