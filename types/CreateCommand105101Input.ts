export interface CreateCommand105101Input {
  mPerson: MyPersonCommand105101[]
}
export interface MyPersonCommand105101 {
  personId?: number
  personCode?: string
  personFirstname: string
  depId: number
  prodtnFlag?: string
  mobile?: string
  email?: string
  shopFlag?: string
  leasFlag?: string
  apvPersonFlag?: string
  personGrpPict?: number
  prodMgrFlag?: string
  saleMgrFlag?: string
  saleFlag?: string
  purFlag?: string
  invtFlag?: string
  finFlag?: string
  salePersonFlag?: string
  consFlag?: string
  activeTyp?: string
  apvFlag?: string
  cObjId?: number
  lineLangFlag?: string
  comId: number
  cDepId: number
  mDepPerson?: MyDepPersonCommand105101[]
}
export interface MyDepPersonCommand105101 {
  depId?: number
  personId?: number
  xsysId?: number
  itemNo?: number
  comId: number
  cDepId: number
  cObjId?: number
}
