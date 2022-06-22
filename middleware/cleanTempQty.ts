import { Middleware } from '@nuxt/types'

const cleanTempQty: Middleware = ({ route, store, redirect, next }) => {
  store.commit('cartStore/cleanTempQty')
}

export default cleanTempQty
