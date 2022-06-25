<template>
  <div class="cart-wrapper pb-4">
    <v-card
      outlined
      height="100%"
      class="d-flex align-center pa-1 pa-lg-3 pa-md-2 pa-sm-2 flex-sm-row flex-column"
    >
      <v-img
        min-width="100"
        max-width="100"
        :src="
          Array.isArray(cart.productImageFilePath) &&
          cart.productImageFilePath.length > 0
            ? cart.productImageFilePath[0]
            : cart.productImageFilePath
            ? cart.productImageFilePath
            : null
        "
      ></v-img>
      <div class="ProductDetail d-flex-column px-6">
        <div class="ProductHeader d-flex justify-space-between">
          <div class="d-flex flex-column flex-sm-row">
            <span
              class="tagsell mr-2"
              v-if="parseFloat(cart.salePrice) > parseFloat(cart.unitPriceShow)"
              >Sale</span
            >
            <div
              class="div-Logo-Tag-discounts d-flex align-start"
              v-if="cart.couponFlag === 'Y'"
            >
              <img
                class="Logo-Tag-discounts"
                src="/images/Tag-discounts.png"
                alt=""
              />
            </div>
            <div class="div-LogoShopRecommend" v-if="cart.shopRecommendTypeIdx">
              <span
                v-for="item in cart.shopRecommendTypeIdx"
                :key="item"
                class="material-icons"
              >
                stars
              </span>
            </div>
          </div>
          <a class="black--text" @click="deleteCartItem(index)">
            <span>X</span>
          </a>
        </div>
        <div class="d-flex justify-space-between flex-sm-row flex-column">
          <div class="ProductName d-flex flex-column">
            <span class="font-weight-regular text-ProductName">{{
              cart.productName
            }}</span>
            <span class="text-Unit make--text pt-sm-6 pt-0">{{
              cart.uomCode
            }}</span>
          </div>
          <div class="ProductPrice">
            <div class="count-wrapper">
              <div class="price-wrapper">
                <v-col class="px-1">
                  <span
                    v-if="cart.specialPrice > 0"
                    class="PriceDiscount font-weight-bold"
                  >
                    {{ cart.salePrice }}
                  </span>
                </v-col>
                <v-col class="px-4">
                  <span
                    v-if="cart.specialPrice > 0"
                    class="DiscountedPrice font-weight-bold"
                  >
                    {{
                      CurrencyFormatter.addCurrencyFormat(
                        parseFloat(cart.specialPrice),
                        true
                      )
                    }}
                  </span>
                  <span v-else class="titel--text font-weight-bold"
                    >{{
                      CurrencyFormatter.addCurrencyFormat(
                        parseFloat(cart.salePrice),
                        true
                      )
                    }}
                  </span>
                </v-col>
              </div>

              <div class="d-flex">
                <v-col class="px-1">
                  <span
                    @click="minus(cart.stepQty, index)"
                    class="MathSym font-weight-bold px-3 py-1"
                  >
                    -
                  </span>
                </v-col>
                <v-col class="px-1">
                  <input
                    type="number"
                    v-model="qty"
                    class="Qty titel--text theme--light v-sheet--outlined"
                  />
                </v-col>
                <v-col class="px-1">
                  <span
                    @click="plus(cart.stepQty, index)"
                    class="MathSym font-weight-bold px-3 py-1"
                  >
                    +
                  </span>
                </v-col>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script lang="ts">
import { Product } from '~/types/Product'
import Vue from 'vue'
import CurrencyFormatter from '~/helpers/CurrencyFormatter'
export default Vue.extend({
  props: {
    cart: Object as () => Product,
    index: Number,
  },
  data() {
    return {
      CurrencyFormatter,
    }
  },
  methods: {
    minus(qty: number, index: number) {
      qty > 0 ? qty-- : qty
      // if (this.checkEmptyQtyItem(qty, index)) return
      const _qty = {
        qty,
        index,
      }
      this.$emit('qty', _qty)
    },
    plus(qty: number, index: number) {
      qty >= 0 ? qty++ : qty
      // if (this.checkEmptyQtyItem(qty, index)) return
      const _qty = {
        qty,
        index,
      }
      this.$emit('qty', _qty)
    },
    deleteCartItem(i: number) {
      this.$emit('deleteCartItem', i)
    },
    checkEmptyQtyItem(qty: number, index: number) {
      if (qty === 0) {
        // modal open confirm
        this.$emit('deleteCartItem', index)
        return true
      }
    },
  },
  computed: {
    qty: {
      get: function () {
        return this.cart.stepQty
      },
      set: function (newVal: string) {
        let qty = 0
        const index = this.index
        if (newVal) {
          qty = parseInt(newVal)
        }
        // if (this.checkEmptyQtyItem(qty, index)) return
        const _qty = {
          qty,
          index,
        }
        this.$emit('qty', _qty)
      },
    },
  },
})
</script>
<style scoped>
@import url('~/assets/css/Cart.css');

.count-wrapper {
  display: flex;
}

.price-wrapper {
  display: flex;
  flex-direction: row-reverse;
}

@media (max-width: 600px) {
  .count-wrapper {
    display: flex;
    flex-direction: column !important;
  }
}
</style>
