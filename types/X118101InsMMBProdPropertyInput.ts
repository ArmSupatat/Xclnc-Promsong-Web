export interface X118101InsMMBProdPropertyInput {
  mmbProdProperty_Request: MMBProdPropertyRequest
}

interface MMBProdPropertyRequest {
  comId: number
  prodId: number
  prodBarcodeId: number
  uomId: number
  prodChkStkTypId: number
  prodChkStkTypSeqNo?: number
  prodClassId: number
}
