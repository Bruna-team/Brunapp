<template>
  <section class="main-container">
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
    <v-list>
      <v-list-item
        v-for="info in información"
        :key="info"
        :title="info"
        :subtitle="info"
      ></v-list-item>
    </v-list>
  </section>
</template>

<script lang="ts">
export default {
  data: () => ({
    información: {
      telefono: "04243333333",
      area: "Coordinación 1",
    },
  }),
};
</script>
