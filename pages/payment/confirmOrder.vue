<template>
  <v-app>
    <Topbar :checkLogin="true" />
    <Navigationdrawers class="hidden-sm-and-up" />
    <v-container>
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a>
        <span class="mx-3 make--text">/</span>
        <a href="#" class="secondary--text">ชำระเงิน</a>
      </div>
      <v-card outlined class="promptpay-card pa-1 pa-lg-3 pa-md-2 pa-sm-2 my-4">
        <h4>ชำระเงิน</h4>
        <div class="d-flex flex-column align-center">
          <img src="/images/promptpay.png" height="70" />
          <!-- <div class="text-loader" v-if="loading">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </div> -->
          <h4>หมายเลขอ้างอิง 1 : COM650000007</h4>
          <!-- <div class="text-loader" v-if="loading">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </div> -->
          <h4>หมายเลขอ้างอิง 2 : 2009021452161P22</h4>
          <!-- <div class="text-loader" v-if="loading">
            <v-skeleton-loader type="text, image"></v-skeleton-loader>
          </div>
          <h4 v-else>หมายเลขอ้างอิง 3 : {{ ref3 ? ref3 : '-' }}</h4> -->

          <img src="/images/qrcode2.png" height="200" />

          <!-- <vue-qrcode :width="250" :value="qrCode" /> -->
          <p class="NetPrice font-weight-bold">
            <span> ฿ </span>
            <span class="NetPriceValue">1210.00</span>
          </p>
          <p class="font-weight-bold">
            <span> กรุณาชำระเงินภายใน </span>
            <span class="CoutingTime" id="countdown"></span>
          </p>
          <p>
            กรุณาสแกน QR Code เพื่อทำการชำระเงิน หรือ
            <a
              @click.prevent="downloadQrCode"
              v-text="`บันทึก QR`"
              class="underline"
            ></a>
            เพื่อนำไปชำระที่ Application ของธนาคาร
          </p>
          <template>
            <span class="font-weight-bold">
              ระบบจะปิดบิลอัติโนมัติภายใน 30 วินาทีหลังจากการชำระเงิน
            </span>
            <p>
              เมื่อหลังจากชำระเงินแล้ว หากระบบยังไม่ยืนยันการสั่งซื้อภายใน 30
              วินาที กรุณา
              <nuxt-link to="/payment/uploadSlip" class="UploadSlip underline">
                แนบหลักฐานการชำระเงินที่นี่
              </nuxt-link>
            </p>
          </template>
        </div>
      </v-card>
    </v-container>
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
          <p class="mb-0 titel--text">{{ poNo }}</p>
          <v-btn
            @click="$router.push('/order')"
            type="button"
            class="button is-primary"
            >ปิด</v-btn
          >
        </div>
      </modal>
    </client-only>
    <client-only>
      <modal
        name="modal-cancel-sucess"
        :adaptive="true"
        width="300"
        height="200"
        @closed="$modal.hide('modal-cancel-sucess')"
      >
        <div class="d-flex flex-column align-center justify-center h-full">
          <img src="/images/Checked.png" class="w-fit" />
          <p class="mt-6 mb-0">ระบบถูกยกเลิกอัตโนมัติสำเร็จ</p>
          <p class="mb-0 titel--text">{{ poNo }}</p>
          <v-btn
            @click="$router.push('/order')"
            type="button"
            class="button is-primary"
            >ปิด</v-btn
          >
        </div>
      </modal>
    </client-only>
    <client-only>
      <modal
        name="modal-cancel-failed"
        :adaptive="true"
        width="300"
        height="200"
        @closed="$modal.hide('modal-cancel-failed')"
      >
        <div class="d-flex flex-column align-center justify-center h-full">
          <p class="mt-6 mb-0">ระบบถูกยกเลิกอัตโนมัติล้มเหลว</p>
          <p class="mb-0 titel--text">{{ poNo }}</p>
          <v-btn
            @click="$router.push('/')"
            type="button"
            class="button is-primary"
            >ปิด</v-btn
          >
        </div>
      </modal>
    </client-only>
    <Footer />
  </v-app>
</template>
<script lang="ts">
import { cmdGrp3PO } from '~/api/Order/Command29101Group3'
import CurrencyFormatter from '~/helpers/CurrencyFormatter'
import PaddingWithZero from '~/helpers/PaddingWithZero'
import CaculatePrice from '~/mixins/APICalPurOrd'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import { getLookUpQrCode } from '~/api/LookUp/GetLookUpGenerateQrCode'
import { getLookUpInquiryTransBillPayment } from '~/api/LookUp/GetLookUpInquiryTransBillPayment'
import VueQrcode from 'vue-qrcode'
import { CommandPurchaseTPurOrd } from '~/types/CommandPurchaseOrderInput'
import { cmdPO } from '~/api/Order/CommandPurchaseOrder'

