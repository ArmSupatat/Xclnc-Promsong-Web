<template>
  <div class="d-flex flex-column py-md-10">
    <v-container
      ><div class="text-center d-flex flex-column">
        <span
          class="
            groupTital--text
            font-weight-regular
            text-lg-h4 text-md-h5 text-sm-h6 text-subtitles
          "
        >
          กลุ่มสินค้า
        </span>

        <span class="mt-lg-3 mt-md-2">
          <img src="/images/Subtitel.png" class="imageTitel" alt="" />
        </span>
      </div>
      <div>
        <v-container>
          <v-row v-if="loading">
            <v-col v-for="(item, index) in 6" :key="index"
              ><v-skeleton-loader type=" image, table-tfoot"></v-skeleton-loader
            ></v-col>
          </v-row>
          <v-sheet v-else>
            <v-slide-group
              show-arrows
              class="container-groupProduct d-flex justify-center"
            >
              <v-slide-item
                v-for="Product in listGroupproduct"
                :key="Product.productGroupName"
                active-class="selectProductGroups"
              >
                <v-card
                  outlined
                  class="ProductGroups ma-lg-2 ma-Xl-2 ma-md-2 ma-sm-1 ma-1"
                  @click="
                    selectProductGroup(
                      Product.productGroupId,
                      Product.productGroupName
                    )
                  "
                >
                  <div
                    class="text-center h-full d-flex flex-column align-center"
                  >
                    <img
                      class="Groups-img"
                      :src="Product.productGroupImageFilePath"
                      alt=""
                    />
                  </div>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-container>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getGroups } from '~/api/Product/GetGroups'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'

export default Vue.extend({
  data: () => ({
    loading: true as boolean,
    listGroupproduct: [] as object[],
  }),
  methods: {
    selectProductGroup(groupId: number, groupName: string) {
      this.$router.push({
        path: '/product',
        query: { group: `${groupId}` },
      })
    },
    async getGroups() {
      await getGroups
        .getAllGroups(this.auth.globalCode, this.auth.channelName)
        .then((response) => {
          this.listGroupproduct = response

          setTimeout(() => (this.loading = false), 2000)
        })
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },

  mounted() {
    this.getGroups()
  },
})
</script>

<style lang="scss" scoped>
@import url('~/assets/css/Groupproduct.css');
</style>
