export interface CreateCommandBusinessInput {
  mCompany?: CreateCommandBusinessMCompany[]
}
export interface CreateCommandBusinessMCompany {
  comId?: number
  comCode?: string
  comName: string
  addr?: string
  businessTypIdx?: number
  projCustComCode?: string
  presentVatRptFlag?: string
  vatRptFlag?: string
  copyComId?: number
  finChartCount?: number
  tel?: string
  copyAllLevelFlag?: string
  email?: string
  website?: string
  taxNo?: string
  apvFlag?: string
  cObjId?: number
  depId: number
  houseNo?: string
  buildingName?: string
  roomNo?: string
  floorNo?: string
  soiName?: string
  villageName?: string
  mooNo?: string
  streetName?: string
  sDistrictId?: number
  districtId?: number
  provinceId?: number
  zipCode?: string
  newLineColIdx?: number
  latitude?: string
  longtitude?: string
  mobile?: string
  mBranch?: CreateCommandBusinessMCompanyMBranch[]
}
export interface CreateCommandBusinessMCompanyMBranch {
  branchId?: number
  branchCode: string
  branchName: string
  shipPlaceId?: number
  businessGrpIdx?: number
  cObjId?: number
  comId?: number
  depId?: number
}
