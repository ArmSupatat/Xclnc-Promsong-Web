<template>
  <v-app>
    <Topbar />
    <v-container>
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">ยืนยันการเข้าสู่ระบบ</a>
      </div>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-form
          class="text-field-details-messages mt-6"
          @submit.prevent="userVerifyOtp"
        >
          <div class="H5" style="text-align: center; color: #333333">
            <p>ยืนยันการเข้าสู่ระบบ</p>
          </div>
          <div class="Body1" style="text-align: center; color: #333333">
            <p>กรุณากรอกรหัสชั่วคราวที่ส่งให้</p>
          </div>
          <div class="Body1" style="text-align: center; color: #333333">
            <p>ส่งผ่าน : {{ mobile }}</p>
          </div>
          <v-text-field
            outlined
            class="mt-8 rounded-lg"
            label="รหัส OTP"
            v-model="OTP"
            :rules="OTPRules"
            maxlength="6"
            placeholder="OTP เป็นตัวเลข 6 ตัว"
          ></v-text-field>
          <div class="Body1" style="text-align: center; color: #333333">
            <p>REF : {{ referenceOTP }}</p>
          </div>
          <v-text-field
            outlined
            v-if="errorId === 542"
            v-model="password"
            type="password"
            class="mt-2 mb-2 rounded-lg"
            placeholder="รหัสผ่าน"
            :rules="[PasswordRules.required, PasswordRules.min]"
          ></v-text-field>
          <v-btn
            block
            class="mt-2 Button1"
            v-bind:class="{
              'Checkbox-Button-Custom-True':
                !!OTP && !!/^[0-9][0-9][0-9][0-9][0-9][0-9]$/.test(OTP),
              'Checkbox-Button-Custom-False': !(
                !!OTP && !!/^[0-9][0-9][0-9][0-9][0-9][0-9]$/.test(OTP)
              ),
            }"
            :disabled="
              !(!!this.OTP && !!/^[0-9][0-9][0-9][0-9][0-9][0-9]$/.test(OTP))
            "
            type="submit"
            >ตกลง</v-btn
          >
          <div class="d-flex justify-center mt-7">
            <div class="href-SendTemporaryCodeNew" @click="resendGetChOTP">
              <p>ส่งรหัสชั่วคราวใหม่</p>
            </div>
          </div>
        </v-form>
        <v-spacer></v-spacer>
      </div>
      <client-only>
        <modal
          name="modal-otp-failed"
          :adaptive="true"
          width="30%"
          height="30%"
          @closed="$modal.hide('modal-otp-failed')"
        >
          <div class="d-flex flex-column align-center justify-center h-full">
            <h3>{{ failedMessage }}</h3>
          </div>
        </modal>
      </client-only>
    </v-container>
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import Navigationdrawers from '~/components/Navigationdrawers.vue'
import { authen } from '~/api/Authenticate/Authenticate'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import { OTPModel } from '~/types/OTPModel'

export default Vue.extend({
  components: {
    Topbar,
    Navigationdrawers,
  },
  //   middleware: ['authenticated', 'checkRegister'],
  data: () => ({
    referenceOTP: '' as string,
    mobile: '' as string,
    OTP: '' as string,
    failedMessage: '' as string,
    password: '' as string,
    errorId: '' as string,

    OTPRules: [
      (v: any) => !!v || 'กรุณาใส่ OTP เป็นตัวเลข 6 ตัว',
      (v: any) =>
        !!/^[0-9][0-9][0-9][0-9][0-9][0-9]$/.test(v) ||
        'OTP เป็นตัวเลข 6 ตัว เช่น 123456',
    ],
    PasswordRules: {
      required: (v: any) => !!v || 'กรุณาใส่ รหัสผ่าน',
      min: (v: any) =>
        v.length >= 8 || 'กรุณาใส่ รหัสผ่านมากกว่าหรือเท่ากับ 8 ตัว',
    },
  }),

  mounted() {
    if (this.otpModel.refOTP && this.otpModel.mobile) {
      this.referenceOTP = String(this.otpModel.refOTP)
      this.mobile = String(this.otpModel.mobile)
    } else {
      this.$router.push('/auth')
    }
  },
  methods: {
    async resendGetChOTP() {
      const response = await authen.userRegisterGetChOTP(this.otpModel.mobile)
      const { getChOTP, alert } =
        response && response.data ? response.data : null
      if (alert[0].alertId === -1) {
        const { refOTP } = getChOTP[0]
        this.referenceOTP = refOTP
        this.$store.commit('otpStore/setOTPModel', {
          refOTP: refOTP,
          mobile: this.otpModel.mobile,
        })
      }
    },
    async userVerifyOtp() {
      const loader = this.$loading.show()
      try {
        const response = await authen.userAuthenGetChByOTP(
          this.mobile,
          this.OTP,
          this.referenceOTP
        )
        const { getChbyOTP, alert } =
          response && response.data ? response.data : null
        if (alert && alert[0].alertId === -1) {
          const { chName, projCustomize_Code } = getChbyOTP[0]
          const response = await authen.login(
            this.auth.username,
            this.failedMessage ? this.password : this.auth.password,
            '',
            {
              macAddress: '',
              brandName: '',
              ipAddress: '',
              deviceName: '',
              deviceTypIdx: '',
              osVersion: '',
              productModel: '',
            },
            chName
          )
          const { alert } = response
          if (alert.alertApiCode === '200') {
            this.$store.commit('authStore/clearUsernamePassword')
            this.$store.commit('otpStore/resetOTPModel')
            this.$store.commit('authStore/setAuth', {
              globalCode: response.globalCode,
              comId: response.companyId,
              levelId: response.levelId,
              depId: response.departmentId,
              channelName: chName,
              projCustCompanyCode: projCustomize_Code,
            })
            this.$router.push('/')
          } else {
            this.$modal.show('modal-otp-failed')
            this.failedMessage = alert.alertDisplay
            this.errorId = alert.alertId
          }
        } else {
          this.$modal.show('modal-otp-failed')
          this.failedMessage = alert[0].alertDisplay
          this.errorId = alert[0].alertId
        }
        loader.hide()
      } catch (err) {
        console.log(err)
        loader.hide()
      }
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
      otpModel: (state: any): OTPModel => state.otpStore.otpModel,
    }),
  },
})
</script>

<style scoped>
@import url('~/assets/css/Register.css');
</style>
