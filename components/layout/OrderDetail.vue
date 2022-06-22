<template>
  <div class="width-100">
    <div class="content-details-top flex-column">
      <div class="flex flex-row">
        <div class="details-left flex">
          <p class="font-bold mr-2">รายการสินค้า</p>
          <p class="subtext-color">
            {{
              tPurOrdCal && tPurOrdCal.tPoProd ? tPurOrdCal.tPoProd.length : 0
            }}
            รายการ
          </p>
        </div>
        <div class="details-right">
          <p class="subtext-color width-25 text-left">ราคาต่อหน่วย</p>
          <p class="subtext-color width-30">ส่วนลด</p>
          <p class="subtext-color width-30">จำนวน</p>
          <p class="subtext-color width-15 text-right pr-1">รวม</p>
        </div>
      </div>
      <template v-if="tPurOrdCal">
        <div v-for="(prod, index) in tPurOrdCal.tPoProd" :key="index">
          <div class="flex flex-row mb-4">
            <div class="details-left flex">
              {{ prod.prodName }}
            </div>
            <div class="details-right flex justify-between">
              <div class="width-25 text-left pl-6">
                {{ prod.unitPrice }}
              </div>
              <div class="width-30">
                {{ prod.discAmt }}
              </div>
              <div class="width-30">
                {{ prod.pricePoQty }}
              </div>
              <div class="width-15 text-right">
                {{ prod.poAmt }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="content-details-bottom" v-if="tPurOrdGrp3">
      <div class="details-left">
        <p class="font-bold">ที่อยู่สำหรับจัดส่ง</p>
        <p class="pr-16 mb-12">
          {{ tPurOrdGrp3.supShipAddr ? tPurOrdGrp3.supShipAddr : '-' }}
        </p>
        <p class="font-bold">ชำระเงิน</p>
        <p>ชำระเงินโดย {{ tPurOrdGrp3.paymentTypIdxXShow }}</p>
      </div>
      <div class="details-right">
        <div class="">
          <p class="font-bold">สรุปยอดรวมทั้งสิ้น</p>
        </div>
        <div class="space-between">
          <p>รวมเป็นเงิน</p>
          <p>
            {{
              CurrencyFormatter.addCurrencyFormat(
                tPurOrdGrp3.sumPoBeforeDiscAmt,
                true
              )
            }}
          </p>
        </div>
        <div class="space-between">
          <p>ส่วนลดสินค้า</p>
          <p>
            -{{
              CurrencyFormatter.addCurrencyFormat(
                tPurOrdGrp3.sumPoDiscAmt,
                true
              )
            }}
          </p>
        </div>
        <div class="space-between">
          <p>ส่วนลดคูปอง</p>
          <p>
            {{ CurrencyFormatter.addCurrencyFormat(tPurOrdGrp3.discAmt, true) }}
          </p>
        </div>
        <div class="space-between">
          <p>ภาษีมูลค่าเพิ่ม</p>
          <p>
            {{ CurrencyFormatter.addCurrencyFormat(tPurOrdGrp3.vatAmt, true) }}
          </p>
        </div>
        <div class="space-between border-top">
          <p class="mt-4">เงินชำระล่วงหน้าคงเหลือ</p>
          <p class="mt-4">
            {{
              CurrencyFormatter.addCurrencyFormat(
                tPurOrdGrp3.apAdvNoInvBfAmt,
                true
              )
            }}
          </p>
        </div>
        <div class="space-between border-top">
          <p class="mt-4">ยอดรวมทั้งสิ้น</p>
          <p class="mt-4">
            ฿<span class="NetPriceValue">{{
              CurrencyFormatter.addCurrencyFormat(tPurOrdGrp3.poAmt, false)
            }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CurrencyFormatter from '~/helpers/CurrencyFormatter'
import Vue from 'vue'

export default Vue.extend({
  props: {
    tPurOrdGrp3: Object,
    tPurOrdCal: Object,
  },
  data() {
    return {
      CurrencyFormatter,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/globalStyle.scss';

.submit-button {
  background-color: #469b5c !important;
  color: #fff !important;
  width: 100px !important;
  border-radius: 5px !important;
  margin-left: 5px !important;
}
.cancel-button {
  background-color: transparent !important;
  color: #000 !important;
  width: 150px !important;
  border-radius: 5px !important;
  border: 2px solid gainsboro !important;
}
.icon-clock {
  background-image: url(../../assets/img/clock.svg);
  width: 20px;
  height: 25px;
  background-position: center;
}
.font-bold {
  font-weight: bold;
}
.subtext-color {
  color: $subtext-color;
}
.content-details-top {
  display: flex;
  padding: 1.5rem 2rem 0.5rem 2rem;
  border-top: 1px solid lightgray;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  .details-left {
    width: 50%;
  }
  .details-right {
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
  }
}
.content-details-bottom {
  display: flex;
  padding: 1.5rem 2rem 1.5rem 2rem;
  border: 1px solid lightgray;
  .details-left {
    width: 50%;
  }
  .details-right {
    width: 50%;
    .space-between {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
.font-bold {
  font-weight: bold;
}
.border-top {
  border-top: 1px solid lightgray;
}
.width-30 {
  width: 30%;
}
.width-25 {
  width: 25%;
}
.width-15 {
  width: 15%;
}
.width-100 {
  width: 100%;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}

@media (max-width: 1200px) {
  .content-details-bottom {
    display: flex;
    flex-direction: column;
    .details-left {
      width: 100%;
    }
    .details-right {
      width: 100%;
    }
  }
}

@media (max-width: 600px) {
}
</style>
