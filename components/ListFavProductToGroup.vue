<template>
  <div
    @click="handleClickFavGroup"
    :class="`fav-group-wrapper d-flex pa-4 mb-2 ma-lg-2 cursor-pointer ${
      favGroupProduct.active ? 'active' : ''
    }`"
  >
    <v-img
      min-width="100"
      max-width="100"
      :src="favGroupProduct.productImageFilePath"
    ></v-img>
    <div class="fav-group-detail ml-4 d-flex flex-column">
      <h4>{{ favGroupProduct.prodName }}</h4>
      <h6>{{ favGroupProduct.uomCode }}</h6>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    favGroupProduct: Object,
  },
  methods: {
    handleClickFavGroup() {
      this.favGroupProduct.active = !this.favGroupProduct.active
      if (this.favGroupProduct.active) {
        this.$emit('addFavGroupProduct', this.favGroupProduct)
      } else {
        this.$emit('deleteFavGroupProduct', this.favGroupProduct)
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.fav-group-wrapper {
  border: 1px solid #dbdee7;
  width: 100%;
  flex-direction: column;
  align-items: center;

  @media only screen and (min-width: 960px) {
    flex-direction: row;
    width: 46%;
    height: 120px;
    img {
      width: 30px;
      height: 30px;
    }
  }
}
.active {
  border: 1px solid #469b5c;
}
</style>
