<template>
  <v-app>
    <Topbar />
    <Navigationdrawers class="hidden-sm-and-up" />
    <v-container>
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a>
        <span class="mx-3 make--text">/</span>
        <a href="#" class="secondary--text">ชำระเงิน</a>
      </div>
      <div class="bank-acc-wrapper ma-auto">
        <v-card
          outlined
          class="bank-acc-card pa-4 pa-lg-6 pa-md-6 pa-sm-4 my-4"
        >
          <div class="acc-header">
            <h4 class="mb-4">{{ accountBankName }}</h4>
          </div>
          <div class="acc-info d-flex flex-column">
            <div>
              <p>ชื่อบัญชี : {{ accountName }}</p>
              <p>เลขบัญชี: {{ accountNo }}</p>
            </div>
            <v-btn
              class="mx-auto"
              @click="copyAccountNo"
              color="error"
              type="button"
              >คัดลอก</v-btn
            >
          </div>
          <transition name="fade">
            <v-alert
              v-if="isShowCopyAccNo"
              style="
                width: 180px;
                top: -22px;
                position: absolute;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
              "
              class="d-flex"
              type="success"
            >
              คัดลอกสำเร็จ
            </v-alert>
          </transition>
        </v-card>
        <div class="evidence-wrapper">
          <h4>หลักฐานการโอนเงิน</h4>
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
          <img
            v-if="previewUrl"
            :src="previewUrl"
            class="d-flex my-4 ma-auto upload-img"
          />
          <div class="d-flex flex-column ma-auto text-center dataBox">
            <div class="pa-2 netPriceBox">
              <p class="ma-0 text-center">
                ฿
                <span class="netPriceValue font-weight-bold">{{
                  CurrencyFormatter.addCurrencyFormat(
                    this.advPoAmt > 0 ? this.advPoAmt : this.genQrAmt,
                    false
                  )
                }}</span>
              </p>
            </div>
            <p class="font-weight-bold mt-4">
              <span> กรุณาชำระเงินภายใน </span>
              <span class="coutingTime">{{ countingTime }}</span>
            </p>
            <p class="ma-0">
              ระบบจะยกเลิกคำสั่งซื้อนี้อัตโนมัติหากไม่ชำระในเวลาที่กำหนด
            </p>
            <v-btn
              class="titel rounded input-file my-2"
              :disabled="!file"
              @click="uploadSlip()"
            >
              <span class="white--text"> ยืนยัน</span>
            </v-btn>
          </div>
        </div>
      </div>
    </v-container>
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
    <Footer />
  </v-app>
</template>

<script lang="ts">
import CurrencyFormatter from '~/helpers/CurrencyFormatter'
import PaddingWithZero from '~/helpers/PaddingWithZero'
import { cmdGrp3PO } from '~/api/Order/Command29101Group3'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import CaculatePrice from '~/mixins/APICalPurOrd'
import { getLookUpSupId } from '~/api/LookUp/GetLookUpSupId'
import { CommandPurchaseTPurOrd } from '~/types/CommandPurchaseOrderInput'
import { cmdPO } from '~/api/Order/CommandPurchaseOrder'
import { saveMPicture } from '~/api/Order/SaveMPicture'

export default CaculatePrice.extend({
  data() {
    return {
      PaddingWithZero,
      CurrencyFormatter,
      accountBankName: '',
      accountName: '',
      accountNo: '',
      isShowCopyAccNo: false,
      file: null as unknown as File,
      previewUrl: '',
      countingTime: '0:00',
      progressTime: 0,
      initTime: 0,
      intervalTime: null as any,
    }
  },
  async mounted() {
    if (this.poId) {
      await this.calculatePrice()
      await this.initialValues()
      await this.initialTimeout()
    } else {
      this.$router.push('/product')
    }
  },
  destroyed() {
    clearInterval(this.intervalTime)
    this.intervalTime = null
  },
  methods: {
    copyAccountNo() {
      try {
        navigator.clipboard.writeText(this.accountNo).then(() => {
          this.isShowCopyAccNo = true
          setTimeout(() => {
            this.isShowCopyAccNo = false
          }, 3000)
        })
      } catch (err) {
        console.log(err)
      }
    },
    onFileChange(f: File) {
      this.file = f
      this.previewUrl = f ? URL.createObjectURL(f) : ''
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
      }
      const lookupSupIdRes = await getLookUpSupId.getLookUpSupId(
        0,
        this.auth.globalCode,
        this.auth.channelName
      )
      const supplier =
        lookupSupIdRes && lookupSupIdRes.data && lookupSupIdRes.data.length > 0
          ? lookupSupIdRes.data[0]
          : null
      if (supplier) {
        this.accountBankName = supplier?.platformBankName
        this.accountName = supplier?.platformBankAccName
        this.accountNo = supplier?.platformBankAccNo
      }
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
      this.intervalTime = setInterval(() => {
        if (this.progressTime === 0) {
          clearInterval(this.intervalTime)
          this.intervalTime = null
          this.cancelPO()
        } else {
          this.updateTime()
        }
      }, 1000)
    },
    async cancelPO() {
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
                cmdPOResponse && cmdPOResponse.data ? cmdPOResponse.data : null

              if (alert && alert.length > 0 && alert[0].alertId === -1) {
                this.$modal.show('modal-cancel-sucess')
              } else {
                this.$modal.show('modal-cancel-failed')
              }
              this.$store.commit('cartStore/clearPurchaseOrderId')
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    uploadSlip() {
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
              editFlag: 'N',
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

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 134px - 302px);
}
.upload-img {
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.netPriceBox {
  width: 100%;
  background-color: #eee;
  border-radius: 0.4rem;
  p {
    color: #3c78bd;
    .netPriceValue {
      font-size: 1.25rem;
    }
  }
}
.coutingTime {
  color: #dd6241;
  font-size: 1.25rem;
}
.bank-acc-wrapper {
  width: 70%;
}
.acc-info {
  button {
    width: 100px;
  }
}
@media only screen and (min-width: 600px) {
  .acc-info {
    flex-direction: row !important;
    justify-content: space-between;
    button {
      margin: auto 0 !important;
    }
  }
  .upload-img {
    width: 300px;
  }
  .dataBox {
    width: 500px;
  }
}
</style>
