import axios from '~/plugins/axios'
import { CreateCommandBusinessInput } from '~/types/CreateCommandBusinessInput'

class CommandBusiness {
  async createCmdBusiness(
    createCmdBusInput: CreateCommandBusinessInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/Account/CreateCommandBusiness`, createCmdBusInput, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const commandBusiness = new CommandBusiness()
