import axios from '~/plugins/axios'
class Product {
  async serarchProductName(
    currentPage: number,
    keywordSearch: string,
    sizeItem: number,
    orderBy: string,
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

    const productByName = await axios
      .get(
        `/Product/GetProduct?PageNumber=${currentPage}&PageSize=${sizeItem}&PriceTypeId=4&Search=${keywordSearch}${
          orderBy ? `&OrderBy=${orderBy}` : ``
        }${pathBrands}`,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)

    return productByName
  }
  async filterProductFromPrice(
    currentPage: number,
    rangePrice: number[],
    keywordSearch: string,
    orderBy: string,
    listBrands: number[]
  ) {
    let pathBrands = ''
    if (listBrands.length > 0) {
      for (let i: number = 0; i < listBrands.length; i++) {
        pathBrands += `&BrandId=${listBrands[i]}`
      }
    }
    const productFromPrice = await axios
      .post(
        `/Product/GetSearchPrice?PageNumber=${currentPage}&PageSize=16&PriceTypeId=4&MinPrice=${
          rangePrice[0]
        }&MaxPrice=${rangePrice[1]}&Search=${keywordSearch}&${
          orderBy ? `&OrderBy=${orderBy}` : ``
        }${pathBrands}`
      )
      .then((response) => response.data)

    return productFromPrice
  }
}
export const searchProduct = new Product()
