<template>
  <div class="change-password-container">
    <div class="font20bo600 mb-0">เปลี่ยนรหัสผ่าน</div>
    <div class="font14">
      กรุณาอย่าเปิดเผยรหัสผ่านแก่คนอื่นๆ เพื่อความปลอดภัยของบัญชีผู้ใช้ของคุณ
    </div>
    <div class="flex justify-center width-100">
      <div class="input-container">
        <v-form
          class="text-field-details-messages"
          @submit.prevent="userChangePassword"
        >
          <v-text-field
            type="password"
            outlined
            class="mt-8 rounded-lg"
            label="รหัสผ่านปัจจุบัน*"
            name="oldPassword"
            v-model="oldPassword"
            :rules="[oldPasswordRules.required, oldPasswordRules.min]"
          ></v-text-field>
          <v-text-field
            type="password"
            outlined
            class="mt-1 rounded-lg"
            label="ตั้งรหัสผ่านใหม่*"
            name="newPassword"
            v-model="newPassword"
            :rules="[newPasswordRules.required, newPasswordRules.min]"
          ></v-text-field>
          <v-text-field
            type="password"
            outlined
            class="mt-1 mb-1 rounded-lg"
            label="ยืนยันรหัสผ่านใหม่*"
            name="newConfirmPassword"
            v-model="newConfirmPassword"
            :rules="[
              !!newConfirmPassword || 'กรุณาใส่ ยืนยันรหัสผ่านใหม่',
              newPassword === newConfirmPassword ||
                'ยืนยันรหัสผ่านใหม่ ไม่ถูกต้อง',
              newConfirmPasswordRules.required,
            ]"
          ></v-text-field>
        </v-form>
        <div class="field">
          <v-btn
            :disabled="!disabledButtonNewPassword"
            @click="userChangePasswordOTP"
            type="submit"
            class="button is-primary is-fullwidth"
            >ยืนยัน</v-btn
          >
          <p v-if="error.message" class="is-danger mt-2 mb-0 text-center">
            {{ error.message }}
          </p>
          <modal
            name="OTP"
            :adaptive="true"
            width="700px"
            height="450px"
            @closed="$modal.hide('OTP')"
          >
            <div
              class="
                flex
                justify-lg-center
                align-center
                flex-column
                pa-10
                height-100
                text-field-details-messages
              "
            >
              <h2 class="mt-8">ยืนยันการเปลี่ยนรหัสผ่าน</h2>
              <p class="m-0">กรุณากรอกรหัสชั่วคราวที่ส่งให้</p>
              <v-text-field
                type="text"
                outlined
                class="mt-4 rounded-lg input-text-otp input-container"
                label="รหัส OTP*"
                v-model="passwordOtp"
                :rules="OTPRules"
                placeholder="OTP เป็นตัวเลข 6 ตัว"
              ></v-text-field>
              <p class="mb-1">ส่งผ่าน : {{ mobile }}</p>
              <p class="gray-x-web mb-3">REF : {{ refOTP }}</p>

              <p
                v-if="error.messageOTP"
                class="is-danger mt-1 mb-1 text-center"
              >
                {{ error.messageOTP }}
              </p>
              <div class="d-flex flex-column">
                <v-btn
                  class="button-modal is-primary is-fullwidth"
                  type="submit"
                  @click="userChangePassword"
                  :disabled="!disabledButtonPasswordOtp"
                >
                  ยืนยัน
                </v-btn>
                <div class="d-flex justify-center">
                  <div class="icon-resend"></div>
                  <a
                    class="mt-3 text-underline green-x-web text-resend"
                    @click="userChangePasswordOTP"
                  >
                    ส่งรหัสชั่วคราวใหม่
                  </a>
                </div>
              </div>
            </div>
          </modal>
          <v-dialog v-model="dialog" width="300px" height="450px">
            <!-- <template v-slot:activator="{ on, attrs }"> -->

            <!-- </template> -->
            <v-card>
              <v-card-title class="pb-5">เปลี่ยนรหัสผ่านเรียบร้อย</v-card-title>
              <v-card-actions class="py-5">
                <v-spacer></v-spacer>
                <v-btn
                  color="darken-1"
                  class="border-btn-color"
                  text
                  @click="dialog = !dialog"
                >
                  ตกลง
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { changePasswordOtp } from '~/api/Account/UserChangePasswordOtp'
import { changePassword } from '~/api/Account/UserChangePassword'
import { mapState } from 'vuex'
import { RegisterInput } from '~/types/RegisterInput'
import { AuthModel } from '~/types/AuthModel'

