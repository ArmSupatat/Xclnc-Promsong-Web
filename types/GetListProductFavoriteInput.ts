export interface GetListProductFavoriteInput {
  supId: number
  priceTypId: number
  filter?: GetListProductFavoriteFilter
}

export interface GetListProductFavoriteFilter {
  pagingFrom: number
  pagingTo: number
  search: string
  barcode?: string
}
