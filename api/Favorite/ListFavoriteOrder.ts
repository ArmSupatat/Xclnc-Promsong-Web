import axios from '~/plugins/axios'
import { ListFavoriteOrderInput } from '~/types/ListFavoriteOrderInput'

class ListFavoriteOrder {
  async listFavoriteOrder(
    body: ListFavoriteOrderInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/OrderFavorite/X118101GetMMBProdProperty`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const listFavoriteOrder = new ListFavoriteOrder()
