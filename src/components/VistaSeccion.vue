<template>
  <section class="main-container d-flex">
    <v-list lines="one">
      <v-list-item
        v-for="estudiante in estudiantes"
        :key="estudiante.id"
        :title="estudiante.nombre"
        :subtitle="estudiante.cedula"
        :prepend-avatar="estudiante.avatar"
        @clic="selecionado = estudiante"
        class="my-3"
      ></v-list-item>
    </v-list>
    <div v-if="selecionado">
      <v-row>
        <v-col>
          <v-select label="Periodo" :items="periodos" v-model="periodo"></v-select>
        </v-col>
        <v-col>
          <div class="box">
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input v-model="newItemTitle" class="input" type="text" />
              </div>
            </div>

            <div class="field">
              <label class="label">Start date</label>
              <div class="control">
                <input v-model="newItemStartDate" class="input" type="date" />
              </div>
            </div>

            <div class="field">
              <label class="label">End date</label>
              <div class="control">
                <input v-model="newItemEndDate" class="input" type="date" />
              </div>
            </div>

            <button class="button is-info" @click="clickTestAddItem">Add Item</button>
          </div>
        </v-col>
      </v-row>
      <calendar-view
        :display-period-uom="periodo"
        :starting-day-of-week="Lunes"
        :show-date="showDate"
        class="theme-default holiday-us-traditional holiday-us-official"
      >
        <template #header="{ headerProps }">
          <calendar-view-header :header-props="headerProps" @input="setShowDate" />
        </template>
      </calendar-view>
    </div>
    <div v-else>
      <p>Selecciona un estudiante para ver su información</p>
    </div>
  </section>
</template>
<script lang="ts">
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import "/node_modules/vue-simple-calendar/dist/style.css";
import "/node_modules/vue-simple-calendar/dist/css/holidays-us.css";
import "/node_modules/vue-simple-calendar/dist/css/default.css";

// The next two lines are optional themes
// import "..relative-path-to-node_modules/vue-simple-calendar/dist/css/default.css";
// import "..relative-path-to-node_modules/vue-simple-calendar/dist/css/holidays-us.css";
export default {
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  data: () => ({
    selecionado: {},
    estudiantes: [
      {
        id: "12",
        nombre: "Antonio Jose Castellano",
        avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
        cedula: "23322323",
        telefono: "04243333333",
        area: "Coordinación 1",
      },
      {
        id: "12",
        nombre: "Maria Jose Alvarez",
        avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
        cedula: "23322323",
        telefono: "04243333333",
        area: "Coordinación 1",
      },
      {
        id: "12",
        nombre: "Luis Camilo Castellano",
        avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
        cedula: "23322323",
        telefono: "04243333333",
        area: "Coordinación 1",
      },
    ],
    periodos: ["week", "month", "year"],
    periodo: "month",
    Lunes: 1,
    showDate: new Date(),
  }),
  methods: {
    setShowDate(d) {
      this.showDate = d;
    },
  },
};
</script>
