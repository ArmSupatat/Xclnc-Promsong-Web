<template>
  <div class="brand mt-5">
    <div class="container-brand">
      <p class="text-Brand font-weight-bold">แบรนด์</p>
      <div class="list-brand">
        <div v-if="loading">
          <v-row v-for="(item, index) in 10" :key="index">
            <v-col><v-skeleton-loader type="article"></v-skeleton-loader></v-col
          ></v-row>
        </div>
        <div v-else>
          <div v-for="item in listAllBrand" :key="item.brandId">
            <v-checkbox
              v-model="listSelectedBrand"
              :label="item.brandName"
              :value="item.brandId"
              @click="selectedBrands"
            >
            </v-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getBrands } from '~/api/Product/GetBrandProduct'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'

export default Vue.extend({
  data: () => ({
    loading: true as boolean,
    listAllBrand: [] as object[],
    listSelectedBrand: [] as number[],
  }),
  methods: {
    async getBrands() {
      await getBrands
        .getBrandsProduct(this.auth.globalCode, this.auth.channelName)
        .then((response) => {
          this.listAllBrand = response
          this.loading = false
        })
    },
    selectedBrands() {
      this.$root.$emit('selectedProductFromBrand', this.listSelectedBrand)
    },
  },
  mounted() {
    this.getBrands()
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
<style scoped>
@import url('~/assets/css/ListBrand.css');
</style>
