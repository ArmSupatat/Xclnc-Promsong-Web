import axios from '~/plugins/axios'
import { GetLookUpGenerateQrCodeBodyInput } from '~/types/GetLookUpGenerateQrCodeBodyInput'

class GetLookUpGenerateQrCode {
  async getLookUpGenerateQrCode(
    billerId: string,
    ref1: string,
    ref2: string,
    amount: number,
    body: GetLookUpGenerateQrCodeBodyInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(
        `/LookUp/GetLookUpGenerateQrCode?BillerId=${billerId}&Reference1=${ref1}&Reference2=${ref2}&Amount=${amount}`,
        body,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getLookUpQrCode = new GetLookUpGenerateQrCode()
