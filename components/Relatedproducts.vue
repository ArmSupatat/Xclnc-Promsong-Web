<template>
  <div class="d-flex flex-column mt-10">
    <p class="font-weight-bold text-xl-h5 text-lg-h5">สินค้าใกล้เคียง</p>
    <div v-if="loading">
      <v-row class="justify-space-between">
        <v-col
          class="lg-respon"
          v-for="(item, index) in 5"
          :key="`lg-respon-${index}`"
          lg="2"
          ><v-skeleton-loader type="image, table-tfoot"></v-skeleton-loader
        ></v-col>
        <v-col
          class="xs-respon"
          v-for="(item, index) in 2"
          :key="`xs-respon${index}`"
          ><v-skeleton-loader type="image, table-tfoot"></v-skeleton-loader
        ></v-col>
      </v-row>
    </div>
    <v-sheet class="mx-auto width-100" v-else>
      <v-slide-group class="py-4 flex justify-center align-center" show-arrows>
        <v-slide-item v-for="(item, index) in product" :key="index">
          <v-card
            outlined
            class="
              d-flex
              align-center
              pa-3 pa-lg-3 pa-md-2 pa-sm-2
              justify-space-between
              flex-column
              container-card-RelatedProduct
              mr-sm-8 mr-4
            "
            @click="selectProduct(item)"
          >
            <div
              class="
                container-RelatedProduct
                text-left
                d-flex
                flex-column
                justify-space-between
                width-100
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
                    class="Btn-favorite"
                    v-if="auth.globalCode && item.useShopFlag === 'Y'"
                    color="#DD6241"
                    @click="changeStatus(index, item.productBarcode, 'N')"
                  >
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                  <v-btn
                    class="Btn-favorite"
                    icon
                    v-if="auth.globalCode && item.useShopFlag === 'N'"
                    @click="changeStatus(index, item.productBarcode, 'Y')"
                    color="#DBDEE7"
                  >
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                </div>
              </div>
              <div
                class="detail-Product d-flex flex-column justify-space-between"
              >
                <div class="text-left d-flex flex-column">
                  <div class="d-flex flex-column align-center">
                    <img
                      :src="`${item.productImageFilePath[0]}`"
                      class="imges-ProductReated"
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
                  <span class="text-Unit make--text">{{ item.uomCode }}</span>
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
                  <div>
                    <v-btn
                      block
                      class="Btn-AddProduct titel rounded"
                      @click="selectProduct(item)"
                    >
                      <v-icon class="icon-Cart mx-1 white--text"
                        >add_shopping_cart</v-icon
                      >
                      <span class="text-AddProduct font-weight-bold white--text"
                        >เพิ่มลงตะกร้า</span
                      >
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <v-row align="center" justify="center">
              <v-scale-transition>
                <v-icon
                  v-if="active"
                  color="white"
                  size="48"
                  v-text="'mdi-close-circle-outline'"
                ></v-icon>
              </v-scale-transition>
            </v-row>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { getLookUpdMProdBarcode } from '~/api/LookUp/GetLookUpdMProdBarcode'
import { AuthModel } from '~/types/AuthModel'

export default Vue.extend({
  props: ['product'],
  data: () => ({
    loading: true as boolean,
    listAllProduct: [] as any[],
    active: false as boolean,
  }),

  methods: {
    async changeStatus(i: number, prodBarcode: string, activeTyp: string) {
      this.product[i].useShopFlag = activeTyp
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
  },
  mounted() {
    setTimeout(() => (this.loading = false), 2000)
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
<style lang="scss" scoped>
@import url('~/assets/css/RelatedProduct.css');
@import '@/assets/scss/globalStyle.scss';

.VueCarousel-wrapper {
  display: flex !important;
  justify-content: left !important;
}

.xs-respon {
  display: none;
}

@media (max-width: 1200px) {
}

@media (max-width: 600px) {
  .xs-respon {
    display: unset;
  }
  .lg-respon {
    display: none !important;
  }
}
</style>
