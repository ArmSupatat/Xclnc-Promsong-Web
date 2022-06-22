<template>
  <div>
    <v-row v-if="loading">
      <v-col v-for="(item, index) in 4" :key="index"
        ><v-skeleton-loader type=" image, table-tfoot"></v-skeleton-loader
      ></v-col>
    </v-row>
    <v-row v-else no-gutters class="row-promotion pa-lx-4 pa-lg-3 pa-sm-2">
      <v-col
        v-for="item in listPromotion"
        class="ListPromotion pa-lx-2 pa-md-2 pa-sm-2 pa-1"
        :key="item.promotionId"
        cols="4"
        @click="nextPagetoPromotion(item.promotionId)"
      >
        <img :src="item.promotionImageFilePath[0]" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { promotionsCoupon } from '~/api/Product/GetPromotions'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'

export default Vue.extend({
  data: () => ({
    loading: true as boolean,
    listPromotion: [] as object[],
  }),
  methods: {
    async getPromotionsCoupon() {
      await promotionsCoupon
        .getPromotions(this.auth.globalCode, this.auth.channelName)
        .then((response) => {
          this.loading = false
          this.listPromotion = response
        })
    },
    nextPagetoPromotion(promotionId: number) {
      this.$router.push({
        path: '/product',
        query: { promotion: `${promotionId}` },
      })
    },
  },
  mounted() {
    this.getPromotionsCoupon()
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style lang="scss" scoped>
@import url('~/assets/css/Promotion.css');
</style>
