import { createRouter, createWebHistory } from "vue-router";
import { hasAccessToRoute } from '@/funciones/api'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "secciones",
      component: () => import("@/views/VistaSecciones.vue"),
      beforeEnter: (to, from, next) => {
        hasAccessToRoute('secciones').then((route) => {
          if (route) {
            next(route);
          } else {
            next();
          }
        }).catch(() => {});
      },
    },
    {
      path: "/seccion/:sec?",
      name: "seccion",
      component: () => import("@/views/VistaSeccion.vue"),
      beforeEnter: (to, from, next) => {
        hasAccessToRoute('seccion').then((route) => {
          if (route) {
            next(route);
          } else {
            next();
          }
        }).catch(() => {});
      },
    },
    {
      path: "/maestros",
      name: "maestros",
      component: () => import("@/views/VistaMaestros.vue"),
      beforeEnter: (to, from, next) => {
        hasAccessToRoute('maestros').then((route) => {
          if (route) {
            next(route);
          } else {
            next();
          }
        }).catch(() => {
          next({ path: 'acceso-denegado', query: { message: 'err' } });
        });
      },
    },
    {
      path: "/reportes",
      name: "reportes",
      component: () => import("@/views/VistaReportes.vue"),
      beforeEnter: (to, from, next) => {
        hasAccessToRoute('reportes').then((route) => {
          if (route) {
            next(route);
          } else {
            next();
          }
        }).catch(() => {});
      },
    },
    {
      path: "/pases",
      name: "pases",
      props: true,
      component: () => import("@/views/PasesDeEntradaYSalida.vue"),
      beforeEnter: (to, from, next) => {
        hasAccessToRoute('pases').then((route) => {
          if (route) {
            next(route);
          } else {
            next();
          }
        }).catch(() => {});
      },
    },
    {
      path: "/configuracion",
      name: "configuracion",
      component: () => import("@/views/VistaConfiguracion.vue"),
      beforeEnter: (to, from, next) => {
        hasAccessToRoute('configuracion').then((route) => {
          if (route) {
            next(route);
          } else {
            next();
          }
        }).catch(() => {});
      },
    },
    {
      path: "/usuario",
      name: "Perfil",
      component: () => import("@/views/PerfilUsuario.vue"),
    },
    {
      path: '/acceso-denegado',
      name: "AccesoDenegado",
      props: (route) => ({ message: route.query.message }),
      component: () => import("@/views/AccesoDenegado.vue"),
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
