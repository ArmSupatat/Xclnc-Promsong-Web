<template>
  <div class="coupon-wrapper">
    <v-img
      :src="`${
        coupon
          ? coupon.useCouponFlag === 'Y'
            ? '/images/BGCouponSel.png'
            : '/images/BGCoupon.png'
          : null
      }`"
    >
      <div class="coupon-content pa-lg-4 pa-4">
        <template v-if="coupon.type === 1">
          <div class="d-flex justify-space-between">
            <img :src="coupon.prodGrpUrl" width="46" height="46" />
            <div class="d-flex flex-column">
              <h4>คูปองส่วนลดสินค้า</h4>
              <h4 class="accent-color">{{ coupon.platformCouponDesc }} บาท</h4>
              <h6>{{ coupon.showPlatformCouponDescDetail }}</h6>
            </div>
            <h6 class="make--text">เงื่อนไข</h6>
          </div>
        </template>
        <template v-if="coupon.type === 2">
          <div class="d-flex justify-space-between">
            <h4>คูปองส่วนลด</h4>
            <h6 class="make--text">เงื่อนไข</h6>
          </div>
          <h4 class="accent-color">{{ coupon.discAmt }} บาท</h4>
          <h6>{{ coupon.platformCouponDesc }}</h6>
        </template>

        <div class="coupon-footer d-flex pt-4 justify-space-between">
          <h6>
            ถึงวันที่
            {{ DateFormatter.generalDateFormat($moment, coupon.expire_Date) }}
          </h6>
          <h6 class="titel--text">ใช้คูปอง</h6>
        </div>
      </div>
    </v-img>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import DateFormatter from '~/helpers/DateFormatter'
export default Vue.extend({
  props: {
    coupon: Object,
  },
  data() {
    return {
      DateFormatter,
    }
  },
})
</script>
<style scoped>
.coupon-footer {
  border-top: 1px dashed #dbdee7;
}
img {
  position: relative;
}
.coupon-content {
  position: absolute;
  width: 100%;
}
</style>
