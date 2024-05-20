import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "secciones",
      component: () => import("@/views/VistaSecciones.vue"),
    },
    {
      path: "/seccion/:sec?",
      name: "seccion",
      component: () => import("@/views/VistaSeccion.vue"),
    },
    {
      path: "/maestros",
      name: "maestros",
      component: () => import("@/views/VistaMaestros.vue"),
    },
    {
      path: "/reportes",
      name: "reportes",
      component: () => import("@/views/VistaReportes.vue"),
    },
    {
      path: "/pases",
      name: "pases",
      props: true,
      component: () => import("@/views/PasesDeEntradaYSalida.vue"),
    },
    {
      path: "/configuracion",
      name: "configuracion",
      component: () => import("@/views/VistaConfiguracion.vue"),
    },
    {
      path: "/usuario",
      name: "Perfil",
      component: () => import("@/views/PerfilUsuario.vue"),
    },
    {
      path: "/LogIn",
      name: "LogIn",
      component: () => import("@/views/LogIn.vue"),
    },
    {
      path: "/SingIn",
      name: "SingIn",
      component: () => import("@/views/LogIn.vue"),
    }
  ],
});

export default router;
