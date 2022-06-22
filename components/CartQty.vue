<template>
  <div class="cart-wrapper">
    <div class="d-flex">
      <v-col class="px-1 d-flex justify-center">
        <span @click="minus" class="MathSym font-weight-bold px-3 py-1">
          -
        </span>
      </v-col>
      <v-col class="px-1 d-flex justify-center ailgn-center">
        <input
          type="number"
          v-model="newQty"
          class="Qty titel--text theme--light v-sheet--outlined"
        />
      </v-col>
      <v-col class="px-1 d-flex justify-center">
        <span @click="plus" class="MathSym font-weight-bold px-3 py-1">
          +
        </span>
      </v-col>
    </div>
  </div>
</template>
<script lang="ts">
import { Product } from '~/types/Product'
import Vue from 'vue'
import CurrencyFormatter from '~/helpers/CurrencyFormatter'
export default Vue.extend({
  props: {
    pItem: Object as () => Product,
    qty: Object,
  },
  data() {
    return {
      CurrencyFormatter,
      newQty: 1,
    }
  },

  methods: {
    minus() {
      if (this.newQty > 1) {
        this.newQty--
      } else {
        this.newQty = 1
      }
    },
    plus() {
      if (this.newQty >= 1) {
        this.newQty++
      } else {
        this.newQty = 1
      }
    },
    handleChangeQty() {
      this.$store.commit('cartStore/updateTempQty', {
        productId: this.pItem.productId,
        qty: ~~this.newQty,
      })
    },
  },
  watch: {
    newQty() {
      this.handleChangeQty()
    },
  },
})
</script>
<style scoped>
@import url('~/assets/css/Cart.css');

.cart-wrapper {
  width: 100%;
}

.count-wrapper {
  display: flex;
}

.price-wrapper {
  display: flex;
  flex-direction: row-reverse;
}

@media (max-width: 1200px) {
}

@media (max-width: 600px) {
  .count-wrapper {
    display: flex;
    flex-direction: column !important;
  }
}
</style>
