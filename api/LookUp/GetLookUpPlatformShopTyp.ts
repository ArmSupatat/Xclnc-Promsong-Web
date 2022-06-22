import axios from '~/plugins/axios'
import { PlatformShopTypeSearch } from '~/types/PlatformShopTypeSearch'

class LookUp {
  async getLookUpPlatformShopTyp(
    filter: PlatformShopTypeSearch,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(
        `/LookUp/GetLookUpPlatformShopTyp?Filter.PagingFrom=${filter.pagingFrom}&Filter.PagingTo=${filter.pagingTo}&Filter.Search=${filter.search}`,
        null,
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
export const lookup = new LookUp()
