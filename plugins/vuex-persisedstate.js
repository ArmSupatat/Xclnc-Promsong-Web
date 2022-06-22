import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'Xcellence',
    paths: [
      'cartStore',
      'registerStore',
      'authStore',
      'forgetStore',
      'otpStore',
    ],
  })(store)
}
