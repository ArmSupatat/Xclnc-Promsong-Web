<template>
  <v-app>
    <Topbar :checkLogin="true" />
    <Navigationdrawers class="hidden-sm-and-up" />
    <v-container class="d-flex flex-column h-full">
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">รถเข็น (4)</a>
      </div>
      <v-row dense>
        <v-col xs="12" sm="12" lg="8">
          <div class="d-flex justify-space-between">
            <h2>รถเข็น (4)</h2>
            <a @click="deleteAll" v-if="listCart.length > 0">
              <v-card
                outlined
                height="100%"
                class="d-flex align-center pa-1 pa-lg-3 pa-md-2 pa-sm-2 flex-row"
              >
                <div class="d-flex flex-row">
                  <img src="/images/trash.svg" />
                  <p class="my-0">ลบทั้งหมด</p>
                </div>
              </v-card>
            </a>
          </div>
        </v-col>
      </v-row>
      <v-row dense class="d-flex flex-column flex-sm-row">
        <v-col lg="8">
          <Cart
            @qty="qty"
            @deleteCartItem="deleteCartItem"
            v-for="(cart, i) in mockListCart"
            :key="cart.productId"
            :cart="cart"
            :index="i"
          />
        </v-col>
        <v-col lg="4">
          <SummaryOrder
            :sumPoBeforeDiscAmt="sumPoDiscAmt"
            :sumPoDiscAmt="0"
            :vatAmt="vatAmt"
            :discAmt="0"
            :poAmt="poAmt"
            :apAdvNoInvBfAmt="apAdvNoInvBfAmt"
            :genQrAmt="genQrAmt"
            :btnName="`ไปขั้นตอนการชำระเงิน`"
            :linkPage="genQrAmt > 0 ? '/payment' : '/'"
            @submitPayment="goToPayment"
        /></v-col>
      </v-row>
      <!-- <v-row dense v-else>
        <v-col class="pa-8 text-center">
          <nuxt-link class="product" to="/product">กรุณาเลือกสินค้า</nuxt-link>
        </v-col>
      </v-row> -->
    </v-container>
    <Footer />
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import Cart from '~/components/Cart.vue'
import SummaryOrder from '~/components/SummaryOrder.vue'
import { mapState } from 'vuex'
import { cmdGrp3PO } from '~/api/Order/Command29101Group3'
import { groupBusiness } from '~/api/Authenticate/CommandGroupBusiness'
import { cmdPO } from '~/api/Order/CommandPurchaseOrder'
import { AuthModel } from '~/types/AuthModel'
import {
  CommandPurchaseTPoProd,
  CommandPurchaseTPurOrd,
} from '~/types/CommandPurchaseOrderInput'
import { getLookUpSupId } from '~/api/LookUp/GetLookUpSupId'

