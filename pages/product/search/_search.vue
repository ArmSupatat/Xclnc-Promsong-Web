<template>
  <v-app
    ><topbar />
    <Navigationdrawers :keywordSearch="searching" class="hidden-sm-and-up" />
    <v-container class="d-flex flex-column">
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-2 make--text">/</span>
        <a href="#" class="secondary--text">ผลการค้นหา “{{ searching }}” </a>
      </div>

      <div class="d-flex flex-row justify-space-between">
        <div class="hidden-xs-only">
          <Categoryproduct :keywordSearch="searching" />
          <ListBrand />
        </div>
        <div class="ProductFilter d-flex flex-column">
          <ProductFilter :keywordSearch="searching" />
          <ListProduct :keywordSearch="searching" />
        </div>
      </div>
      <ProductSelectUnit :action="actionModal" /> </v-container
  ></v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import Footer from '~/components/Footer.vue'
import Categoryproduct from '~/components/Categoryproduct.vue'
import ProductFilter from '~/components/ProductFilter.vue'
import ListProduct from '~/components/ListProduct.vue'
import ProductSelectUnit from '~/components/ProductSelectUnit.vue'
import ListBrand from '~/components/ListBrand.vue'
import Navigationdrawers from '~/components/Navigationdrawers.vue'

export default Vue.extend({
  data() {
    return {
      searching: this.$route.params.search,
      actionModal: '' as any,
    }
  },
  components: {
    Footer,
    Topbar,
    Categoryproduct,
    ProductFilter,
    ListProduct,
    ProductSelectUnit,
    Navigationdrawers,
    ListBrand,
  },
  created() {
    this.$root.$on('productSeleted', (product: object) => {
      this.actionModal = product
    })
  },
})
</script>
<style scoped>
@import url('~/assets/css/Product.css');
</style>
