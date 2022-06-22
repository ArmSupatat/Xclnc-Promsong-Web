import { Middleware } from '@nuxt/types'

const pathWithAuth = ['/auth', '/register', '/register/otp']

const isLoggedIn: Middleware = ({ route, store, redirect, next }) => {
  const { auth } = store.state.authStore
  const { register } = store.state.registerStore
  if (auth && auth.globalCode) {
    if (pathWithAuth.includes(route.path)) {
      return redirect('/')
    }
  } else {
    if ('/register/otp' === route.path && !register.referenceOTP) {
      return redirect('/register')
    } else if (!pathWithAuth.includes(route.path)) {
      return redirect('/auth')
    }
  }
}

export default isLoggedIn
