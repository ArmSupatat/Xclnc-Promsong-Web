<template>
  <div class="Navigation">
    <v-app-bar color="success accent-4" dark prominent>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon @click="handleClick('grid')">
        <v-icon class="material-icons-round">grid_on</v-icon>
      </v-btn>
      <v-btn icon @click="handleClick('list')">
        <v-icon class="material-icons-round">format_list_bulleted </v-icon>
      </v-btn>
      {{ selectedArrangement }}
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </div>
        </template>
        <v-list dense>
          <v-list-item-group color="success">
            <v-list-item
              v-for="item in sortProduct"
              :key="item.key"
              @click="arrangementProduct(item.key)"
            >
              <v-list-item-title color="success" :value="item.key">{{
                item.name
              }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list>
        <div
          v-if="keywordSearch"
          class="d-flex align-center flex-row justify-center"
        >
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
        <div v-else>
          <v-list-group v-for="item in listMenus" :key="item.title" no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="child in item.items" :key="child.title">
              <p
                v-text="child.listName"
                class="listName-Menu"
                @click="getProductFromList(child.key)"
                :style="`${
                  child.key === currenListProduct
                    ? `color:#469b5c;`
                    : `color:#5C5B5A;`
                }cursor: pointer`"
              ></p>
            </v-list-item>
          </v-list-group>
        </div>

        <v-list-group no-action class="listCategoryProduct">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                v-text="listCategoryProduct.title"
              ></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-group
            sub-group
            v-for="group in listCategoryProduct.items"
            :key="group.productGroupName"
            :value="group.active"
            no-action
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
        </v-list-group>

        <v-list-group no-action class="listBrands">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="listBrands.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <div v-for="item in listBrands.items" :key="item.brandId">
            <v-checkbox
              v-model="listSelectedBrand"
              :label="item.brandName"
              :value="item.brandId"
              @click="selectedBrands"
            >
            </v-checkbox>
          </div>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { productGroup } from '~/api/Product/GetProductGroups'
import { getBrands } from '~/api/Product/GetBrandProduct'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'

export default Vue.extend({
  props: ['keywordSearch'],
  data: () => ({
    min: 0,
    max: 999,
    range: [0, 999],
    drawer: false,
    currenListProduct: '' as string,
    selectedArrangement: '' as string,
    listMenus: [
      {
        active: false,
        items: [
          { key: 'AllProduct', listName: 'สินค้าทั้งหมด' },
          { key: 'Favorites', listName: 'สินค้ารายการโปรด' },
          { key: 'Promotion', listName: 'สินค้าโปรโมชั่น' },
        ],
        title: 'รายการสินค้า',
      },
    ],
    listCategoryProduct: {
      active: false,
      items: [],
      title: 'ประเภทสินค้า',
    },

    listBrands: {
      active: false,
      items: [],
      title: 'แบรนด์',
    },
    listGroupID: {
      groupsId: [] as any,
      subGroupsId: [] as any,
    },
    selectedGroups: [] as number[],
    selectedSubGroups: [] as number[],
    listSelectedBrand: [] as number[],
    sortProduct: [
      { id: 1, name: 'สินค้าใหม่ล่าสุด', key: '1' },
      { id: 2, name: 'ราคาต่ำสุด - สูงสุด', key: 'Sale_Price%20asc' },
      { id: 3, name: 'สูงสุด - ราคาต่ำสุด', key: 'Sale_Price%20desc' },
      { id: 4, name: 'ชื่อ', key: 'Prod_Name%20asc' },
    ],
  }),
  methods: {
    getProductFromList(key: string) {
      this.currenListProduct = key
      this.$root.$emit('getProductFromList', this.currenListProduct)
    },
    changeReangePrice(range: object) {
      this.$root.$emit('rangePriceProduct', range)
    },
    handleClick(type: string) {
      this.$root.$emit('filterStatus', type)
    },
    arrangementProduct(key: string) {
      this.$root.$emit('arrangementProduct', key)
    },
    selectedProductFromGroup(groupId: number, subGroupId: any, status: string) {
      const findGroups: any = this.listCategoryProduct.items.find(
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

    selectedBrands() {
      this.$root.$emit('selectedProductFromBrand', this.listSelectedBrand)
    },
    async getAllGroups(groupId: string) {
      await productGroup
        .getProductAllGroup(this.auth.globalCode, this.auth.channelName)
        .then((response) => {
          this.listCategoryProduct.items = response
            ? response.map((i: any) => {
                return {
                  ...i,
                  active: i.productGroupId === parseInt(groupId) ? true : false,
                }
              })
            : []
        })
    },
    async getAllBrands() {
      await getBrands
        .getBrandsProduct(this.auth.globalCode, this.auth.channelName)
        .then((response) => {
          this.listBrands.items = response
        })
    },
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search)
    const groupId: any = urlParams.get('group')
    const subGroupId = urlParams.get('subGroup')

    if (groupId) {
      this.listGroupID.groupsId.push(parseInt(groupId))
    }
    if (subGroupId) {
      this.listGroupID.subGroupsId.push(subGroupId)
    }
    this.getAllGroups(groupId)
    this.getAllBrands()
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>
<style scoped>
@import url('~/assets/css/NavigationDrewers.css');
</style>
