import { AuthModel } from '~/types/AuthModel'
import { RegisterInput } from '~/types/RegisterInput'

export const state = () => ({
  auth: {} as AuthModel,
})

export const mutations = {
  setAuth(state: any, auth: RegisterInput) {
    for (const [key, value] of Object.entries(auth)) {
      state.auth[key] = value
    }
  },
  logout(state: any) {
    state.auth.globalCode = null
    state.auth.comId = null
    state.auth.levelId = null
    state.auth.depId = null
  },
  clearUsernamePassword(state: any) {
    state.auth.username = null
    state.auth.password = null
  },
  resetAuth(state: any) {
    state.auth = {}
  },
}
