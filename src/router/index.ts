import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "VistaInicio",
      alias: '/home',
      component: () => import("../views/VistaInicio.vue"),
    },
    {
      path: "/usuario",
      name: "Perfil",
      component: () => import("../views/PerfilUsuario.vue"),
    },
    {
      path: "/seccion",
      name: "Sección",
      component: () => import("../components/VistaSeccion.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
    },
  ],
});

export default router;
