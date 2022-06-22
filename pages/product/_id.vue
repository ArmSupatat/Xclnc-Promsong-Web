<template>
  <v-app>
    <Topbar />
    <v-container class="d-flex flex-column">
      <div class="py-5 ellipsis">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-2 make--text">/</span>
        <a href="/product" class="make--text">สินค้าทั้งหมด</a>
        <span class="mx-2 make--text">/</span>
        <a href="#" class="secondary--text">{{ nameProductSelect }}</a>
      </div>
      <div class="d-flex flex-column">
        <ProductDetail :product="product" />
        <RelatedProducts :product="relateProducts" />
      </div>
    </v-container>
    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import Footer from '~/components/Footer.vue'
import ProductDetail from '~/components/ProductDetail.vue'
import RelatedProducts from '~/components/Relatedproducts.vue'
import { getProduct } from '~/api/Product/GetProducts'
import { Product } from '~/types/Product'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'

export default Vue.extend({
  data() {
    return {
      id: this.$route.params.id,
      product: {} as Product,
      listRelatedProduct: [] as Product[],
      nameProductSelect: '' as string,
    }
  },
  components: {
    Topbar,
    Footer,
    ProductDetail,
    RelatedProducts,
  },
  computed: {
    relateProducts(): Product[] {
      const filterProduct: Product[] = this.listRelatedProduct.filter(
        (products: any) => products.productId != this.id
      )
      filterProduct.length === 6 ? filterProduct.splice(-1) : filterProduct
      return filterProduct
    },
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
  methods: {
    async getProductSelect(productId: string) {
      await getProduct
        .getSingleProduct(
          productId,
          this.auth.globalCode,
          this.auth.channelName
        )
        .then((response: any) => {
          this.product = response.data[0]
          this.nameProductSelect = response.data[0].productName
          const productGroupId = response.data[0].productGroupId
          const productSubGroupId = response.data[0].productSubGroupId
          this.getRelatedProduct(productGroupId, productSubGroupId)
        })
    },
    async getRelatedProduct(productGroupId: number, productSubGroupId: number) {
      await getProduct
        .getRelatedProduct(
          productGroupId,
          productSubGroupId,
          this.auth.globalCode,
          this.auth.channelName
        )
        .then((response) => {
          this.listRelatedProduct = response.data
        })
    },
  },
  mounted() {
    this.getProductSelect(this.id)
  },
})
</script>

<style>
.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
