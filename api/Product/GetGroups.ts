import axios from '~/plugins/axios'

class Groups {
  async getAllGroups(global: string, channelName: string) {
    const allGroups = await axios
      .post('/Product/GetProdGroups?priceTypeIdRequest=4', null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
    return allGroups
  }
}
export const getGroups = new Groups()
