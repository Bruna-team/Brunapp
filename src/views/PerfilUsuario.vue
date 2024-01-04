<template>
<v-container>
  <div class="d-flex justify-center">
    <v-avatar size="70">
      <v-img
        src="https://cdn.vuetifyjs.com/images/john.jpg"
        alt="Mildred"
      ></v-img>
    </v-avatar>
  </div>
  <p class="text-h4 text-center my-3">Mildred</p>
  <v-divider></v-divider>
  <v-switch v-model="temaLight" inset :label="temaLight ? 'Tema claro' : 'Tema oscuro'"/>
  <v-list>
    <v-list-item
      v-for="info in información"
      :key="info"
      :title="info"
      :subtitle="info"
    ></v-list-item>
  </v-list>
</v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify'

const theme = useTheme()

const temaLight = ref(true)
const información = ref({
  telefono: "04243333333",
  area: "Coordinación 1",
})

localStorage.getItem("brunaTheme") == 'dark'
? temaLight.value = false
: temaLight.value = true

watch(temaLight, () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem("brunaTheme", theme.global.current.value.dark ? 'dark' : 'light')
});
</script>