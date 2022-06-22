<template>
  <div class="d-flex flex-column">
    <div class="container-ProductFilter">
      <h2
        class="
          text-lg-h5 text-md-h6 text-sm-subtitles-2 text-subtitle-1
          font-weight-bold
        "
        v-if="keywordSearch"
      >
        ผลการค้นหา “{{ keywordSearch }}”
      </h2>
      <h2
        class="
          text-lg-h5 text-md-h6 text-sm-subtitles-2 text-subtitle-1
          font-weight-bold
        "
        v-else
      >
        สินค้าทั้งหมด
      </h2>
    </div>
    <div class="d-flex flex-row justify-space-between">
      <div v-if="keywordSearch" class="d-flex flex-row align-center">
        <span
          class="
            success--text
            mr-2
            text-lg-h6 text-md-subtitle-1 text-subtitle-2
          "
          >{{ countProduct }}</span
        ><span
          class="text-lg-body-1 text-lg-h6 text-md-subtitle-1 text-subtitle-2"
        >
          รายการ
        </span>
      </div>
      <div v-else class="d-flex flex-row align-center">
        <span
          class="
            success--text
            mr-2
            text-lg-body-1 text-lg-h6 text-md-subtitle-1 text-subtitle-2
          "
          >{{ countProduct }}</span
        ><span
          class="text-lg-body-1 text-lg-h6 text-md-subtitle-1 text-subtitle-2"
        >
          รายการ พบใน สินค้าทั้งหมด</span
        >
      </div>

      <div class="hidden-xs-only">
        <div class="d-flex flex-row justify-end align-center">
          <div>
            <span
              class="material-icons-round mr-1"
              :style="`${
                filterStatus === 'grid' ? `color:#469B5C;` : `color:#B5B5B5;`
              }cursor: pointer;font-size:${changeSizeScreen.icon}px;`"
              @click="handleClick('grid')"
            >
              grid_on
            </span>
            <span
              class="material-icons-round mr-xl-3 mr-lg-2 mr-md-1 mr-1"
              :style="`${
                filterStatus === 'list' ? `color:#469B5C;` : `color:#B5B5B5;`
              }cursor: pointer;font-size:${changeSizeScreen.icon}px;`"
              @click="handleClick('list')"
            >
              format_list_bulleted
            </span>
          </div>

          <div class="sortProduct">
            <v-select
              :items="sortProduct"
              label="เรียงตาม"
              color="success"
              item-color="success"
              dense
              item-text="name"
              @change="arrangementProduct"
              outlined
              :style="`font-size:${changeSizeScreen.fontArrangement}px;z-index: 1`"
            ></v-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['keywordSearch'],
  data: () => ({
    selectedArrangement: '' as string,
    countProduct: 0,
    filterStatus: 'grid',
    sortProduct: [
      { id: 1, name: 'ราคาต่ำสุด - ราคาสูงสุด', key: 'Unit_Price_Show%20asc' },
      { id: 2, name: 'ราคาสูงสุด - ราคาต่ำสุด', key: 'Unit_Price_Show%20desc' },
      { id: 3, name: 'ชื่อ ก-ฮ', key: 'Prod_Name%20asc' },
      { id: 4, name: 'ชื่อ ฮ-ก', key: 'Prod_Name%20desc' },
    ],
  }),
  created() {
    this.$root.$on('conuterFilterProduct', (counterProduct: number) => {
      this.countProduct = counterProduct
    })
  },
  computed: {
    changeSizeScreen(): object {
      const size = {
        icon: 24,
        fontArrangement: 15,
      }

      if (this.$vuetify.breakpoint.sm) {
        size.icon = 20
        size.fontArrangement = 12
      } else if (this.$vuetify.breakpoint.xs) {
        if (this.$vuetify.breakpoint.width < 360) {
          size.fontArrangement = 10
          size.icon = 12
        } else {
          size.icon = 16
          size.fontArrangement = 8
        }
      }
      return size
    },
  },
  methods: {
    arrangementProduct(key: string) {
      const getKey: any = this.sortProduct.find(
        (products: any) => products.name === key
      )
      this.$root.$emit('arrangementProduct', getKey.key)
    },
    handleClick(type: string) {
      this.filterStatus = type
      this.$root.$emit('filterStatus', this.filterStatus)
    },
  },
})
</script>
<style scoped>
@import url('~/assets/css/ProductFilter.css');
</style>
