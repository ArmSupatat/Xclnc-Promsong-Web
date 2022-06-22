import axios from '~/plugins/axios'
import { CmdGrp3OrderFavoriteBodyInput } from '~/types/CmdGrp3OrderFavoriteBodyInput'

class Cmd304101Grp3 {
  async cmd304101Grp3(
    viewMode: number,
    body: CmdGrp3OrderFavoriteBodyInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/OrderFavorite/Cmd304101Grp3?ViewMode=${viewMode}`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const cmd304101Grp3 = new Cmd304101Grp3()
