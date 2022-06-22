import axios from '~/plugins/axios'
import { CalPurOrdInput } from '~/types/CalPurOrdInput'

class CalculatePurOrd {
  async calculatePurOrd(
    body: CalPurOrdInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/Order/CalPurOrd`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const calculatePurOrd = new CalculatePurOrd()
