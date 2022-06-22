import { ForgetInput } from '~/types/ForgetInput'

export const state = () => ({
  forget: {} as ForgetInput,
})

export const mutations = {
  setForget(state: any, forget: ForgetInput) {
    state.forget = forget
  },
}
