import axios from '~/plugins/axios'

class Product {
  async getAllProduct(
    page: number,
    sizeItem: number,
    orderBy: string,
    promoFlag: string,
    global: string,
    channelName: string
  ) {
    const getAll_Product = await axios
      .get(
        `/Product/GetProduct?PageNumber=${page}&PageSize=${sizeItem}&PriceTypeId=4&PromoFlag=${promoFlag}`,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
    return getAll_Product
  }
  async getAllProducttoship(
    page: number,
    sizeItem: number,
    global: string,
    channelName: string
  ) {
    const getAll_Product = await axios
      .get(
        `/Product/GetProduct?PageNumber=${page}&PageSize=${sizeItem}&PriceTypeId=4`,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
    return getAll_Product
  }
  async getSingleProduct(
    productId: string,
    global: string,
    channelName: string
  ) {
    const getSingleProduct = await axios
      .get(`/Product/GetProductId?PriceTypeId=4&ProductId=${productId}`, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response)
      .catch((err) => console.log(err))
    return getSingleProduct
  }
  async getRelatedProduct(
    productGroupId: number,
    productSubGroupId: number,
    global: string,
    channelName: string
  ) {
    const relateProduct = await axios
      .get(
        `/Product/GetProduct?PageNumber=1&PageSize=6&PriceTypeId=4&ProductGroupId=${productGroupId}&ProductSubGroupId=${productSubGroupId}`,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
    return relateProduct
  }
  async getProductrecomment(
    currentPage: number,
    global: string,
    channelName: string
  ) {
    const productRecomment = await axios
      .post(
        `/Product/GetRecommends?PageNumber=${currentPage}&PageSize=30&PriceTypeId=4`,
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
    return productRecomment
  }
  async getProductsOrderby(
    orderBy: string,
    groupId: number[],
    subGroupId: any,
    currentPage: number,
    sizeItem: number,
    listBrands: number[],
    global: string,
    channelName: string
  ) {
    let pathBrands = ''
    if (listBrands.length > 0) {
      for (let i: number = 0; i < listBrands.length; i++) {
        pathBrands += `&BrandId=${listBrands[i]}`
      }
    }

    let url = ''
    if (groupId.length === 0 && subGroupId.length === 0) {
      url = `/Product/GetProduct?PageNumber=${currentPage}&PriceTypeId=4&PageSize=${sizeItem}&OrderBy=${orderBy}${pathBrands}`
    } else {
      let pathGroup = ''
      let pathSubGroup = ''

      for (let i: number = 0; i < groupId.length; i++) {
        pathGroup += `&ProductGroupId=${groupId[i]}`
      }

      if (subGroupId.length === 0) {
        url = `/Product/GetProduct?PageNumber=${currentPage}&OrderBy=${orderBy}&PageSize=${sizeItem}&PriceTypeId=4${pathGroup}${pathBrands}`
      } else {
        for (let i: number = 0; i < subGroupId.length; i++) {
          if (typeof subGroupId[i] != 'string' && subGroupId[i] != null) {
            pathSubGroup += `&ProductSubGroupId=${subGroupId[i]}`
          }
        }
        url = `/Product/GetProduct?PageNumber=${currentPage}&OrderBy=${orderBy}&PageSize=${sizeItem}&PriceTypeId=4${pathGroup}${pathSubGroup}${pathBrands}`
      }
    }

    const ordersProducts = await axios
      .get(url, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
    return ordersProducts
  }
  async getProductFromBrands(
    currentPage: number,
    listBrands: number[],
    orderBy: string,
    groupId: number[],
    subGroupId: any,
    global: string,
    channelName: string
  ) {
    let pathBrands = ''
    for (let i: number = 0; i < listBrands.length; i++) {
      pathBrands += `&BrandId=${listBrands[i]}`
    }
    let pathGroup = ''
    let pathSubGroup = ''
    if (groupId.length > 0) {
      for (let i: number = 0; i < groupId.length; i++) {
        pathGroup += `&ProductGroupId=${groupId[i]}`
      }
    }
    if (subGroupId.length > 0) {
      for (let i: number = 0; i < subGroupId.length; i++) {
        if (typeof subGroupId[i] != 'string' && subGroupId[i] != null) {
          pathSubGroup += `&ProductSubGroupId=${subGroupId[i]}`
        }
      }
    }

    let url = `/Product/GetProduct?PageNumber=${currentPage}&PageSize=16&PriceTypeId=4&${
      orderBy ? `&OrderBy=${orderBy}` : ``
    }${pathBrands}${pathGroup}${pathSubGroup}`

    const productFromBrands = await axios
      .get(url, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)

    return productFromBrands
  }
  async getProductFromPromotion(
    currentPage: number,
    promotopnId: number,
    global: string,
    channelName: string
  ) {
    const productFromPromotion = await axios
      .post(
        `/ProductPromotion/GetPromotionCouponDetail?PageNumber=${currentPage}&PageSize=16&PriceTypeId=4&SearchType=${promotopnId}`,
        null,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)
    return productFromPromotion
  }
}
export const getProduct = new Product()
