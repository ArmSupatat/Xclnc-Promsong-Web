import axios from '~/plugins/axios'
import { ListOrderBodyInput } from '~/types/ListOrderBodyInput'

class ListOrder {
  async listOrder(
    body: ListOrderBodyInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/Order/ListOrder`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}
export const listOrder = new ListOrder()
