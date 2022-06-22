import axios from '~/plugins/axios'

class ForgetPassword {
  async userForgetPassword(
    langFlag: string,
    loginName: string,
    hashCode: string
  ) {
    return await axios
      .post(
        `/Account/UserForgetPassword?LangFlag=${langFlag}&LoginName=${loginName}&HashCode=.`,
        null
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}

export const forgetPassword = new ForgetPassword()
