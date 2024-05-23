/**
 * Retorna un string con comas e y
 * @param {Array} array a comprobar
 * @return {String} Valor de la comprobación
 * @description Valida que el parametro enviado sea un string valido
 */
function autoComaYAutoY(array: any) {
  if (array.length) {
    return array.length == 1 ? `${array[0]}` : `${array.slice(0, -1).join(', ')} y ${array.slice(-1)}`;
  }
}
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
            if(data.estudiante) {
              e.getElementsByTagName('span')[0].textContent =
              data.estudiante
            }
            break;
          case 'representante':
            if(data.representante) {
               e.getElementsByTagName('span')[0].textContent =
               data.representante
            }
            break;
          case 'Ecedula':
            if(data.estudianteCedula) {
              e.getElementsByTagName('span')[0].textContent =
              data.estudianteCedula
            }
            break;
        }
        break;
      case 'Academico':
        switch(id) {
           case 'modulo':
            if(data.modulo) {
              e.getElementsByTagName('span')[0].textContent =
              data.modulo
            }
            break;
          case 'seccion':
            if(data.seccion) {
              e.getElementsByTagName('span')[0].textContent =
              data.seccion
            }
            break;
          case 'mencion':
            if(data.mencion) {
              e.getElementsByTagName('span')[0].textContent =
              data.mencion
            }
            break;
          case 'curso':
            if(data.ano) {
              e.getElementsByTagName('span')[0].textContent =
              data.ano
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
            if(data.materia) {
              e.getElementsByTagName('span')[0].textContent =
              data.materia
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
export {
  autoComaYAutoY,
  capitalizar,
  formatoFechaYHora,
  sustituirSpandEmbed,
  validateCed,
  validateBornDate,
};