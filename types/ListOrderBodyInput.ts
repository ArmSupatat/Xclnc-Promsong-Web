export interface ListOrderBodyInput {
  listingFilter?: ListingFilter
  filter?: Filter
}
export interface ListingFilter {
  cfmTyp?: string[]
  createTyp?: string
  poAmt?: number
  poDispTypIdx?: string[]
  poId?: number
  poProdCount?: number
  shortShipFlag?: string
  supId?: number
  fromPoDate?: string
  toPoDate?: string
  fromReqDate?: string
  toReqDate?: string
  fromPoNo?: string
  toPoNo?: string
}
export interface Filter {
  pagingFrom?: number
  pagingTo?: number
  search?: string
  barcode?: string
}
