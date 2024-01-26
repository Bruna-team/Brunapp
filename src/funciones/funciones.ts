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
   return string
 }
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

export {
  capitalizar,
  formatoFechaYHora,
};