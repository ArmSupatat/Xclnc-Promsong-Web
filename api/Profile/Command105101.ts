import axios from '~/plugins/axios'
import { CreateCommand105101Input } from '~/types/CreateCommand105101Input'

class Command105101 {
  async command105101(
    data: CreateCommand105101Input,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/UserProfile/CreateCommand105101`, data, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}
export const command105101 = new Command105101()
