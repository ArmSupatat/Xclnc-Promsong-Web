<template>
  <div class="personal-information-container">
    <h2>บัญชีของฉัน</h2>
    <h3>ข้อมูลส่วนตัว</h3>
    <div class="mt-8 width-100">
      <v-form @submit.prevent="saveProfile">
        <div class="flex respon105101Grp3-field">
          <v-text-field
            outlined
            class="rounded-lg"
            label="ผู้ใช้งาน"
            v-model="info.personCode"
            disabled
          ></v-text-field>
          <v-text-field
            outlined
            class="rounded-lg ml-8"
            label="ชื่อผู้ใช้งาน"
            v-model="info.personFirstname"
          ></v-text-field>
        </div>
        <div class="mt-4 flex respon105101Grp3-field">
          <v-text-field
            outlined
            class="rounded-lg"
            label="เบอร์โทร"
            v-model="info.mobile"
          ></v-text-field>
          <v-text-field
            outlined
            class="rounded-lg ml-8"
            label="อีเมล"
            v-model="info.email"
          ></v-text-field>
        </div>
        <div class="mt-8 field flex justify-end">
          <button type="reset" class="cancel-button is-primary is-fullwidth">
            ยกเลิก
          </button>
          <button type="submit" class="submit-button is-primary is-fullwidth">
            บันทึก
          </button>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import { command105101Group3 } from '~/api/Profile/Command105101Group3'
import { command105101 } from '~/api/Profile/Command105101'
import {
  MyDepPersonCommand105101,
  MyPersonCommand105101,
} from '~/types/CreateCommand105101Input'

export default Vue.extend({
  data: () => ({
    info: {
      personFirstname: '' as string,
      mobile: '' as string,
      email: '' as string,
      personCode: '' as string,
    },
    response105101Grp3: null as any,
  }),
  mounted() {
    this.getProfile()
  },
  methods: {
    async getProfile() {
      const response105101Grp3 = await command105101Group3.command105101Group3(
        '0',
        this.auth.globalCode,
        this.auth.channelName
      )
      this.response105101Grp3 =
        response105101Grp3 && response105101Grp3.data
          ? response105101Grp3.data
          : null
      if (this.response105101Grp3) {
        const { mPerson } = this.response105101Grp3
        if (mPerson.length > 0) {
          this.info.personFirstname = mPerson[0].personFirstname
          this.info.mobile = mPerson[0].mobile
          this.info.email = mPerson[0].email
          this.info.personCode = mPerson[0].personCode
        }
      }
    },
    async saveProfile() {
      const loader = this.$loading.show()
      try {
        const { mPerson, mDepPerson } = this.response105101Grp3
        if (mPerson && mDepPerson) {
          const myDepPerson: MyDepPersonCommand105101 = {
            comId: mDepPerson[0].comId,
            cDepId: mDepPerson[0].cDepId,
            depId: mDepPerson[0].depId,
            personId: mDepPerson[0].personId,
            xsysId: mDepPerson[0].xsysId,
            itemNo: mDepPerson[0].itemNo,
            cObjId: mDepPerson[0].cObjId,
          }
          const mDepPersonList: MyDepPersonCommand105101[] = []
          mDepPersonList.push(myDepPerson)
          const myPerson: MyPersonCommand105101 = {
            personFirstname: this.info.personFirstname,
            depId: mPerson[0].depId,
            comId: mPerson[0].comId,
            cDepId: mPerson[0].cDepId,
            personId: mPerson[0].personId,
            personCode: this.info.personCode,
            prodtnFlag: mPerson[0].prodtnFlag,
            mobile: this.info.mobile,
            email: this.info.email,
            shopFlag: mPerson[0].shopFlag,
            leasFlag: mPerson[0].leasFlag,
            apvPersonFlag: mPerson[0].apvPersonFlag,
            personGrpPict: mPerson[0].personGrpPict,
            prodMgrFlag: mPerson[0].prodMgrFlag,
            saleMgrFlag: mPerson[0].saleMgrFlag,
            saleFlag: mPerson[0].saleFlag,
            purFlag: mPerson[0].purFlag,
            invtFlag: mPerson[0].invtFlag,
            finFlag: mPerson[0].finFlag,
            salePersonFlag: mPerson[0].salePersonFlag,
            consFlag: mPerson[0].consFlag,
            activeTyp: mPerson[0].activeType,
            apvFlag: mPerson[0].apvFlag,
            cObjId: mPerson[0].cObjId,
            lineLangFlag: mPerson[0].lineLangFlag,
            mDepPerson: mDepPersonList,
          }
          const myPersonList: MyPersonCommand105101[] = []
          myPersonList.push(myPerson)
          const command105101Res = await command105101.command105101(
            {
              mPerson: myPersonList,
            },
            this.auth.globalCode,
            this.auth.channelName
          )
          console.log('command105101Res', command105101Res)
        }
        this.$root.$emit('updateProfile')
        loader.hide()
      } catch (err) {
        loader.hide()
      }
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';

.submit-button {
  background-color: #469b5c;
  color: #fff;
  width: 150px;
  padding: 0.5rem;
  border-radius: 6px;
  margin-left: 5px;
}
.cancel-button {
  background-color: transparent;
  color: #000;
  width: 150px;
  padding: 0.5rem;
  border-radius: 6px;
  margin-right: 5px;
  border: 1px solid lightgray;
}
.personal-information-container {
  border: 1px solid lightgray;
  padding: 3rem;
  height: 450px;
  margin-bottom: 2rem;
}
fieldset {
  border-radius: 10px;
  width: 48%;
  height: 80px;
  padding: 0 10px;
  border: 1px solid gray;
}
legend {
  padding: 0 5px;
}
.input-style {
  border-radius: 10px;
  padding: 0 5px;
  outline: none;
  height: 100%;
  width: 100%;
  font-size: 20px;
}
.flex {
  display: flex;
}
@media only screen and (max-width: 600px) {
  .personal-information-container {
    height: 620px;
  }
  fieldset {
    width: unset;
  }
}
</style>
