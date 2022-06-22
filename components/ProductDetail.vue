<template>
  <div>
    <div v-if="loading" style="width: 100%">
      <v-skeleton-loader type="image,article, actions"></v-skeleton-loader>
    </div>

    <div v-else>
      <v-row>
        <v-col class="pa-0" lg="4">
          <div>
            <div
              class="d-flex img-container justify-center align-center"
              v-if="
                product.productImageFilePath &&
                product.productImageFilePath.length < 2
              "
            >
              <img
                :src="`${product.productImageFilePath[0]}`"
                class="product-image"
                alt=""
              />
            </div>
            <div class="img-container w-full" v-else>
              <carousel
                :paginationEnabled="true"
                :perPage="1"
                :centerMode="true"
                paginationActiveColor="gray"
                :paginationPadding="2.5"
                :resistanceCoef="20"
              >
                <slide
                  v-for="(images, i) in product.productImageFilePath"
                  :key="i"
                >
                  <img :src="images" class="product-image fill-height" alt="" />
                </slide>
              </carousel>
            </div>
          </div>
        </v-col>
        <v-col class="pa-0" lg="8">
          <div
            class="
              Detail
              d-flex
              flex-column
              justify-space-between
              mt-4
              ml-sm-4
              mt-sm-0
            "
          >
            <div
              class="container-Detail d-flex flex-column justify-space-around"
            >
              <div class="d-flex">
                <div
                  v-if="product.couponFlag === 'Y'"
                  class="div-Logo-Tag-discounts d-flex align-start"
                >
                  <img
                    class="Logo-Tag-discounts"
                    src="/images/Tag-discounts.png"
                    alt=""
                  />
                </div>
                <span class="tagsell mr-2" v-if="product.promoFlag === 'Y'"
                  >Sale</span
                >
                <div
                  class="div-LogoShopRecommend"
                  v-if="product.shopRecommendTypeIdx"
                >
                  <span
                    v-for="item in product.shopRecommendTypeIdx"
                    :key="item"
                    class="material-icons"
                  >
                    stars
                  </span>
                </div>
              </div>
              <div>
                <span class="text-DetailProductName font-weight-black">
                  {{ product.productName }}
                </span>
              </div>
              <div class="my-2">
                <span class="subtext">{{ product.productName }}</span>
              </div>
              <div>
                <span class="text-DetailUnit font-weight-black">หน่วย : </span
                ><span class="text-DetailUnitType">{{ product.uomCode }}</span>
                <span class="make--text px-xl-3 px-lg-3 px-md-3 px-sm-2 pa-1"
                  >|</span
                >
                <span class="text-Storage font-weight-black display-respon-show"
                  >ราคาต่อหน่วย : {{ product.unitPriceShow }}</span
                >
                <span class="text-Storage font-weight-black display-respon-none"
                  >สต็อก : </span
                ><span class="text-NumStorage display-respon-none">{{
                  parseInt(product.stkQty)
                }}</span>
              </div>
              <div class="mt-1">
                <span
                  class="text-DetailUnit font-weight-black display-respon-show"
                  >สต็อกและจำนวนที่มีในร้านค้า : {{ parseInt(product.stkQty) }}
                </span>
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="my-2">
                <span
                  v-if="
                    parseFloat(product.salePrice) >
                    parseFloat(product.unitPriceShow)
                  "
                  class="
                    text-DetailSalePrice text-decoration-line-through
                    make--text
                    mr-1
                  "
                  >฿{{
                    product.salePrice % 1 === 0
                      ? Math.round(product.salePrice)
                      : parseFloat(product.salePrice).toFixed(2)
                  }}</span
                >
                <span
                  class="text-DetailPrice font-weight-black"
                  :style="`${
                    parseFloat(product.salePrice) <=
                    parseFloat(product.unitPriceShow)
                      ? `color: #469B5C;`
                      : `color: #DD6241;`
                  }`"
                >
                  ฿{{
                    product.unitPriceShow % 1 === 0
                      ? Math.round(product.unitPriceShow)
                      : parseFloat(product.unitPriceShow).toFixed(2)
                  }}
                </span>
                <div class="d-flex w-fit">
                  <CartQty :pItem="product" />
                </div>
              </div>
              <div class="mb-3">
                <span class="text-Curpons font-weight-black display-respon-none"
                  >คูปองส่วนลด
                </span>
              </div>

              <div>
                <v-btn
                  class="
                    Btn-DetailAddProduct
                    titel
                    rounded
                    px-xl-16 px-lg-12 px-md-8 px-sm-6 px-16
                    width-75
                  "
                  @click="addProductInBasket(product)"
                >
                  <v-icon class="text-DetailIcon mx-1 white--text"
                    >add_shopping_cart</v-icon
                  >
                  <span class="text-DetailText white--text">เพิ่มลงตะกร้า</span>
                </v-btn>
                <modal
                  name="add"
                  :adaptive="true"
                  :maxWidth="350"
                  height="200"
                  @closed="$modal.hide('add')"
                >
                  <div
                    class="
                      d-flex
                      flex-column
                      justify-center
                      align-center
                      relative
                      height-100
                    "
                  >
                    <v-icon
                      class="absolute position-close"
                      @click="$modal.hide('add')"
                      >close</v-icon
                    >
                    <h3 class="mb-4">คุณได้ทำการเพิ่มสินค้าลงในรถเข็นแล้ว</h3>
                    <div>
                      <v-btn block class="" @click="$router.push('/cart')">
                        <v-img
                          class="mr-2"
                          :width="changeSizeScreen.icon"
                          src="/images/Basket.png"
                        ></v-img>
                        <span>ไปยังตะกร้า</span>
                      </v-btn>
                    </div>
                  </div>
                </modal>
                <v-btn class="Btn-DetailFavorite rounded" outlined>
                  <span class="material-icons"> favorite_border </span>
                  <span class="text-DetailText font-weight-bold">ถูกใจ</span>
                </v-btn>
              </div>
              <div class="mt-3">
                <span class="text-Curpons font-weight-black display-respon-show"
                  >คูปองส่วนลด
                </span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Product } from '~/types/Product'
import { mapState } from 'vuex'
import Vue from 'vue'
import { AuthModel } from '~/types/AuthModel'
export default Vue.extend({
  props: {
    product: Object as () => Product,
    discountPrice: Number,
  },
  data: () => ({
    colors: [
      'indigo',
      'warning',
      'pink darken-2',
      'red lighten-1',
      'deep-purple accent-4',
    ],
    slides: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
    loading: true as boolean,
  }),
  methods: {
    addProductInBasket(product: Product) {
      if (this.auth.globalCode) {
        this.$store.commit('cartStore/addHotProductBasket', product)
        this.$modal.show('add')
      } else {
        this.$router.push('/auth')
      }
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
    changeSizeScreen(): object {
      const size = {
        logoProduct: 160,
        icon: 28,
        fontSignin: 18,
        fontSearch: 18,
        fontTopic: 12,
      }

      if (this.$vuetify.breakpoint.sm) {
        size.logoProduct = 120
        size.icon = 22
      } else if (this.$vuetify.breakpoint.xs) {
        if (this.$vuetify.breakpoint.width < 360) {
          size.logoProduct = 65
          size.icon = 20
        } else {
          size.logoProduct = 80
          size.icon = 22
        }
      }
      return size
    },
  },
  mounted() {
    setTimeout(() => (this.loading = false), 2000)
  },
})
</script>
<style lang="scss" scoped>
@import url('~/assets/css/ProductDetail.css');
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/globalStyle.scss';

.img-container {
  border: 1px solid lightgray;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 10px;
}
.img-product {
  height: 100%;
  width: 250px;
}
.subtext {
  font-size: 16px;
  color: $subtext-color;
}
.width-75 {
  width: 75%;
}

.position-close {
  top: 0.5rem;
  right: 0.5rem;
}
</style>
