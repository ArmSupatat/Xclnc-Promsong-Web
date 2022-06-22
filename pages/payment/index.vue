<template>
  <v-app>
    <Topbar />
    <Navigationdrawers class="hidden-sm-and-up" />
    <v-container>
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">รายการสั่งซื้อสินค้า</a>
      </div>
      <h2>รายการสั่งซื้อสินค้า</h2>
      <div class="d-flex flex-row flex-wrap mt-4">
        <v-row dense class="respon">
          <v-col lg="8">
            <v-card
              outlined
              class="
                d-flex
                flex-column
                pa-1 pa-lg-4 pa-md-2 pa-sm-2
                mb-4
                borad-0
              "
            >
              <h4 class="mb-4">เลือกเวลาจัดส่ง</h4>
              <v-row dense>
                <v-col lg="6">
                  <v-menu
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="computedDateFormattedDatefns"
                        single-line
                        outlined
                        label="วันที่"
                        append-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="allowedDates"
                      v-model="date"
                      locale="th-TH"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col lg="6">
                  <v-autocomplete
                    v-model="selectedTime"
                    :items="listTimeFilter"
                    :loading="isLoading"
                    item-text="timeShow"
                    item-value="reqDate"
                    label="เวลาการจัดส่ง"
                    :rules="[rules.required]"
                    single-line
                    outlined
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          กรุณาเลือก
                          <strong>เวลาการจัดส่ง</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                    <template v-slot:selection="{ item }">
                      <span v-text="item.timeShow"></span>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col lg="6">
                  <p class="mb-0" v-if="computedDateFormattedDatefns">
                    <span>เวลาจัดส่ง :</span> {{ computedDateFormattedDatefns }}
                  </p>
                  <p class="mb-0" v-if="deliveryPrice > 0">
                    <span>ราคาค่าจัดส่ง :</span> {{ deliveryPrice }} บาท
                  </p>
                  <p class="mb-0" v-else>
                    <span>จัดส่งฟรี</span>
                  </p>
                </v-col>
                <v-col lg="6">
                  <p class="mb-0" v-if="computedDateFormattedTimefns">
                    <span> เวลา :</span>{{ computedDateFormattedTimefns }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              outlined
              class="
                d-flex
                flex-column
                pa-1 pa-lg-4 pa-md-2 pa-sm-2
                mb-4
                borad-0
              "
            >
              <div class="d-flex">
                <h4>คูปอง</h4>
                <span
                  v-if="selectedCoupon.length > 0"
                  class="ml-2 underline cursor-pointer"
                  @click="$modal.show('modal-coupon')"
                  >เลือกคูปองเพิ่ม</span
                >
              </div>
              <template v-if="selectedCoupon.length === 0">
                <v-card
                  @click="$modal.show('modal-coupon')"
                  class="
                    w-fit
                    cursor-pointer
                    pa-1 pa-lg-3 pa-md-2 pa-sm-2
                    mt-4
                    theme--light
                    v-sheet--outlined
                  "
                >
                  เลือกคูปอง
                </v-card>
              </template>
              <template
                v-if="
                  listCouponDisc.length === 0 && listCouponDiscProd.length === 0
                "
              >
                <p class="ma-0 mt-3 pa-0">ไม่มีคูปอง</p>
              </template>
              <v-row dense>
                <v-col
                  v-for="(coupon, i) in selectedCoupon"
                  :key="i"
                  cols="6"
                  sm="6"
                  md="4"
                  lg="4"
                  xl="3"
                >
                  <CouponCard
                    :coupon="coupon"
                    class="d-flex flex-wrap cursor-pointer"
                  />
                </v-col>
              </v-row>
              <client-only>
                <modal
                  name="modal-coupon"
                  :adaptive="true"
                  width="65%"
                  height="95%"
                  @closed="$modal.hide('modal-coupon')"
                >
                  <div
                    class="
                      d-flex
                      flex-column
                      justify-space-between
                      pa-xs-8 pa-sm-8 pa-md-6 pa-lg-6 pa-2
                    "
                    style="overflow: auto; height: 100%"
                  >
                    <div class="modal-content">
                      <div class="d-flex flex-row justify-space-between">
                        <h2 class="pb-4">คูปอง</h2>
                        <div class="couponListRespon">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                class="drawer-icon"
                              >
                                <v-icon>mdi-filter</v-icon>
                              </v-btn>
                            </template>
                            <v-list dense>
                              <v-list-item-group
                                class="d-flex flex-column px-4 py-1"
                              >
                                <span
                                  @click="couponType = 0"
                                  :class="`cursor-pointer ${
                                    couponType === 0
                                      ? 'titel--text underline'
                                      : ''
                                  }`"
                                  >ทั้งหมด</span
                                >
                                <span
                                  @click="couponType = 1"
                                  :class="`cursor-pointer ${
                                    couponType === 1
                                      ? 'titel--text underline'
                                      : ''
                                  }`"
                                  >คูปองส่วนลดสินค้า</span
                                >
                                <span
                                  @click="couponType = 2"
                                  :class="`cursor-pointer ${
                                    couponType === 2
                                      ? 'titel--text underline'
                                      : ''
                                  }`"
                                  >คูปองส่วนลด</span
                                >
                              </v-list-item-group>
                            </v-list>
                          </v-menu>
                        </div>
                      </div>
                      <div class="couponList mb-2">
                        <span
                          @click="couponType = 0"
                          :class="`cursor-pointer ${
                            couponType === 0 ? 'titel--text underline' : ''
                          }`"
                          >ทั้งหมด</span
                        >
                        <span class="mx-2 make--text">|</span>
                        <span
                          @click="couponType = 1"
                          :class="`cursor-pointer ${
                            couponType === 1 ? 'titel--text underline' : ''
                          }`"
                          >คูปองส่วนลดสินค้า</span
                        >
                        <span class="mx-2 make--text">|</span>
                        <span
                          @click="couponType = 2"
                          :class="`cursor-pointer ${
                            couponType === 2 ? 'titel--text underline' : ''
                          }`"
                          >คูปองส่วนลด</span
                        >
                      </div>
                      <v-row dense class="respon-card">
                        <v-col
                          class="respon-coupon"
                          v-for="(coupon, i) in filterCoupon"
                          :key="i"
                          cols="6"
                          sm="6"
                          md="4"
                          lg="4"
                          xl="3"
                        >
                          <div
                            class="clickable-coupon"
                            @click="selectCoupon(coupon)"
                          >
                            <CouponCard
                              :coupon="coupon"
                              class="d-flex flex-wrap cursor-pointer"
                            />
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div class="mt-3 text-center">
                      <v-btn
                        @click="confirmCoupon"
                        class="warn-coupon-card"
                        outlined
                      >
                        <span class="font-weight-bold">ตกลง</span>
                      </v-btn>
                    </div>
                    <!-- <v-dialog v-model="dialogWarnCouponCard" max-width="300">
                      <v-card>
                        <v-card-title class="textDialogWarnCouponCard">
                          <p>ไม่สามารถเลือกคูปองได้</p>
                        </v-card-title>
                        <v-card-subtitle
                          class="textDialogWarnCouponCardSubtitle"
                        >
                          <p class="newline">
                            <span>คูปองส่วนลดสินค้าสามารถเลือกใช้ได้เพียง</span>
                            <span>ครั้งละหนึ่งคูปองเท่านั้น</span>
                          </p>
                        </v-card-subtitle>
                        <v-card-actions class="pb-4">
                          <v-spacer></v-spacer>
                          <v-btn
                            class="Button"
                            color="white"
                            @click="dialogWarnCouponCard = false"
                            >ตกลง</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog> -->
                    <v-dialog
                      v-model="dialogWarnAbleEditCouponCard"
                      max-width="300"
                    >
                      <v-card>
                        <v-card-title class="textDialogWarnAbleEditCouponCard">
                          <p>เลือกคูปองได้</p>
                        </v-card-title>
                        <v-card-subtitle
                          class="textDialogWarnAbleEditCouponCardSubtitle"
                        >
                          <p class="newline">
                            <span
                              >ไม่สามารถเปลี่ยนแปลงคูปองที่เลือกไปแล้วได้</span
                            >
                          </p>
                        </v-card-subtitle>
                        <v-card-actions class="pb-4">
                          <v-spacer></v-spacer>
                          <v-btn
                            class="Button"
                            color="white"
                            @click="dialogWarnAbleEditCouponCard = false"
                            >ตกลง</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </modal>
              </client-only>
            </v-card>
            <v-card
              outlined
              class="d-flex flex-column pa-1 pa-lg-4 pa-md-2 pa-sm-2 borad-0"
            >
              <h4>วิธีชำระเงิน</h4>
              <v-radio-group v-model="paymentType" row>
                <v-row>
                  <v-col
                    v-for="payment in listPayment"
                    :key="payment.paymentTypIdx"
                    lg="4"
                  >
                    <v-card
                      :class="`PaymentType ${
                        paymentType === payment.paymentTypIdx ? 'checked' : ''
                      } pa-1 pa-lg-3 pa-md-2 pa-sm-2 borad-0 theme--light v-sheet--outlined`"
                      @click="paymentType = payment.paymentTypIdx"
                    >
                      <v-radio
                        :label="payment.paymentTypIdxXShow"
                        color="success"
                        :value="payment.paymentTypIdx"
                      ></v-radio>

                      <img src="/images/promptpay.png" class="PaymentPic" />
                    </v-card>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-card>
          </v-col>
          <v-col lg="4">
            <SummaryOrder
              :sumPoBeforeDiscAmt="sumPoBeforeDiscAmt"
              :sumPoDiscAmt="sumPoDiscAmt"
              :discAmt="discAmt"
              :vatAmt="vatAmt"
              :poAmt="poAmt"
              :apAdvNoInvBfAmt="apAdvNoInvBfAmt"
              :genQrAmt="genQrAmt"
              :btnName="`ชำระเงิน`"
              :linkPage="linkPage"
              :validate="
                !computedDateFormattedDatefns || !computedDateFormattedTimefns
              "
              @submitPayment="cmdPOMd"
            />
          </v-col>
        </v-row>
      </div>
    </v-container>
    <Footer />
    <v-dialog v-model="dialogWarnPaidSuccess" max-width="300">
      <v-card>
        <v-card-title class="textDialogWarnPaidSuccess">
          <p>แจ้งเตือน</p>
        </v-card-title>
        <v-card-subtitle class="textDialogWarnPaidSuccessSubtitle">
          <p class="newline">
            <span>ไม่มียอดที่ต้องชำระหรือชำระเมื่อรับสินค้า</span>
          </p>
        </v-card-subtitle>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            class="Button"
            color="white"
            @click="dialogWarnPaidSuccess = false"
            >ตกลง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogWarnChooseShipDate" max-width="300">
      <v-card>
        <v-card-title class="textDialogWarnChooseShipDate">
          <p>แจ้งเตือน</p>
        </v-card-title>
        <v-card-subtitle class="textDialogWarnChooseShipDateSubtitle">
          <p class="newline">
            <span>กรุณาเลือกวันที่จัดส่งอีกครั้ง</span>
          </p>
        </v-card-subtitle>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            class="Button"
            color="white"
            @click="dialogWarnChooseShipDate = false"
            >ตกลง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogError" max-width="300">
      <v-card>
        <v-card-title class="textDialogError">
          <p>แจ้งเตือน</p>
        </v-card-title>
        <v-card-subtitle class="textDialogErrorSubtitle">
          <p class="newline">
            <span>ไม่สามารถทำงานต่อได้</span>
          </p>
        </v-card-subtitle>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn class="Button" color="white" @click="dialogError = false"
            >ตกลง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <client-only>
      <modal
        name="modal-paid-sucess"
        :adaptive="true"
        width="300"
        height="200"
        @closed="$modal.hide('modal-paid-sucess')"
      >
        <div class="d-flex flex-column align-center justify-center h-full">
          <img src="/images/Checked.png" class="w-fit" />
          <p class="mt-6 mb-0">ชำระเงินเรียบร้อย</p>
          <p class="mb-0 titel--text">
            {{ tPurOrd && tPurOrd.poNo ? tPurOrd.poNo : '-' }}
          </p>
          <v-btn
            @click="$router.push('/order')"
            type="button"
            class="button is-primary"
            >ปิด</v-btn
          >
        </div>
      </modal>
    </client-only>
  </v-app>
</template>
<script lang="ts">
import CouponCard from '~/components/CouponCard.vue'
import { getLookUpMPTShipRouteDelivery } from '~/api/LookUp/GetLookUpMPTShipRouteDelivery'
import { cmdPO } from '~/api/Order/CommandPurchaseOrder'
import { mapState } from 'vuex'
import {
  CommandPurchaseTPoCoupon,
  CommandPurchaseTPurOrd,
  CommandPurchaseTPoCouponDelete,
} from '~/types/CommandPurchaseOrderInput'
import { AuthModel } from '~/types/AuthModel'
import { getLookUpPaymentTypIdx } from '~/api/LookUp/GetLookUpPaymentTypIdx'
import { cmdGrp3PO } from '~/api/Order/Command29101Group3'
import { getLookUpAuthenGetDate } from '~/api/LookUp/GetLookUpAuthenGetDate'
import { getListCoupon } from '~/api/Order/GetCoupon'
import APICalPurOrd from '~/mixins/APICalPurOrd'

export default APICalPurOrd.extend({
  components: {
    CouponCard,
  },
  middleware: ['checkPoId'],
  data() {
    return {
      cart: [] as object[],
      sumPoBeforeDiscAmt: 0 as number,
      sumPoDiscAmt: 0 as number,
      discAmt: 0 as number,
      vatAmt: 0 as number,
      poAmt: 0 as number,
      advPoPct: 0 as number,
      advPoAmt: 0 as number,
      apAdvNoInvBfAmt: 0 as number,
      genQrAmt: 0 as number,
      deliveryPrice: 0 as number,
      isLoading: false,
      date: null,
      time: null,
      setProgressTimeMs: 1000 * 60 * 5,
      tempCoupon: [] as any[],
      selectedCoupon: [] as Object[],
      paymentType: 0 as number,
      linkPage: '/' as string,
      couponType: 0 as number,
      // dialogWarnCouponCard: false as Boolean,
      dialogWarnAbleEditCouponCard: false as Boolean,
      dialogWarnPaidSuccess: false as Boolean,
      dialogError: false as Boolean,
      dialogWarnChooseShipDate: false as Boolean,
      rules: {
        required: (value: any) => !!value || 'ต้องการ',
      },
      listPayment: [],
      listCouponDisc: [] as object[],
      listCouponDiscProd: [] as object[],
      listTime: [],
      listTimeFilter: [],
      selectedTime: null as string | null,
    }
  },
  created() {
    this.cart = this.listCart
  },
  async mounted() {
    if (this.poId) {
      await this.calculatePrice()
      await this.getListCoupon()
      await this.getShipRouteDelivery()
      await this.getLookUpPaymentTypIdx()
    } else {
      this.$router.push('/product')
    }
  },
  methods: {
    allowedDates(val: any) {
      const valDate = new Date(val)
      const currentDate = new Date()
      const expireDate = new Date()
      expireDate.setDate(expireDate.getDate() + 5)
      return valDate > currentDate && expireDate > valDate
    },
    async getCommand29101Group3() {
      const cmdGrp3PORes = await cmdGrp3PO.command29101Group3(
        0,
        {
          poId: this.poId,
        },
        this.auth.globalCode,
        this.auth.channelName
      )
      return await cmdGrp3PORes
    },
    async getListCoupon() {
      const listCouponRes = await getListCoupon.getListCoupon(
        this.poId,
        {
          pagingFrom: 0,
          pagingTo: 1000,
          search: '',
          barcode: '',
        },
        this.auth.globalCode,
        this.auth.channelName
      )
      const { couponDiscResponse, couponDiscProdResponse } =
        listCouponRes && listCouponRes.data ? listCouponRes.data : []
      this.listCouponDiscProd = couponDiscProdResponse.map((item: any) => {
        const fIndex =
          this.tPurOrdCmdGrp3 && this.tPurOrdCmdGrp3.tPoCoupon
            ? this.tPurOrdCmdGrp3.tPoCoupon.findIndex(
                (e: any) => e.platformCouponId === item.platformCouponId
              )
            : -1
        return {
          ...item,
          type: 1,
          useCouponFlag: fIndex > -1 ? 'Y' : 'N',
        }
      })
      this.listCouponDisc = couponDiscResponse.map((item: any) => {
        const fIndex =
          this.tPurOrdCmdGrp3 && this.tPurOrdCmdGrp3.tPoCoupon
            ? this.tPurOrdCmdGrp3.tPoCoupon.findIndex(
                (e: any) => e.platformCouponId === item.platformCouponId
              )
            : -1
        return {
          ...item,
          type: 2,
          useCouponFlag: fIndex > -1 ? 'Y' : 'N',
        }
      })
      this.selectedCoupon = [
        ...this.listCouponDiscProd
          .concat(this.listCouponDisc)
          .filter((item: any) => {
            return item.useCouponFlag === 'Y'
          })
          .map((coupon: any) => {
            return {
              ...coupon,
            }
          }),
      ]
      this.tempCoupon = [
        ...this.selectedCoupon.map((coupon: any) => {
          return {
            ...coupon,
          }
        }),
      ]
    },
    async getShipRouteDelivery() {
      const cmdGrp3PORes = await this.getCommand29101Group3()
      const { alert, tPurOrd } =
        cmdGrp3PORes && cmdGrp3PORes.data ? cmdGrp3PORes.data : null
      if (alert && alert.length > 0) {
        if (alert[0].alertId === -1 && tPurOrd.shipRouteId) {
          const { mptShipRouteDelivery_Response } =
            await getLookUpMPTShipRouteDelivery.getLookUpMPTShipRouteDelivery(
              tPurOrd.shipRouteId,
              this.auth.globalCode,
              this.auth.channelName
            )
          this.listTime = mptShipRouteDelivery_Response
        }
      }
    },
    async getLookUpPaymentTypIdx() {
      const data = {
        filter: {
          pagingFrom: 0,
          pagingTo: 1000,
          search: '',
          barcode: '',
        },
      }
      const response = await getLookUpPaymentTypIdx.getLookUpPaymentTypIdx(
        data,
        this.auth.globalCode,
        this.auth.channelName
      )
      this.listPayment = response.data ? response.data : []
    },
    selectCoupon(selCoupon: any) {
      selCoupon.useCouponFlag = selCoupon.useCouponFlag === 'Y' ? 'N' : 'Y'
      if (selCoupon.useCouponFlag === 'Y') {
        this.tempCoupon.push(selCoupon)
        // if (
        //   this.tempCoupon.filter(
        //     (each: any) =>
        //       each.type === 1 &&
        //       each.showPlatformCouponDescDetail ===
        //         selCoupon.showPlatformCouponDescDetail
        //   ).length > 1
        // ) {
        //   this.dialogWarnCouponCard = true
        //   selCoupon.useCouponFlag = 'N'
        //   this.tempCoupon.splice(length - 1, 1)
        // }
      } else {
        const index = this.tempCoupon.findIndex(
          (each: any) => each.platformCouponId === selCoupon.platformCouponId
        )
        this.tempCoupon.splice(index, 1)
      }
    },
    async confirmCoupon() {
      const loader = this.$loading.show()
      this.selectedCoupon = [
        ...this.tempCoupon.map((coupon: any) => {
          return {
            ...coupon,
          }
        }),
      ]
      const cmdGrp3PORes = await this.getCommand29101Group3()
      const { alert, tPurOrd } =
        cmdGrp3PORes && cmdGrp3PORes.data ? cmdGrp3PORes.data : null
      if (alert && alert.length > 0) {
        if (alert[0].alertId === -1) {
          try {
            if (this.tPurOrd) {
              //list coupon added
              const cmdTPoCouponList: CommandPurchaseTPoCoupon[] =
                this.selectedCoupon
                  .filter((coupon1: any) => {
                    var found = true
                    tPurOrd.tPoCoupon?.forEach((coupon2: any) => {
                      if (
                        coupon1.platformCouponId === coupon2.platformCouponId
                      ) {
                        found = false
                      }
                    })
                    return found
                  })
                  .map((each: any, index: number) => {
                    return {
                      platformCouponId: each.platformCouponId,
                      poId: this.poId,
                      discAmt: each.discAmt,
                      poItem: index + 1,
                    }
                  })
              // list coupon deleteted
              const tPoCouponDeleteList: CommandPurchaseTPoCouponDelete[] =
                tPurOrd.tPoCoupon
                  ?.filter((coupon1: any) => {
                    var found = true
                    this.selectedCoupon.forEach((coupon2: any) => {
                      if (
                        coupon1.platformCouponId === coupon2.platformCouponId
                      ) {
                        found = false
                      }
                    })
                    return found
                  })
                  .map((each: any) => {
                    return { xsysId: each.xsysId }
                  })
              const tPurOrdInput: CommandPurchaseTPurOrd = {
                poId: this.tPurOrd.poId,
                poNo: this.tPurOrd.poNo,
                poDate: this.tPurOrd.poDate,
                saleJobDesc: this.tPurOrd.saleJobDesc,
                supId: this.tPurOrd.supId,
                supName: this.tPurOrd.supName,
                paidSupId: this.tPurOrd.paidSupId,
                mDocPrefixRunProdClassId: this.tPurOrd.mDocPrefixRunProdClassId,
                mSupProdClassId: this.tPurOrd.mSupProdClassId,
                onePoFlag: this.tPurOrd.onePoFlag,
                maxPriceFlag: this.tPurOrd.maxPriceFlag,
                paidSupName: this.tPurOrd.paidSupName,
                imptFlag: this.tPurOrd.imptFlag,
                poRefTypIdx: this.tPurOrd.poRefTypIdx,
                poRefId: this.tPurOrd.poRefId,
                saleJobId: this.tPurOrd.saleJobId,
                othRefNo: this.tPurOrd.othRefNo,
                changeOrdQtyFlag: this.tPurOrd.changeOrdQtyFlag,
                supRefNo: this.tPurOrd.supRefNo,
                cashCrTerm: this.tPurOrd.cashCrTerm,
                crTerm: this.tPurOrd.crTerm,
                expireDate: this.tPurOrd.expireDate,
                tradeIncoTermTyp: this.tPurOrd.tradeIncoTermTyp,
                paymentTypIdx: this.tPurOrd.paymentTypIdx,
                supPaymentDueTypIdx: this.tPurOrd.supPaymentDueTypIdx,
                balCrLineAmt: this.tPurOrd.balCrLineAmt,
                paymentTermIdx: this.tPurOrd.paymentTermIdx,
                pmPersonId: this.tPurOrd.pmPersonId,
                cncyId: this.tPurOrd.cncyId,
                presentVatRptFlag: this.tPurOrd.presentVatRptFlag,
                exchgRate: this.tPurOrd.exchgRate,
                vatRptFlag: this.tPurOrd.vatRptFlag,
                poAmt: this.tPurOrd.poAmt,
                reqDate: this.tPurOrd.reqDate,
                purLeadtime: this.tPurOrd.purLeadtime,
                taxNo: this.tPurOrd.taxNo,
                headOfficeFlag: this.tPurOrd.headOfficeFlag,
                poExpireDay: this.tPurOrd.poExpireDay,
                supBranchCode: this.tPurOrd.supBranchCode,
                reqDateTypIdx: this.tPurOrd.reqDateTypIdx,
                supBillName: this.tPurOrd.supBillName,
                supBillNameItem: this.tPurOrd.supBillNameItem,
                supBillAddr: this.tPurOrd.supBillAddr,
                supBillAddrItem: this.tPurOrd.supBillAddrItem,
                bankBasketId: this.tPurOrd.bankBasketId,
                apAdvNoInvBfAmt: this.tPurOrd.apAdvNoInvBfAmt,
                focFlag: this.tPurOrd.focFlag,
                poRcvFlag: this.tPurOrd.poRcvFlag,
                discPct1: this.tPurOrd.discPct1,
                discPct2: this.tPurOrd.discPct2,
                discPct3: this.tPurOrd.discPct3,
                cashDiscPct: this.tPurOrd.cashDiscPct,
                discAmt: this.tPurOrd.discAmt,
                prodClassProdTyp: this.tPurOrd.prodClassProdTyp,
                chngPriceFlag: this.tPurOrd.chngPriceFlag,
                holdApvTimeIdx: this.tPurOrd.holdApvTimeIdx,
                specificPurProdTypIdx: this.tPurOrd.specificPurProdTypIdx,
                vatInclFlag: this.tPurOrd.vatInclFlag,
                vatPct: this.tPurOrd.vatPct,
                poBeforeVatAmt: this.tPurOrd.poBeforeVatAmt,
                vatAmt: this.tPurOrd.vatAmt,
                advPctFlag: this.tPurOrd.advPctFlag,
                advPoPct: this.tPurOrd.advPoPct,
                advPoAmt: this.tPurOrd.advPoAmt,
                adjBeforeVatAmt: this.tPurOrd.adjBeforeVatAmt,
                adjBeforePoAmt: this.tPurOrd.adjBeforePoAmt,
                defSupInvDepId: this.tPurOrd.defSupInvDepId,
                defSupInvDepName: this.tPurOrd.defSupInvDepName,
                defRcvDepId: this.tPurOrd.defRcvDepId,
                defRcvDepName: this.tPurOrd.defRcvDepName,
                purShipTypIdx: this.tPurOrd.purShipTypIdx,
                rcvDepAddrItem: this.tPurOrd.rcvDepAddrItem,
                styleId: this.tPurOrd.styleId,
                assortId: this.tPurOrd.assortId,
                assortSolidTypIdx: this.tPurOrd.assortSolidTypIdx,
                noRtnFlag: this.tPurOrd.noRtnFlag,
                supShipAddr: this.tPurOrd.supShipAddr,
                supShipAddrItem: this.tPurOrd.supShipAddrItem,
                firstShipDate: this.tPurOrd.firstShipDate,
                shipMinPct: this.tPurOrd.shipMinPct,
                sumVatAbleAmt: this.tPurOrd.sumVatAbleAmt,
                sumNonVatAbleAmt: this.tPurOrd.sumNonVatAbleAmt,
                shipExtraPct: this.tPurOrd.shipExtraPct,
                partialShipFlag: this.tPurOrd.partialShipFlag,
                xchngFlag: this.tPurOrd.xchngFlag,
                platformIdx: this.tPurOrd.platformIdx,
                platformLockFlag: this.tPurOrd.platformLockFlag,
                billPaymentRef1: this.tPurOrd.billPaymentRef1,
                billPaymentRef2: this.tPurOrd.billPaymentRef2,
                billPaymentRef3: this.tPurOrd.billPaymentRef3,
                manualCloseQRFlag: this.tPurOrd.manualCloseQRFlag,
                manualCloseQRGrpPict: this.tPurOrd.manualCloseQRGrpPict,
                stkFilterFlag: this.tPurOrd.stkFilterFlag,
                stkTypIdx: this.tPurOrd.stkTypIdx,
                cUsrName: this.tPurOrd.cUsrName,
                lUsrName: this.tPurOrd.lUsrName,
                minReqDate: this.tPurOrd.minReqDate,
                sumVatBaseAbleAmt: this.tPurOrd.sumVatBaseAbleAmt,
                maxPurLeadtime: this.tPurOrd.maxPurLeadtime,
                cfmUsrName: this.tPurOrd.cfmUsrName,
                docPrefixRunId: this.tPurOrd.docPrefixRunId,
                remark: this.tPurOrd.remark,
                sumPoAmt: this.tPurOrd.sumPoAmt,
                sumPoVatAmt: this.tPurOrd.sumPoVatAmt,
                cObjId: this.tPurOrd.cObjId,
                createTyp: this.tPurOrd.createTyp,
                prodTypId: this.tPurOrd.prodTypId,
                comId: this.tPurOrd.comId,
                depId: this.tPurOrd.depId,
                cfmTyp: 'N',
                tPoCoupon: cmdTPoCouponList,
                tPoProd: this.tPurOrd.tPoProd,
              }
              const tPurOrdList: CommandPurchaseTPurOrd[] = []
              tPurOrdList.push(tPurOrdInput)
              const response = await cmdPO.commandPurchaseOrder(
                {
                  tPurOrd: tPurOrdList,
                  tPoCouponDelete: tPoCouponDeleteList,
                },
                this.auth.globalCode,
                this.auth.channelName
              )
              const { data } = response
              if (data && data.alert && data.alert.length > 0) {
                const alert = data.alert[0]
                if (alert.alertApiCode === '200' && alert.alertId < 0) {
                  this.tempCoupon = []
                  await this.calculatePrice()
                  await this.getListCoupon()
                  this.$modal.hide('modal-coupon')
                } else {
                  console.log(alert.alertDisplay)
                }
              } else {
                console.log('บันทึกล้มเหลว')
              }
            } else {
              console.log('บันทึกล้มเหลว')
            }
            loader.hide()
          } catch (err) {
            console.log(err)
            loader.hide()
          }
        }
      }
    },
    async cmdPOMd() {
      const getDateResp = await getLookUpAuthenGetDate.getLookUpAuthenGetDate(
        this.auth.globalCode,
        this.auth.channelName
      )
      const { serverInfo } =
        getDateResp && getDateResp.data ? getDateResp.data : null
      const poDate = this.tPurOrdCmdGrp3.poDate.split('T')[0]
      const serverDate = serverInfo[0].dateTime.split('T')[0]
      if (poDate === serverDate) {
        const loader = this.$loading.show()
        try {
          if (this.tPurOrd) {
            const setProgressTimeMs =
              this.tPurOrd.limitQrMs > 0
                ? this.tPurOrd.limitQrMs
                : this.setProgressTimeMs
            const expireDate = new Date(
              new Date().getTime() + setProgressTimeMs
            )
            const tPurOrdInput: CommandPurchaseTPurOrd = {
              poId: this.tPurOrd.poId,
              poNo: this.tPurOrd.poNo,
              poDate: this.tPurOrd.poDate,
              saleJobDesc: this.tPurOrd.saleJobDesc,
              supId: this.tPurOrd.supId,
              supName: this.tPurOrd.supName,
              paidSupId: this.tPurOrd.paidSupId,
              mDocPrefixRunProdClassId: this.tPurOrd.mDocPrefixRunProdClassId,
              mSupProdClassId: this.tPurOrd.mSupProdClassId,
              onePoFlag: this.tPurOrd.onePoFlag,
              maxPriceFlag: this.tPurOrd.maxPriceFlag,
              paidSupName: this.tPurOrd.paidSupName,
              imptFlag: this.tPurOrd.imptFlag,
              poRefTypIdx: this.tPurOrd.poRefTypIdx,
              poRefId: this.tPurOrd.poRefId,
              saleJobId: this.tPurOrd.saleJobId,
              othRefNo: this.tPurOrd.othRefNo,
              changeOrdQtyFlag: this.tPurOrd.changeOrdQtyFlag,
              supRefNo: this.tPurOrd.supRefNo,
              cashCrTerm: this.tPurOrd.cashCrTerm,
              crTerm: this.tPurOrd.crTerm,
              expireDate: this.$moment(expireDate)
                .locale('th')
                .format('YYYY-MM-DDTHH:mm:ss.SSS'),
              tradeIncoTermTyp: this.tPurOrd.tradeIncoTermTyp,
              paymentTypIdx: this.paymentType,
              supPaymentDueTypIdx: this.tPurOrd.supPaymentDueTypIdx,
              balCrLineAmt: this.tPurOrd.balCrLineAmt,
              paymentTermIdx: this.tPurOrd.paymentTermIdx,
              pmPersonId: this.tPurOrd.pmPersonId,
              cncyId: this.tPurOrd.cncyId,
              presentVatRptFlag: this.tPurOrd.presentVatRptFlag,
              exchgRate: this.tPurOrd.exchgRate,
              vatRptFlag: this.tPurOrd.vatRptFlag,
              poAmt: this.tPurOrd.poAmt,
              reqDate: this.$moment(this.selectedTime)
                .locale('th')
                .format('YYYY-MM-DDTHH:mm:ss.SSS'),
              purLeadtime: this.tPurOrd.purLeadtime,
              taxNo: this.tPurOrd.taxNo,
              headOfficeFlag: this.tPurOrd.headOfficeFlag,
              poExpireDay: this.tPurOrd.poExpireDay,
              supBranchCode: this.tPurOrd.supBranchCode,
              reqDateTypIdx: this.tPurOrd.reqDateTypIdx,
              supBillName: this.tPurOrd.supBillName,
              supBillNameItem: this.tPurOrd.supBillNameItem,
              supBillAddr: this.tPurOrd.supBillAddr,
              supBillAddrItem: this.tPurOrd.supBillAddrItem,
              bankBasketId: this.tPurOrd.bankBasketId,
              apAdvNoInvBfAmt: this.tPurOrd.apAdvNoInvBfAmt,
              focFlag: this.tPurOrd.focFlag,
              poRcvFlag: this.tPurOrd.poRcvFlag,
              discPct1: this.tPurOrd.discPct1,
              discPct2: this.tPurOrd.discPct2,
              discPct3: this.tPurOrd.discPct3,
              cashDiscPct: this.tPurOrd.cashDiscPct,
              discAmt: this.tPurOrd.discAmt,
              prodClassProdTyp: this.tPurOrd.prodClassProdTyp,
              chngPriceFlag: this.tPurOrd.chngPriceFlag,
              holdApvTimeIdx: this.tPurOrd.holdApvTimeIdx,
              specificPurProdTypIdx: this.tPurOrd.specificPurProdTypIdx,
              vatInclFlag: this.tPurOrd.vatInclFlag,
              vatPct: this.tPurOrd.vatPct,
              poBeforeVatAmt: this.tPurOrd.poBeforeVatAmt,
              vatAmt: this.tPurOrd.vatAmt,
              advPctFlag: this.tPurOrd.advPctFlag,
              advPoPct: this.tPurOrd.advPoPct,
              advPoAmt: this.tPurOrd.advPoAmt,
              adjBeforeVatAmt: this.tPurOrd.adjBeforeVatAmt,
              adjBeforePoAmt: this.tPurOrd.adjBeforePoAmt,
              defSupInvDepId: this.tPurOrd.defSupInvDepId,
              defSupInvDepName: this.tPurOrd.defSupInvDepName,
              defRcvDepId: this.tPurOrd.defRcvDepId,
              defRcvDepName: this.tPurOrd.defRcvDepName,
              purShipTypIdx: this.tPurOrd.purShipTypIdx,
              rcvDepAddrItem: this.tPurOrd.rcvDepAddrItem,
              styleId: this.tPurOrd.styleId,
              assortId: this.tPurOrd.assortId,
              assortSolidTypIdx: this.tPurOrd.assortSolidTypIdx,
              noRtnFlag: this.tPurOrd.noRtnFlag,
              supShipAddr: this.tPurOrd.supShipAddr,
              supShipAddrItem: this.tPurOrd.supShipAddrItem,
              firstShipDate: this.tPurOrd.firstShipDate,
              shipMinPct: this.tPurOrd.shipMinPct,
              sumVatAbleAmt: this.tPurOrd.sumVatAbleAmt,
              sumNonVatAbleAmt: this.tPurOrd.sumNonVatAbleAmt,
              shipExtraPct: this.tPurOrd.shipExtraPct,
              partialShipFlag: this.tPurOrd.partialShipFlag,
              xchngFlag: this.tPurOrd.xchngFlag,
              platformIdx: this.tPurOrd.platformIdx,
              platformLockFlag: this.tPurOrd.platformLockFlag,
              billPaymentRef1: this.tPurOrd.billPaymentRef1,
              billPaymentRef2: this.tPurOrd.billPaymentRef2,
              billPaymentRef3: this.tPurOrd.billPaymentRef3,
              manualCloseQRFlag: 'N',
              // manualCloseQRGrpPict: null,
              stkFilterFlag: this.tPurOrd.stkFilterFlag,
              stkTypIdx: this.tPurOrd.stkTypIdx,
              cUsrName: this.tPurOrd.cUsrName,
              lUsrName: this.tPurOrd.lUsrName,
              minReqDate: this.tPurOrd.minReqDate,
              sumVatBaseAbleAmt: this.tPurOrd.sumVatBaseAbleAmt,
              maxPurLeadtime: this.tPurOrd.maxPurLeadtime,
              cfmUsrName: this.tPurOrd.cfmUsrName,
              docPrefixRunId: this.tPurOrd.docPrefixRunId,
              remark: this.tPurOrd.remark,
              sumPoAmt: this.tPurOrd.sumPoAmt,
              sumPoVatAmt: this.tPurOrd.sumPoVatAmt,
              cObjId: this.tPurOrd.cObjId,
              createTyp: 'W',
              prodTypId: this.tPurOrd.prodTypId,
              comId: this.tPurOrd.comId,
              depId: this.tPurOrd.depId,
              cfmTyp: 'Y',
              tPoCoupon: this.tPurOrd.tPoCoupon,
              tPoProd: this.tPurOrd.tPoProd,
            }
            const tPurOrdList: CommandPurchaseTPurOrd[] = []
            tPurOrdList.push(tPurOrdInput)
            const response = await cmdPO.commandPurchaseOrder(
              {
                tPurOrd: tPurOrdList,
              },
              this.auth.globalCode,
              this.auth.channelName
            )
            const { data } = response
            if (data && data.alert && data.alert.length > 0) {
              const alert = data.alert[0]
              if (alert.alertApiCode === '200' && alert.alertId < 0) {
                if (
                  tPurOrdInput.paymentTermIdx === 3 ||
                  tPurOrdInput.paymentTermIdx === 4 ||
                  this.tPurOrd.genQrAmt === 0
                ) {
                  this.dialogWarnPaidSuccess = true
                } else {
                  if (tPurOrdInput.paymentTypIdx === 4) {
                    this.$store.commit('cartStore/clearCart')
                    this.$router.push('/payment/transfer')
                  } else {
                    this.$store.commit('cartStore/clearCart')
                    this.$router.push('/payment/confirmOrder')
                  }
                }
              } else if (
                alert.alertId === 2834 &&
                (alert.alertType === 'W' || alert.alertType === 'I')
              ) {
                this.dialogWarnChooseShipDate = true
              } else {
                this.dialogError = true
              }
            } else {
              this.dialogError = true
            }
          } else {
            this.dialogError = true
          }
          loader.hide()
        } catch (err) {
          this.dialogError = true
          loader.hide()
        }
      }
    },
  },
  computed: {
    computedDateFormattedDatefns(): string {
      var christianYear = this.$moment(this.date).format('YYYY')
      var buddhishYear = (parseInt(christianYear) + 543)
        .toString()
        .substring(2, 4)
      return this.date
        ? this.$moment(this.date)
            .locale('th')
            .format('dddd DD MMM ')
            .concat(buddhishYear)
        : ''
    },
    computedDateFormattedTimefns(): string | null {
      const selectTime: any = this.listTimeFilter.find(
        (time: any) =>
          time.day === this.date && time.reqDate === this.selectedTime
      )
      return selectTime ? selectTime.timeShow : null
    },
    filterCoupon(): any[] {
      let filterCoupon: any[] = []
      switch (this.couponType) {
        case 1:
          filterCoupon = this.listCouponDiscProd
          break
        case 2:
          filterCoupon = this.listCouponDisc
          break
        default:
          filterCoupon = this.listCouponDisc.concat(this.listCouponDiscProd)
      }
      return filterCoupon
    },
    ...mapState({
      poId: (state: any) => state.cartStore.poId,
      listCart: (state: any) => state.cartStore.cart,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
  watch: {
    async date(): Promise<void> {
      this.listTimeFilter = this.listTime.filter(
        (each: any) => each.day === this.date
      )
    },
    paymentType(): void {
      switch (this.paymentType) {
        case 10:
          this.linkPage = '/payment/confirmOrder'
          break
        default:
          this.linkPage = '/payment/transfer'
          break
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.PaymentType {
  height: 132px;
}
.PaymentType.checked {
  border-color: #469b5c !important;
}
.PaymentPic {
  display: flex;
  margin: 0 auto;
}
.ChooseCouponBtn {
  border-color: #dbdee7;
}

.respon {
  display: flex;
  flex-direction: row;
}

.couponListRespon {
  display: none;
}

.test {
  width: 65% !important;
}

@media (max-width: 1200px) {
  .respon {
    display: flex;
    flex-direction: column !important;
  }
}

@media (max-width: 600px) {
  .respon-card {
    display: flex;
    flex-direction: column !important;
    .respon-coupon {
      max-width: 100%;
    }
  }
  .couponList {
    display: none;
  }
  .couponListRespon {
    display: unset;
  }
}
</style>
