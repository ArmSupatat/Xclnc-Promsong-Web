<template>
  <v-dialog v-model="action.action" style="background-color: white">
    <div class="d-flex flex-column pa-5">
      <div class="text-center">
        <h3>เลือกหน่วยสินค้าที่ต้องการ</h3>
      </div>
      <div class="d-flex flex-row mt-5 justify-space-around">
        <v-card
          outlined
          v-for="(item, i) in productSeleted"
          :key="item.id"
          class="pa-3"
        >
          <div class="text-left d-flex flex-column justify-space-between">
            <div class="d-flex flex-column">
              <div
                :class="`${
                  item.priceresell != ''
                    ? 'justify-space-between'
                    : 'justify-end'
                }  flex-row  d-flex`"
              >
                <span class="tagsell" v-if="item.promoFlag === 'Y'">Sale</span>
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
                <v-btn
                  icon
                  v-if="auth.globalCode && item.useShopFlag === 'Y'"
                  color="#DD6241"
                  @click="changeStatus(i, item.productBarcode, 'N')"
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
            </div>
            <div
              class="d-flex flex-column"
              style="cursor: pointer"
              @click="seleteProduct(item.id)"
            >
              <div class="text-left d-flex flex-column">
                <div class="d-flex flex-column align-center">
                  <img
                    src="/images/Chickenwing.png"
                    width="180px"
                    height="120px"
                    alt=""
                  />
                </div>
                <div>
                  <span class="font-weight-bold">{{ item.name }}</span>
                </div>
              </div>
              <div class="text-left d-flex flex-column">
                <span class="make--text">{{ item.unit }}</span>
                <div class="d-flex flex-row justify-space-between">
                  <div>
                    <span
                      v-if="item.priceresell != ''"
                      class="text-decoration-line-through make--text mr-2"
                      >฿{{ item.priceresell }}</span
                    ><span
                      class="font-weight-bold"
                      :style="`${
                        item.priceresell === ''
                          ? `color: #469B5C;`
                          : `color: #DD6241;`
                      }font-size:large`"
                      >฿{{ item.price }}</span
                    >
                  </div>
                  <div>
                    <span>฿51/ชิ้น</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <v-btn block class="titel rounded">
              <v-icon class="mx-1 white--text">add_shopping_cart</v-icon>
              <span class="font-weight-bold white--text">เพิ่มลงตะกร้า</span>
            </v-btn>
          </div>
        </v-card>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { getLookUpdMProdBarcode } from '~/api/LookUp/GetLookUpdMProdBarcode'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'

export default Vue.extend({
  props: ['action'],
  data: () => ({
    productSeleted: [] as any[],
  }),
  methods: {
    seleteProduct(id: string) {
      this.$router.push(`/product/${id}`)
    },
    async changeStatus(i: number, prodBarcode: string, activeTyp: string) {
      this.productSeleted[i].useShopFlag = activeTyp
      await getLookUpdMProdBarcode.getLookUpdMProdBarcode(
        {
          prodBarcode,
          activeTyp,
        },
        this.auth.globalCode,
        this.auth.channelName
      )
    },
    mockProduct() {
      for (let count: number = 300; count < 303; count++) {
        const name: string = Math.random().toString(36).substr(2, 36)
        const price: number = Math.random() * 300
        const priceresell: number = Math.random() * 100
        const unit: string[] = ['ลัง', 'ถุง', 'ขวด', 'แพ็ค', 'ชิ้น']
        const rand: number = Math.random() * 4

        const mockProduct = {
          id: count,
          img: '',
          name: name,
          price: Math.floor(price),
          priceresell: Math.floor(priceresell),
          unit: unit[Math.floor(rand)],
          status: false,
        }
        this.productSeleted.push(mockProduct)
      }
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
