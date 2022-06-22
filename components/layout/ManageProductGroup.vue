<template>
  <div class="d-flex">
    <button @click="$modal.show('editFavGroup')" class="change-store-botton">
      <div class="icon-add" />
      แก้ไขกลุ่ม
    </button>
    <button
      @click="$modal.show('selectProductstoGroup')"
      class="change-store-botton ml-2"
    >
      <div class="icon-add" />
      เลือกสินค้าเข้ากลุ่ม
    </button>
    <client-only>
      <modal
        name="editFavGroup"
        :adaptive="true"
        width="400px"
        height="236px"
        @closed="$modal.hide('change-store')"
      >
        <div
          class="pa-xs-8 pa-sm-8 pa-lg-8 pa-4"
          style="overflow: auto; height: 100%"
        >
          <h2 class="mb-4">แก้ไขกลุ่ม</h2>
          <v-text-field
            outlined
            class="rounded-lg"
            label="ชื่อกลุ่ม"
            v-model="prodChkStkTypName"
          ></v-text-field>
          <div class="mt-3 flex justify-space-between">
            <div>
              <button @click="deleteFavGroup" class="change-store-botton">
                ลบกลุ่ม
              </button>
            </div>
            <div class="d-flex">
              <button
                @click="$modal.hide('editFavGroup')"
                class="change-store-botton"
              >
                ยกเลิก
              </button>
              <button
                @click="editFavProductGroup"
                class="change-store-botton ml-4"
              >
                <span>ตกลง</span>
              </button>
            </div>
          </div>
        </div>
      </modal>
      <modal
        name="chooseProductFavGroup"
        :adaptive="true"
        width="350px"
        height="236px"
        @closed="$modal.hide('change-store')"
      >
        <div
          class="pa-xs-8 pa-sm-8 pa-lg-8 pa-4"
          style="overflow: auto; height: 100%"
        >
          <h2 class="mb-4">สร้างกลุ่ม</h2>
          <v-text-field
            outlined
            class="rounded-lg"
            label="ชื่อกลุ่ม"
          ></v-text-field>
          <div class="mt-3 flex flex-end">
            <button
              @click="$modal.hide('change-store')"
              class="change-store-botton"
            >
              ยกเลิก
            </button>
            <button @click="deleteFavGroup" class="change-store-botton ml-4">
              <span>ตกลง</span>
            </button>
          </div>
        </div>
      </modal>
      <modal
        name="selectProductstoGroup"
        :adaptive="true"
        width="50%"
        height="70%"
        @closed="$modal.hide('selectProductstoGroup')"
      >
        <div class="pa-xs-8 pa-sm-8 pa-lg-8 pa-4" style="height: 100%">
          <h2 class="mb-4">เลือกสินค้าเข้ากลุ่ม</h2>
          <div id="search" class="search d-flex">
            <div
              class="
                container-search-input
                d-flex
                flex-row
                align-center
                w-full
                mb-4
              "
            >
              <span class="material-icons" style="color: #469b5c">search</span>
              <v-text-field
                class="ml-2"
                v-model="keywordSearch"
                @keyup="getListFavGroupProduct"
                label="ค้นหาสินค้า"
              ></v-text-field>
            </div>
            <img class="pl-2 pb-4" src="~/assets/img/barcode-switch.svg" />
          </div>
          <div v-if="!loading" class="fav-prod-group-wrapper d-flex flex-wrap">
            <ListFavProductToGroup
              v-for="item in listFavGroupProduct"
              :favGroupProduct="item"
              :key="item.prodId"
              @addFavGroupProduct="addFavGroupProduct"
              @deleteFavGroupProduct="deleteFavGroupProduct"
            />
          </div>
          <div class="loader-wrapper d-flex align-center justify-center" v-else>
            <div class="loader"></div>
          </div>
          <div class="mt-3 flex flex-end">
            <button
              @click="$modal.hide('selectProductstoGroup')"
              class="change-store-botton"
            >
              ยกเลิก
            </button>
            <button
              @click="confirmProductsToGroup"
              class="change-store-botton ml-4"
            >
              <span>ตกลง</span>
            </button>
          </div>
        </div>
      </modal>
    </client-only>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { cmd304101Grp3 } from '~/api/Favorite/​Cmd304101Grp3'
import { cmdOrderFavorite } from '~/api/Favorite/CmdOrderFavorite'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import {
  CmdOrderFavoriteInput,
  ProdChkStkTyp,
  ProdChkStkTypDelete,
} from '~/types/CmdOrderFavoriteInput'
import { x304101ProdName } from '~/api/Favorite/X304101ProdName'
import { x118101InsMMBProdProperty } from '~/api/Favorite/X118101InsMMBProdProperty'

