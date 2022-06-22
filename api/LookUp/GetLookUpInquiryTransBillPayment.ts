import axios from '~/plugins/axios'
import { GetLookUpInquiryTransBillPaymentInput } from '~/types/GetLookUpInquiryTransBillPaymentInput'

class GetLookUpInquiryTransBillPayment {
  async getLookUpInquiryTransBillPayment(
    body: GetLookUpInquiryTransBillPaymentInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/LookUp/GetLookUpInquiryTransBillPayment`, body, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getLookUpInquiryTransBillPayment =
  new GetLookUpInquiryTransBillPayment()
