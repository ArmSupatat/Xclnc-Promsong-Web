import axios from '~/plugins/axios'

class SetPassword {
  async userSetPassword(
    projCustComCode: string,
    langFlag: string,
    loginName: string,
    newPassword: string,
    refOTP: string,
    passwordOtp: string,
    channelName: string
  ) {
    return await axios
      .post(
        `/Account/UserSetPassword?ProjCustComCode=${projCustComCode}&LangFlag=${langFlag}&LoginName=${loginName}&Password=${newPassword}&RefOTP=${refOTP}&OTP=${passwordOtp}`,
        null,
        {
          headers: {
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}

export const setPassword = new SetPassword()
