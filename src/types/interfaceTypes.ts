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

export type {Menciones, Pase}