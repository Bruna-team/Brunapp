<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import NavBar from './components/NavBar.vue';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const showNav = computed(() => (route.name !== 'LogIn') && (route.name !== 'SingIn'))
const theme = useTheme()
const loading = ref(true)
// @ts-ignore
router.beforeEach((to, from, next) => {
  loading.value = true;
  next();
});

router.afterEach(() => {
  loading.value = false;
});
localStorage.getItem("brunaTheme") == 'darkTheme'
  ? theme.global.name.value = 'darkTheme'
  : theme.global.name.value = 'lightTheme'
</script>

<template>
  <v-layout>
    <NavBar v-if="showNav"/>
    <v-main>
      <v-overlay
        v-model="loading"
        persistent
        class="d-flex justify-center align-center"
      >
        <v-progress-circular
          indeterminate
          size="80"
          color="primario"
        />
      </v-overlay>
      <RouterView />
    </v-main>
  </v-layout>
</template>
