<template>
  <div>
    <Topbar />
    <MenuListOrder @orderTypeEmitMobile="orderTypeEmitMobile" />
    <v-container class="container-wrapper">
      <div class="SubNav-wrapper">
        <div class="py-5 hidden-xs-only">
          <a href="/" class="make--text">หน้าหลัก</a
          ><span class="mx-3 make--text">/</span
          ><a href="#" class="secondary--text">รายการสั่งซื้อของฉัน</a>
        </div>
        <div class="SubNav">
          <Profile />
          <MenuList />
        </div>
      </div>
      <div class="content">
        <ListOrder @orderTypeEmit="orderTypeEmit" :filterOrder="filterOrder" />
      </div>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import MenuList from '~/components/layout/MenuList.vue'
import Profile from '~/components/layout/Profile.vue'
import ListOrder from '~/components/layout/ListOrder.vue'
import MenuListOrder from '~/components/layout/MenuListOrder.vue'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'
import { listOrder } from '~/api/Order/ListOrder'

export default Vue.extend({
  components: {
    MenuList,
    Profile,
    Topbar,
    ListOrder,
    MenuListOrder,
  },
  data() {
    return {
      orderType: 1 as number,
      listOrder: [] as object[],
    }
  },
  mounted() {
    this.fetchListOrder()
    this.$root.$on('getNewListOrder', () => {
      this.fetchListOrder()
    })
  },
  methods: {
    orderTypeEmitMobile(orderType: number) {
      this.orderType = orderType
    },
    orderTypeEmit(orderType: number) {
      this.orderType = orderType
    },
    async fetchListOrder() {
      try {
        const listOrderResp = await listOrder.listOrder(
          {
            filter: {
              pagingFrom: 0,
              pagingTo: 1000,
            },
          },
          this.auth.globalCode,
          this.auth.channelName
        )
        const { uspTPurOrd } =
          listOrderResp && listOrderResp.data ? listOrderResp.data : null
        this.listOrder = uspTPurOrd ? uspTPurOrd : []
      } catch (err) {
        console.log(err)
      }
    },
  },
  computed: {
    filterOrder(): Object[] {
      return this.orderType > 1
        ? this.listOrder.filter((each: any) => {
            return each.poDispTypIdx === this.orderType
          })
        : this.listOrder
    },
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
    flex: 30%;
    justify-content: space-between;
  }
  .content {
    flex: 70%;
    padding-top: 64px;
    .container {
      padding: 0;
      margin-top: 4rem;
      .filter {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border: 1px solid lightgray;
        padding: 2rem 5rem;
        margin-bottom: 2rem;
        p {
          margin: 0;
        }
      }
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
      padding-top: 1rem;
    }
  }
}

@media (max-width: 1025px) {
  .content {
    width: 100% !important;
  }
}

@media (max-width: 600px) {
  .SubNav {
    display: none !important;
  }
}
</style>
