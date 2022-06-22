import axios from '~/plugins/axios'
import { CreatePlatformShopTypInput } from '~/types/CreatePlatformShopTypInput'

class CommandPlatformShopTyp {
  async createPlatformShopTyp(
    createCmdPltformTypInput: CreatePlatformShopTypInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/Account/CreateCommandPlatformShopTyp`, createCmdPltformTypInput, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const commandPltformShopTyp = new CommandPlatformShopTyp()