export default CaculatePrice.extend({
  components: {
    VueQrcode,
  },
  // middleware: ['checkPoId'],
  mixins: [CaculatePrice],
  data() {
    return {
      cart: [] as object[],
      CurrencyFormatter,
      billerId: '',
      ref1: '',
      ref2: '',
      ref3: '',
      qrCode: '',
      poNo: '',
      PaddingWithZero,
      initTime: 0,
      progressTime: 0,
      countingTime: '0:00',
      isEnableUploadSlip: false,
      loading: true,
      showAttachMs: 0,
      minQrMs: 5 * 1000 * 60,
      dateFrom: null as unknown as Date,
      dateTo: null as unknown as Date,
      intervalInquiryTrans: null as any,
      intervalTime: null as any,
    }
  },
  created() {
    this.cart = this.listCart
  },
  mounted() {
    let timeleft = 30
    const downloadTimer = setInterval(function () {
      if (timeleft <= 0) {
        clearInterval(downloadTimer)
      } else {
        document.getElementById('countdown').innerHTML = '0:' + timeleft
      }
      timeleft -= 1
    }, 1000)
  },
  destroyed() {
    clearInterval(this.intervalTime)
    this.intervalTime = null
    clearInterval(this.intervalInquiryTrans)
    this.intervalInquiryTrans = null
  },
  methods: {
    downloadQrCode() {
      const imgSrc = document.querySelectorAll('img')[1]?.src
      const a = document.createElement('a')
      a.download = 'qrcode.png'
      a.href = imgSrc ? imgSrc : '#'
      document.body.append()
      a.click()
      a.remove()
    },
    initCheckInquiryTransBillPayment() {
      this.intervalInquiryTrans = setInterval(async () => {
        await this.checkInquiryTransBillPayment()
      }, 5000)
    },
    async checkInquiryTransBillPayment() {
      try {
        const inquiryRes =
          await getLookUpInquiryTransBillPayment.getLookUpInquiryTransBillPayment(
            {
              biller: this.billerId,
              amount: this.genQrAmt,
              reference1: this.ref1,
              reference2: this.ref2,
              terminal: this.ref3,
              isSummary: true,
              dateFrom: this.$moment(this.dateFrom)
                .locale('th')
                .format('YYYY-MM-DDTHH:mm:ss.SSS'),
              dateTo: this.$moment(this.dateTo)
                .locale('th')
                .format('YYYY-MM-DDTHH:mm:ss.SSS'),
            },
            this.auth.globalCode,
            this.auth.channelName
          )
        const { inquiryTransBillPayment } =
          inquiryRes && inquiryRes.data ? inquiryRes.data : null
        if (inquiryTransBillPayment && inquiryTransBillPayment.length > 0) {
          this.paidSuccess()
        } else if (!this.intervalTime) {
          this.cancelPO()
        }
      } catch (err) {
        console.log(err)
      }
    },
    async initialValues() {
      const cmdGrp3PORes = await cmdGrp3PO.command29101Group3(
        0,
        { poId: this.poId },
        this.auth.globalCode,
        this.auth.channelName
      )
      const { tPurOrd } =
        cmdGrp3PORes && cmdGrp3PORes.data ? cmdGrp3PORes.data : null
      if (tPurOrd) {
        this.initTime = tPurOrd.limitQrMs ? tPurOrd.limitQrMs : 0
        this.showAttachMs = tPurOrd.showAttachMs
        this.dateFrom = new Date()
        this.dateTo = new Date(tPurOrd.expireDate)
        this.poNo = tPurOrd.poNo
      }
      const genQrResp = await getLookUpQrCode.getLookUpGenerateQrCode(
        '',
        '',
        '',
        this.advPoAmt > 0 ? this.advPoAmt : this.genQrAmt,
        { poId: this.poId },
        this.auth.globalCode,
        this.auth.channelName
      )
      const { generateQr } = genQrResp && genQrResp.data ? genQrResp.data : null
      if (generateQr) {
        this.billerId = generateQr.billerId
        this.ref1 = generateQr.reference1
        this.ref2 = generateQr.reference2
        this.ref3 = generateQr.reference3
        this.qrCode = generateQr.qrCode
      }
      this.loading = false
    },
    updateTime() {
      this.progressTime =
        this.progressTime > 1000
          ? this.progressTime - 1000
          : this.progressTime - this.progressTime
      const durationTime = this.$moment.duration(this.progressTime)
      this.countingTime = `${this.PaddingWithZero.paddingWithZero(
        durationTime.minutes(),
        2
      )}:${this.PaddingWithZero.paddingWithZero(durationTime.seconds(), 2)}`
    },
    initialTimeout() {
      this.progressTime = this.initTime
      const showAttachTime = this.initTime - this.showAttachMs
      this.intervalTime = setInterval(() => {
        if (this.progressTime === 0) {
          clearInterval(this.intervalTime)
          this.intervalTime = null
        } else {
          this.updateTime()
        }
        this.isEnableUploadSlip = showAttachTime >= this.progressTime
      }, 1000)
    },
    async paidSuccess() {
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
        createTyp: this.tPurOrd.createTyp,
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
          clearInterval(this.intervalInquiryTrans)
          this.intervalInquiryTrans = null
          this.$store.commit('cartStore/clearPurchaseOrderId')
          this.$modal.show('modal-paid-sucess')
        }
      }
    },
    async cancelPO() {
      try {
        if (this.intervalInquiryTrans) {
          this.checkInquiryTransBillPayment()
          clearInterval(this.intervalInquiryTrans)
          this.intervalInquiryTrans = null
        } else {
          const cmdGrp3PORes = await cmdGrp3PO.command29101Group3(
            0,
            {
              poId: this.poId,
            },
            this.auth.globalCode,
            this.auth.channelName
          )
          const { alert, tPurOrd } =
            cmdGrp3PORes && cmdGrp3PORes.data ? cmdGrp3PORes.data : null
          if (alert && alert.length > 0) {
            if (alert[0].alertId === -1) {
              if (tPurOrd.poDispTypIdx === 2) {
                const tPurOrdInput: CommandPurchaseTPurOrd = {
                  poId: tPurOrd.poId,
                  poNo: tPurOrd.poNo,
                  poDate: tPurOrd.poDate,
                  saleJobDesc: tPurOrd.saleJobDesc,
                  supId: tPurOrd.supId,
                  supName: tPurOrd.supName,
                  paidSupId: tPurOrd.paidSupId,
                  mDocPrefixRunProdClassId: tPurOrd.mDocPrefixRunProdClassId,
                  mSupProdClassId: tPurOrd.mSupProdClassId,
                  onePoFlag: tPurOrd.onePoFlag,
                  maxPriceFlag: tPurOrd.maxPriceFlag,
                  paidSupName: tPurOrd.paidSupName,
                  imptFlag: tPurOrd.imptFlag,
                  poRefTypIdx: tPurOrd.poRefTypIdx,
                  poRefId: tPurOrd.poRefId,
                  saleJobId: tPurOrd.saleJobId,
                  othRefNo: tPurOrd.othRefNo,
                  changeOrdQtyFlag: tPurOrd.changeOrdQtyFlag,
                  supRefNo: tPurOrd.supRefNo,
                  cashCrTerm: tPurOrd.cashCrTerm,
                  crTerm: tPurOrd.crTerm,
                  expireDate: tPurOrd.expireDate,
                  tradeIncoTermTyp: tPurOrd.tradeIncoTermTyp,
                  paymentTypIdx: tPurOrd.paymentTypIdx,
                  supPaymentDueTypIdx: tPurOrd.supPaymentDueTypIdx,
                  balCrLineAmt: tPurOrd.balCrLineAmt,
                  paymentTermIdx: tPurOrd.paymentTermIdx,
                  pmPersonId: tPurOrd.pmPersonId,
                  cncyId: tPurOrd.cncyId,
                  presentVatRptFlag: tPurOrd.presentVatRptFlag,
                  exchgRate: tPurOrd.exchgRate,
                  vatRptFlag: tPurOrd.vatRptFlag,
                  poAmt: tPurOrd.poAmt,
                  reqDate: tPurOrd.reqDate,
                  purLeadtime: tPurOrd.purLeadtime,
                  taxNo: tPurOrd.taxNo,
                  headOfficeFlag: tPurOrd.headOfficeFlag,
                  poExpireDay: tPurOrd.poExpireDay,
                  supBranchCode: tPurOrd.supBranchCode,
                  reqDateTypIdx: tPurOrd.reqDateTypIdx,
                  supBillName: tPurOrd.supBillName,
                  supBillNameItem: tPurOrd.supBillNameItem,
                  supBillAddr: tPurOrd.supBillAddr,
                  supBillAddrItem: tPurOrd.supBillAddrItem,
                  bankBasketId: tPurOrd.bankBasketId,
                  apAdvNoInvBfAmt: tPurOrd.apAdvNoInvBfAmt,
                  focFlag: tPurOrd.focFlag,
                  poRcvFlag: tPurOrd.poRcvFlag,
                  discPct1: tPurOrd.discPct1,
                  discPct2: tPurOrd.discPct2,
                  discPct3: tPurOrd.discPct3,
                  cashDiscPct: tPurOrd.cashDiscPct,
                  discAmt: tPurOrd.discAmt,
                  prodClassProdTyp: tPurOrd.prodClassProdTyp,
                  chngPriceFlag: tPurOrd.chngPriceFlag,
                  holdApvTimeIdx: tPurOrd.holdApvTimeIdx,
                  specificPurProdTypIdx: tPurOrd.specificPurProdTypIdx,
                  vatInclFlag: tPurOrd.vatInclFlag,
                  vatPct: tPurOrd.vatPct,
                  poBeforeVatAmt: tPurOrd.poBeforeVatAmt,
                  vatAmt: tPurOrd.vatAmt,
                  advPctFlag: tPurOrd.advPctFlag,
                  advPoPct: tPurOrd.advPoPct,
                  advPoAmt: tPurOrd.advPoAmt,
                  adjBeforeVatAmt: tPurOrd.adjBeforeVatAmt,
                  adjBeforePoAmt: tPurOrd.adjBeforePoAmt,
                  defSupInvDepId: tPurOrd.defSupInvDepId,
                  defSupInvDepName: tPurOrd.defSupInvDepName,
                  defRcvDepId: tPurOrd.defRcvDepId,
                  defRcvDepName: tPurOrd.defRcvDepName,
                  purShipTypIdx: tPurOrd.purShipTypIdx,
                  rcvDepAddrItem: tPurOrd.rcvDepAddrItem,
                  styleId: tPurOrd.styleId,
                  assortId: tPurOrd.assortId,
                  assortSolidTypIdx: tPurOrd.assortSolidTypIdx,
                  noRtnFlag: tPurOrd.noRtnFlag,
                  supShipAddr: tPurOrd.supShipAddr,
                  supShipAddrItem: tPurOrd.supShipAddrItem,
                  firstShipDate: tPurOrd.firstShipDate,
                  shipMinPct: tPurOrd.shipMinPct,
                  sumVatAbleAmt: tPurOrd.sumVatAbleAmt,
                  sumNonVatAbleAmt: tPurOrd.sumNonVatAbleAmt,
                  shipExtraPct: tPurOrd.shipExtraPct,
                  partialShipFlag: tPurOrd.partialShipFlag,
                  xchngFlag: tPurOrd.xchngFlag,
                  platformIdx: tPurOrd.platformIdx,
                  platformLockFlag: tPurOrd.platformLockFlag,
                  billPaymentRef1: tPurOrd.billPaymentRef1,
                  billPaymentRef2: tPurOrd.billPaymentRef2,
                  billPaymentRef3: tPurOrd.billPaymentRef3,
                  manualCloseQRFlag: tPurOrd.manualCloseQRFlag,
                  manualCloseQRGrpPict: tPurOrd.manualCloseQRGrpPict,
                  stkFilterFlag: tPurOrd.stkFilterFlag,
                  stkTypIdx: tPurOrd.stkTypIdx,
                  cUsrName: tPurOrd.cUsrName,
                  lUsrName: tPurOrd.lUsrName,
                  minReqDate: tPurOrd.minReqDate,
                  sumVatBaseAbleAmt: tPurOrd.sumVatBaseAbleAmt,
                  maxPurLeadtime: tPurOrd.maxPurLeadtime,
                  cfmUsrName: tPurOrd.cfmUsrName,
                  docPrefixRunId: tPurOrd.docPrefixRunId,
                  remark: tPurOrd.remark,
                  sumPoAmt: tPurOrd.sumPoAmt,
                  sumPoVatAmt: tPurOrd.sumPoVatAmt,
                  cObjId: tPurOrd.cObjId,
                  createTyp: tPurOrd.createTyp,
                  prodTypId: tPurOrd.prodTypId,
                  comId: tPurOrd.comId,
                  depId: tPurOrd.depId,
                  cfmTyp: 'C',
                  tPoCoupon: tPurOrd.tPoCoupon,
                  tPoProd: tPurOrd.tPoProd,
                }
                const tPurOrdList: CommandPurchaseTPurOrd[] = []
                tPurOrdList.push(tPurOrdInput)
                const cmdPOResponse = await cmdPO.commandPurchaseOrder(
                  {
                    tPurOrd: tPurOrdList,
                  },
                  this.auth.globalCode,
                  this.auth.channelName
                )
                const { alert } =
                  cmdPOResponse && cmdPOResponse.data
                    ? cmdPOResponse.data
                    : null

                if (alert && alert.length > 0 && alert[0].alertId === -1) {
                  this.$modal.show('modal-cancel-sucess')
                } else {
                  this.$modal.show('modal-cancel-failed')
                }
                this.$store.commit('cartStore/clearPurchaseOrderId')
              }
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  computed: {
    ...mapState({
      poId: (state: any) => state.cartStore.poId,
      listCart: (state: any) => state.cartStore.cart,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style scoped>
@import url('~/assets/css/ConfimOrder.css');
</style>
