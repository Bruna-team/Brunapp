import axios from 'axios'
import router from '@/router'
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://brunapi.000webhostapp.com/api/consultas.php'
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
        if (respuesta.data.e === 'Invalido') {
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
