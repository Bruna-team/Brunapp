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
 * @param {date} string
 * @param {type} string
 * @return {string}
 */
function formatoFechaYHora (date: string, type: string) {
  const fecha = `${new Date(date).getFullYear()}-${String(new Date(date).getMonth()+1).padStart(2, '0')}-${String(new Date(date).getDate()).padStart(2, '0')}`
  const hora = new Date(date).toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'})
  switch (type) {
    case 'fecha':
      return fecha
    case 'hora':
      return fecha
    default:
      return fecha+'T'+hora
  }
}

export {
  capitalizar,
  formatoFechaYHora,
};