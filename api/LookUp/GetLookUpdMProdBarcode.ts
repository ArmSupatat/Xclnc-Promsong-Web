import axios from '~/plugins/axios'
import { GetLookUpdMProdBarcodeInput } from '~/types/GetLookUpdMProdBarcodeInput'

class GetLookUpdMProdBarcode {
  async getLookUpdMProdBarcode(
    body: GetLookUpdMProdBarcodeInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/LookUp/GetLookUpdMProdBarcode`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getLookUpdMProdBarcode = new GetLookUpdMProdBarcode()
