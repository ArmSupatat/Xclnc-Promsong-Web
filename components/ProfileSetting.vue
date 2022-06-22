<template>
  <div class="container">
    <v-form @submit.prevent="saveProfileSetting">
      <h2>ตั้งค่า</h2>
      <h3>ข้อมูลผู้ประกอบการ</h3>
      <div class="text-field-wrapper">
        <div class="flex respon-field">
          <v-text-field
            outlined
            class="rounded-lg"
            label="ชื่อสถานประกอบการ"
            v-model="info.depName"
          ></v-text-field>
          <v-text-field
            outlined
            class="rounded-lg ml-8"
            label="เลขประจำตัวผู้เสียภาษี/เลขบัตรประชาชน"
            v-model="info.taxNo"
          ></v-text-field>
        </div>
        <div class="flex respon-field">
          <v-text-field
            outlined
            class="rounded-lg"
            label="เบอร์มือถือ"
            v-model="info.mobile"
          ></v-text-field>
          <v-text-field
            outlined
            class="rounded-lg ml-8"
            label="อีเมล"
            v-model="info.email"
          ></v-text-field>
        </div>
        <div class="d-sm-flex flex-sm-row">
          <div class="flex-1">
            <p>ประเภทการจดทะเบียน *</p>
            <v-radio-group class="mt-0" v-model="info.businessTypIdx" row>
              <v-radio :key="1" :label="`นิติบุคคล`" :value="1"></v-radio>
              <v-radio :key="2" :label="`บุคคลธรรมดา`" :value="2"></v-radio>
            </v-radio-group>
          </div>
          <div class="flex-1 ml-sm-8 ml-0">
            <p>VAT *</p>
            <v-radio-group class="mt-0" v-model="info.presentVatRptFlag" row>
              <v-radio :key="`Y`" :label="`จด Vat`" :value="`Y`"></v-radio>
              <v-radio :key="`N`" :label="`ไม่จด Vat`" :value="`N`"></v-radio>
            </v-radio-group>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <h3>ที่อยู่</h3>
        <h4>สำหรับการส่งสินค้า และออกใบกำกับภาษี</h4>
        <div class="text-field-wrapper">
          <div class="flex respon-field">
            <v-select
              :items="items"
              label="ศูนย์อาหาร"
              class="rounded-lg flex-3"
              outlined
              v-if="info.isFoodCenter"
              v-model="info.foodCenter"
            ></v-select>
            <v-text-field
              outlined
              :class="`rounded-lg flex-1 ${info.isFoodCenter ? 'ml-8' : ''}`"
              label="เลขที่"
              v-model="info.houseNo"
              :disabled="info.isFoodCenter"
            ></v-text-field>
          </div>
          <div class="flex respon-field">
            <v-text-field
              outlined
              class="rounded-lg flex-1"
              placeholder="หมู่"
              v-model="info.mooNo"
              :disabled="info.isFoodCenter"
            ></v-text-field>
            <v-text-field
              outlined
              class="rounded-lg flex-3 ml-8"
              label="ชื่ออาคาร/หมู่บ้าน"
              v-model="info.buildingName"
              :disabled="info.isFoodCenter"
            ></v-text-field>
          </div>
          <div class="flex respon-field">
            <v-text-field
              outlined
              class="rounded-lg flex-1"
              placeholder="ล็อค"
              v-model="info.lock"
            ></v-text-field>
            <div class="flex flex-3 ml-8 respon-field">
              <v-text-field
                outlined
                class="rounded-lg flex-1"
                placeholder="ชั้น"
                v-model="info.floorNo"
              ></v-text-field>
              <v-text-field
                outlined
                class="rounded-lg flex-1 ml-8"
                label="ตรอก/ซอย"
                v-model="info.soiName"
                :disabled="info.isFoodCenter"
              ></v-text-field>
            </div>
          </div>
          <div class="flex respon-field">
            <v-text-field
              outlined
              class="rounded-lg flex-1"
              label="ถนน"
              v-model="info.streetName"
              :disabled="info.isFoodCenter"
            ></v-text-field>
            <div class="flex flex-3 ml-8 respon-field">
              <v-select
                :items="provinces"
                item-text="PROVINCE_NAME"
                item-value="PROVINCE_ID"
                label="จังหวัด"
                class="rounded-lg flex-1"
                outlined
                v-model="info.provinceId"
                :disabled="info.isFoodCenter"
              ></v-select>
              <v-select
                :items="districts"
                item-text="DISTRICT_NAME"
                item-value="DISTRICT_ID"
                label="เขต/อำเภอ"
                class="rounded-lg flex-1 ml-8"
                outlined
                v-model="info.districtId"
                :disabled="info.isFoodCenter"
              ></v-select>
            </div>
          </div>
          <div class="flex respon-field">
            <v-select
              :items="sDistricts"
              item-text="SUB_DISTRICT_NAME"
              item-value="SUB_DISTRICT_ID"
              label="แขวง/ตำบล"
              class="rounded-lg flex-1"
              outlined
              v-model="info.sDistrictId"
              :disabled="info.isFoodCenter"
            ></v-select>
            <div class="flex flex-3 ml-8 respon-field">
              <v-text-field
                outlined
                class="rounded-lg flex-1"
                label="รหัสไปรษณีย์"
                v-model="info.zipCode"
                :disabled="info.isFoodCenter"
              ></v-text-field>
              <div class="flex-1 ml-8" />
            </div>
          </div>
          <div class="mt-8 field flex justify-end">
            <button type="reset" class="cancel-button is-primary is-fullwidth">
              ยกเลิก
            </button>
            <button type="submit" class="submit-button is-primary is-fullwidth">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'

