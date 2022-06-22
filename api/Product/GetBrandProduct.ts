import axios from '~/plugins/axios'

class Brands {
  async getBrandsProduct(global: string, channelName: string) {
    const brandsProduct = await axios
      .post('/Product/GetProdSBrand?PriceTypeIdReq=4', null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
    return brandsProduct
  }
}
export const getBrands = new Brands()
