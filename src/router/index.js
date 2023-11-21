import { createRouter, createWebHistory } from "vue-router";
import VistaInicio from "../views/VistaInicio.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "VistaInicio",
      component: VistaInicio,
    },
    {
      path: "/usuario",
      name: "Perfil",
      component: () => import("../components/PerfilUsuario.vue"),
    },
    {
      path: "/seccion",
      name: "Sección",
      component: () => import("../components/VistaSeccion.vue"),
    },
  ],
});

export default router;
