import axios from '~/plugins/axios'
import { GetCouponFilterInput } from '~/types/GetCouponFilterInput'

class GetListCoupon {
  async getListCoupon(
    poId: number | null,
    filter: GetCouponFilterInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(
        `/LookUp/GetLookUpCoupon?${
          poId ? `PoId=${poId}&` : ''
        }Filter.PagingFrom=${filter.pagingFrom}&Filter.PagingTo=${
          filter.pagingTo
        }&Filter.Search=${filter.search}&Filter.Barcode=${filter.barcode}`,
        null,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response: any) => response.data)
      .catch((err: any) => console.log(err))
  }
}
export const getListCoupon = new GetListCoupon()
