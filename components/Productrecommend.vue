<template>
  <div class="Productrecommend py-md-10">
    <v-container
      ><div class="text-center d-flex flex-column" style="z-index: 2">
        <div class="text-center d-flex flex-column">
          <span
            class="
              groupTital--text
              font-weight-regular
              text-lg-h4 text-md-h5 text-sm-h6 text-subtitles
            "
          >
            สินค้าแนะนำ
          </span>
          <span
            ><img src="/images/Subtitel.png" class="imageTitel" alt=""
          /></span>
        </div>
        <div>
          <v-row v-if="listAllProduct && listAllProduct.length === 0">
            <v-col v-for="item in 6" :key="item"
              ><v-skeleton-loader type=" image, table-tfoot"></v-skeleton-loader
            ></v-col>
          </v-row>
          <v-sheet v-else style="background: none">
            <v-slide-group
              multiple
              class="silde-product justify-center d-flex flex-row align-center"
              show-arrows
            >
              <v-slide-item
                v-for="(item, i) in listAllProduct"
                :key="item.productId"
              >
                <v-card
                  outlined
                  class="
                    ma-lg-2 ma-md-2 ma-sm-1 ma-1
                    d-flex
                    flex-column
                    justify-space-between
                    pa-lg-3 pa-2
                  "
                  style="border-radius: 6px"
                >
                  <div class="d-flex flex-row justify-space-between">
                    <div class="d-flex">
                      <span class="tagsell mr-2" v-if="item.promoFlag === 'Y'"
                        >Sale</span
                      >
                      <div
                        v-if="item.couponFlag === 'Y'"
                        class="div-Logo-Tag-discounts d-flex align-start"
                      >
                        <img
                          class="Logo-Tag-discounts"
                          src="/images/Tag-discounts.png"
                          alt=""
                        />
                      </div>
                      <div
                        class="div-LogoShopRecommend"
                        v-if="item.shopRecommendTypeIdx"
                      >
                        <span
                          v-for="(item, index) in item.shopRecommendTypeIdx"
                          :key="index"
                          class="material-icons"
                        >
                          stars
                        </span>
                      </div>
                    </div>
                    <v-btn
                      icon
                      v-if="auth.globalCode && item.useShopFlag === 'Y'"
                      color="#DD6241"
                      @click="changeStatus(i, item.productBarcode, 'N')"
                      class="Btn-favorite"
                    >
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      class="Btn-favorite"
                      v-if="auth.globalCode && item.useShopFlag === 'N'"
                      @click="changeStatus(i, item.productBarcode, 'Y')"
                      color="#DBDEE7"
                    >
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                  </div>
                  <div class="text-left d-flex flex-column">
                    <div class="d-flex flex-column align-center">
                      <img
                        @click="selectProduct(item)"
                        :src="`${item.productImageFilePath[0]}`"
                        class="img-Productrecommend cursor-pointer"
                        alt=""
                      />
                    </div>

                    <span class="text-ProductName font-weight-bold">{{
                      item.productName
                    }}</span>
                  </div>

                  <div>
                    <div class="d-flex flex-column">
                      <div class="text-left d-flex flex-column">
                        <span class="text-Unit unit--text">{{
                          item.uomCode
                        }}</span>
                        <div>
                          <span
                            v-if="
                              parseFloat(item.salePrice) >
                              parseFloat(item.unitPriceShow)
                            "
                            class="
                              text-salePrice text-decoration-line-through
                              make--text
                              mr-2
                            "
                            >฿{{
                              item.salePrice % 1 === 0
                                ? Math.round(item.salePrice)
                                : parseFloat(item.salePrice).toFixed(2)
                            }}</span
                          ><span
                            class="text-PriceShow font-weight-bold"
                            :style="`${
                              parseFloat(item.salePrice) <=
                              parseFloat(item.unitPriceShow)
                                ? `color: #469B5C;`
                                : `color: #DD6241;`
                            }`"
                            >฿{{
                              item.unitPriceShow % 1 === 0
                                ? Math.round(item.unitPriceShow)
                                : parseFloat(item.unitPriceShow).toFixed(2)
                            }}</span
                          >
                        </div>
                        <div class="z-index-front">
                          <div class="d-flex">
                            <CartQty :pItem="item" />
                          </div>
                          <v-btn
                            class="
                              Btn-DetailAddProduct
                              titel
                              rounded
                              space
                              w-full
                            "
                            @click="addProductInBasket(item)"
                          >
                            <v-icon class="text-DetailIcon mx-1 white--text"
                              >add_shopping_cart</v-icon
                            >
                            <span class="text-DetailText white--text"
                              >เพิ่มลงตะกร้า</span
                            >
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </div>
        <div class="py-lg-7 py-md-6 py-sm-5 py-4">
          <v-btn
            class="btn-viewmore groupTital white--text"
            @click="toAllProducts"
            >ดูเพิ่มเติม</v-btn
          >
        </div>
      </div></v-container
    >
    <v-dialog v-model="dialog" width="28rem">
      <v-card class="p-4">
        <v-card-text class="d-flex justify-center">
          <h3>คุณได้ทำการเพิ่มสินค้าลงในรถเข็นแล้ว</h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            block
            class="Btn-DetailAddProduct titel rounded space"
            @click="$router.push('/cart')"
          >
            <v-icon class="text-DetailIcon mx-1 white--text"
              >add_shopping_cart</v-icon
            >
            <span class="white--text">ไปยังตะกร้า</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getProduct } from '~/api/Product/GetProducts'
import { Product } from '~/types/Product'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import { getLookUpdMProdBarcode } from '~/api/LookUp/GetLookUpdMProdBarcode'

export default Vue.extend({
  data: () => ({
    dialog: false,
    listAllProduct: [] as any[],
  }),
  methods: {
    addProductInBasket(product: Product) {
      if (this.auth.globalCode) {
        this.$store.commit('cartStore/addHotProductBasket', product)
        this.dialog = true
      } else {
        this.$router.push('/auth')
      }
    },
    toAllProducts() {
      this.$router.push('/product')
    },
    async changeStatus(i: number, prodBarcode: string, activeTyp: string) {
      this.listAllProduct[i].useShopFlag = activeTyp
      await getLookUpdMProdBarcode.getLookUpdMProdBarcode(
        {
          prodBarcode,
          activeTyp,
        },
        this.auth.globalCode,
        this.auth.channelName
      )
    },
    async selectProduct(product: any) {
      if (product.manyUomFlag === 'Y') {
        const actionModal = {
          action: true,
          productId: product.productId,
          productGroupId: product.productGroupId,
          productSubGroupId: product.productSubGroupId,
        }
        this.$root.$emit('productSeleted', actionModal)
      } else {
        this.$router.push(`/product/${product.productId}`)
      }
    },
    async getProductrecomment() {
      const randomPage = Math.floor(Math.random() * 5)
      try {
        const allProduct = await getProduct.getProductrecomment(
          randomPage,
          this.auth.globalCode,
          this.auth.channelName
        )
        this.listAllProduct =
          allProduct && allProduct.data ? allProduct.data : null
      } catch (err) {
        console.log(err)
      }
    },
  },
  mounted() {
    this.getProductrecomment()
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style scoped>
@import url('~/assets/css/Productrecommend.css');
@import url('~/assets/css/Cart.css');

.p-4 {
  padding: 4rem;
}

@media (max-width: 1200px) {
}

@media (max-width: 600px) {
}
</style>
