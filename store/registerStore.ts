import { RegisterInput } from '~/types/RegisterInput'

export const state = () => ({
  register: {} as RegisterInput,
})

export const mutations = {
  setRegister(state: any, register: RegisterInput) {
    for (const [key, value] of Object.entries(register)) {
      state.register[key] = value
    }
  },
  clearUsernamePassword(state: any) {
    state.register.username = ''
    state.register.password = ''
    state.register.registerId = ''
    state.register.referenceOTP = ''
    state.register.mobile = ''
    state.register.shopName = ''
    state.register.isFoodCenter = ''
    state.register.lat = ''
    state.register.lng = ''
  },
}
