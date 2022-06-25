<template>
  <div class="Productrecommend py-md-10">
    <v-container
      ><div class="text-center d-flex flex-column" style="z-index: 2">
        <div class="text-center d-flex flex-column">
          <span
            class="groupTital--text font-weight-regular text-lg-h4 text-md-h5 text-sm-h6 text-subtitles"
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
                v-for="(item, i) in mockListAllProduct"
                :key="item.productId"
              >
                <v-card
                  outlined
                  class="ma-lg-2 ma-md-2 ma-sm-1 ma-1 d-flex flex-column justify-space-between pa-lg-3 pa-2"
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
                      v-if="item.useShopFlag === 'Y'"
                      color="#DD6241"
                      @click="changeStatus(i, item.productBarcode, 'N')"
                      class="Btn-favorite"
                    >
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      class="Btn-favorite"
                      v-if="item.useShopFlag === 'N'"
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
                            class="text-salePrice text-decoration-line-through make--text mr-2"
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
                            class="Btn-DetailAddProduct titel rounded space w-full"
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
    mockListAllProduct: [
      {
        productId: 1,
        useShopFlag: 'N',
        productName: 'เนื้อหมู',
        uomCode: 'กิโลกรัม',
        unitPriceShow: 130,
        productImageFilePath: [
          'https://i0.wp.com/www.freshfoodsbkk.com/wp-content/uploads/2017/08/Pork-Fillet.jpg?fit=500%2C500&ssl=1',
        ],
      },
      {
        productId: 2,
        useShopFlag: 'N',
        productName: 'น้ำมัน',
        uomCode: 'ขวด',
        unitPriceShow: 139,
        productImageFilePath: [
          'https://backend.tops.co.th/media/catalog/product/8/8/8850210000046_1.jpg',
        ],
      },
      {
        productId: 3,
        useShopFlag: 'N',
        productName: 'ซอสปรุงรสฝาเขียว',
        uomCode: 'ขวด',
        unitPriceShow: 37,
        productImageFilePath: [
          'https://www.goldenmountainsauce.com/uploads/articles_icon/1499139449.jpg',
        ],
      },
      {
        productId: 4,
        useShopFlag: 'N',
        productName: 'เนื้อไก่',
        uomCode: 'กิโลกรัม',
        unitPriceShow: 90,
        productImageFilePath: [
          'https://cf.shopee.co.th/file/c1e92fbbfcd0ad5e488e0c76db1844f3',
        ],
      },
      {
        productId: 5,
        useShopFlag: 'N',
        productName: 'ไข่',
        uomCode: 'แผง',
        unitPriceShow: 105,
        productImageFilePath: [
          'https://image.thainewsonline.co/uploads/images/contents/w1024/2022/01/XIItkFwR0Yg7vJUTpx5s.webp',
        ],
      },
      {
        productId: 6,
        useShopFlag: 'N',
        productName: 'น้ำตาล',
        uomCode: 'ถุง',
        unitPriceShow: 22,
        productImageFilePath: [
          'https://backend.tops.co.th/media/catalog/product/8/8/8850256100106_e17-03-2020.jpg',
        ],
      },
      {
        productId: 7,
        useShopFlag: 'N',
        productName: 'รสดี',
        uomCode: 'ถุง',
        unitPriceShow: 26,
        productImageFilePath: ['https://inwfile.com/s-fn/uhv4qi.jpg'],
      },
      {
        productId: 8,
        useShopFlag: 'N',
        productName: 'ซอสมะเขือเทศ',
        uomCode: 'ขวด',
        unitPriceShow: 28,
        productImageFilePath: [
          'https://backend.tops.co.th/media/catalog/product/8/8/8850343000166_1.jpg',
        ],
      },
      {
        productId: 9,
        useShopFlag: 'N',
        productName: 'เกลือ',
        uomCode: 'ถุง',
        unitPriceShow: 14,
        productImageFilePath: [
          'https://backend.tops.co.th/media/catalog/product/8/8/8850069010074_e13-11-2020.jpg',
        ],
      },
      {
        productId: 10,
        useShopFlag: 'N',
        productName: 'ซอสหอยนางรม',
        uomCode: 'ขวด',
        unitPriceShow: 34,
        productImageFilePath: [
          'https://backend.tops.co.th/media/catalog/product/8/8/8850038400028_e08-11-2018.jpg',
        ],
      },
    ] as any[],
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
