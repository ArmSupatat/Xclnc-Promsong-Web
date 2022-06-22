import axios from '~/plugins/axios'
import { UserSysListComDepLevelInput } from '~/types/UserSysListComDepLevelInput'

class SysListComDepLevel {
  async UserSysListComDepLevel(
    body: UserSysListComDepLevelInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`UserProfile/SysListComDepLevel`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}
export const sysListComDepLevel = new SysListComDepLevel()
