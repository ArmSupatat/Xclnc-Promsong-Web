export interface X304101ProdNameInput {
  comId: number
  prodName?: string
  filter: X304101ProdNameFilter
}

interface X304101ProdNameFilter {
  pagingFrom: number
  pagingTo: number
  search?: string
  barcode?: string
}
