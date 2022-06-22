<template>
  <div>
    <div v-if="keywordSearch" class="searching d-flex flex-column">
      <div class="searching-Rangeprice">
        <div class="d-flex flex-row justify-space-between">
          <span>ราคา</span>
          <span
            style="cursor: pointer"
            @click="changeReangePrice([0, 999]), (range = [0, 999])"
            >ล้างรายการ</span
          >
        </div>
        <div>
          <v-range-slider
            v-model="range"
            :max="max"
            :min="min"
            hide-details
            @change="changeReangePrice(range)"
            class="align-center success--text"
          >
          </v-range-slider>
        </div>
        <div class="d-flex flex-row justify-space-between">
          <span>฿{{ range[0] }}</span>
          <span>฿{{ range[1] }}</span>
        </div>
      </div>
    </div>
    <div v-else class="category">
      <div class="category-container">
        <p class="text-MenuProduct font-weight-bold">รายการสินค้า</p>
        <p
          class="text-ListMenuProduct"
          v-for="item in listProduct"
          :style="`${
            item.key === currenListProduct ? `color:#469b5c;` : `color:#000;`
          }cursor: pointer`"
          @click="getProductFromList(item.key)"
          :key="item.listName"
        >
          {{ item.listName }}
        </p>
      </div>
    </div>
    <div class="category mt-5">
      <div class="category-container">
        <p class="font-weight-bold text-MenuProduct">ประเภทสินค้า</p>
        <div v-if="loading">
          <v-row v-for="(item, index) in 3" :key="index">
            <v-col><v-skeleton-loader type="article"></v-skeleton-loader></v-col
          ></v-row>
        </div>

        <v-list v-else class="listGroupProduct">
          <v-list-group
            v-for="group in listGroupProduct"
            :key="group.productGroupId"
            no-action
            v-model="group.active"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title
                  v-text="group.productGroupName"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item>
              <v-checkbox
                v-model="listGroupID.groupsId"
                label="ทั้งหมด"
                :value="group.productGroupId"
                @click="
                  selectedProductFromGroup(
                    group.productGroupId,
                    group.productGroupName,
                    'all'
                  )
                "
              >
                ></v-checkbox
              >
            </v-list-item>
            <v-list-item
              v-for="subGroup in group.data"
              :key="subGroup.productSubGroupId"
            >
              <v-checkbox
                v-model="listGroupID.subGroupsId"
                :label="subGroup.productSubGroupName"
                :value="subGroup.productSubGroupId"
                @click="
                  selectedProductFromGroup(
                    group.productGroupId,
                    subGroup.productSubGroupId,
                    'Sub'
                  )
                "
              ></v-checkbox>
            </v-list-item>
          </v-list-group>
        </v-list>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { productGroup } from '~/api/Product/GetProductGroups'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'

export default Vue.extend({
  props: ['keywordSearch'],
  data: () => ({
    loading: true as boolean,
    min: 0,
    max: 999,
    range: [0, 999],
    currenListProduct: 'AllProduct' as string,
    listProduct: [
      { key: 'AllProduct', listName: 'สินค้าทั้งหมด' },
      { key: 'Favorites', listName: 'สินค้ารายการโปรด' },
      // { key: 'bestSeller', listName: 'สินค้าขายดี' },
      { key: 'Promotion', listName: 'สินค้าโปรโมชั่น' },
    ],
    listGroupProduct: [] as object[],
    checkSubGroup: false,
    listGroupID: {
      groupsId: [] as any,
      subGroupsId: [] as any,
    },
    selectedGroups: [] as number[],
    selectedSubGroups: [] as number[],
  }),

  methods: {
    getProductFromList(key: string) {
      this.currenListProduct = key
      this.$root.$emit('getProductFromList', this.currenListProduct)
    },
    changeReangePrice(range: object) {
      this.$root.$emit('rangePriceProduct', range)
    },
    selectedProductFromGroup(groupId: number, subGroupId: any, status: string) {
      const findGroups: any = this.listGroupProduct.find(
        (findGroups: any) => findGroups.productGroupId === groupId
      )
      if (status === 'all') {
        for (let i in findGroups.data) {
          const index_GroupsId = this.listGroupID.subGroupsId.indexOf(
            findGroups.data[i].productSubGroupId
          )
          this.listGroupID.subGroupsId.splice(index_GroupsId, 1)
        }

        const checkSubGroup: boolean[] = []
        for (let i in findGroups.data) {
          checkSubGroup.push(
            this.selectedSubGroups.includes(
              findGroups.data[i].productSubGroupId
            )
          )
        }
        const allDataNotFounds = checkSubGroup.filter(
          (isFind: boolean) => isFind === false
        )

        if (allDataNotFounds.length === findGroups.data.length) {
          for (let i in findGroups.data) {
            if (
              !this.selectedSubGroups.includes(
                findGroups.data[i].productSubGroupId
              )
            ) {
              this.selectedSubGroups.push(findGroups.data[i].productSubGroupId)
            }
          }
        } else if (
          allDataNotFounds.length < findGroups.data.length &&
          allDataNotFounds.length > 0
        ) {
          for (let i in findGroups.data) {
            if (
              !this.selectedSubGroups.includes(
                findGroups.data[i].productSubGroupId
              )
            ) {
              this.selectedSubGroups.push(findGroups.data[i].productSubGroupId)
            }
          }
        } else {
          for (let i in findGroups.data) {
            const index_GroupsId = this.selectedSubGroups.indexOf(
              findGroups.data[i].productSubGroupId
            )
            this.selectedSubGroups.splice(index_GroupsId, 1)
          }
        }
      } else {
        const index_GroupsId = this.listGroupID.groupsId.indexOf(groupId)
        this.listGroupID.groupsId.splice(index_GroupsId, 1)

        if (this.selectedSubGroups.includes(subGroupId)) {
          const checkSubGroup: boolean[] = []
          for (let i in findGroups.data) {
            checkSubGroup.push(
              this.selectedSubGroups.includes(
                findGroups.data[i].productSubGroupId
              )
            )
          }
          const allDataFounds = checkSubGroup.filter(
            (isFind: boolean) => isFind === true
          )
          if (allDataFounds.length === findGroups.data.length) {
            for (let i in findGroups.data) {
              const index_GroupsId = this.selectedSubGroups.indexOf(
                findGroups.data[i].productSubGroupId
              )
              this.selectedSubGroups.splice(index_GroupsId, 1)
            }
            this.selectedSubGroups.push(subGroupId)
          } else {
            const index_GroupsId = this.selectedSubGroups.indexOf(subGroupId)
            this.selectedSubGroups.splice(index_GroupsId, 1)
          }
        } else {
          this.selectedSubGroups.push(subGroupId)
        }
      }
      if (this.keywordSearch) {
        if (typeof subGroupId === 'string') {
          this.$router.push({
            path: '/product',
            query: { group: `${groupId}` },
          })
        } else {
          this.$router.push({
            path: '/product',
            query: { group: `${groupId}`, subGroup: `${subGroupId}` },
          })
        }
      } else {
        this.$root.$emit('getProductFromGroup', {
          groupId: this.selectedGroups,
          subGroupId: this.selectedSubGroups,
        })
      }
    },
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search)
    const groupId: any = urlParams.get('group')
    const subGroupId: any = urlParams.get('subGroup')

    if (groupId) {
      this.listGroupID.groupsId.push(parseInt(groupId))
      this.selectedGroups.push(parseInt(groupId))
    }
    if (subGroupId) {
      this.listGroupID.subGroupsId.push(subGroupId)
      this.selectedSubGroups.push(subGroupId)
    }
    productGroup
      .getProductAllGroup(this.auth.globalCode, this.auth.channelName)
      .then((response) => {
        this.loading = false
        this.listGroupProduct = response.map((i: any) => {
          return {
            ...i,
            active: i.productGroupId === parseInt(groupId) ? true : false,
          }
        })
      })
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
<style scoped>
@import url('~/assets/css/Categoryproduct.css');
</style>