import Address from '~/mixins/Address'
import {
  CreateCommandBusinessInput,
  CreateCommandBusinessMCompany,
  CreateCommandBusinessMCompanyMBranch,
} from '~/types/CreateCommandBusinessInput'
import { commandBusiness } from '~/api/Authenticate/CreateCommandBusiness'
import { commandPltformShopTyp } from '~/api/Authenticate/CreateCommandPlatformShopTyp'
import {
  CreatePlatformShopTypInput,
  CreatePlatformShopTypMBranch,
  CreatePlatformShopTypMShop,
} from '~/types/CreatePlatformShopTypInput'
import { groupBusiness } from '~/api/Authenticate/CommandGroupBusiness'
import { command432101Group3 } from '~/api/Authenticate/Command432101Group3'

export default Address.extend({
  mixins: [Address],
  data: () => ({
    items: ['ศูนย์อาหาร 1', 'ศูนย์อาหาร 2', 'ศูนย์อาหาร 3', 'ศูนย์อาหาร 4'],
    info: {
      depName: '' as string,
      taxNo: '' as string,
      mobile: '' as string,
      email: '' as string,
      isFoodCenter: false as boolean,
      businessTypIdx: 0 as number,
      presentVatRptFlag: '' as string,
      foodCenter: '' as string,
      houseNo: '' as string,
      mooNo: '' as string,
      buildingName: '' as string,
      lock: '' as string | null,
      floorNo: '' as string,
      soiName: '' as string,
      streetName: '' as string,
      provinceId: 0 as number,
      districtId: 0 as number,
      sDistrictId: 0 as number,
      sDistrictName: '' as string,
      zipCode: '' as string,
    },
    cmdGrpBusinessRes: null,
    command432101Group3Res: null,
  }),
  mounted() {
    this.getProfile()
  },
  methods: {
    async getProfile() {
      this.cmdGrpBusinessRes = await groupBusiness.commandGroupBusiness(
        0,
        this.auth.globalCode,
        this.auth.channelName
      )
      if (this.cmdGrpBusinessRes) {
        const { alert, mCompany } = this.cmdGrpBusinessRes
        if (alert && alert.length > 0 && mCompany) {
          if (alert[0].alertId === -1) {
            this.info.depName = mCompany.comName
            this.info.taxNo = mCompany.taxNo
            this.info.mobile = mCompany.mobile
            this.info.email = mCompany.email
            this.info.businessTypIdx = mCompany.businessTypIdx
            this.info.presentVatRptFlag = mCompany.presentVatRptFlag
            // 1 = ศูนย์อาหาร 2 = ร้านอาหาร
            this.info.isFoodCenter =
              mCompany.mBranch && mCompany.mBranch.length > 0
                ? mCompany.mBranch[0].businessGrpIdx === 1
                : false
          }
        }
      }
      this.command432101Group3Res =
        await command432101Group3.command432101Group3(
          0,
          this.auth.globalCode,
          this.auth.channelName
        )
      if (this.command432101Group3Res) {
        const { alert, mShop } = this.command432101Group3Res
        if (alert && alert.length > 0 && mShop) {
          if (alert[0].alertId === -1) {
            const { mBranch } = mShop
            this.info.houseNo = mBranch[0].houseNo
            this.info.mooNo = mBranch[0].mooNo
            this.info.buildingName = mBranch[0].buildingName
            this.info.lock = null
            this.info.floorNo = mBranch[0].floorNo
            this.info.soiName = mBranch[0].soiName
            this.info.streetName = mBranch[0].streetName
            this.info.provinceId = mBranch[0].provinceId
            this.info.districtId = mBranch[0].districtId
            this.info.sDistrictId = mBranch[0].sDistrictId
            this.info.zipCode = mBranch[0].zipCode
          }
        }
      }
    },
    async saveProfileSetting() {
      const loader = this.$loading.show()
      try {
        //Save CmdBusiness
        {
          if (this.cmdGrpBusinessRes) {
            const { alert, mCompany } = this.cmdGrpBusinessRes
            if (alert && alert.length > 0 && mCompany) {
              if (alert[0].alertId === -1) {
                const { mBranch } = mCompany
                const mBranchBusinessReq: CreateCommandBusinessMCompanyMBranch =
                  {
                    branchCode: mBranch[0].branchCode,
                    branchName: this.info.depName,
                    branchId: mBranch[0].branchId,
                    shipPlaceId: mBranch[0].shipPlaceId,
                    businessGrpIdx: mBranch[0].businessGrpIdx,
                    cObjId: mBranch[0].cObjId,
                    comId: mBranch[0].comId,
                    depId: mBranch[0].depId,
                  }
                const listMBranch: CreateCommandBusinessMCompanyMBranch[] = []
                listMBranch.push(mBranchBusinessReq)
                const mComReq: CreateCommandBusinessMCompany = {
                  comId: mCompany.comId,
                  comCode: mCompany.comCode,
                  comName: this.info.depName,
                  addr: mCompany.address,
                  businessTypIdx: this.info.businessTypIdx,
                  projCustComCode: mCompany.projCustComCode,
                  presentVatRptFlag: this.info.presentVatRptFlag,
                  vatRptFlag: mCompany.vatRptFlag,
                  copyComId: mCompany.copyComId,
                  finChartCount: mCompany.finChartCount,
                  tel: mCompany.tel,
                  copyAllLevelFlag: mCompany.copyAllLevelFlag,
                  email: this.info.email,
                  website: mCompany.website,
                  taxNo: this.info.taxNo,
                  apvFlag: mCompany.apvFlag,
                  cObjId: mCompany.cObjId,
                  depId: mCompany.depId,
                  houseNo: mCompany.houseNo,
                  buildingName: mCompany.buildingName,
                  roomNo: mCompany.roomNo,
                  floorNo: mCompany.floorNo,
                  soiName: mCompany.soiName,
                  villageName: mCompany.villageName,
                  mooNo: mCompany.mooNo,
                  streetName: mCompany.streetName,
                  sDistrictId: mCompany.sDistrictId,
                  districtId: mCompany.districtId,
                  provinceId: mCompany.provinceId,
                  zipCode: mCompany.zipCode,
                  newLineColIdx: mCompany.newLineColIdx,
                  latitude: mCompany.latitude,
                  longtitude: mCompany.longtitude,
                  mobile: this.info.mobile,
                  mBranch: listMBranch,
                }
                const listMCompany: CreateCommandBusinessMCompany[] = []
                listMCompany.push(mComReq)
                const requestBusiness: CreateCommandBusinessInput = {
                  mCompany: listMCompany,
                }
                const createCmdBusinessRes =
                  await commandBusiness.createCmdBusiness(
                    requestBusiness,
                    this.auth.globalCode,
                    this.auth.channelName
                  )
              } else {
                console.log('alert', alert)
              }
            } else {
              console.log('alert', alert)
            }
          } else {
            console.log('cmdGrpBusinessRes is null')
          }
        }
        //Save CmdPlatformShopTyp
        {
          if (this.command432101Group3Res) {
            const { alert, mShop } = this.command432101Group3Res
            if (alert && alert.length > 0 && mShop) {
              if (alert[0].alertId === -1) {
                const { mBranch } = mShop
                const mBranchPltReq: CreatePlatformShopTypMBranch = {
                  branchId: mBranch[0].branchId,
                  branchCode: mBranch[0].branchCode,
                  branchName: mBranch[0].branchName,
                  mainBranchFlag: mBranch[0].mainBranchFlag,
                  headOfficeFlag: mBranch[0].headOfficeFlag,
                  houseNo: this.info.houseNo,
                  platformComBillFlag: mBranch[0].platformComBillFlag,
                  buildingName: this.info.buildingName,
                  businessGrpIdx: mBranch[0].businessGrpIdx,
                  roomNo: mBranch[0].roomNo,
                  floorNo: this.info.floorNo,
                  soiName: this.info.soiName,
                  villageName: mBranch[0].villageName,
                  mooNo: this.info.mooNo,
                  streetName: this.info.streetName,
                  sDistrictId: this.info.sDistrictId,
                  districtId: this.info.districtId,
                  provinceId: this.info.provinceId,
                  countryId: mBranch[0].countryId,
                  addr: `${this.info.streetName}\r\n ตำบล${this.sDistrictIdXShow} อำเภอ${this.districtIdXShow} จังหวัด${this.provinceIdXShow} ${this.info.zipCode}`,
                  addrEn: mBranch[0].addrEn,
                  zipCode: this.info.zipCode,
                  newLineColIdx: mBranch[0].newLineColIdx,
                  latitude: mBranch[0].latitude,
                  longtitude: mBranch[0].longtitude,
                  tel: mBranch[0].tel,
                  fax: mBranch[0].fax,
                  mobile: mBranch[0].mobile,
                  email: mBranch[0].email,
                  shipPlaceId: mBranch[0].shipPlaceId,
                  activeTyp: mBranch[0].activeTyp,
                  remark: mBranch[0].remark,
                  comId: mBranch[0].comId,
                  depId: mBranch[0].depId,
                  cObjId: mBranch[0].cObjId,
                  contactAddrItem: mBranch[0].contactAddrItem,
                }
                const listMBranchReq: CreatePlatformShopTypMBranch[] = []
                listMBranchReq.push(mBranchPltReq)
                const mShopReq: CreatePlatformShopTypMShop = {
                  shopId: mShop.shopId,
                  shopCode: mShop.shopCode,
                  shopName: this.info.depName,
                  shopNameEn: mShop.shopNameEn,
                  whId: mShop.whId,
                  cashBasketId: mShop.cashBasketId,
                  defArInvDepId: mShop.defArInvDepId,
                  rvCusId: mShop.rvCusId,
                  activeTyp: mShop.activeTyp,
                  shopDepId: mShop.shopDepId,
                  remark: mShop.remark,
                  apvFlag: mShop.apvFlag,
                  comId: mShop.comId,
                  headOfficeFlag: mShop.headOfficeFlag,
                  depId: mShop.depId,
                  cObjId: mShop.cObjId,
                  mBranch: listMBranchReq,
                  mShopPlatformShopTyp: mShop.mShopPlatformShopTyp,
                }
                const listMShopReq: CreatePlatformShopTypMShop[] = []
                listMShopReq.push(mShopReq)
                const requestPlatformShop: CreatePlatformShopTypInput = {
                  mShop: listMShopReq,
                }
                console.log('Request2', requestPlatformShop)
                const commandPltformShopTypRes =
                  await commandPltformShopTyp.createPlatformShopTyp(
                    requestPlatformShop,
                    this.auth.globalCode,
                    this.auth.channelName
                  )
                console.log('Response2', commandPltformShopTypRes)
              } else {
                console.log('alert', alert)
              }
            } else {
              console.log('alert', alert)
            }
          } else {
            console.log('command432101Group3Res is null')
          }
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

p {
  margin: 0;
}

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

.button-cancel {
  border: 1px solid lightgray;
  border-radius: 4px;
  cursor: pointer;
  padding: 1rem 3rem;
}

.button-confirm {
  border: 1px solid #469b5c;
  border-radius: 4px;
  background-color: #469b5c;
  cursor: pointer;
  color: #fff;
  padding: 1rem 3rem;
}

.container {
  border: 1px solid lightgray;
  margin-top: 4rem;
  padding: 3rem;
  .text-field-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    .rounded-lg {
      width: 50%;
      margin-bottom: 1rem;
    }
  }
}

@media (max-width: 1200px) {
  .container {
    margin-top: 1rem;
    padding: 1rem;
  }
}

@media only screen and (max-width: 600px) {
  .respon-field {
    display: unset;
    margin-left: 0 !important;
    .rounded-lg {
      margin-left: 0 !important;
      width: 100% !important;
    }
  }
  .button-cancel {
    padding: 1rem 1.5rem !important;
  }
  .button-confirm {
    padding: 1rem 1.5rem !important;
  }
}
</style>
