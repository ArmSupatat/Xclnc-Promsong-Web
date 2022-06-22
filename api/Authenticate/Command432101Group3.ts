import axios from '~/plugins/axios'

class Command432101Group3 {
  async command432101Group3(
    viewMode: number,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`Account/Command432101Group3?ViewMode=${viewMode}`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const command432101Group3 = new Command432101Group3()
