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
export {
  capitalizar,
  formatoFechaYHora,
  sustituirSpandEmbed,
};