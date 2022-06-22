<template>
  <v-app>
    <Topbar />
    <v-container>
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">เข้าสู่ระบบ</a>
      </div>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-form
          @submit.prevent="onSubmit"
          class="text-field-details-messages"
          style="width: 400px; margin-top: 30px"
        >
          <h2 style="text-align: center; color: #333333">
            <p>เข้าสู่ระบบ</p>
          </h2>
          <div class="Body1" style="text-align: center; color: #333333">
            <p>กรุณาใส่ข้อมูลเพื่อเข้าสู่ระบบ</p>
          </div>
          <v-text-field
            outlined
            v-model="username"
            type="text"
            class="mt-8 rounded-lg"
            placeholder="เบอร์โทร"
            :rules="[PhoneNumberRules.required, PhoneNumberRules.phRegex]"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="password"
            type="password"
            class="mt-2 mb-2 rounded-lg"
            placeholder="รหัสผ่าน"
            :rules="[PasswordRules.required, PasswordRules.min]"
          ></v-text-field>
          <div class="field">
            <v-btn
              type="submit"
              class="button is-primary is-fullwidth"
              :disabled="!disabledButtonLogin"
            >
              เข้าสู่ระบบ
            </v-btn>
          </div>
          <div class="field">
            <p
              v-if="error"
              class="notification is-danger mt-4 mb-0"
              style="color = red;"
            >
              {{ error.message }}
            </p>
          </div>
          <div class="d-flex justify-center mt-3">
            <div class="href-forget">
              <nuxt-link to="/forgetPassword"> ลืมรหัสผ่าน </nuxt-link>
            </div>
          </div>
        </v-form>
        <v-spacer></v-spacer>
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import { authen } from '~/api/Authenticate/Authenticate'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {
    Topbar,
  },
  middleware: 'authenticated',
  data: () => ({
    username: '' as string,
    password: '' as string,
    error: { message: '' },
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
  }),
  methods: {
    async onSubmit() {
      try {
        if (this.auth.channelName && this.auth.projCustCompanyCode) {
          const response = await authen.login(
            this.username,
            this.password,
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
          const { alert } = response
          if (alert.alertApiCode === '200') {
            this.$store.commit('authStore/clearUsernamePassword')
            this.$store.commit('otpStore/resetOTPModel')
            this.$store.commit('authStore/setAuth', {
              globalCode: response.globalCode,
              comId: response.companyId,
              levelId: response.levelId,
              depId: response.departmentId,
            })
            this.$router.push('/')
          } else {
            this.error.message = alert.alertDisplay
          }
        } else {
          const response = await authen.userRegisterGetChOTP(this.username)
          const { getChOTP, alert } =
            response && response.data ? response.data : null
          if (alert[0].alertId === -1) {
            const { refOTP, loginName } = getChOTP[0]
            this.$store.commit('otpStore/setOTPModel', {
              refOTP: refOTP,
              mobile: loginName,
            })
            this.$store.commit('authStore/setAuth', {
              username: this.username,
              password: this.password,
            })
            this.$router.push('auth/verifyotp')
          } else {
            this.error.message = alert[0].alertDisplay
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  computed: {
    disabledButtonLogin() {
      return (
        this.username &&
        !!this.password &&
        !!this.password === this.password.length >= 8 &&
        !!/^0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(this.username)
      )
    },
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style lang="scss" scoped>
.is-danger {
  color: red !important;
}

.button {
  background-color: gray !important;
  color: #fff;
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  &:hover {
    background-color: #469b5c !important;
  }
}
.href-forget {
  cursor: pointer;
  p {
    margin: 0;
  }
  &:hover {
    color: #469b5c;
    border-bottom: 1px solid #469b5c;
  }
}
.field > p {
  color: red($color: #000000);
}
</style>
