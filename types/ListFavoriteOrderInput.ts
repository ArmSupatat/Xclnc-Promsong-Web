export interface ListFavoriteOrderInput {
  prodChkStkTypId?: number | null
  filter?: ListFavoriteOrderFilter
}
export interface ListFavoriteOrderFilter {
  pagingFrom: number
  pagingTo: number
  search: string
  barcode?: string
}
export interface ListFavoriteOrderGroupInput {
  listingFilter?: ListFavoriteOrderGroupListingFilter
  filter?: ListFavoriteOrderGroupFilter
}
export interface ListFavoriteOrderGroupListingFilter {
  activeTyp?: string
  apvFlag?: string
}
export interface ListFavoriteOrderGroupFilter {
  pagingFrom: number
  pagingTo: number
  search?: string
  barcode?: string
}
