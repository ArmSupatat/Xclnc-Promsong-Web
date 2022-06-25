<template>
  <div class="summaryorder-wrapper px-4 py-4">
    <h3 style="padding: 0.7rem">สรุปข้อมูลคำสั่งซื้อ</h3>
    <v-row>
      <v-col lg="6"> รวมเป็นเงิน </v-col>
      <v-col lg="6" class="text-right"> ฿1160.00 </v-col>
    </v-row>
    <v-row>
      <v-col lg="6"> ส่วนลดสินค้า </v-col>
      <v-col lg="6" class="text-right">
        -{{
          CurrencyFormatter.addCurrencyFormat(
            sumPoDiscAmt ? sumPoDiscAmt : 0,
            true
          )
        }}
      </v-col>
    </v-row>
    <v-row v-if="false">
      <v-col lg="6"> ส่วนลด </v-col>
      <v-col lg="6" class="text-right">
        {{ CurrencyFormatter.addCurrencyFormat(0, true) }}
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="6"> ส่วนลดคูปอง </v-col>
      <v-col lg="6" class="text-right">
        {{ CurrencyFormatter.addCurrencyFormat(discAmt ? discAmt : 0, true) }}
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="6"> ภาษีมูลค่าเพิ่ม </v-col>
      <v-col lg="6" class="text-right">
        {{ CurrencyFormatter.addCurrencyFormat(vatAmt ? vatAmt : 0, true) }}
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="6"> ค่าจัดส่ง </v-col>
      <v-col lg="6" class="text-right"> ฿50.00 </v-col>
    </v-row>
    <v-row>
      <v-card
        outlined
        width="100%"
        height="100%"
        class="d-flex align-center flex-row mt-6"
      >
        <v-col lg="6"> รวมทั้งสิ้น </v-col>
        <v-col lg="6" class="font-weight-bold text-right"> ฿1210.00 </v-col>
      </v-card>
    </v-row>
    <v-row>
      <v-card
        outlined
        width="100%"
        height="100%"
        class="d-flex align-center flex-row mt-3"
      >
        <v-col lg="6"> เงินชำระล่วงหน้าคงเหลือ </v-col>
        <v-col lg="6" class="titel--text text-right">
          {{
            CurrencyFormatter.addCurrencyFormat(
              apAdvNoInvBfAmt ? apAdvNoInvBfAmt : 0,
              true
            )
          }}
        </v-col>
      </v-card>
    </v-row>
    <v-row class="border-t">
      <v-col lg="6"> รวมทั้งสิ้น </v-col>
      <v-col lg="6" class="NetPrice font-weight-bold text-right">
        ฿<span class="NetPriceValue">1210.00</span>
      </v-col>
    </v-row>
    <!-- <v-row class="border-t" v-if="poAmt < 1000">
      <v-col lg="12">
        <span style="color: red"> ยอดสั่งซื้อขั้นต่ำ ฿1000</span>
      </v-col>
    </v-row> -->
    <v-row class="border-t">
      <v-btn block class="titel rounded" @click="submitPayment">
        <span class="white--text"> {{ btnName }} </span>
      </v-btn>
    </v-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CurrencyFormatter from '~/helpers/CurrencyFormatter'
export default Vue.extend({
  props: {
    sumPoBeforeDiscAmt: Number,
    sumPoDiscAmt: Number,
    discAmt: Number,
    vatAmt: Number,
    poAmt: Number,
    apAdvNoInvBfAmt: Number,
    genQrAmt: Number,
    btnName: String,
    linkPage: String,
    validate: Boolean,
  },
  data() {
    return {
      CurrencyFormatter,
    }
  },
  methods: {
    submitPayment() {
      if (this.btnName === 'ไปขั้นตอนการชำระเงิน') {
        this.$router.push('/payment')
      } else if (this.btnName === 'ชำระเงิน') {
        this.$router.push('/payment/confirmOrder')
      }
      // this.$emit('submitPayment')
    },
  },
})
</script>
<style scoped>
@import url('~/assets/css/SummaryOrder.css');
</style>
