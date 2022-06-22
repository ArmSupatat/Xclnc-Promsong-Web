import axios from '~/plugins/axios'

class ProductGroup {
  async getProductAllGroup(global: string, channelName: string) {
    const productGroup = await axios
      .get('/Product/ProductAllGroup?priceTypeIdRequest=4', {
        headers: {
          global,
          channelName,
        },
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        console.log(err)
      })
    return productGroup
  }
  async getProductFromGroup(
    groupId: number[],
    subGroupId: number[],
    currentPage: number,
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
    let pathGroup = ''
    let pathSubGroup = ''
    let url = ''
    if (groupId.length > 0) {
      for (let i: number = 0; i < groupId.length; i++) {
        pathGroup += `&ProductGroupId=${groupId[i]}`
      }
    }

    if (subGroupId.length === 0) {
      url = `/Product/GetProduct?PageNumber=${currentPage}&PageSize=${sizeItem}&PriceTypeId=4${pathGroup}${pathBrands}`
    } else {
      for (let i: number = 0; i < subGroupId.length; i++) {
        if (typeof subGroupId[i] != 'string' && subGroupId[i] != null) {
          pathSubGroup += `&ProductSubGroupId=${subGroupId[i]}`
        }
      }
      url = `/Product/GetProduct?PageNumber=${currentPage}&PageSize=${sizeItem}&PriceTypeId=4${pathGroup}${pathSubGroup}${pathBrands}`
    }
    url = url + `${orderBy ? `&OrderBy=${orderBy}` : ''}${pathBrands}`

    const productFromGroup = await axios
      .get(url, {
        headers: {
          global,
          channelName,
        },
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        console.log(err)
      })
    return productFromGroup
  }
}
export const productGroup = new ProductGroup()
