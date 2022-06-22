<template>
  <div class="wrapper mb-sm-0 mb-4">
    <div class="container tile">
      <div
        :class="[
          'menu-table',
          poDispTypIdx === 2
            ? 'waiting-pay'
            : '' || poDispTypIdx === 3
            ? 'organize'
            : '' || poDispTypIdx === 4
            ? 'organizing'
            : '' || poDispTypIdx === 5
            ? 'shipping'
            : '' || poDispTypIdx === 6
            ? 'received'
            : '' || poDispTypIdx === 7
            ? 'wait-confirm'
            : '' || poDispTypIdx === 8
            ? 'cancel'
            : '',
        ]"
      >
        <div class="cell-table pay">
          <div
            class="flex justify-between p-0 d-sm-flex flex-sm-nowrap flex-wrap"
          >
            <div class="flex">
              <button class="px-6">
                {{ poDispTypIdxName }}
              </button>
              <div class="flex align-center pl-4">
                {{ poNo }}
              </div>
            </div>
            <div class="d-flex justify-end align-center pt-sm-0 pt-2">
              <div class="">
                {{ DateFormatter.shortDateFormat($moment, orderDate) }}
              </div>
              <div class="pl-2">
                {{ DateFormatter.timeFormat($moment, orderDate) }}
              </div>
            </div>
          </div>
          <div class="flex justify-between p-0 pt-sm-4 pt-2">
            <div class="">รายการสั่งซื้อ : {{ poProdCount }} รายการ</div>
            <div class="">รวม ฿{{ poAmt }}</div>
          </div>
          <div
            class="
              flex
              justify-between
              align-center
              p-0
              pt-2
              flex-sm-nowrap flex-wrap
            "
          >
            <div class="flex">
              <div class="">
                วันที่รับสินค้า :
                {{ DateFormatter.shortDateFormat($moment, reqDate) }}
              </div>
              <div class="flex pl-2">
                <div class="icon-clock pr-8" />
                {{ DateFormatter.timeFormat($moment, reqDate) }}
              </div>
            </div>
            <div class="buttonDetails d-flex justify-end pt-sm-0 pt-2">
              <button
                v-if="poDispTypIdx === 2"
                class="payOrderBtn px-4 mr-2"
                @click="payOrder"
              >
                ชำระเงิน
              </button>
              <button
                v-if="poDispTypIdx > 2"
                class="repeatOrderBtn px-4 mr-2"
                @click="dialogRepeatOrder = true"
              >
                ซื้อซ้ำ
              </button>
              <button
                v-if="poDispTypIdx === 2 || poDispTypIdx === 3"
                class="cancelOrderBtn px-4 mr-2"
                @click="dialogCancelOrder = true"
              >
                ยกเลิกการสั่งซื้อ
              </button>
              <div v-if="isShowDetail" class="detail">
                <nuxt-link :to="`order/orderDetail/${poId}`"
                  >ดูรายละเอียด</nuxt-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-dialog v-model="dialogRepeatOrder" max-width="300">
      <v-card>
        <v-card-title class="textDialogRepeatOrder">
          <p>ยืนยันทำรายการ</p>
        </v-card-title>
        <v-card-subtitle class="textDialogRepeatOrderSubtitle">
          <p class="newline">
            <span>คุณต้องการสั่งซ้ำจากรายการ {{ poNo }} หรือไม่</span>
          </p>
        </v-card-subtitle>
        <v-card-actions class="pb-4">
          <v-btn class="Button" color="white" @click="dialogRepeatOrder = false"
            >ยกเลิก</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn class="Button" color="white" @click="repeatOrder">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCancelOrder" max-width="300">
      <v-card>
        <v-card-title class="textDialogCancelOrder">
          <p>ยืนยันทำรายการ</p>
        </v-card-title>
        <v-card-subtitle class="textDialogCancelOrderSubtitle">
          <p class="newline">
            <span>คุณต้องการลบรายการ {{ poNo }} หรือไม่</span>
          </p>
        </v-card-subtitle>
        <v-card-actions class="pb-4">
          <v-btn class="Button" color="white" @click="dialogCancelOrder = false"
            >ยกเลิก</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn class="Button" color="white" @click="cancelOrder">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import DateFormatter from '~/helpers/DateFormatter'
import {
  CommandPurchaseTPoProd,
  CommandPurchaseTPurOrd,
} from '~/types/CommandPurchaseOrderInput'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'
import { cmdGrp3PO } from '~/api/Order/Command29101Group3'
import { cmdPO } from '~/api/Order/CommandPurchaseOrder'
import { Product } from '~/types/Product'

