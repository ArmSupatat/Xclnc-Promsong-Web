<template>
  <v-app>
    <Topbar />
    <v-container>
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">ลงทะเบียน</a>
      </div>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-form class="text-field-details-messages mt-6">
          <div class="H5" style="text-align: center; color: #333333">
            <p>ยืนยันการลงทะเบียน</p>
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
            @click="userVerifyOtp"
            >ตกลง</v-btn
          >
          <div class="d-flex justify-center mt-7">
            <div class="href-SendTemporaryCodeNew" @click="resendOtp">
              <p>ส่งรหัสชั่วคราวใหม่</p>
            </div>
          </div>
        </v-form>
        <v-spacer></v-spacer>
      </div>
      <v-dialog v-model="confirmDialog" max-width="290">
        <v-card>
          <v-card-title class="textConfirmDialog">
            <p>ยืนยันการลงทะเบียน<br />เรียบร้อย</p>
          </v-card-title>
          <v-card-actions style="padding-bottom: 16px !important">
            <v-spacer></v-spacer>
            <v-btn
              class="ButtonOTP"
              color="white"
              @click="confirmDialogComplete"
              >ดำเนินการต่อ</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import { RegisterInput } from '~/types/RegisterInput'
import { AuthModel } from '~/types/AuthModel'
// import { resendOtp } from '~/api/Account/UserResendOtp'

export default Vue.extend({
  components: {
    Topbar,
    Navigationdrawers,
  },
  middleware: ['authenticated', 'checkRegister'],
  data: () => ({
    registerId: '' as string,
    referenceOTP: '' as string,
    username: '' as string,
    mobile: '' as string,
    OTP: '' as string,
    confirmDialog: false as boolean,
    failedMessage: '' as string,

    OTPRules: [
      (v: any) => !!v || 'กรุณาใส่ OTP เป็นตัวเลข 6 ตัว',
      (v: any) =>
        !!/^[0-9][0-9][0-9][0-9][0-9][0-9]$/.test(v) ||
        'OTP เป็นตัวเลข 6 ตัว เช่น 123456',
    ],
  }),

  mounted() {
    this.registerId = String(this.register.registerId)
    this.referenceOTP = String(this.register.referenceOTP)
    this.username = String(this.register.username)
    this.mobile = String(this.register.mobile)
  },
  methods: {
    async userVerifyOtp() {
      const loader = this.$loading.show()
      const response = await authen.userVerifyOtp(
        this.registerId,
        this.username,
        this.referenceOTP,
        this.OTP
      )
      if (response && response.alert.length > 0) {
        if (response.alert[0].alertApiCode == '200') {
          const { blueFlagUserActivate } = response
          this.$store.commit('authStore/setAuth', {
            channelName: blueFlagUserActivate[0].channelName,
            projCustCompanyCode: blueFlagUserActivate[0].proj_CustCom_Code,
          })
          this.confirmDialog = true
        } else {
          this.failedMessage = response.alert[0].alertDisplay
          this.$modal.show('modal-otp-failed')
        }
      }
      loader.hide()
    },
    async confirmDialogComplete() {
      const loader = this.$loading.show()
      const response = await authen.login(
        this.register.username,
        this.register.password,
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
        this.auth.channelName
      )
      if (response && response.alert) {
        const alert = response.alert
        if (alert.alertApiCode == '200' && alert.alertId < 0) {
          this.$store.commit('registerStore/clearUsernamePassword')
          this.$store.commit('authStore/setAuth', {
            globalCode: response.globalCode,
            comId: response.companyId,
            levelId: response.levelId,
            depId: response.departmentId,
            channelName: response.channelName,
            projCustCompanyCode: response.projCustCompanyCode,
          })
          this.$router.push({
            path: '/register/shop',
          })
        } else {
          this.failedMessage = alert.alertDisplay
          this.$modal.show('modal-otp-failed')
        }
      }
      loader.hide()
    },
    async resendOtp() {
      const response = await authen.resendOtp(this.registerId)
      if (response && response.alert.length > 0) {
        if (response.alert[0].alertApiCode == '200') {
          this.referenceOTP = response.usrResendOtp[0].referenceOTP
        } else {
          this.failedMessage = response.alert[0].alertDisplay
          this.$modal.show('modal-otp-failed')
        }
      }
    },
  },
  computed: {
    ...mapState({
      register: (state: any): RegisterInput => state.registerStore.register,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style scoped>
@import url('~/assets/css/Register.css');
</style>
