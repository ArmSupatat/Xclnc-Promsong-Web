import axios from '~/plugins/axios'

class ChangePassword {
  async userChangePassword(
    refOTP: string,
    OTP: string,
    oldPassword: string,
    newPassword: string,
    usrRoleIdx: string,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(
        `/Account/UserChangePassword?RefOTP=${refOTP}&OTP=${OTP}&OldPassword=${oldPassword}&NewPassword=${newPassword}&UsrRoleIdx=${usrRoleIdx}`,
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
export const changePassword = new ChangePassword()
