interface secciones {
  id_ano: string,
  sec_nom: string,
  num_sec?: string
  semanero?: string,
  nuevo? : boolean,
}
interface Anos {
  id_ano: string,
  nom_ano: string,
  num_ano: string,
  nuevo? : boolean,
  sec: [secciones]
}
interface Menciones {
  id_men: string,
  men: string,
  edit?: Boolean,
  nuevo? : boolean,
  ano: [Anos]
}
interface MencionesReportes {
  id_men: string,
  men: string,
  edit?: Boolean,
  nuevo? : boolean,
  ano: {
    [key: string]: Anos
  }
}
interface Pase {
  ano: string,
  mencion: string,
  seccion: string,
  pasefecha: string,
  pasehor: string,
  id: string,
  estudiante: string,
  estudianteCedula: string,
  representante: string,
  type?: string,
}
interface Modulos {
  id_hor: string,
  modulo_hor: string,
  inicio_hor: string,
  fin_hor: string,
  edit?: boolean,
  nuevo?: boolean
}
interface Materias {
  id_mat: string,
  nom_mat: string,
  edit?: boolean,
  nuevo?: boolean,
}
interface Periodos {
  startF: string,
  endF: string,
  startS: string,
  endS: string,
  edit?: boolean,
}
interface Maestros {
  id_person: string,
  dia_hor: string,
  fin_hor: string,
  inicio_hor: string,
  nom_mat: string,
  nom_men: string,
  num_ano: string,
  profesor: string,
  sec_ano: string,
  id_car: string,
  nom_car: string
}
interface Estudiantes {
  ced_alum: string,
  id_estd: string,
  pape_alum: string,
  pnom_alum: string,
  sape_alum: string,
  snom_alum: string,
}
export type {
  Menciones,
  MencionesReportes,
  Pase,
  Modulos,
  Materias,
  Periodos,
  Maestros,
  Estudiantes
}