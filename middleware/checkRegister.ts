import { Middleware } from '@nuxt/types'
import { command432101Group3 } from '~/api/Authenticate/Command432101Group3'

const chkRegister: Middleware = async ({ store, redirect }) => {
  const { globalCode, channelName } = store.state.authStore.auth
  if (globalCode && channelName) {
    const response = await command432101Group3.command432101Group3(
      0,
      globalCode,
      channelName
    )
    if (response && response.mShop) {
      const { apvFlag } = response.mShop
      if (apvFlag === 'Y') {
        return redirect('/')
      }
    }
  }
}

export default chkRegister
