<template>
  <div class="list-allProduct">
    <div v-if="loading">
      <v-row v-if="filterStatus === 'grid'">
        <v-col v-for="(item, index) in 15" :key="index" lg="3" sm="6"
          ><v-skeleton-loader type="image, table-tfoot"></v-skeleton-loader
        ></v-col>
      </v-row>
      <div v-if="filterStatus === 'list'">
        <v-row v-for="(item, index) in 15" :key="index">
          <v-col
            ><v-skeleton-loader
              type="image, actions, table-tfoot"
            ></v-skeleton-loader
          ></v-col>
        </v-row>
      </div>
    </div>
    <div v-else>
      <div v-if="filterStatus === 'grid'" class="filter-grid mt-3">
        <v-item-group>
          <v-row class="flex">
            <v-col
              v-for="(item, i) in listAllProduct"
              :key="item.id"
              class="col-gridProduct pb-2"
            >
              <v-card
                outlined
                height="100%"
                class="
                  d-flex
                  align-center
                  card
                  justify-space-between
                  flex-column
                "
              >
                <div class="container-GridProduct text-left d-flex flex-column">
                  <div class="d-flex flex-column">
                    <div class="flex-row d-flex justify-space-between">
                      <div class="d-flex">
                        <span
                          class="tagsell mr-2"
                          v-if="
                            parseFloat(item.salePrice) >
                            parseFloat(item.unitPriceShow)
                          "
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
                        color="#DD6241"
                        @click="
                          changeStatus(
                            i,
                            item.productBarcode
                              ? item.productBarcode
                              : item.prodBarcode,
                            'N'
                          )
                        "
                        class="Btn-favorite"
                      >
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        class="Btn-favorite"
                        v-if="auth.globalCode && item.useShopFlag === 'N'"
                        @click="
                          changeStatus(
                            i,
                            item.productBarcode
                              ? item.productBarcode
                              : item.prodBarcode,
                            'Y'
                          )
                        "
                        color="#DBDEE7"
                      >
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div
                    class="
                      detail-GridProduct
                      d-flex
                      flex-column
                      justify-space-between
                    "
                  >
                    <div
                      class="text-left d-flex flex-column"
                      @click="selectProduct(item)"
                    >
                      <div class="d-flex flex-column align-center">
                        <img
                          :src="`${
                            item.productImageFilePath &&
                            item.productImageFilePath.length > 0
                              ? item.productImageFilePath[0]
                              : item.promotionDetailImageFilePath
                              ? item.promotionDetailImageFilePath[0]
                              : null
                          }`"
                          class="Products-Grid"
                          alt=""
                        />
                      </div>
                      <div>
                        <span class="font-weight-bold text-ProductName">{{
                          item.productName ? item.productName : item.prodName
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
                      <div class="z-index-front">
                        <div class="d-flex">
                          <CartQty :pItem="item" />
                        </div>
                        <v-btn
                          class="Btn-DetailAddProduct titel rounded space"
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
            </v-col>
          </v-row>
        </v-item-group>
      </div>

      <div v-else-if="filterStatus === 'list'" class="filter-list mt-3">
        <v-card
          v-for="item in listAllProduct"
          :key="item.id"
          class="mt-2"
          outlined
        >
          <div class="d-flex flex-row pa-xl-3 pa-lg-3 pa-md-3 pa-sm-2 pa-1">
            <div class="detail-ListProductImage d-flex justify-center">
              <img
                :src="`${
                  item.productImageFilePath
                    ? item.productImageFilePath[0]
                    : item.promotionDetailImageFilePath[0]
                }`"
                alt=""
                class="Products-List"
              />
            </div>
            <div
              class="detail-ListProduct d-flex flex-row justify-space-between"
            >
              <div class="d-flex flex-column justify-space-between">
                <div class="d-flex flex-column">
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

                  <span class="text-ProductList-Name">{{
                    item.productName ? item.productName : item.prodName
                  }}</span>
                </div>
                <div>
                  <span class="text-ProductList-Unit make--text">{{
                    item.uomCode
                  }}</span>
                </div>
              </div>
              <div class="d-flex flex-column">
                <div style="text-align: end">
                  <v-btn
                    icon
                    v-if="auth.globalCode && item.useShopFlag === 'Y'"
                    @click="changeStatus(i, item.productBarcode, 'N')"
                    color="#DD6241"
                  >
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    v-if="auth.globalCode && item.useShopFlag === 'N'"
                    @click="changeStatus(i, item.productBarcode, 'Y')"
                    color="#DBDEE7"
                  >
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                </div>
                <div
                  class="
                    d-flex
                    flex-sm-row flex-xl-row flex-lg-row flex-md-row flex-column
                  "
                >
                  <div class="d-flex flex-row align-center">
                    <span
                      v-if="
                        parseFloat(item.salePrice) >
                        parseFloat(item.unitPriceShow)
                      "
                      class="
                        text-ProductList-salePrice text-decoration-line-through
                        make--text
                      "
                      >฿{{
                        item.salePrice % 1 === 0
                          ? Math.round(item.salePrice)
                          : parseFloat(item.salePrice).toFixed(2)
                      }}</span
                    >
                    <span
                      class="text-ProductList-Price font-weight-bold ml-2"
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
                  <div class="z-index-front align-self-center">
                    <div class="d-flex">
                      <CartQty :pItem="item" />
                    </div>
                  </div>
                  <div class="pl-xl-6 pl-lg-6 pa-md-4 pa-sm-2 pa-1">
                    <v-btn
                      @click="addProductInBasket(item)"
                      block
                      class="
                        Btn-ProductList-addProduct
                        titel
                        rounded
                        pa-xl-5 pa-lg-5
                      "
                    >
                      <v-icon
                        class="Btn-ProductList-iconAddProduct mx-1 white--text"
                        >add_shopping_cart</v-icon
                      >
                      <span class="Btn-ProductList-TextAddProduct white--text"
                        >เพิ่มลงตะกร้า</span
                      >
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </div>
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
    <div
      v-if="listAllProduct.length != 0"
      class="text-center pa-xl-16 pa-lg-14 pa-md-12 pa-10"
    >
      <v-pagination
        v-model="currentPage"
        :length="pages"
        circle
        @input="nextPage(currentPage)"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getProduct } from '~/api/Product/GetProducts'
import { searchProduct } from '~/api/Product/SearchProduct'
import { productGroup } from '~/api/Product/GetProductGroups'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'
import { Product } from '~/types/Product'
import { getLookUpdMProdBarcode } from '~/api/LookUp/GetLookUpdMProdBarcode'
import { getLookUpSupId } from '~/api/LookUp/GetLookUpSupId'
import { getListProductFavorite } from '~/api/Product/GetListProductFavorite'

export default Vue.extend({
  props: ['keywordSearch'],
  data: () => ({
    dialog: false,
    loading: false,
    categoryId: 1 as number,
    filterStatus: 'grid',
    actionUser: '' as string,
    rangePrice: [] as number[],
    OrderBy: '' as string,
    listAllProduct: [] as any[],
    productSeleted: [] as object[],
    currentPage: 1 as number,
    pages: 1 as number,
    listBrands: [] as number[],
    groupId: [] as number[],
    subGroupId: [] as number[],
    promotionId: 0 as number,
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
    async getProductFromSearch(
      currentPage: number,
      keywordSearch: string,
      orderBy: string,
      listBrands: number[]
    ) {
      this.loading = true
      this.currentPage = currentPage
      await searchProduct
        .serarchProductName(
          currentPage,
          keywordSearch,
          16,
          orderBy,
          listBrands,
          this.auth.globalCode,
          this.auth.channelName
        )
        .then((response) => {
          this.listAllProduct = response.data
          setTimeout(() => (this.loading = false))
          this.pages = response.totalPages
          this.$root.$emit('conuterFilterProduct', response.totalRecords)
        })
    },
    async getAllProduct(
      currentPage: number,
      orderBy: string,
      promoFlag: string
    ) {
      this.loading = true
      this.currentPage = currentPage
      await getProduct
        .getAllProduct(
          currentPage,
          16,
          orderBy,
          promoFlag,
          this.auth.globalCode,
          this.auth.channelName
        )
        .then((response) => {
          this.listAllProduct = response.data
          setTimeout(() => (this.loading = false))
          this.pages = response.totalPages
          this.$root.$emit('conuterFilterProduct', response.totalRecords)
        })
    },
    async filterProductFromPrice(
      currentPage: number,
      rangePrice: number[],
      keywordSearch: string,
      orderBy: string,
      listBrands: number[]
    ) {
      this.loading = true
      this.currentPage = currentPage
      await searchProduct
        .filterProductFromPrice(
          currentPage,
          rangePrice,
          keywordSearch,
          orderBy,
          listBrands
        )
        .then((response) => {
          this.listAllProduct = response.data
          setTimeout(() => (this.loading = false))
          this.pages = response.totalPages
          this.$root.$emit('conuterFilterProduct', response.totalRecords)
        })
    },
    async getProductFromGroup(
      groupId: any,
      subGroupId: any,
      currentPage: number,
      orderBy: string,
      listBrands: number[]
    ) {
      this.loading = true
      this.currentPage = currentPage
      await productGroup
        .getProductFromGroup(
          groupId,
          subGroupId,
          currentPage,
          16,
          orderBy,
          listBrands,
          this.auth.globalCode,
          this.auth.channelName
        )
        .then((response) => {
          if (response.totalPages > 0 && response.data.length === 0) {
            this.getProductFromGroup(
              this.groupId,
              this.subGroupId,
              1,
              this.OrderBy,
              this.listBrands
            )
          }
          this.listAllProduct = response.data
          setTimeout(() => (this.loading = false))
          this.pages = response.totalPages

          this.$root.$emit('conuterFilterProduct', response.totalRecords)
        })
    },
    nextPage(current: number) {
      if (this.keywordSearch) {
        if (this.actionUser === 'rangePriceProduct') {
          this.filterProductFromPrice(
            current,
            this.rangePrice,
            this.keywordSearch,
            this.OrderBy,
            this.listBrands
          )
        }
        this.getProductFromSearch(
          current,
          this.keywordSearch,
          this.OrderBy,
          this.listBrands
        )
      } else {
        if (this.actionUser === 'getProductFromGroup') {
          this.getProductFromGroup(
            this.groupId,
            this.subGroupId,
            current,
            this.OrderBy,
            this.listBrands
          )
        } else if (this.actionUser === 'getProductFromListAllProduct') {
          this.getAllProduct(current, this.OrderBy, 'N')
        } else if (this.actionUser === 'getProductFromListFavorites') {
          this.getListProductFavorite(current, this.OrderBy)
        } else if (this.actionUser === 'getProductFromListPromotion') {
          this.getAllProduct(current, this.OrderBy, 'Y')
        } else if (this.actionUser === 'getProductsFromPromotion') {
          this.getAllProduct(current, this.OrderBy, 'Y')
        } else if (this.actionUser === 'selectedProductFromBrand') {
          if (this.keywordSearch) {
            this.getProductFromSearch(
              current,
              this.keywordSearch,
              this.OrderBy,
              this.listBrands
            )
          } else {
            this.getProductFromBrands(
              current,
              this.listBrands,
              this.OrderBy,
              this.groupId,
              this.subGroupId
            )
          }
        } else if (this.actionUser === 'getProductOrderBy') {
          if (this.keywordSearch) {
            this.getProductFromSearch(
              current,
              this.keywordSearch,
              this.OrderBy,
              this.listBrands
            )
          } else {
            this.getProductOrderBy(
              this.OrderBy,
              this.groupId,
              this.subGroupId,
              current,
              this.listBrands
            )
          }
        } else {
          this.getAllProduct(current, this.OrderBy, 'N')
        }
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
    async getProductOrderBy(
      orderBy: string,
      groupId: number[],
      subGroupId: any,
      currentPage: number,
      listBrands: number[]
    ) {
      this.loading = true
      this.currentPage = currentPage
      await getProduct
        .getProductsOrderby(
          orderBy,
          groupId,
          subGroupId,
          currentPage,
          16,
          listBrands,
          this.auth.globalCode,
          this.auth.channelName
        )
        .then((response) => {
          this.listAllProduct = response.data
          this.pages = response.totalPages
          setTimeout(() => (this.loading = false))
        })
    },
    async getProductFromBrands(
      currentPage: number,
      listBrands: number[],
      orderBy: string,
      groupId: any,
      subGroupId: any
    ) {
      this.loading = true
      this.currentPage = currentPage
      await getProduct
        .getProductFromBrands(
          currentPage,
          listBrands,
          orderBy,
          groupId,
          subGroupId,
          this.auth.globalCode,
          this.auth.channelName
        )
        .then((response) => {
          if (response.totalPages > 0 && response.data.length === 0) {
            this.getProductFromBrands(
              1,
              this.listBrands,
              this.OrderBy,
              this.groupId,
              this.subGroupId
            )
          }
          this.listAllProduct = response.data
          this.pages = response.totalPages
          setTimeout(() => (this.loading = false))
          this.$root.$emit('conuterFilterProduct', response.totalRecords)
        })
    },
    async getProductFromPromotions(currentPage: number, promotopnId: number) {
      this.loading = true
      this.currentPage = currentPage
      await getProduct
        .getProductFromPromotion(
          currentPage,
          promotopnId,
          this.auth.globalCode,
          this.auth.channelName
        )
        .then((response) => {
          this.listAllProduct = response.data
          setTimeout(() => (this.loading = false))
          this.pages = response.totalPages
          this.$root.$emit('conuterFilterProduct', response.totalRecords)
          6
        })
    },
    async getListProductFavorite(currentPage: number, orderBy: string) {
      if (!this.auth.globalCode) {
        this.listAllProduct = []
        this.loading = false
        this.$root.$emit('conuterFilterProduct', 0)
        this.$router.push('/auth')
        return
      }
      this.loading = true
      const lookupSupIdRes = await getLookUpSupId.getLookUpSupId(
        0,
        this.auth.globalCode,
        this.auth.channelName
      )
      const supplier =
        lookupSupIdRes && lookupSupIdRes.data && lookupSupIdRes.data.length > 0
          ? lookupSupIdRes.data[0]
          : null
      if (supplier) {
        const getListProductFavRes =
          await getListProductFavorite.getListProductFavorite(
            {
              supId: supplier?.supId,
              priceTypId: supplier?.priceTypId,
              filter: {
                // pagingFrom: currentPage > 1 ? (currentPage - 1) * 16 + 1 : 0,
                // pagingTo: currentPage * 16,
                pagingFrom: 0,
                pagingTo: 999,
                search: '',
              },
            },
            this.auth.globalCode,
            this.auth.channelName
          )
        const { code, data, message } = getListProductFavRes
        if (code === 200 && message === 'Success') {
          this.listAllProduct = data?.productFavoriteResponse
          setTimeout(() => (this.loading = false))
          this.pages = 1
          this.$root.$emit('conuterFilterProduct', this.listAllProduct.length)
        }
      }
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
  created() {
    this.$root.$on('filterStatus', (status: string) => {
      this.filterStatus = status
    })
    this.$root.$on('getProductFromGroup', (groupDetail: any) => {
      this.actionUser = 'getProductFromGroup'
      this.groupId = groupDetail.groupId
      this.subGroupId = groupDetail.subGroupId
      this.getProductFromGroup(
        this.groupId,
        this.subGroupId,
        this.currentPage,
        this.OrderBy,
        this.listBrands
      )
    })
    this.$root.$on('arrangementProduct', (orderBy: string) => {
      this.actionUser = 'getProductOrderBy'
      this.OrderBy = orderBy
      if (this.keywordSearch) {
        this.getProductFromSearch(
          this.currentPage,
          this.keywordSearch,
          this.OrderBy,
          this.listBrands
        )
      } else {
        this.getProductOrderBy(
          this.OrderBy,
          this.groupId,
          this.subGroupId,
          this.currentPage,
          this.listBrands
        )
      }
    })
    this.$root.$on('rangePriceProduct', (range: []) => {
      this.actionUser = 'rangePriceProduct'
      this.rangePrice = range

      this.filterProductFromPrice(
        this.currentPage,
        range,
        this.keywordSearch,
        this.OrderBy,
        this.listBrands
      )
    })
    this.$root.$on('selectedProductFromBrand', (listBrands: []) => {
      this.actionUser = 'selectedProductFromBrand'
      this.listBrands = listBrands
      if (this.keywordSearch) {
        this.getProductFromSearch(
          this.currentPage,
          this.keywordSearch,
          this.OrderBy,
          this.listBrands
        )
      } else {
        this.getProductFromBrands(
          this.currentPage,
          this.listBrands,
          this.OrderBy,
          this.groupId,
          this.subGroupId
        )
      }
    })
    this.$root.$on('getProductFromList', (ListProduct: string) => {
      this.actionUser = `getProductFromList${ListProduct}`
      this.currentPage = 1
      if (ListProduct === 'AllProduct') {
        this.groupId.splice(0, this.groupId.length)
        this.listBrands.splice(0, this.listBrands.length)
        this.subGroupId.splice(0, this.subGroupId.length)
        this.getAllProduct(this.currentPage, this.OrderBy, 'N')
      } else if (ListProduct === 'Favorites') {
        this.getListProductFavorite(this.currentPage, this.OrderBy)
      } else if (ListProduct === 'Promotion') {
        this.getAllProduct(this.currentPage, this.OrderBy, 'Y')
      }
    })
  },

  mounted() {
    const urlParams = new URLSearchParams(window.location.search)
    const groupId: any = urlParams.get('group')
    const subGroupId: any = urlParams.get('subGroup')
    const promotopnId: any = urlParams.get('promotion')

    if (this.keywordSearch) {
      this.getProductFromSearch(
        this.currentPage,
        this.keywordSearch,
        this.OrderBy,
        this.listBrands
      )
    } else if (promotopnId) {
      this.promotionId = promotopnId
      this.actionUser = 'getProductsFromPromotion'
      this.getProductFromPromotions(this.currentPage, promotopnId)
    } else {
      if (groupId || subGroupId) {
        this.actionUser = 'getProductFromGroup'
        this.groupId.push(parseInt(groupId))
        this.subGroupId.push(subGroupId)
        this.getProductFromGroup(
          [groupId],
          [subGroupId],
          1,
          this.OrderBy,
          this.listBrands
        )
      } else {
        this.getAllProduct(this.currentPage, this.OrderBy, 'N')
      }
    }
  },
})
</script>

<style scoped>
@import url('~/assets/css/ListProduct.css');
@import url('~/assets/css/Cart.css');

.p-4 {
  padding: 4rem;
}

.space {
  width: 100%;
  max-width: 100% !important;
}
.text-spcae {
  font-size: 1rem;
}

.Qty-space {
  border-radius: 15px;
  text-align: center;
  width: 6rem !important;
}

@media (max-width: 600px) {
  .Qty-space {
    width: 4rem !important;
  }
}

@media only screen and (max-width: 376px) {
  .Qty-space {
    width: 3rem !important;
  }
}
</style>
