import axios from '~/plugins/axios'

class GetLookUpPaymentTypIdx {
  async getLookUpPaymentTypIdx(data: any, global: string, channelName: string) {
    return await axios
      .post(`/LookUp/GetLookUpPaymentTypIdx`, data, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getLookUpPaymentTypIdx = new GetLookUpPaymentTypIdx()
