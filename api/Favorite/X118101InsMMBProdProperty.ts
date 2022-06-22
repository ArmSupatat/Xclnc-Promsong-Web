import axios from '~/plugins/axios'
import { X118101InsMMBProdPropertyInput } from '~/types/X118101InsMMBProdPropertyInput'

class X118101InsMMBProdProperty {
  async x118101InsMMBProdProperty(
    body: X118101InsMMBProdPropertyInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/OrderFavorite/X118101InsMMBProdProperty`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const x118101InsMMBProdProperty = new X118101InsMMBProdProperty()
