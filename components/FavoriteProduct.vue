<template>
  <div class="favorite-wrapper pb-4">
    <v-card
      outlined
      height="100%"
      class="
        d-flex
        align-center
        pa-1 pa-lg-3 pa-md-2 pa-sm-2
        flex-sm-row flex-column
      "
    >
      <v-img
        min-width="100"
        max-width="100"
        :src="favorite.productImageFilePath"
      ></v-img>
      <div class="ProductDetail d-flex-column px-6 w-full">
        <div class="ProductHeader d-flex justify-space-between">
          <div class="d-flex flex-column flex-sm-row">
            <span
              class="tagsell mr-2"
              v-if="
                parseFloat(favorite.salePrice) >
                parseFloat(favorite.unitPriceShow)
              "
              >Sale</span
            >
            <div
              class="div-Logo-Tag-discounts d-flex align-start"
              v-if="favorite.couponFlag === 'Y'"
            >
              <img
                class="Logo-Tag-discounts"
                src="/images/Tag-discounts.png"
                alt=""
              />
            </div>
            <div
              class="div-LogoShopRecommend"
              v-if="favorite.shopRecommendTypeIdx"
            >
              <span
                v-for="item in favorite.shopRecommendTypeIdx"
                :key="item"
                class="material-icons"
              >
                stars
              </span>
            </div>
          </div>
        </div>
        <div
          class="d-flex justify-space-between flex-sm-row flex-column w-full"
        >
          <div class="ProductName d-flex flex-column w-full">
            <div class="d-flex flex-row justify-space-between w-full">
              <span class="font-weight-regular text-ProductName">{{
                favorite.prodName
              }}</span>
              <a
                v-if="prodChkStkTypId"
                class="black--text"
                @click="deleteProductsToGroup"
              >
                <span>X</span>
              </a>
            </div>
            <span class="text-Unit make--text pt-sm-6 pt-0">{{
              favorite.uomCode
            }}</span>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CurrencyFormatter from '~/helpers/CurrencyFormatter'
import { x118101DelMMBProdProperty } from '~/api/Favorite/X118101DelMMBProdProperty'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'

export default Vue.extend({
  props: {
    favorite: Object,
    prodChkStkTypId: Number,
  },
  data() {
    return {
      CurrencyFormatter,
    }
  },
  methods: {
    async deleteProductsToGroup() {
      const loader = this.$loading.show()
      await x118101DelMMBProdProperty.x118101DelMMBProdProperty(
        {
          prodChkStkTypId: this.favorite.prodChkStkTypId,
          prodBarcodeId: this.favorite.prodBarcodeId,
          delProdFlag: 'N',
        },
        this.auth.globalCode,
        this.auth.channelName
      )
      this.$root.$emit('getListFavoriteOrderGroup')
      loader.hide()
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
<style lang="scss" scoped></style>
