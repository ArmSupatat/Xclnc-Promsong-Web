import axios from '~/plugins/axios'
import { SaveMPictureInput } from '~/types/SaveMPictureInput'

class SaveMPicture {
  async saveMPicture(
    body: SaveMPictureInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/Order/SaveMPicture`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const saveMPicture = new SaveMPicture()
