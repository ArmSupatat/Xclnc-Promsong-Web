import axios from '~/plugins/axios'

class ChangePasswordOtp {
  async userChangePasswordOtp(
    langFlag: string,
    oldPassword: string,
    projCustComCode: string,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(
        `/Account/UserChangePasswordOtp?ProjCustComCode=${projCustComCode}&LangFlag=${langFlag}&OldPassword=${oldPassword}&HashCode=.`,
        null,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const changePasswordOtp = new ChangePasswordOtp()
