<template>
  <div
    class="
      Product-ship
      text-center
      d-flex
      flex-column
      align-center
      pa-xl-12 pa-lg-10 pa-md-8 pa-sm-6 pa-4
    "
  >
    <v-container>
      <div class="Subtitel text-center d-flex flex-column">
        <span
          class="
            groupTital--text
            font-weight-regular font-weight-regular
            text-lg-h4 text-md-h5 text-sm-h6 text-subtitles
          "
        >
          สินค้าพร้อมส่ง
        </span>
        <span
          ><img src="/images/Subtitel.png" class="imageTitel" alt=""
        /></span>
      </div>

      <v-row v-if="listAllProduct && listAllProduct.length === 0">
        <v-col v-for="(item, index) in 15" :key="index" lg="3" sm="6"
          ><v-skeleton-loader type=" image, table-tfoot"></v-skeleton-loader
        ></v-col>
      </v-row>
      <div v-else class="box justify-md-center justify-lg-center">
        <v-item-group>
          <v-row>
            <v-col
              v-for="(item, i) in listAllProduct"
              :key="item.id"
              class="col-ProducttoShip"
            >
              <v-card outlined class="d-flex pa-1 pa-lg-3 pa-md-2 pa-sm-1">
                <div
                  class="
                    text-left
                    d-flex
                    flex-column
                    justify-space-between
                    cursor:
                    pointer
                  "
                >
                  <div class="d-flex flex-column">
                    <div class="flex-row d-flex justify-space-between">
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
                            v-for="item in item.shopRecommendTypeIdx"
                            :key="item"
                            class="material-icons"
                          >
                            stars
                          </span>
                        </div>
                      </div>

                      <v-btn
                        icon
                        v-if="auth.globalCode && item.useShopFlag === 'Y'"
                        class="Btn-favorite"
                        color="#DD6241"
                        @click="changeStatus(i, item.productBarcode, 'N')"
                      >
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                      <v-btn
                        class="Btn-favorite"
                        icon
                        v-if="auth.globalCode && item.useShopFlag === 'N'"
                        @click="changeStatus(i, item.productBarcode, 'Y')"
                        color="#DBDEE7"
                      >
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div
                    class="
                      detail-Product
                      d-flex
                      flex-column
                      justify-space-between
                      cursor-pointer
                    "
                    @click="selectProduct(item)"
                  >
                    <div class="text-left d-flex flex-column">
                      <div class="d-flex flex-column align-center">
                        <img
                          :src="
                            item.productImageFilePath &&
                            item.productImageFilePath.length > 0
                              ? item.productImageFilePath[0]
                              : null
                          "
                          class="img-ProducttoShip"
                          alt=""
                        />
                      </div>
                      <div>
                        <span class="text-ProductName font-weight-bold">{{
                          item.productName
                        }}</span>
                      </div>
                    </div>

                    <div class="text-left d-flex flex-column">
                      <span class="text-Unit make--text">{{
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
                    </div>
                  </div>
                  <div class="z-index-front">
                    <div class="d-flex">
                      <CartQty :pItem="item" />
                    </div>
                    <v-btn
                      class="Btn-DetailAddProduct w-full titel rounded space"
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
              </v-card>
            </v-col>
          </v-row>
        </v-item-group>
      </div>
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
      <div class="pa-4">
        <v-btn
          class="btn-viewmore groupTital white--text"
          @click="$router.push('/product')"
          >ดูเพิ่มเติม</v-btn
        >
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getProduct } from '~/api/Product/GetProducts'
import { Product } from '~/types/Product'
import { mapState } from 'vuex'
import { getLookUpdMProdBarcode } from '~/api/LookUp/GetLookUpdMProdBarcode'
import { AuthModel } from '~/types/AuthModel'

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
    selectProduct(product: any) {
      if (product.manyUomFlag === 'M') {
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
    async getAllProduct(currentPage: number) {
      try {
        const allProduct = await getProduct.getAllProducttoship(
          currentPage,
          15,
          this.auth.globalCode,
          this.auth.channelName
        )
        this.listAllProduct =
          allProduct && allProduct.data ? allProduct.data : null
      } catch (err) {
        console.log(err)
      }
    },
    showProductSeleted(id: number) {
      const actionModal = {
        action: true,
        ProductId: id,
      }
      this.$root.$emit('productSeleted', actionModal)
    },
  },
  mounted() {
    const randomPage = Math.floor(Math.random() * 5)
    this.getAllProduct(randomPage)
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style scoped>
@import url('~/assets/css/Producttoship.css');
@import url('~/assets/css/Cart.css');

.p-4 {
  padding: 4rem;
}

.Qty-other {
  border-radius: 15px;
  text-align: center;
  width: 6rem;
}

@media (max-width: 1200px) {
}

@media (max-width: 600px) {
  .Qty-other {
    border-radius: 6px;
    width: 3.1rem !important;
  }
}

@media (max-width: 375px) {
  .Qty-other {
    border-radius: 6px;
    width: 2.3rem !important;
  }
}
</style>
