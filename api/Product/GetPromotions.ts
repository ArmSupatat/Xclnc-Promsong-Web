import axios from '~/plugins/axios'
class Promotions {
  async getPromotions(global: string, channelName: string) {
    const promotionsCoupon = axios
      .post(
        '/ProductPromotion/GetPromotionCoupon?Filter.PagingFrom=0&Filter.PagingTo=100',
        null,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((error) => {
        console.log(error)
      })
    return promotionsCoupon
  }
}
export const promotionsCoupon = new Promotions()
