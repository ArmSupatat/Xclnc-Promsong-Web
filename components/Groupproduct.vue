<template>
  <div class="d-flex flex-column py-md-10">
    <v-container
      ><div class="text-center d-flex flex-column">
        <span
          class="groupTital--text font-weight-regular text-lg-h4 text-md-h5 text-sm-h6 text-subtitles"
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
                v-for="Product in mockListGroupproduct"
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
    mockListGroupproduct: [
      {
        productGroupId: 1,
        productGroupName: 'ผัก',
        productGroupImageFilePath: [
          'https://backend.tops.co.th/media//catalog/product/0/0/0000030066014_1.jpg',
        ],
      },
      {
        productGroupId: 2,
        productGroupName: 'เนื้อหมู',
        productGroupImageFilePath: [
          'https://i0.wp.com/www.freshfoodsbkk.com/wp-content/uploads/2017/08/Pork-Fillet.jpg?fit=500%2C500&ssl=1',
        ],
      },
      {
        productGroupId: 3,
        productGroupName: 'ไข่',
        productGroupImageFilePath: [
          'https://image.thainewsonline.co/uploads/images/contents/w1024/2022/01/XIItkFwR0Yg7vJUTpx5s.webp',
        ],
      },
      {
        productGroupId: 4,
        productGroupName: 'ผลไม้',
        productGroupImageFilePath: [
          'https://i0.wp.com/www.freshfoodsbkk.com/wp-content/uploads/2017/08/orange.jpg?fit=500%2C500',
        ],
      },
      {
        productGroupId: 5,
        productGroupName: 'น้ำตาล',
        productGroupImageFilePath: [
          'https://backend.tops.co.th/media/catalog/product/8/8/8850256100106_e17-03-2020.jpg',
        ],
      },
      {
        productGroupId: 6,
        productGroupName: 'รสดี',
        productGroupImageFilePath: ['https://inwfile.com/s-fn/uhv4qi.jpg'],
      },
      {
        productGroupId: 7,
        productGroupName: 'น้ำมัน',
        productGroupImageFilePath: [
          'https://backend.tops.co.th/media/catalog/product/8/8/8850210000046_1.jpg',
        ],
      },
      {
        productGroupId: 8,
        productGroupName: 'ซอสมะเขือเทศ',
        productGroupImageFilePath: [
          'https://backend.tops.co.th/media/catalog/product/8/8/8850343000166_1.jpg',
        ],
      },
    ] as any[],
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
