<template>
  <v-app>
    <Topbar :checkLogin="true" />
    <Navigationdrawers class="hidden-sm-and-up" />
    <v-container class="d-flex flex-column">
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">สินค้าทั้งหมด</a>
      </div>

      <div class="d-flex flex-row justify-space-between">
        <div class="ProductCategory hidden-xs-only">
          <Categoryproduct />
          <ListBranch />
        </div>
        <div class="ProductFilter d-flex flex-column">
          <ProductFilter />
          <ListProduct />
        </div>
      </div>
    </v-container>
    <ProductSelectUnit :action="actionModal" />
    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import Footer from '~/components/Footer.vue'
import ProductFilter from '~/components/ProductFilter.vue'
import Categoryproduct from '~/components/Categoryproduct.vue'
import ListBranch from '~/components/ListBrand.vue'
import ListProduct from '~/components/ListProduct.vue'
import ProductSelectUnit from '~/components/ProductSelectUnit.vue'
import Navigationdrawers from '~/components/Navigationdrawers.vue'

export default Vue.extend({
  layout: 'default',
  data: () => ({
    actionModal: '' as any,
  }),
  components: {
    Topbar,
    Footer,
    Categoryproduct,
    ProductFilter,
    ListProduct,
    ProductSelectUnit,
    ListBranch,
    Navigationdrawers,
  },
  created() {
    this.$root.$on('productSeleted', (product: object) => {
      this.actionModal = product
    })
  },
})
</script>
<style lang="scss" scoped>
@import url('~/assets/css/Product.css');

@media (max-width: 360px) {
  .ProductFilter {
    padding: 1rem 0rem !important;
  }
}
</style>
