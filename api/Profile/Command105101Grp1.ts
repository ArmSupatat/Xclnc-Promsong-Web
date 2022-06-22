import axios from '~/plugins/axios'

class Command105101Grp1 {
  async command105101Group1(global: string, channelName: string) {
    return await axios
      .post(`/UserProfile/Command105101Group1`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}
export const command105101grp1 = new Command105101Grp1()
