import axios from '~/plugins/axios'

class Command {
  async createCommandBusiness(global: string, channelName: string) {
    return await axios
      .post(`/Account/CreateCommandBusiness`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}

export const command = new Command()
