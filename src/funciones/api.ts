import axios from 'axios'
import router from '../router'
console.log(process.env.NODE_ENV)
// const baseURL = 'http://localhost/Bruna/Brunapi/api/consultas.php'
const baseURL = process.env.NODE_ENV === 'production'
  ? 'mysql://root:-4Ha16GeBaafcda1-aDbBaEb-6Eg4C-A@monorail.proxy.rlwy.net:14256/railway'
  : 'http://localhost/Bruna/Brunapi/api/consultas.php'

/**
 * @param {object} params
 * @param {object} data
 * @return {object}
 */
function brunaApi (params: any, data: any) {
  return new Promise((resolve, reject) => {
    axios.request({
      baseURL,
      method: 'post',
      params,
      data,
      withCredentials: true
    })
      .then((respuesta) => {
        if (typeof respuesta.data === 'string' && respuesta.data.indexOf('<!--log-->') === 0) {
          router.push('LogIn')
        }
        return resolve(respuesta)
      })
      .catch((error) => reject(error))
  })
}

export {
  brunaApi
}
