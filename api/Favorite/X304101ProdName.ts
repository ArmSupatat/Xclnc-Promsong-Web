import axios from '~/plugins/axios'
import { X304101ProdNameInput } from '~/types/X304101ProdNameInput'

class X304101ProdName {
  async x304101ProdName(
    body: X304101ProdNameInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/OrderFavorite/X304101ProdName`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const x304101ProdName = new X304101ProdName()
