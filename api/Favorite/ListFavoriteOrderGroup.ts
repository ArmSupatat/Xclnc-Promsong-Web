import axios from '~/plugins/axios'
import { ListFavoriteOrderGroupInput } from '~/types/ListFavoriteOrderInput'

class ListFavoriteOrderGroup {
  async listFavoriteOrderGroup(
    body: ListFavoriteOrderGroupInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/OrderFavorite/ListFavoriteOrder`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const listFavoriteOrderGroup = new ListFavoriteOrderGroup()