export default Vue.extend({
  components: {
    Topbar,
    Cart,
    SummaryOrder,
  },
  // middleware: 'authenticated',
  data() {
    return {
      sumPoBeforeDiscAmt: 0 as number,
      sumPoDiscAmt: 0 as number,
      discAmt: 0 as number,
      vatAmt: 0 as number,
      poAmt: 0 as number,
      advPoPct: 0 as number,
      advPoAmt: 0 as number,
      apAdvNoInvBfAmt: 0 as number,
      genQrAmt: 0 as number,
      mockListCart: [
        {
          productId: 1,
          productName: 'เนื้อหมู',
          uomCode: 'กิโลกรัม',
          salePrice: 130,
          stepQty: 2,
          productImageFilePath: [
            'https://i0.wp.com/www.freshfoodsbkk.com/wp-content/uploads/2017/08/Pork-Fillet.jpg?fit=500%2C500&ssl=1',
          ],
        },
        {
          productId: 2,
          productName: 'น้ำมัน',
          uomCode: 'ขวด',
          salePrice: 139,
          stepQty: 4,
          productImageFilePath: [
            'https://backend.tops.co.th/media/catalog/product/8/8/8850210000046_1.jpg',
          ],
        },
        {
          productId: 3,
          productName: 'ซอสปรุงรสฝาเขียว',
          uomCode: 'ขวด',
          salePrice: 37,
          stepQty: 2,
          productImageFilePath: [
            'https://www.goldenmountainsauce.com/uploads/articles_icon/1499139449.jpg',
          ],
        },
        {
          productId: 4,
          productName: 'เนื้อไก่',
          uomCode: 'กิโลกรัม',
          salePrice: 90,
          stepQty: 3,
          productImageFilePath: [
            'https://cf.shopee.co.th/file/c1e92fbbfcd0ad5e488e0c76db1844f3',
          ],
        },
      ] as any[],
    }
  },
  created() {
    this.calculatePrice()
  },
  methods: {
    qty(qty: any) {
      this.$store.commit('cartStore/updateStepQty', qty)
      this.calculatePrice()
    },
    calculatePrice() {
      this.calculateSumPoBeforeDiscAmt()
      this.calculateSumPoDiscAmt()
      this.calculatePoAmt()
      this.calculateGenQrAmt()
    },
    calculateSumPoBeforeDiscAmt() {
      this.sumPoBeforeDiscAmt = this.listCart.reduce(
        (previosValue: any, currentValue: any) => {
          return previosValue + currentValue.stepQty * currentValue.salePrice
        },
        0
      )
    },
    calculateSumPoDiscAmt() {
      this.sumPoDiscAmt = this.listCart.reduce(
        (previosValue: any, currentValue: any) => {
          return currentValue.specialPrice > 0
            ? previosValue + currentValue.stepQty * currentValue.specialPrice
            : previosValue + currentValue.stepQty * currentValue.salePrice
        },
        0
      )
    },
    calculatePoAmt() {
      this.poAmt = this.sumPoDiscAmt
    },
    calculateGenQrAmt() {
      this.genQrAmt = this.poAmt
    },
    deleteCartItem(i: number) {
      this.$store.commit('cartStore/removeCartByIndex', i)
    },
    deleteAll() {
      this.$store.commit('cartStore/clearCart')
    },
    async goToPayment() {
      const loader = this.$loading.show()
      try {
        const lookupSupIdRes = await getLookUpSupId.getLookUpSupId(
          0,
          this.auth.globalCode,
          this.auth.channelName
        )
        const supplier =
          lookupSupIdRes &&
          lookupSupIdRes.data &&
          lookupSupIdRes.data.length > 0
            ? lookupSupIdRes.data[0]
            : null
        if (supplier) {
          const tPoProdList: CommandPurchaseTPoProd[] = []
          // let sumQty = 0
          let sumPOAmt = 0
          this.listCart.forEach((cart: any, i: number) => {
            const salePrice = Number(cart.salePrice)
            const poAmt = Number(cart.salePrice * cart.stepQty)
            const pricePoQty = Number(cart.stepQty)
            const labelPrice = Number(cart.labelPrice)
            const tPoProd: CommandPurchaseTPoProd = {
              prodId: cart.productId,
              supProdName: cart.productName,
              supUomId: cart.uomId,
              priceUomId: cart.uomId,
              poQty: cart.stepQty,
              prodName: cart.productName,
              poItem: i + 1,
              unitPrice: salePrice,
              poAmt: poAmt,
              pricePoQty: pricePoQty,
              labelPrice: labelPrice,
            }
            sumPOAmt += poAmt
            tPoProdList.push(tPoProd)
          })
          const tPurOrdInput: CommandPurchaseTPurOrd = {
            supId: supplier.supId,
            poDate: this.$moment(new Date())
              .locale('th')
              .format('YYYY-MM-DDTHH:mm:ss.SSS'),
            supBillName: supplier.supName,
            supBillAddr: supplier.shipAddr,
            comId: this.auth.comId,
            depId: this.auth.depId,
            cfmTyp: 'N',
            sumPoAmt: Number(sumPOAmt),
            tPoProd: tPoProdList,
          }
          const tPurOrdList: CommandPurchaseTPurOrd[] = []
          tPurOrdList.push(tPurOrdInput)
          const response = await cmdPO.commandPurchaseOrder(
            {
              tPurOrd: tPurOrdList,
            },
            this.auth.globalCode,
            this.auth.channelName
          )
          const { data } = response
          if (data && data.alert && data.alert.length > 0) {
            const alert = data.alert[0]
            if (alert.alertApiCode === '200' && alert.alertId < 0) {
              this.$store.commit(
                'cartStore/savePurchaseOrderId',
                data.tPurOrd[0].poId
              )
              this.$router.push('/payment')
            } else {
              console.log(alert.alertDisplay)
            }
          } else {
            console.log('บันทึกล้มเหลว')
          }
        }
        loader.hide()
      } catch (err) {
        console.log(err)
        loader.hide()
      }
    },
  },
  watch: {
    listCart() {
      this.calculatePrice()
    },
  },
  computed: {
    ...mapState({
      listCart: (state: any) => state.cartStore.cart,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style lang="scss" scoped>
.h-full {
  height: 100% !important;
}
.product {
  &:hover {
    text-decoration: underline !important;
  }
}
</style>
