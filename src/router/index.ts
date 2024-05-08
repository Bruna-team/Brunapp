import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/components/NavBar.vue"),
      children: [
        {
          path: "/seccion/:sec?",
          name: "seccion",
          component: () => import("@/views/VistaSeccion.vue"),
        },
        {
          path: "/",
          name: "secciones",
          component: () => import("@/views/VistaSecciones.vue"),
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
          children: [
            {
              path: "pases",
              name: "pases",
              props: true,
              component: () => import("@/views/reportes/ReportesPases.vue"),
            },
            {
              path: "observaciones",
              name: "observaciones",
              props: true,
              component: () => import("@/views/reportes/ReportesObservaciones.vue"),
            },
            {
              path: "inasistencias",
              name: "inasistencias",
              props: true,
              component: () => import("@/views/reportes/ReportesInasistencias.vue"),
            }
          ]
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
        }
      ]
    },
    {
      path: "/sesion",
      name: "sesion",
      children: [
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
      ]
    },
  ],
});

export default router;
