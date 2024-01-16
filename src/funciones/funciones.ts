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

export {
  capitalizar,
};