<template>
  <v-app>
    <Topbar />
    <v-container class="height-100">
      <v-form
        class="
          width-100
          flex
          justify-center
          align-center
          flex-column
          new-password-container
          text-field-details-messages
        "
        @submit.prevent="userSetPassword"
      >
        <h2 class="mb-2">ตั้งรหัสใหม่</h2>
        <p class="mb-6">กรุณากรอกรหัสชั่วคราว และทำการตั้งรหัสผ่านใหม่</p>
        <p>ส่งผ่าน : {{ mobile }}</p>
        <v-text-field
          outlined
          class="rounded-lg mb-0"
          label="รหัส OTP"
          name="passwordOtp"
          v-model="passwordOtp"
          :rules="[passwordOtpRules.required, passwordOtpRules.min]"
        ></v-text-field>
        <p class="gray-x-web">REF : {{ referenceOTP }}</p>
        <v-text-field
          outlined
          class="rounded-lg mb-0"
          label="รหัสผ่าน 8-15 ตัว"
          type="password"
          name="newPassword"
          v-model="newPassword"
          :rules="[newPasswordRules.required, newPasswordRules.min]"
        ></v-text-field>
        <v-text-field
          outlined
          class="rounded-lg mb-0"
          label="ยืนยันรหัสผ่าน"
          type="password"
          name="newConfirmPassword"
          v-model="newConfirmPassword"
          :rules="[
            !!newConfirmPassword || 'กรุณาใส่ ยืนยันรหัสผ่านใหม่',
            newPassword === newConfirmPassword ||
              'ยืนยันรหัสผ่านใหม่ ไม่ถูกต้อง',
            newConfirmPasswordRules.required,
          ]"
        ></v-text-field>
        <v-btn
          class="button-modal"
          :disabled="!disabledButtonSetPassword"
          @click="userSetPassword"
        >
          ยืนยัน
        </v-btn>
        <v-dialog v-model="dialog" persistent width="300px" height="450px">
          <v-card>
            <v-card-title class="pb-5">เปลี่ยนรหัสผ่านเรียบร้อย</v-card-title>
            <v-card-actions class="py-5">
              <v-spacer></v-spacer>
              <v-btn
                color="darken-1"
                class="border-btn-color"
                text
                @click=";(dialog = false), $router.push('/')"
              >
                ตกลง
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <p v-if="error.messageOTP" class="is-danger text-center mb-0 mt-2">
          {{ error.messageOTP }}
        </p>
      </v-form>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { setPassword } from '~/api/Account/UserSetPassword'
import { mapState } from 'vuex'
import { ForgetInput } from '~/types/ForgetInput'

export default Vue.extend({
  methods: {
    async userSetPassword() {
      let loader = this.$loading.show()
      try {
        const response = await setPassword.userSetPassword(
          this.projCustComCode,
          'Y',
          this.loginName,
          this.newPassword,
          this.referenceOTP,
          this.passwordOtp,
          this.channelName
        )
        if (response && response.data.alert.length > 0) {
          const alert = response.data.alert[0]
          if (alert.alertApiCode === '200') {
            this.dialog = true
          } else {
            this.error.messageOTP = alert.alertDisplay
          }
        }
        loader.hide()
      } catch (e) {
        this.error = e
        loader.hide()
      }
    },
  },
  data: () => ({
    loginName: '' as string,
    newPassword: '' as string,
    newConfirmPassword: '' as string,
    projCustComCode: '' as string,
    refOTP: '' as string,
    passwordOtp: '' as string,
    channelName: '' as string,
    mobile: '' as string,
    referenceOTP: '' as string,
    error: { messageOTP: '' },
    dialog: false,
    passwordOtpRules: {
      required: (v: any) => !!v || 'กรุณาใส่ OTP เป็นตัวเลข 6 ตัว',
      min: (v: any) =>
        !!/^[0-9][0-9][0-9][0-9][0-9][0-9]$/.test(v) ||
        'OTP เป็นตัวเลข 6 ตัว เช่น 123456',
    },
    newPasswordRules: {
      required: (v: any) => !!v || 'กรุณาใส่ รหัสผ่านใหม่',
      min: (v: any) =>
        v.length >= 8 || 'กรุณาใส่ รหัสผ่านมากกว่าหรือเท่ากับ 8 ตัว',
    },
    newConfirmPasswordRules: {
      required: (v: any) => !!v || 'กรุณาใส่ ยืนยันรหัสผ่านใหม่',
    },
  }),
  mounted() {
    this.mobile = String(this.forget.mobile)
    this.referenceOTP = String(this.forget.referenceOTP)
    this.loginName = String(this.forget.loginName)
    this.channelName = String(this.forget.channelName)
    this.projCustComCode = String(this.forget.projCustComCode)
  },
  computed: {
    ...mapState({
      forget: (state: any): ForgetInput => state.forgetStore.forget,
    }),
    disabledButtonSetPassword() {
      return (
        this.passwordOtp &&
        !!this.newPassword &&
        !!this.newConfirmPassword &&
        !!this.newPassword === this.newPassword.length >= 8 &&
        this.newPassword === this.newConfirmPassword &&
        !!this.passwordOtp === this.passwordOtp.length >= 6
      )
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';
@import '@/assets/scss/_variables.scss';

.button-modal {
  background-color: darkgray;
  color: #fff;
  width: 300px;
  padding: 0.5rem;
  border-radius: 6px;
  &:hover {
    background-color: #469b5c;
  }
}
.new-password-container {
  height: 90%;
}
fieldset {
  border-radius: 7px;
  width: 300px;
  height: 65px;
  padding: 0 10px;
  border: 1px solid gray;
}
legend {
  padding: 0 5px;
  font-size: 12px;
}
.input-style {
  padding: 0 5px;
  outline: none;
  height: 100%;
  width: 100%;
  font-size: 20px;
}
.gray-x-web {
  color: $subtext-color;
}
.v-input {
  flex: unset !important;
  width: 300px !important;
  margin-bottom: 15px;
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
.flex-unset {
  flex: unset !important;
}
.border-btn-color {
  border: 1px solid lightgray !important;
}
</style>