export default Vue.extend({
  props: {
    prodChkStkTypId: Number,
    prodChkStkTypName: String,
  },
  data() {
    return {
      listFavGroupProduct: [] as any,
      listAddFavGroupProduct: [] as any,
      listDeleteFavGroupProduct: [] as any,
      keywordSearch: '',
      loading: true,
    }
  },
  async mounted() {
    await this.getListFavGroupProduct()
  },
  methods: {
    async confirmProductsToGroup() {
      const loader = this.$loading.show()
      const mmbProdProperty_Request = this.listAddFavGroupProduct.map(
        (addFavGroupProduct: any) => {
          return {
            comId: this.auth.comId,
            prodBarcodeId: addFavGroupProduct.prodBarcodeId,
            prodClassId: addFavGroupProduct.prodClassId,
            prodId: addFavGroupProduct.prodId,
            uomId: addFavGroupProduct.uomId,
            prodChkStkTypId: this.prodChkStkTypId,
          }
        }
      )
      await x118101InsMMBProdProperty.x118101InsMMBProdProperty(
        {
          mmbProdProperty_Request,
        },
        this.auth.globalCode,
        this.auth.channelName
      )
      this.$root.$emit('getListFavoriteOrderGroup')
      console.log('this.listAddFavGroupProduct', this.listAddFavGroupProduct)
      this.$modal.hide('selectProductstoGroup')
      loader.hide()
    },
    async addFavGroupProduct(favorite: any) {
      this.listAddFavGroupProduct.push(favorite)
    },
    async deleteFavGroupProduct(favorite: any) {
      this.listDeleteFavGroupProduct.push(favorite)
    },
    async editFavProductGroup() {
      const loader = this.$loading.show()
      try {
        const cmd304101Grp3Res = await cmd304101Grp3.cmd304101Grp3(
          0,
          {
            prodChkStkTypId: this.prodChkStkTypId,
          },
          this.auth.globalCode,
          this.auth.channelName
        )
        const { data } = cmd304101Grp3Res
        if (data) {
          const { mProdChkStkTyp } = data
          if (mProdChkStkTyp) {
            const mProdChkStkTypReq: ProdChkStkTyp = {
              prodChkStkTypId: mProdChkStkTyp.prodChkStkTypId,
              prodChkStkTypCode: mProdChkStkTyp.prodChkStkTypCode,
              prodChkStkTypNameEn: mProdChkStkTyp.prodChkStkTypNameEn,
              prodChkStkTypName: this.prodChkStkTypName,
              activeTyp: mProdChkStkTyp.activeTyp,
              apvFlag: mProdChkStkTyp.apvFlag,
              remark: mProdChkStkTyp.remark,
              comId: mProdChkStkTyp.comId,
              depId: mProdChkStkTyp.depId,
              cObjId: mProdChkStkTyp.cObjId,
            }
            const mProdChkStkTypList: ProdChkStkTyp[] = []
            mProdChkStkTypList.push(mProdChkStkTypReq)
            const cmdOrderFavoriteReq: CmdOrderFavoriteInput = {
              mProdChkStkTyp: mProdChkStkTypList,
            }
            await cmdOrderFavorite.cmdOrderFavorite(
              cmdOrderFavoriteReq,
              this.auth.globalCode,
              this.auth.channelName
            )
            this.$root.$emit('getListFavoriteOrderGroup')
          }
        }
        loader.hide()
        this.$modal.hide('chooseProductFavGroup')
      } catch (err) {
        console.log(err)
        loader.hide()
      }
    },
    async deleteFavGroup() {
      const loader = this.$loading.show()
      try {
        const cmd304101Grp3Res = await cmd304101Grp3.cmd304101Grp3(
          0,
          {
            prodChkStkTypId: this.prodChkStkTypId,
          },
          this.auth.globalCode,
          this.auth.channelName
        )
        const { data } = cmd304101Grp3Res
        if (data) {
          const { mProdChkStkTyp } = data
          if (mProdChkStkTyp) {
            const mProdChkStkTypDeleteReq: ProdChkStkTypDelete = {
              prodChkStkTypId: this.prodChkStkTypId,
            }
            const mProdChkStkTypDeleteList: ProdChkStkTypDelete[] = []
            mProdChkStkTypDeleteList.push(mProdChkStkTypDeleteReq)
            const cmdOrderFavoriteReq: CmdOrderFavoriteInput = {
              mProdChkStkTypDelete: mProdChkStkTypDeleteList,
            }
            await cmdOrderFavorite.cmdOrderFavorite(
              cmdOrderFavoriteReq,
              this.auth.globalCode,
              this.auth.channelName
            )
            this.$root.$emit('getListFavoriteOrderGroup')
          }
        }
        loader.hide()
        this.$modal.hide('chooseProductFavGroup')
      } catch (err) {
        console.log(err)
        loader.hide()
      }
    },
    async getListFavGroupProduct() {
      this.loading = true
      const favGroupProductResponse = await x304101ProdName.x304101ProdName(
        {
          comId: this.auth.comId,
          prodName: this.keywordSearch,
          filter: {
            pagingFrom: 0,
            pagingTo: 100,
          },
        },
        this.auth.globalCode,
        this.auth.channelName
      )
      this.listFavGroupProduct =
        favGroupProductResponse && favGroupProductResponse.data
          ? favGroupProductResponse.data
          : []
      this.listFavGroupProduct = this.listFavGroupProduct.map((each: any) => {
        return {
          ...each,
          active: false,
        }
      })
      this.loading = false
    },
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';
.search {
  height: 48px;
}
.fav-prod-group-wrapper {
  overflow-y: auto;
  align-content: start;
  height: calc(100% - 48px - 36px - 48px);
}

.change-store-botton {
  border: 2px solid gainsboro;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
}

.icon-add {
  background-image: url(../../assets/img/add.svg);
  width: 20px;
  height: 25px;
  background-position: center;
}
.loader-wrapper {
  height: calc(100% - 48px - 36px - 48px);
}
.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