export default Vue.extend({
  methods: {
    async userChangePasswordOTP() {
      const response = await changePasswordOtp.userChangePasswordOtp(
        'Y',
        this.oldPassword,
        this.auth.projCustCompanyCode,
        this.auth.globalCode,
        this.auth.channelName
      )
      if (response && response.alert.length > 0) {
        const alert = response.alert[0]
        if (alert.alertApiCode === '200') {
          this.$modal.show('OTP')
          this.refOTP = response.usrChangePasswordOtp[0].refOTP
          this.mobile = response.usrChangePasswordOtp[0].mobile
        } else {
          this.error.message = alert.alertDisplay
        }
      }
    },
    async userChangePassword() {
      let loader = this.$loading.show()
      try {
        const response = await changePassword.userChangePassword(
          this.refOTP,
          this.passwordOtp,
          this.oldPassword,
          this.newPassword,
          this.usrRoleIdx,
          this.auth.globalCode,
          this.auth.channelName
        )
        if (response && response.alert.length > 0) {
          const alert = response.alert[0]
          if (alert.alertApiCode === '200') {
            this.$modal.hide('OTP')
            this.dialog = true
          } else {
            this.error.messageOTP = alert.alertDisplay
          }
        }
        loader.hide()
      } catch (e) {
        // this.error.message = e
        loader.hide()
      }
    },
  },
  data: () => ({
    registerId: '' as string,
    oldPassword: '' as string,
    newPassword: '' as string,
    newConfirmPassword: '' as string,
    refOTP: '' as string,
    passwordOtp: '' as string,
    usrRoleIdx: '1' as string,
    error: { message: '', messageOTP: '' },
    mobile: '' as string,
    dialog: false,
    oldPasswordRules: {
      required: (v: any) => !!v || 'กรุณาใส่ รหัสผ่านปัจจุบัน',
      min: (v: any) =>
        v.length >= 8 || 'กรุณาใส่ รหัสผ่านมากกว่าหรือเท่ากับ 8 ตัว',
    },
    newPasswordRules: {
      required: (v: any) => !!v || 'กรุณาใส่ รหัสผ่านใหม่',
      min: (v: any) =>
        v.length >= 8 || 'กรุณาใส่ รหัสผ่านมากกว่าหรือเท่ากับ 8 ตัว',
    },
    newConfirmPasswordRules: {
      required: (v: any) => !!v || 'กรุณาใส่ ยืนยันรหัสผ่านใหม่',
    },
    OTPRules: [
      (v: any) => !!v || 'กรุณาใส่ OTP เป็นตัวเลข 6 ตัว',
      (v: any) =>
        !!/^[0-9][0-9][0-9][0-9][0-9][0-9]$/.test(v) ||
        'OTP เป็นตัวเลข 6 ตัว เช่น 123456',
    ],
  }),
  mounted() {
    this.registerId = String(this.register.registerId)
  },
  computed: {
    ...mapState({
      register: (state: any): RegisterInput => state.registerStore.register,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
    disabledButtonNewPassword() {
      return (
        this.oldPassword &&
        !!this.newPassword &&
        !!this.newConfirmPassword &&
        this.newPassword === this.newConfirmPassword &&
        !!this.oldPassword === this.oldPassword.length >= 8 &&
        !!this.newPassword === this.newPassword.length >= 8
      )
    },
    disabledButtonPasswordOtp() {
      return (
        this.passwordOtp && !!this.passwordOtp === this.passwordOtp.length >= 6
      )
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';
@import '@/assets/scss/_variables.scss';

.change-password-container {
  border: 1px solid lightgray;
  padding: 3rem;
  // height: 900px;
  margin-bottom: 3rem;
  .input-style {
    border-radius: 10px;
    border: 1px solid gray;
    padding: 15px 20px;
    outline: none;
    width: 100%;
  }
  .button {
    background-color: darkgray !important;
    color: #fff;
    width: 100%;
    height: 40px;
    padding: 0.5rem;
    border-radius: 6px;
    &:hover {
      background-color: #469b5c !important;
    }
  }
}
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.input-modal {
  border-radius: 10px;
  border: 1px solid gray;
  padding: 15px;
  outline: none;
  width: 50%;
}
.font14 {
  font-size: 14px;
}
.font20bo600 {
  font-size: 20px;
  font-weight: 600;
}
.button-modal {
  background-color: darkgray !important;
  color: #fff;
  width: 300px;
  padding: 0.5rem;
  border-radius: 6px;
  &:hover {
    background-color: #469b5c !important;
  }
}
.input-container {
  width: 300px;
}
.icon-resend {
  background-image: url(../assets/img/resend.svg);
  width: 20px;
  height: 50px;
  background-position: center;
  margin-right: 5px;
}
.green-x-web {
  color: #469b5c;
}
.gray-x-web {
  color: $subtext-color;
}
.text-resend {
  height: fit-content;
  text-decoration: underline !important;
}
.is-danger {
  color: red;
}
.border-btn-color {
  border: 1px solid lightgray !important;
}
.v-text-field__details {
  display: block !important;
}
.v-application--is-ltr .v-messages {
  display: block !important;
}
.input-text-otp {
  flex: unset !important;
}
.v--modal-box .v--modal {
  width: 150px !important;
}
@media screen and (max-width: 600px) {
  .change-password-container {
    height: 600px;
    margin-bottom: 0;
  }
}
</style>
