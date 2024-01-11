const formatoEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

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
 * @param {string} email
 * @return {boolean}
 */
function validarEmail(email:string) {
  return formatoEmail.test(email);
}

/**
 * @param {string} telefono
 * @param {string} codigo
 * @return {boolean}
 */
function validarTel(telefono:string, codigo:string) {
  const telefonoFormateado = String(codigo) + String(telefono);
  const valido = parseFloat(telefonoFormateado) && /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(telefonoFormateado);
  return (valido);
}

export {
  capitalizar,
  validarTel,
  validarEmail,
};