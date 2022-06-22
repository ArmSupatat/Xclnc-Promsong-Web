<template>
  <div>
    <Topbar />
    <v-container class="container-wrapper">
      <div class="SubNav-wrapper">
        <div class="py-5 hidden-xs-only">
          <a href="/" class="make--text">หน้าหลัก</a
          ><span class="mx-3 make--text">/</span
          ><a href="#" class="make--text">ตั้งค่า</a
          ><span class="mx-3 make--text">/</span
          ><a href="#" class="secondary--text">แก้ไขข้อมูลส่วนตัว</a>
        </div>
        <div class="SubNav">
          <Profile />
          <MenuList />
        </div>
      </div>
      <div class="content">
        <div class="order">
          <OrderCard
            v-if="order"
            :poId="order.poId"
            :poNo="order.poNo"
            :poDispTypIdx="order.poDispTypIdx"
            :poDispTypIdxName="order.poDispTypIdxName"
            :orderDate="order.poDate"
            :orderTime="order.poDate"
            :reqDate="order.reqDate"
            :reqTime="order.reqDate"
            :poProdCount="order.poProdCount"
            :poAmt="order.poAmt"
            :isShowDetail="false"
          />
          <OrderDetail :tPurOrdGrp3="tPurOrdGrp3" :tPurOrdCal="tPurOrdCal" />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import OrderCard from '~/components/layout/OrderCard.vue'
import OrderDetail from '~/components/layout/OrderDetail.vue'
import Topbar from '~/components/Topbar.vue'
import MenuList from '~/components/layout/MenuList.vue'
import Profile from '~/components/layout/Profile.vue'
import { mapState } from 'vuex'
import { AuthModel } from '~/types/AuthModel'
import { listOrder } from '~/api/Order/ListOrder'
import { cmdGrp3PO } from '~/api/Order/Command29101Group3'
import { CalPurOrdInput, CommandGroup3TPurOrd } from '~/types/CalPurOrdInput'
import { calculatePurOrd } from '~/api/Order/CalculatePurOrd'

export default Vue.extend({
  components: {
    OrderDetail,
    MenuList,
    Profile,
    Topbar,
    OrderCard,
  },
  data() {
    return {
      order: null as any,
      tPurOrdGrp3: null as any,
      tPurOrdCal: null as any,
    }
  },
  mounted() {
    this.fetchOrderDetail()
  },
  methods: {
    async fetchOrderDetail() {
      {
        const listOrderResp = await listOrder.listOrder(
          {
            listingFilter: {
              poId: Number(this.$route.params.id),
            },
            filter: {
              pagingFrom: 0,
              pagingTo: 1,
            },
          },
          this.auth.globalCode,
          this.auth.channelName
        )
        const { uspTPurOrd } =
          listOrderResp && listOrderResp.data ? listOrderResp.data : null
        this.order = uspTPurOrd && uspTPurOrd[0] ? uspTPurOrd[0] : {}
      }
      {
        const cmdGrp3PORes = await cmdGrp3PO.command29101Group3(
          0,
          {
            poId: Number(this.$route.params.id),
          },
          this.auth.globalCode,
          this.auth.channelName
        )
        const { alert } =
          cmdGrp3PORes && cmdGrp3PORes.data ? cmdGrp3PORes.data : null
        if (alert && alert.length > 0) {
          if (alert[0].alertId === -1) {
            const cmdGrp3TPurOrd: CommandGroup3TPurOrd[] =
              cmdGrp3PORes.data.tPurOrd
            this.tPurOrdGrp3 = cmdGrp3TPurOrd
            const cmdGrp3Req: CalPurOrdInput = {
              cmdGrp3: {
                tPurOrd: cmdGrp3TPurOrd,
              },
            }
            const calculatePurOrdRes = await calculatePurOrd.calculatePurOrd(
              cmdGrp3Req,
              this.auth.globalCode,
              this.auth.channelName
            )
            const { tPurOrd } =
              calculatePurOrdRes &&
              calculatePurOrdRes.data &&
              calculatePurOrdRes.data.cmdGrp3
                ? calculatePurOrdRes.data.cmdGrp3
                : null
            this.tPurOrdCal = tPurOrd ? tPurOrd : null
          } else {
            console.log(alert)
          }
        } else {
          console.log(alert)
        }
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
@import '@/assets/scss/_variables.scss';
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
  }
}
.order {
  display: flex;
  flex-wrap: wrap;
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
}
</style>
