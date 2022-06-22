import axios from '~/plugins/axios'
class GetLookUpSupId {
  async getLookUpSupId(subId: number, global: string, channelName: string) {
    return await axios
      .post(`/LookUp/GetLookUpSupId?SubId=${subId}`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getLookUpSupId = new GetLookUpSupId()
