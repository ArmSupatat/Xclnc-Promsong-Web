<template>
  <div>
    <div
      class="d-flex flex-column justify-space-between"
      style="overflow: auto; height: 100%"
    >
      <div class="modal-content">
        <div class="d-flex flex-row justify-space-between">
          <h2 class="pb-4">คูปองของฉัน</h2>
          <div class="couponListRespon">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" class="drawer-icon">
                  <v-icon>mdi-filter</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item-group class="d-flex flex-column px-4 py-1">
                  <span
                    @click="couponType = 0"
                    :class="`cursor-pointer ${
                      couponType === 0 ? 'titel--text underline' : ''
                    }`"
                    >ทั้งหมด</span
                  >
                  <span
                    @click="couponType = 1"
                    :class="`cursor-pointer ${
                      couponType === 1 ? 'titel--text underline' : ''
                    }`"
                    >คูปองส่วนลดสินค้า</span
                  >
                  <span
                    @click="couponType = 2"
                    :class="`cursor-pointer ${
                      couponType === 2 ? 'titel--text underline' : ''
                    }`"
                    >คูปองส่วนลด</span
                  >
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>
        </div>
        <div class="couponList pb-4">
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
        <v-row dense>
          <v-col
            v-for="(coupon, i) in filterCoupon"
            :key="i"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CouponCard from '~/components/CouponCard.vue'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import { getListCoupon } from '~/api/Order/GetCoupon'

export default Vue.extend({
  components: {
    CouponCard,
  },
  data() {
    return {
      couponType: 0 as number,
      listCouponDisc: [] as object[],
      listCouponDiscProd: [] as object[],
    }
  },
  mounted() {
    this.getListCoupon()
  },
  methods: {
    async getListCoupon() {
      const listCouponRes = await getListCoupon.getListCoupon(
        null,
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
      this.listCouponDiscProd = couponDiscProdResponse.map((each: any) => {
        return {
          ...each,
          type: 1,
        }
      })
      this.listCouponDisc = couponDiscResponse.map((each: any) => {
        return {
          ...each,
          type: 2,
        }
      })
    },
  },
  computed: {
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
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';

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
.couponListRespon {
  display: none;
}

@media (max-width: 600px) {
  .couponList {
    display: none;
  }
  .couponListRespon {
    display: unset;
  }
}
</style>
