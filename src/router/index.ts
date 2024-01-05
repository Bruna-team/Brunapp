import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../components/NavBar.vue"),
      children: [
        {
          path: "/",
          name: "secciones",
          component: () => import("../views/VistaSecciones.vue"),
        },
        {
          path: "/seccion",
          name: "sección",
          component: () => import("../views/VistaSeccion.vue"),
        },
        {
          path: "/usuario",
          name: "Perfil",
          component: () => import("../views/PerfilUsuario.vue"),
        },
      ]
    },
    {
      path: "/sesion",
      name: "sesion",
      children: [
        {
          path: "/LogIn",
          name: "LogIn",
          component: () => import("../views/LogIn.vue"),
        },
        {
          path: "/SingIn",
          name: "SingIn",
          component: () => import("../views/LogIn.vue"),
        }
      ]
    },
  ],
});

export default router;
