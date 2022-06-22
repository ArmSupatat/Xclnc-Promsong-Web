<template>
  <div>
    <button @click="$modal.show('change-store')" class="change-store-botton">
      <div class="icon-add" />
      สร้างกลุ่มสินค้า
    </button>
    <client-only>
      <modal
        name="change-store"
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
            v-model="prodChkStkTypName"
          ></v-text-field>
          <div class="mt-3 flex flex-end">
            <button
              @click="$modal.hide('change-store')"
              class="change-store-botton"
            >
              ยกเลิก
            </button>
            <button
              @click="addFavProductGroup"
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
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import { cmdOrderFavorite } from '~/api/Favorite/CmdOrderFavorite'
import { cmd304101Grp3 } from '~/api/Favorite/​Cmd304101Grp3'
import {
  CmdOrderFavoriteInput,
  ProdChkStkTyp,
} from '~/types/CmdOrderFavoriteInput'

export default Vue.extend({
  data() {
    return {
      prodChkStkTypName: '' as string,
    }
  },
  methods: {
    async addFavProductGroup() {
      const loader = this.$loading.show()
      try {
        const cmd304101Grp3Res = await cmd304101Grp3.cmd304101Grp3(
          0,
          {
            prodChkStkTypId: 0,
          },
          this.auth.globalCode,
          this.auth.channelName
        )
        const { data } = cmd304101Grp3Res
        if (data) {
          const { mProdChkStkTyp } = data
          if (mProdChkStkTyp) {
            const mProdChkStkTypReq: ProdChkStkTyp = {
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
        this.$modal.hide('change-store')
      } catch (err) {
        console.log(err)
        loader.hide()
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

<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';

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
</style>
