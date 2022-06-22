import axios from '~/plugins/axios'
import { GetListProductFavoriteInput } from '~/types/GetListProductFavoriteInput'

class GetListProductFavorite {
  async getListProductFavorite(
    body: GetListProductFavoriteInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/OrderFavorite/X29101GetProductFavorite`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getListProductFavorite = new GetListProductFavorite()
