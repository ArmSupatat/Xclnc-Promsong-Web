<template>
  <v-app>
    <Topbar />
    <Navigationdrawers class="hidden-sm-and-up" />
    <v-container>
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a>
        <span class="mx-3 make--text">/</span>
        <a href="/payment" class="secondary--text">ชำระเงิน</a>
        <span class="mx-3 make--text">/</span>
        <a href="/payment/uploadSlip" class="third--text">ยืนยันการชำระเงิน</a>
      </div>
      <v-card
        outlined
        class="
          upload-slip-card
          pa-3 pa-lg-8 pa-md-2 pa-sm-2
          my-4
          confirmation-component
        "
      >
        <h4 class="mb-4">ยืนยันการชำระเงิน</h4>
        <div class="upload-slip-content d-flex flex-column align-center">
          <div class="text-loader" v-if="loading">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </div>
          <h4 class="mb-1" v-else>
            หมายเลขอ้างอิง 1 : {{ ref1 ? ref1 : '-' }}
          </h4>
          <div class="text-loader" v-if="loading">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </div>
          <h4 v-else>หมายเลขอ้างอิง 2 : {{ ref2 ? ref2 : '-' }}</h4>
          <div class="text-loader" v-if="loading">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </div>
          <h4 v-else>หมายเลขอ้างอิง 3 : {{ ref3 ? ref3 : '-' }}</h4>
          <v-file-input
            class="mt-6 mb-2 input-file"
            label="ไฟล์แนบ"
            outlined
            dense
            fluid
            v-model="file"
            accept="image/*"
            @change="onFileChange"
          ></v-file-input>
          <img v-if="previewUrl" :src="previewUrl" class="my-4 upload-img" />
          <v-btn
            class="titel rounded input-file my-2"
            v-if="file"
            @click="uploadSlip()"
          >
            <span class="white--text"> ตกลง</span>
          </v-btn>
        </div>
      </v-card>
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
          name="modal-upload-sucess"
          :adaptive="true"
          width="300"
          height="200"
          @closed="$modal.hide('modal-upload-sucess')"
        >
          <div class="d-flex flex-column align-center justify-center h-full">
            <img src="/images/Checked.png" class="w-fit" />
            <p class="mt-6 mb-0">อัปโหลดสำเร็จ</p>
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
          name="modal-upload-failed"
          :adaptive="true"
          width="300"
          height="200"
          @closed="$modal.hide('modal-upload-failed')"
        >
          <div class="d-flex flex-column align-center justify-center h-full">
            <p class="mt-6 mb-0">อัปโหลดล้มเหลว</p>
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
    </v-container>
    <Footer />
  </v-app>
</template>
<script lang="ts">
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'
import CaculatePrice from '~/mixins/APICalPurOrd'
import { getLookUpQrCode } from '~/api/LookUp/GetLookUpGenerateQrCode'
import { cmdGrp3PO } from '~/api/Order/Command29101Group3'
import { saveMPicture } from '~/api/Order/SaveMPicture'
import { getLookUpInquiryTransBillPayment } from '~/api/LookUp/GetLookUpInquiryTransBillPayment'
import { CommandPurchaseTPurOrd } from '~/types/CommandPurchaseOrderInput'
import { cmdPO } from '~/api/Order/CommandPurchaseOrder'

export default CaculatePrice.extend({
  middleware: ['checkPoId'],
  data() {
    return {
      billerId: '',
      ref1: '',
      ref2: '',
      ref3: '',
      poNo: '',
      file: null as unknown as File,
      previewUrl: '',
      dateFrom: null as unknown as Date,
      dateTo: null as unknown as Date,
      loading: true,
      inquiryTransBillPayment: null as any,
    }
  },
  async mounted() {
    if (this.poId) {
      await this.initialValues()
      await this.checkInquiryTransBillPayment()
    } else {
      this.$router.push('/product')
    }
  },
  destroyed() {
    clearInterval(this.inquiryTransBillPayment)
    this.inquiryTransBillPayment = null
  },
  methods: {
    onFileChange(f: File) {
      this.file = f
      this.previewUrl = f ? URL.createObjectURL(f) : ''
    },
    async uploadSlip() {
      const loader = this.$loading.show()
      try {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const rawImg = reader.result
          const base64 = rawImg ? rawImg.toString().split(',') : null
          const saveMPictureRes = await saveMPicture.saveMPicture(
            {
              pictureFile: base64 ? base64[1] : null,
              pictureName: this.$moment(new Date()).format(
                'YYYY-MM-DDTHH:mm:ss.SSS'
              ),
              defaultFlag: 'Y',
            },
            this.auth.globalCode,
            this.auth.channelName
          )
          const { saveMPictureResponseData } =
            saveMPictureRes && saveMPictureRes.data
              ? saveMPictureRes.data
              : null
          if (saveMPictureResponseData && saveMPictureResponseData.length > 0) {
            const mPicture = saveMPictureResponseData[0]
            const pictureGrpId = mPicture.pictureGrpId
            try {
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
                    manualCloseQRFlag: 'Y',
                    manualCloseQRGrpPict: pictureGrpId,
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
                    cfmTyp: 'Y',
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
                    this.$store.commit('cartStore/clearPurchaseOrderId')
                    this.$modal.show('modal-upload-sucess')
                  } else {
                    this.$modal.show('modal-upload-failed')
                  }
                  loader.hide()
                }
              }
            } catch (err) {
              this.$modal.show('modal-upload-failed')
              loader.hide()
            }
          }
        }
        reader.readAsDataURL(this.file)
      } catch (err) {
        loader.hide()
      }
    },
    async checkInquiryTransBillPayment() {
      this.inquiryTransBillPayment = setInterval(async () => {
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
            this.$modal.show('modal-paid-sucess')
            this.$store.commit('cartStore/clearPurchaseOrderId')
          }
        } catch (err) {
          console.log(err)
        }
      }, 5000)
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
        this.dateFrom = new Date()
        this.dateTo = new Date(this.dateFrom.getTime() + 1000 * 60 * 60 * 24)
        this.poNo = tPurOrd.poNo
      }
      const genQrResp = await getLookUpQrCode.getLookUpGenerateQrCode(
        '',
        '',
        '',
        this.genQrAmt,
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
      }
      this.loading = false
    },
  },
  computed: {
    ...mapState({
      poId: (state: any) => state.cartStore.poId,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
<style scoped>
@import url('~/assets/css/UploadSilp.css');
</style>
