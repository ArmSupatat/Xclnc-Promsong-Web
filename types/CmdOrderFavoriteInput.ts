export interface CmdOrderFavoriteInput {
  mProdChkStkTyp?: ProdChkStkTyp[]
  mProdChkStkTypDelete?: ProdChkStkTypDelete[]
}

export interface ProdChkStkTyp {
  prodChkStkTypId?: number
  prodChkStkTypCode?: string
  prodChkStkTypName?: string
  prodChkStkTypNameEn?: string
  activeTyp?: string
  apvFlag?: string
  remark?: string
  comId?: number
  depId?: number
  cObjId?: number
}

export interface ProdChkStkTypDelete {
  prodChkStkTypId?: number
}
