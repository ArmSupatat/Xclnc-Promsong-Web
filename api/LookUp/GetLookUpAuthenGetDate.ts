import axios from '~/plugins/axios'

class GetLookUpAuthenGetDate {
  async getLookUpAuthenGetDate(global: string, channelName: string) {
    return await axios
      .post(`/LookUp/GetLookUpAuthenGetDate`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getLookUpAuthenGetDate = new GetLookUpAuthenGetDate()
