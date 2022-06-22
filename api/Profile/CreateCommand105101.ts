import axios from '~/plugins/axios'
import { CreateCommand105101Input } from '~/types/CreateCommand105101Input'

class CreateCommand105101 {
  async createCommand105101(
    createCommand105101Input: CreateCommand105101Input,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/UserProfile/CreateCommand105101`, createCommand105101Input, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}
export const createCommand105101 = new CreateCommand105101()
