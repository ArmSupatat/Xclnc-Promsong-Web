import axios from '~/plugins/axios'
import { HardwareInfo } from '~/types/HardwareInfo'
class Authenticate {
  async register(username: string, password: string, mobile: string) {
    return await axios
      .post(
        `/Account/UserRegister?UserName=${username}&Password=${password}&Mobile=${mobile}`
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
  async userVerifyOtp(
    registerId: string,
    username: string,
    refOTP: string,
    OTP: string
  ) {
    return await axios
      .post(
        `/Account/UserVerifyOtp?RegisterId=${registerId}&UserName=${username}&ReferenceOTP=${refOTP}&OTP=${OTP}`
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
  async userChangePasswordOTP(
    projCustomCode: string,
    langFlag: string,
    oldPassword: string,
    hashCode: string
  ) {
    return await axios
      .post(
        `/Account/UserChangePasswordOtp?ProjCustComCode=${projCustomCode}&LangFlag=${langFlag}&OldPassword=${oldPassword}&HashCode=${hashCode}`,
        null,
        {
          headers: {},
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
  async userChangePassword(
    refOtp: string,
    OTP: string,
    oldPassword: string,
    newPassword: string,
    userRoleIdx: string
  ) {
    return await axios
      .post(
        `/Account/UserChangePassword?RefOTP=${refOtp}&OTP=${OTP}&OldPassword=${oldPassword}&NewPassword=${newPassword}&UsrRoleIdx=${userRoleIdx}`
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
  async resendOtp(registerId: string) {
    return await axios
      .post(`/Account/UserResendOtp?RegisterId=${registerId}&HashCode=.`)
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
  async login(
    username: string,
    password: string,
    corporateCode: string,
    hardwareInfo: HardwareInfo,
    channelName: string
  ) {
    return await axios
      .post(
        `/Account/UserLogin`,
        {
          username,
          password,
          corporateCode,
          hardwareInfo,
        },
        {
          headers: {
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
  async logout(global: string, channelName: string) {
    return await axios
      .post(`Account/UserLogout`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
  async userRegisterGetChOTP(loginName: string) {
    return await axios
      .post(`Account/UserRegisterGetChOTP?LoginName=${loginName}`)
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
  async userAuthenGetChByOTP(loginName: string, otp: string, refOTP: string) {
    return await axios
      .post(
        `Account/UserAuthenGetChByOTP?LoginName=${loginName}&OTP=${otp}&RefOTP=${refOTP}`
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const authen = new Authenticate()
