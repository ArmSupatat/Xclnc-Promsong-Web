<template>
  <v-app>
    <Topbar />
    <v-container class="height-100">
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">ลืมรหัสผ่าน</a>
      </div>
      <v-form
        class="
          width-100
          flex
          justify-center
          align-center
          flex-column
          forget-password-container
          text-field-details-messages
        "
        @submit.prevent="userForgetPassword"
      >
        <h2 class="mb-2">ลืมรหัสผ่าน</h2>
        <p>กรุณาระบุเบอร์โทรที่ลงทะเบียนไว้</p>
        <v-text-field
          outlined
          class="rounded-lg mb-0"
          label="เบอร์โทร"
          type="text"
          name="loginName"
          v-model="loginName"
          :rules="[loginNameRules.required]"
        ></v-text-field>
        <v-row justify="center" class="flex-unset">
          <v-dialog
            v-model="dialog"
            name="OTP"
            persistent
            width="300px"
            height="450px"
          >
            <template v-slot:activator="{ attrs }">
              <v-btn
                class="button-modal"
                v-bind="attrs"
                :disabled="!disabledButtonPasswordOTP"
                @click="userForgetPassword"
              >
                ส่งรหัสชั่วคราว
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                ระบบได้ทำการส่งรหัสชั่วคราว แล้ว กรุณาเช็คเบอร์โทร
              </v-card-title>
              <v-card-actions class="py-5">
                <v-spacer></v-spacer>
                <v-btn
                  color="darken-1"
                  class="border-btn-color"
                  text
                  @click=";(dialog = false), $router.push('/newPassword')"
                >
                  ตกลง
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <p v-if="error.message" class="is-danger text-center mb-0 mt-2">
          {{ error.message }}
        </p>
      </v-form>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { forgetPassword } from '~/api/Account/UserForgetPassword'

export default Vue.extend({
  methods: {
    async userForgetPassword() {
      const response = await forgetPassword.userForgetPassword(
        'Y',
        this.loginName,
        this.hashCode
      )
      if (response && response.data.alert.length > 0) {
        const alert = response.data.alert[0]
        if (alert.alertApiCode === '200') {
          this.$store.commit('forgetStore/setForget', {
            mobile: response.data.forgetPassword[0].mobile,
            referenceOTP: response.data.forgetPassword[0].refOTP,
            loginName: response.data.forgetPassword[0].loginName,
            projCustComCode: response.data.projCustComCode,
            channelName: response.data.channelName,
          })
          this.dialog = true
        } else {
          this.error.message = alert.alertDisplay
        }
      }
    },
  },
  data: () => ({
    loginName: '' as string,
    projCustComCode: '' as string,
    error: { message: '' },
    mobile: '' as string,
    hashCode: '' as string,
    dialog: false,
    loginNameRules: {
      required: (v: any) => !!v || 'กรุณาใส่ เบอร์โทร',
    },
  }),
  computed: {
    disabledButtonPasswordOTP() {
      return this.loginName
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';

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
.forget-password-container {
  height: 70%;
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
.v-input {
  flex: unset !important;
  width: 300px !important;
  margin-top: 15px;
  margin-bottom: 30px;
}
.flex-unset {
  flex: unset !important;
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
</style>
