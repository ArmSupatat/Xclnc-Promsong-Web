<template>
  <div>
    <div
      class="
        listSelectOrder
        pa-sm-8
        p-4
        border
        mb-8
        d-flex
        justify-sm-start justify-end
      "
    >
      <div
        class="
          width-100
          d-flex
          justify-sm-space-between
          flex-sm-row flex-column
        "
      >
        <span
          @click="orderType = 1"
          :class="`cursor-pointer respon ${
            orderType === 1 ? 'titel--text underline' : ''
          }`"
          >ทั้งหมด</span
        >
        <span
          @click="orderType = 2"
          :class="`cursor-pointer respon ${
            orderType === 2 ? 'titel--text underline' : ''
          }`"
          >รอชำระเงิน</span
        >
        <span
          @click="orderType = 3"
          :class="`cursor-pointer respon ${
            orderType === 3 ? 'titel--text underline' : ''
          }`"
          >รอจัดของ</span
        >
        <span
          @click="orderType = 4"
          :class="`cursor-pointer respon ${
            orderType === 4 ? 'titel--text underline' : ''
          }`"
          >กำลังจัดของ</span
        >
        <span
          @click="orderType = 5"
          :class="`cursor-pointer respon ${
            orderType === 5 ? 'titel--text underline' : ''
          }`"
          >กำลังจัดส่ง</span
        >
        <span
          @click="orderType = 6"
          :class="`cursor-pointer respon ${
            orderType === 6 ? 'titel--text underline' : ''
          }`"
          >รับสินค้าแล้ว</span
        >
        <span
          @click="orderType = 7"
          :class="`cursor-pointer respon ${
            orderType === 7 ? 'titel--text underline' : ''
          }`"
          >รอยืนยันชำระ</span
        >
        <span
          @click="orderType = 8"
          :class="`cursor-pointer respon ${
            orderType === 8 ? 'titel--text underline' : ''
          }`"
          >ยกเลิก</span
        >
      </div>
    </div>
    <div class="mb-4" dense v-for="(order, i) in filterOrder" :key="i">
      <OrderCard
        :poId="order.poId"
        :poNo="order.poNo"
        :poDispTypIdx="order.poDispTypIdx"
        :poDispTypIdxName="order.poDispTypIdxName"
        :orderDate="order.poDate"
        :orderTime="order.poDate"
        :reqDate="order.reqDate"
        :reqTime="order.reqDate"
        :poProdCount="order.poProdCount"
        :poAmt="order.poAmt"
        :index="i"
        :isShowDetail="true"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import OrderCard from '~/components/layout/OrderCard.vue'

export default Vue.extend({
  props: {
    filterOrder: Array,
  },
  components: {
    OrderCard,
  },
  data() {
    return {
      orderType: 1 as number,
    }
  },
  watch: {
    orderType() {
      this.$emit('orderTypeEmit', this.orderType)
    },
  },
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';

.border {
  border: 1px solid lightgray;
}

@media (max-width: 1200px) {
}

@media (max-width: 600px) {
  .listSelectOrder {
    display: none !important;
  }
}
</style>