export default Vue.extend({
  props: [
    'poId',
    'poNo',
    'poDispTypIdxName',
    'poDispTypIdx',
    'reqDate',
    'reqTime',
    'poProdCount',
    'poAmt',
    'orderDate',
    'ordertime',
    'isShowDetail',
  ],
  data() {
    return {
      DateFormatter,
      dialogCancelOrder: false as boolean,
      dialogRepeatOrder: false as boolean,
    }
  },
  methods: {
    async payOrder() {
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
          if (tPurOrd.paymentTypIdx === 10 && tPurOrd.poDispTypIdx === 2) {
            this.$store.commit('cartStore/savePurchaseOrderId', tPurOrd.poId)
            this.$router.push('/payment/confirmOrder')
          }
        }
      }
    },
    async repeatOrder() {
      const loader = this.$loading.show()
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
            this.$store.commit('cartStore/clearCart')
            tPurOrd.tPoProd.forEach((product: any) => {
              const p: Product = {
                brandId: null,
                comId: tPurOrd?.comId,
                couponFlag: product?.couponFlag,
                labelLabelPrice: product?.labelLabelPrice,
                labelPrice: product?.labelPrice,
                limitPoQty: product?.limitPoQty,
                mainUomCode: product?.mainUomCode,
                manyUomFlag: product?.manyUomFlag,
                orderBy: null,
                originalPriceShow: product?.originalPriceShow,
                pricePerMainUom: product?.labelPrice,
                // priceSeq: tPurOrd?.labelPrice,
                priceTypeId: tPurOrd?.priceTypId,
                productBarcode: product?.prodBarcode,
                productGroupId: product?.prodGrpId,
                productGroupPict: product?.prodGrpPict,
                productId: product?.prodId,
                productImageFilePath: product?.productImageFilePath,
                productName: product?.prodName,
                // productSubGroupId: tPurOrd?.labelPrice,
                productTypeId: tPurOrd?.prodTypId,
                promoFlag: product?.promoFlag,
                // promoId: tPurOrd?.labelPrice,
                salePrice: product?.unitPrice,
                // shopRecommendFlag: tPurOrd?.labelPrice,
                // shopRecommendTypeIdx: tPurOrd?.labelPrice,
                showSeqNo: product?.showSeqNo,
                specialPrice: product?.specialPrice,
                stepQty: product?.poQty,
                stkQty: product?.stkQty,
                // subId: tPurOrd?.labelPrice,
                unitPriceShow: product?.unitPriceShow,
                uomCode: product?.supUomIdXShow,
                uomId: product?.supUomId,
                wgtBaseFlag: product?.wgtBaseFlag,
              }
              this.$store.commit('cartStore/addHotProductBasket', p)
              this.$router.push('/cart')
            })
          }
        }
        this.dialogRepeatOrder = false
        loader.hide()
      } catch (err) {
        console.log(err)
        loader.hide()
      }
      /** ซื้อซ้ำข้ามขั้นตอนการใส่ลงตะกร้า */
      // const loader = this.$loading.show()
      // try {
      //   const cmdGrp3PORes = await cmdGrp3PO.command29101Group3(
      //     0,
      //     {
      //       poId: this.poId,
      //     },
      //     this.auth.globalCode,
      //     this.auth.channelName
      //   )
      //   const { alert, tPurOrd } =
      //     cmdGrp3PORes && cmdGrp3PORes.data ? cmdGrp3PORes.data : null
      //   if (alert && alert.length > 0) {
      //     if (alert[0].alertId === -1) {
      //       const tPoProdList: CommandPurchaseTPoProd[] = []
      //       tPurOrd.tPoProd.forEach((prod: any, i: number) => {
      //         const tPoProd: CommandPurchaseTPoProd = {
      //           prodId: prod.prodId,
      //           supProdName: prod.supProdName,
      //           supUomId: prod.supUomId,
      //           priceUomId: prod.priceUomId,
      //           poQty: prod.stepQty,
      //           prodName: prod.prodName,
      //           poItem: prod.poItem,
      //           unitPrice: prod.unitPrice,
      //           poAmt: prod.poAmt,
      //           pricePoQty: prod.pricePoQty,
      //           labelPrice: prod.labelPrice,
      //         }
      //         tPoProdList.push(tPoProd)
      //       })
      //       const tPurOrdInput: CommandPurchaseTPurOrd = {
      //         supId: tPurOrd.supId,
      //         poDate: this.$moment(new Date())
      //           .locale('th')
      //           .format('YYYY-MM-DDTHH:mm:ss.SSS'),
      //         supBillName: tPurOrd.supBillName,
      //         supBillAddr: tPurOrd.supBillAddr,
      //         comId: this.auth.comId,
      //         depId: this.auth.depId,
      //         cfmTyp: 'N',
      //         sumPoAmt: tPurOrd.sumPoAmt,
      //         tPoProd: tPoProdList,
      //       }
      //       const tPurOrdList: CommandPurchaseTPurOrd[] = []
      //       tPurOrdList.push(tPurOrdInput)
      //       const response = await cmdPO.commandPurchaseOrder(
      //         {
      //           tPurOrd: tPurOrdList,
      //         },
      //         this.auth.globalCode,
      //         this.auth.channelName
      //       )
      //       const { data } = response
      //       if (data && data.alert && data.alert.length > 0) {
      //         const alert = data.alert[0]
      //         if (alert.alertApiCode === '200' && alert.alertId < 0) {
      //           this.$store.commit(
      //             'cartStore/savePurchaseOrderId',
      //             data.tPurOrd[0].poId
      //           )
      //           this.$router.push('/payment')
      //         } else {
      //           console.log(alert.alertDisplay)
      //         }
      //       } else {
      //         console.log('บันทึกล้มเหลว')
      //       }
      //     }
      //   }
      //   this.dialogRepeatOrder = false
      //   loader.hide()
      // } catch (err) {
      //   console.log(err)
      //   loader.hide()
      // }
    },
    async cancelOrder() {
      const loader = this.$loading.show()
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
              this.$root.$emit('getNewListOrder')
            } else {
              console.log('ทำรายการไม่สำเร็จ')
            }
          }
        }
        this.dialogCancelOrder = false
        loader.hide()
      } catch (err) {
        console.log(err)
        loader.hide()
      }
    },
  },
  computed: {
    ...mapState({
      listCart: (state: any) => state.cartStore.cart,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/globalStyle.scss';

.wrapper {
  padding: 1rem 2rem 1rem 2rem;
  border: 1px solid lightgray;
  border-bottom: 0;
  width: 100%;
  &:last-child {
    border-bottom: 1px solid lightgray;
  }
  .tile {
    width: 100%;
    padding: 0;

    .menu-table {
      display: flex;
      flex-wrap: wrap;
      .cell-table {
        width: 100%;
        height: fit-content;
        margin-bottom: 8px;
        color: $subtext-color;
      }
      .pay {
        button {
          background-color: gray;
          border: none;
          // width: 7rem;
          padding: 0.5rem 0;
          color: $white;
          outline: none;
          border-radius: 0.3rem;
          &:hover {
            background-color: tint(gray, 25%);
          }
        }
      }
      &.waiting-pay {
        button {
          background-color: $waiting-pay;
          &:hover {
            background-color: tint($waiting-pay, 25%);
          }
        }
      }

      &.organize {
        button {
          background-color: $organize;
          &:hover {
            background-color: tint($organize, 25%);
          }
        }
      }

      &.organizing {
        button {
          background-color: $organizing;
          &:hover {
            background-color: tint($organizing, 25%);
          }
        }
      }

      &.shipping {
        button {
          background-color: $shipping;
          &:hover {
            background-color: tint($shipping, 25%);
          }
        }
      }

      &.received {
        button {
          background-color: $received;
          &:hover {
            background-color: tint($received, 25%);
          }
        }
      }

      &.wait-confirm {
        button {
          background-color: $wait-confirm;
          &:hover {
            background-color: tint($wait-confirm, 25%);
          }
        }
      }

      &.cancel {
        button {
          background-color: $cancel;
          &:hover {
            background-color: tint($cancel, 25%);
          }
        }
      }
      .payOrderBtn,
      .repeatOrderBtn {
        background-color: #469b5c !important;
      }
      .cancelOrderBtn {
        background-color: #fff !important;
        border: 1px solid lightgray !important;
        border-radius: 0.3rem !important;
        color: #000 !important;
      }
      .detail {
        display: flex;
        align-items: center;
        border: 1px solid lightgray;
        padding: 0 1rem;
        border-radius: 0.3rem;
        a {
          color: #000 !important;
        }
        // &:hover {
        //   background-color: rgba(70, 155, 92, 1);
        //   border: 1px solid rgba(70, 155, 92, 1);
        //   a {
        //     color: #fff;
        //   }
        // }
      }
    }
  }
}

.icon-clock {
  background-image: url(../../assets/img/clock.svg);
  width: 20px;
  height: 25px;
  background-position: center;
}

@media (max-width: 1200px) {
  .wrapper {
    padding: 0.5rem 0.5rem 0rem 0.5rem;
  }
}

@media screen and (max-width: 600px) {
  .buttonDetails {
    width: 100%;
  }
}
</style>
