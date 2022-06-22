import { OTPModel } from '~/types/OTPModel'

export const state = () => ({
  otpModel: {} as OTPModel,
})

export const mutations = {
  setOTPModel(state: any, otpModel: OTPModel) {
    for (const [key, value] of Object.entries(otpModel)) {
      state.otpModel[key] = value
    }
  },
  resetOTPModel(state: any) {
    state.otpModel = {}
  },
}
