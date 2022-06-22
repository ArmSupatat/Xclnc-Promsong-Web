import axios from '~/plugins/axios'
import { CmdOrderFavoriteInput } from '~/types/CmdOrderFavoriteInput'

class CmdOrderFavorite {
  async cmdOrderFavorite(
    body: CmdOrderFavoriteInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/OrderFavorite/CmdOrderFavorite`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const cmdOrderFavorite = new CmdOrderFavorite()
