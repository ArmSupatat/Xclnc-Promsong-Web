export interface Product {
  brandId?: number | null
  comId: number
  couponFlag: string
  labelLabelPrice: string
  labelPrice: number
  limitPoQty: number
  mainUomCode: string
  manyUomFlag: string
  orderBy?: string | null
  originalPriceShow: number
  pricePerMainUom: number
  priceSeq?: number
  priceTypeId: number
  productBarcode: string
  productGroupId: number
  productGroupPict: number
  productId: number
  productImageFilePath: [string]
  productName: string
  productSubGroupId?: number
  productTypeId: number
  promoFlag: string
  promoId?: number
  salePrice?: number
  shopRecommendFlag?: string
  shopRecommendTypeIdx?: number
  showSeqNo: number
  specialPrice: number
  stepQty: number
  stkQty: number
  subId?: number
  unitPriceShow: number
  uomCode: string
  uomId: number
  wgtBaseFlag: string
}
