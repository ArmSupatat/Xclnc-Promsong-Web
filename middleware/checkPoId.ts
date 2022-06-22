import { Middleware } from '@nuxt/types'

const chkPoId: Middleware = async ({ store, redirect }) => {
  const poId = store.state.cartStore.poId
  if (!poId) {
    return redirect('/product')
  }
}

export default chkPoId
