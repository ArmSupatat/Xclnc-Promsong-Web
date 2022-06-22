<template>
  <div>
    <Topbar />
    <MenuListOther />
    <v-container class="container-wrapper">
      <div class="SubNav-wrapper">
        <div class="py-5 hidden-xs-only">
          <a href="/" class="make--text">หน้าหลัก</a
          ><span class="mx-3 make--text">/</span
          ><a href="#" class="secondary--text">รายการโปรด</a>
        </div>
        <div class="SubNav">
          <Profile />
          <MenuList />
        </div>
      </div>
      <div class="content">
        <div class="container">
          <h2 class="mb-4">รายการโปรด</h2>
          <div class="flex d-flex flex-sm-row flex-column">
            <div class="flex mb-4 mb-sm-0">
              <div
                v-for="(favGroup, index) in favGroupList"
                :key="index"
                :class="`filter-button ${
                  selectedGroupList[index] ? 'active' : ''
                }`"
                @click="selectedFavoriteGroup(index)"
              >
                {{ favGroup.prodChkStkTypName }}
              </div>
            </div>
            <div v-if="toggleMenu" class="d-flex justify-end">
              <img
                src="~/assets/img/filter-list.svg"
                class="pr-4 cursor-pointer"
              />
              <AddProduct />
            </div>
            <div class="d-flex justify-end" v-else>
              <img
                src="~/assets/img/filter-list.svg"
                class="pr-4 cursor-pointer"
              />
              <ManageProduct
                :prodChkStkTypId="prodChkStkTypId"
                :prodChkStkTypName="prodChkStkTypName"
              />
            </div>
          </div>
          <div class="mt-8">
            <FavoriteProduct
              v-for="favorite in listFavorite"
              :key="favorite.id"
              :favorite="favorite"
              :prodChkStkTypId="prodChkStkTypId"
            />
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import OrderCard from '~/components/layout/OrderCard.vue'
import Topbar from '~/components/Topbar.vue'
import MenuList from '~/components/layout/MenuList.vue'
import Profile from '~/components/layout/Profile.vue'
import AddProduct from '~/components/layout/AddProductGroup.vue'
import ManageProduct from '~/components/layout/ManageProductGroup.vue'
import MenuListOther from '~/components/layout/MenuListOther.vue'
import { listFavoriteOrderGroup } from '~/api/Favorite/ListFavoriteOrderGroup'
import { listFavoriteOrder } from '~/api/Favorite/ListFavoriteOrder'
import {
  ListFavoriteOrderGroupInput,
  ListFavoriteOrderInput,
} from '~/types/ListFavoriteOrderInput'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'

export default Vue.extend({
  components: {
    OrderCard,
    MenuList,
    Profile,
    Topbar,
    AddProduct,
    MenuListOther,
    ManageProduct,
  },
  data() {
    return {
      listFavorite: [] as any[],
      initFavGroup: {
        prodChkStkTypId: null,
        prodChkStkTypCode: '000',
        prodChkStkTypName: 'ทั้งหมด',
        prodChkStkTypNameEn: null,
        remark: null,
        activeTypName: 'Y  ใช้งาน',
        apvFlag: 'Y',
      } as any,
      favGroupList: [] as any[],
      selectedGroupList: [] as boolean[],
      toggleMenu: true as boolean,
      prodChkStkTypId: null as number | null,
      prodChkStkTypName: '' as string,
    }
  },
  mounted() {
    this.initialValue()
  },
  methods: {
    selectedFavoriteGroup(index: number) {
      this.selectedGroupList = this.selectedGroupList.map((_, i) => {
        return i === index
      })
      this.toggleMenuFunc()
      this.prodChkStkTypId = this.favGroupList[index].prodChkStkTypId
      this.prodChkStkTypName = this.favGroupList[index].prodChkStkTypName
      this.getListFavoriteOrder()
    },
    toggleMenuFunc() {
      this.toggleMenu = this.selectedGroupList.some(
        (each, i) => i === 0 && each
      )
    },
    initialValue() {
      this.getListFavoriteOrderGroup()
      this.getListFavoriteOrder()
      this.$root.$on('getListFavoriteOrderGroup', () => {
        this.getListFavoriteOrderGroup()
        this.prodChkStkTypId = null
        this.getListFavoriteOrder()
      })
    },
    async getListFavoriteOrder() {
      const listFavoriteOrderReq: ListFavoriteOrderInput = {
        prodChkStkTypId: this.prodChkStkTypId,
        filter: {
          pagingFrom: 0,
          pagingTo: 10000,
          search: '',
        },
      }
      const listFavoriteOrderRes = await listFavoriteOrder.listFavoriteOrder(
        listFavoriteOrderReq,
        this.auth.globalCode,
        this.auth.channelName
      )
      const { mmbProdPropertyResponse } = listFavoriteOrderRes
        ? listFavoriteOrderRes?.data
        : null
      this.listFavorite = mmbProdPropertyResponse
    },
    async getListFavoriteOrderGroup() {
      const listFavoriteOrderGroupReq: ListFavoriteOrderGroupInput = {
        filter: {
          pagingFrom: 0,
          pagingTo: 1000,
          search: '',
          barcode: '',
        },
      }
      const listFavoriteOrderRes =
        await listFavoriteOrderGroup.listFavoriteOrderGroup(
          listFavoriteOrderGroupReq,
          this.auth.globalCode,
          this.auth.channelName
        )
      const { data } = listFavoriteOrderRes
      this.favGroupList = []
      this.favGroupList.push(this.initFavGroup)
      data.uspMProdChkStkTyp.forEach((each: any) => {
        this.favGroupList.push(each)
      })
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
  watch: {
    favGroupList() {
      this.selectedGroupList = new Array(this.favGroupList.length).fill(false)
      this.selectedGroupList[0] = true
      this.toggleMenuFunc()
    },
  },
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';

.container-wrapper {
  display: flex;
  .SubNav {
    padding-right: 2rem;
    justify-content: space-between;
  }
  .content {
    flex: 3;
    margin-top: 4rem;
    .container {
      border: 1px solid lightgray;
      padding: 2rem;
    }
    .filter-button {
      border: 2px solid gainsboro;
      background-color: rgba(33, 33, 33, 0.08);
      color: #000;
      border-radius: 5rem;
      cursor: pointer;
      padding: 0 10px;
      margin-right: 1rem;
      display: flex;
      align-items: center;
      &:hover {
        background-color: rgba(127, 198, 0, 0.07);
        border: 2px solid #469b5c;
      }
    }
    .filter-button.active {
      background-color: rgba(127, 198, 0, 0.07);
      border: 2px solid #469b5c;
    }
  }
}

@media (max-width: 1200px) {
  .container-wrapper {
    display: flex;
    flex-direction: column;
    padding: 12px 1.5rem !important;
    .SubNav {
      padding-right: 0;
      display: flex;
    }
    .content {
      margin-top: 1rem !important;
    }
  }
}

@media (max-width: 600px) {
  .SubNav {
    display: none !important;
  }
  .content {
    margin-top: 4rem;
    .container {
      border: 1px solid lightgray;
      padding: 1rem !important;
    }
  }
}
</style>
