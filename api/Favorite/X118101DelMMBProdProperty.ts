import axios from '~/plugins/axios'
import { X118101DelMMBProdPropertyInput } from '~/types/X118101DelMMBProdPropertyInput'

class X118101DelMMBProdProperty {
  async x118101DelMMBProdProperty(
    body: X118101DelMMBProdPropertyInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/OrderFavorite/X118101DelMMBProdProperty`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const x118101DelMMBProdProperty = new X118101DelMMBProdProperty()
