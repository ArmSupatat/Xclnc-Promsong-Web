import { Product } from '~/types/Product'
import { TempQty } from '~/types/TempQty'

export const state = () => ({
  cart: [] as Product[],
  tempQty: [] as TempQty[],
  poId: 0 as number,
})
export const mutations = {
  addProductBasket(state: any, product: Product) {
    const index = state.cart.findIndex(
      (_product: Product) => _product.productId === product.productId
    )
    if (index > -1) {
      const _product: Product = state.cart[index]
      _product.stepQty++
      state.cart.splice(index, 1, _product)
    } else {
      product.stepQty = ~~product.stepQty
      state.cart.push(product)
    }
  },
  addHotProductBasket(state: any, product: Product) {
    const index = state.cart.findIndex(
      (_product: Product) => _product.productId === product.productId
    )
    const indexTemp = state.tempQty.findIndex(
      (temp: TempQty) => temp.productId === product.productId
    )
    product.stepQty = ~~product.stepQty
    if (indexTemp === -1) {
      state.tempQty.push({ productId: product.productId, qty: product.stepQty })
    }
    if (index > -1) {
      const _product: Product = state.cart[index]
      const indexTemp = state.tempQty.findIndex(
        (temp: TempQty) => temp.productId === product.productId
      )
      _product.stepQty += state.tempQty[indexTemp].qty
      state.cart.splice(index, 1, _product)
    } else {
      product.stepQty =
        indexTemp === -1 ? product.stepQty : state.tempQty[indexTemp].qty
      state.cart.push(product)
    }
  },
  updateTempQty(state: any, tempQty: TempQty) {
    const index = state.tempQty.findIndex(
      (temp: TempQty) => temp.productId === tempQty.productId
    )
    if (index > -1) {
      state.tempQty[index].qty = tempQty.qty
    } else {
      state.tempQty.push(tempQty)
    }
  },
  cleanTempQty(state: any) {
    state.tempQty.splice(0)
  },
  updateStepQty(state: any, qty: any) {
    state.cart[qty.index].stepQty = qty.qty
  },
  clearCart(state: any) {
    state.cart.splice(0)
  },
  removeCartByIndex(state: any, index: number) {
    state.cart.splice(index, 1)
  },
  savePurchaseOrderId(state: any, poId: number) {
    state.poId = poId
  },
  clearPurchaseOrderId(state: any) {
    state.poId = null
  },
}
