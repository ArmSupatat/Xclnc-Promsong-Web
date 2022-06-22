import axios from '~/plugins/axios'

class Command105101Group3 {
  async command105101Group3(
    viewMode: string,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/UserProfile/Command105101Group3?viewMode=${viewMode}`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}
export const command105101Group3 = new Command105101Group3()
