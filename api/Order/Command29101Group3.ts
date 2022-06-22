import axios from '~/plugins/axios'
import { Command29101Group3BodyInput } from '~/types/Command29101Group3BodyInput'
class Command29101Group3 {
  async command29101Group3(
    viewMode: number,
    body: Command29101Group3BodyInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/Order/Command29101Group3?ViewMode=${viewMode}`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}
export const cmdGrp3PO = new Command29101Group3()
