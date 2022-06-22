<template>
  <div class="store-information-container">
    <div class="Body1 d-sm-flex flex-sm-row justify-sm-space-between">
      <h3 class="mb-sm-0 mb-4">ข้อมูลร้านค้า</h3>
      <button @click="showSysListComDepLevel" class="change-store-botton">
        <div class="icon-edit"></div>
        <span style="font-size: 14px; font-weight: 600"
          >เปลี่ยนร้านค้า - สาขา</span
        >
      </button>
      <client-only>
        <modal
          name="change-store"
          :adaptive="true"
          height="465px"
          @closed="$modal.hide('change-store')"
        >
          <div class="pa-xs-8 pa-sm-8 pa-lg-8 p-4 modal-container height-100">
            <div class="font20wei600 mb-4">ร้านค้า - สาขา</div>
            <div class="flex-row">
              <div class="icon-search"></div>
              <input
                type="search"
                class="popup-search"
                placeholder="ค้นหาสินค้า"
              />
            </div>
            <div class="mt-4 mb-8">
              <form action="">
                <v-radio-group
                  class="mt-0"
                  v-for="(item, index) in depList"
                  :key="index"
                  v-model="depSelect"
                >
                  <div
                    class="popup-list flex justify-between align-center pr-3"
                  >
                    <p class="m-0">{{ item.depName }}</p>
                    <v-radio :value="item.depId"></v-radio>
                  </div>
                </v-radio-group>
              </form>
            </div>
            <div class="mt-10 text-right">
              <v-btn
                class="border-btn-color"
                @click="$modal.hide('change-store')"
                outlined
              >
                <span>ยกเลิก</span>
              </v-btn>
              <v-btn class="border-btn-color" @click="handleChangeDep" outlined>
                <span>ตกลง</span>
              </v-btn>
            </div>
          </div>
        </modal>
      </client-only>
    </div>
    <div class="flex align-center flex-column mt-8 width-100">
      <div class="font16wei600 mb-2">
        <span>{{ branchName }}</span>
        <span v-if="branchCode === '00000'">(สำนักงานใหญ่)</span>
      </div>
      <!-- <p class="green-color">เงินชำระล่วงหน้าคงเหลือ ฿50.00</p> -->
      <h3 class="font16wei600 mb-4">รหัสบริษัท</h3>
      <vue-qrcode :margin="0" :width="150" :value="auth.projCustCompanyCode" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { groupBusiness } from '~/api/Authenticate/CommandGroupBusiness'
import { sysListComDepLevel } from '~/api/Profile/SysListComDepLevel'
import { AuthModel } from '~/types/AuthModel'
import VueQrcode from 'vue-qrcode'

export default Vue.extend({
  components: {
    VueQrcode,
  },
  data() {
    return {
      branchCode: '' as string,
      branchName: '' as string,
      depList: [] as any,
      depSelect: 0 as number,
    }
  },
  mounted() {
    this.getProfile()
  },
  methods: {
    async showSysListComDepLevel() {
      this.$modal.show('change-store')
      try {
        const userSysListRes = await sysListComDepLevel.UserSysListComDepLevel(
          {
            macAddress: '',
            brandName: '',
            ipAddress: '',
            deviceName: '',
            deviceTypIdx: 1,
            osVersion: '',
            productModel: '',
          },
          this.auth.globalCode,
          this.auth.channelName
        )
        this.depList =
          userSysListRes.data && userSysListRes.data.department
            ? userSysListRes.data.department
            : []
      } catch (err) {
        console.log(err)
      }
    },
    async handleChangeDep() {
      console.log('depSelect', this.depSelect)
      this.$modal.hide('change-store')
      //ทำการเข้า function Generate Global
    },
    async getProfile() {
      try {
        const cmdGrpBusinessRes = await groupBusiness.commandGroupBusiness(
          0,
          this.auth.globalCode,
          this.auth.channelName
        )
        if (cmdGrpBusinessRes && cmdGrpBusinessRes.mCompany) {
          const { mCompany } = cmdGrpBusinessRes
          if (mCompany.mBranch && mCompany.mBranch.length > 0) {
            const { mBranch } = mCompany
            this.branchName = mBranch[0].branchName
            this.branchCode = mBranch[0].branchCode
          }
        }
      } catch (err) {
        console.log(err)
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

.store-information-container {
  border: 1px solid lightgray;
  padding: 3rem;
  // height: 470px;
  margin-bottom: 3rem;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.change-store-botton {
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 0 10px;
  display: flex;
  align-items: center;
}
.qr-size {
  width: 152px;
  height: 152px;
}
.lists-space {
  width: 75%;
}
.popup-search {
  border-bottom: 1px solid lightgray;
  padding: 10px 10px 10px 0;
  width: 100%;
  outline: none;
}
.popup-list {
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid lightgray;
}
.m-0 {
  margin: 0 !important;
}
.icon-search {
  background-image: url(../assets/img/search.svg);
  width: 20px;
  height: 50px;
  background-position: center;
  margin-right: 10px;
}
.icon-edit {
  background-image: url(../assets/img/edit.svg);
  width: 20px;
  height: 30px;
  background-position: center;
  margin-right: 5px;
}
.green-color {
  color: #469b5c;
}
.font16wei600 {
  font-size: 16px;
  font-weight: 600;
}
.font20wei600 {
  font-size: 20px;
  font-weight: 600;
}
.flex {
  display: flex;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.border-btn-color {
  border: 1px solid lightgray;
}
input[type='radio']:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: -3px;
  left: -1px;
  position: relative;
  background-color: transparent;
  content: '';
  display: inline-block;
  visibility: visible;
  border: 2px solid gray;
}
input[type='radio']:checked:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: -3px;
  left: -1px;
  position: relative;
  background-color: #469b5c;
  content: '';
  display: inline-block;
  visibility: visible;
  border: 2px solid #469b5c;
}
.modal-container {
  overflow: auto;
}
.v-input--radio-group.v-input--radio-group--row .v-radio {
  margin-right: 0 !important;
  .v-application--is-ltr .v-input--selection-controls__input {
    margin-right: 0 !important;
  }
}

@media only screen and (max-width: 600px) {
  .personal-information-container {
    height: 620px;
  }
  fieldset {
    width: unset;
  }
  .store-information-container {
    height: 530px;
  }
}
</style>
