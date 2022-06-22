import axios from '~/plugins/axios'

class GroupBusiness {
  async commandGroupBusiness(
    viewMode: number,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`Account/CommandGroupBusiness?ViewMode=${viewMode}`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const groupBusiness = new GroupBusiness()
