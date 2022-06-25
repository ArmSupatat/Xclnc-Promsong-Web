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
        <v-form
          class="text-field-details-messages"
          @submit.prevent="submitRegister"
          style="width: 22rem"
        >
          <div class="H5" style="text-align: center; color: #333333">
            <p>ลงทะเบียน</p>
          </div>
          <div class="Body1" style="text-align: center; color: #333333">
            <p>กรุณาใส่ข้อมูลเพื่อลงทะเบียน</p>
          </div>
          <v-text-field
            outlined
            class="mt-8 rounded-lg"
            label="เบอร์โทร"
            maxlength="10"
            name="PhoneNumber"
            v-model="PhoneNumber"
            :rules="[PhoneNumberRules.required, PhoneNumberRules.phRegex]"
            placeholder="0555555555"
          ></v-text-field>
          <v-text-field
            type="password"
            outlined
            class="mt-2 rounded-lg"
            label="รหัสผ่าน"
            name="Password"
            v-model="Password"
            :rules="[PasswordRules.required, PasswordRules.min]"
          ></v-text-field>
          <v-text-field
            type="password"
            outlined
            class="mt-2 rounded-lg"
            label="ยืนยันรหัสผ่าน"
            name="ConfirmPassword"
            v-model="ConfirmPassword"
            :rules="[
              !!ConfirmPassword || 'กรุณาใส่ ยืนยันรหัสผ่าน',
              Password === ConfirmPassword || 'ยืนยันรหัสผ่าน ไม่ถูกต้อง',
              ConfirmPasswordRules.required,
            ]"
          ></v-text-field>
          <div class="d-flex">
            <v-checkbox v-model="checkConfirmCondition"></v-checkbox>
            <div class="mt-2 Body2" style="color: #000000">
              <p>ข้าพเจ้าได้อ่านและรับทราบข้อตกลง</p>
            </div>
            <div
              class="mt-2 Body2"
              @click="downloadPolicy"
              style="
                color: #50a207;
                text-decoration-line: underline;
                cursor: pointer;
              "
            >
              <p>เงื่อนไขการสมัครสมาชิก</p>
            </div>
          </div>
          <v-btn
            type="submit"
            :disabled="!disabledButtonRegister"
            block
            style="width: 22rem !important"
            class="mt-2 Button1"
            :class="{
              'Checkbox-Button-Custom-True':
                checkConfirmCondition &&
                !!PhoneNumber &&
                !!Password &&
                !!ConfirmPassword &&
                Password === ConfirmPassword &&
                !!/^0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(
                  PhoneNumber
                ),
              'Checkbox-Button-Custom-False': !(
                checkConfirmCondition &&
                !!PhoneNumber &&
                !!Password &&
                !!ConfirmPassword &&
                Password === ConfirmPassword &&
                !!/^0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(
                  PhoneNumber
                )
              ),
            }"
            >ลงทะเบียน</v-btn
          >
          <div class="d-flex justify-center mt-7">
            <div
              class="Body1"
              style="
                text-align: right;
                color: #333333;

                flex: none;
                order: 0;
                flex-grow: 0;
                margin: 0px 8px;
              "
            >
              <p>หากคุณมีบัญชีอยู่เเล้วกรุณา</p>
            </div>
            <nuxt-link to="/auth" class="href-Login">
              <p>เข้าสู่ระบบ</p>
            </nuxt-link>
          </div>
        </v-form>
        <v-spacer></v-spacer>
      </div>
    </v-container>
    <modal
      name="register-failed"
      :adaptive="true"
      width="25%"
      height="15%"
      @closed="$modal.hide('register-failed')"
    >
      <div class="d-flex flex-column justify-center align-center h-full">
        <h3>{{ failedMessage }}</h3>
      </div>
    </modal>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import Navigationdrawers from '~/components/Navigationdrawers.vue'
import { authen } from '~/api/Authenticate/Authenticate'

export default Vue.extend({
  components: {
    Topbar,
    Navigationdrawers,
  },
  name: 'register',
  middleware: ['authenticated', 'checkRegister'],
  data: () => ({
    PhoneNumber: '',
    Password: '',
    ConfirmPassword: '',
    checkConfirmCondition: false,
    failedMessage: '',
    PhoneNumberRules: {
      required: (v: any) => !!v || 'กรุณาใส่ เบอร์โทร',
      phRegex: (v: any) =>
        !!/^0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(v) ||
        'เบอร์โทร เช่น 055-555-555',
    },
    PasswordRules: {
      required: (v: any) => !!v || 'กรุณาใส่ รหัสผ่าน',
      min: (v: any) =>
        v.length >= 8 || 'กรุณาใส่ รหัสผ่านมากกว่าหรือเท่ากับ 8 ตัว',
    },
    ConfirmPasswordRules: {
      required: (v: any) => !!v || 'กรุณาใส่ ยืนยันรหัสผ่าน',
    },
  }),
  computed: {
    disabledButtonRegister() {
      return (
        this.checkConfirmCondition &&
        !!this.PhoneNumber &&
        !!this.Password &&
        !!this.ConfirmPassword &&
        this.Password === this.ConfirmPassword &&
        !!/^0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(
          this.PhoneNumber
        ) &&
        !!this.Password === this.Password.length >= 8
      )
    },
  },
  methods: {
    downloadPolicy() {
      const a = document.createElement('a')
      // a.download = '20211215_TOS _ Privacy Policy_บจก.พร้อมส่ง.pdf'
      a.target = '_blank'
      a.href = '/privacy-policy/20211215_TOS _ Privacy Policy_บจก.พร้อมส่ง.pdf'
      document.body.append()
      a.click()
      a.remove()
    },
    submitRegister() {
      // const phoneNumber = this.PhoneNumber.replaceAll('-', '')
      // const response = await authen.register(
      //   phoneNumber,
      //   this.Password,
      //   phoneNumber
      // )
      // if (response && response.alert.length > 0) {
      //   if (response.alert[0].alertApiCode == '200') {
      // this.$store.commit('registerStore/setRegister', {
      //   username: phoneNumber,
      //   password: this.Password,
      // registerId: response.usrRegister[0].registerId,
      // referenceOTP: response.usrRegister[0].referenceOTP,
      // mobile: response.usrRegister[0].mobile,
      // })
      // this.$router.push('/auth')
      // } else {
      //   this.failedMessage = response.alert[0].alertDisplay
      //   this.$modal.show('register-failed')
      // }
      // }
    },
  },
})
</script>

<style scoped>
@import url('~/assets/css/Register.css');

.text-field-details-messages .v-input--selection-controls {
  margin-top: 2px;
  padding-top: 2px;
}
</style>
