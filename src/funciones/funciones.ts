/**
 * @param {string} string
 * @return {string}
 */
function capitalizar (string: string) {
 if (string) {
   const textotoLowerCase = string.toLowerCase()
   const textoCapitalize = textotoLowerCase.replace(/(^\w|\s\w)/g, (m) =>
     m.toUpperCase()
   )
   const textoSinEspacios = textoCapitalize.trim().replace(/\s+/g, ' ')
   string = textoSinEspacios
  }
  return string
}
/**
 * @param {date} Date
 * @param {type} string
 * @return {string}
 */
function formatoFechaYHora (date: Date, type: string) {
  const fecha = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const hora = `${String(date.getHours()).padStart(2, '0')}:${String(date.getDate()).padStart(2, '0')}`
  switch (type) {
    case 'fecha':
      return fecha
    case 'hora':
      return hora
    default:
      return `${fecha}T${hora}`
  }
}
function sustituirSpandEmbed(data:any) {
  document.querySelectorAll('.editor-var').forEach((e: any) => {
    const id = e.getAttribute('data-id')
    switch (e.getAttribute('data-type')) {
      case 'Estudiante':
        switch(id) {
          case 'Ename':
            if(data.nombre) {
              e.getElementsByTagName('span')[0].textContent =
              data.nombre
            }
            break;
          case 'representante':
            if(data.representantes) {
               e.getElementsByTagName('span')[0].textContent =
               data.representantes
            }
            break;
          case 'Ecedula':
            if(data.ced_alum) {
              e.getElementsByTagName('span')[0].textContent =
              data.ced_alum
            }
            break;
        }
        break;
      case 'Academico':
        switch(id) {
           case 'modulo':
            if(data.modulo_hor) {
              e.getElementsByTagName('span')[0].textContent =
              data.modulo_hor
            }
            break;
          case 'seccion':
            if(data.sec_ano) {
              e.getElementsByTagName('span')[0].textContent =
              data.sec_ano
            }
            break;
          case 'mencion':
            if(data.nom_men) {
              e.getElementsByTagName('span')[0].textContent =
              data.nom_men
            }
            break;
          case 'curso':
            if(data.nom_ano) {
              e.getElementsByTagName('span')[0].textContent =
              data.nom_ano
            }
            break;
        }
        break;
      case 'Profesor':
         switch(id) {
          case'Pname':
            if(data.profesor) {
              e.getElementsByTagName('span')[0].textContent =
              data.profesor
            }
            break;
          case'materia':
            if(data.nom_mat) {
              e.getElementsByTagName('span')[0].textContent =
              data.nom_mat
            }
            break;
          }
          break;
      case 'Fecha':
      switch(id) {
        case('Date'):
          if(data.pasefecha) {
            e.getElementsByTagName('span')[0].textContent =
            formatoFechaYHora(new Date(data.pasefecha), 'fecha')
          }
          break;
        case('DateTime'):
          if(data.pasefecha) {
            e.getElementsByTagName('span')[0].textContent =
            formatoFechaYHora(new Date(data.pasefecha), 'hora')
          }
          break;
      }
      break;
    }
  })
}
/**
 * @param {ced} String
 * @return {Boolean | String}
 */
function validateCed(ced: string) {
  return (/^\d{7,8}$/.test(ced)) || 'La cédula debe tener la longitud correcta y no debe tener puntos, espacios o letras.'
}
/**
 * @param {date} String
 * @return {Boolean | String}
 */
function validateBornDate(date: string) {
  let fecha = new Date(date)
  let hoy = new Date()
  let edad = hoy.getFullYear() - fecha.getFullYear()
  fecha.setFullYear(hoy.getFullYear())
  hoy < fecha ? edad-- : ''
  return edad>=10 && edad<=18 || 'La fecha de nacimiento debe ser para mayor de 10 y menor de 18 años de edad.'
}
/**
 * @param {data} Array
 * @param {semanero} Boolean
 * @return {Array}
 */
function organizarSecciones(data:string[], semanero?:boolean) {
  const dataMen:any = {}
  data.forEach((d:any) => {
    if (!dataMen[d.id_men]) {
      dataMen[d.id_men] = {
        id_men: d.id_men,
        men: d.nom_men,
        ano: {}
      }
    }
    if(!dataMen[d.id_men].ano[d.nom_ano]) {
      dataMen[d.id_men].ano[d.nom_ano] = {
        id_ano: d.id_ano,
        nom_ano: d.nom_ano,
        num_ano: d.num_ano,
        sec: {}
      }
    }
    if(!dataMen[d.id_men].ano[d.nom_ano].sec[d.sec_ano]) {
      if(semanero) {
        dataMen[d.id_men].ano[d.nom_ano].sec[d.sec_ano] = {
          id_ano: d.id_ano,
          sec_nom: d.sec_ano,
          semanero: d.pnom_alum + ' ' + d.pape_alum,
          num_sec: d.num_est
        }
      } else {
        dataMen[d.id_men].ano[d.nom_ano].sec[d.sec_ano] = {
          id_ano: d.id_ano,
          sec_nom: d.sec_ano,
        }
      }
    }
  })
  return dataMen
}
export {
  capitalizar,
  formatoFechaYHora,
  sustituirSpandEmbed,
  validateCed,
  validateBornDate,
  organizarSecciones,
};