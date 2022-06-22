export interface CreatePlatformShopTypInput {
  mShop: CreatePlatformShopTypMShop[]
}
export interface CreatePlatformShopTypMShop {
  shopId?: number
  shopCode?: string
  shopName: string
  shopNameEn?: string
  whId: number
  cashBasketId: number
  defArInvDepId: number
  rvCusId: number
  activeTyp?: string
  shopDepId: number
  remark?: string
  apvFlag?: string
  comId: number
  headOfficeFlag?: string
  depId: number
  cObjId?: number
  mBranch?: CreatePlatformShopTypMBranch[]
  mShopPlatformShopTyp?: CreatePlatformShopTypMShopPlatformTyp[]
}
export interface CreatePlatformShopTypMBranch {
  branchId?: number
  branchCode?: string
  branchName: string
  mainBranchFlag?: string
  headOfficeFlag?: string
  houseNo?: string
  platformComBillFlag?: string
  buildingName?: string
  businessGrpIdx?: number
  roomNo?: string
  floorNo?: string
  soiName?: string
  villageName?: string
  mooNo?: string
  streetName?: string
  sDistrictId?: number
  districtId?: number
  provinceId?: number
  countryId?: number
  addr?: string
  addrEn?: string
  zipCode?: string
  newLineColIdx?: number
  latitude?: string
  longtitude?: string
  tel?: string
  fax?: string
  mobile?: string
  email?: string
  shipPlaceId?: number
  activeTyp?: string
  remark?: string
  comId: number
  depId: number
  cObjId?: number
  contactAddrItem?: number
}

export interface CreatePlatformShopTypMShopPlatformTyp {
  shopId?: number
  platformShopTypId?: number
  xsysId?: number
  activeTyp?: string
  itemNo?: number
  remark?: string
  comId: number
  depId: number
  cObjId?: number
}
