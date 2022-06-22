<template>
  <div>
    <Topbar />
    <MenuListOther />
    <v-container class="container-wrapper">
      <div class="SubNavv-wrapper">
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
          <Coupon />
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
import Coupon from '~/components/layout/MyCouponCard.vue'
import MenuListOther from '~/components/layout/MenuListOther.vue'

export default Vue.extend({
  components: {
    OrderCard,
    MenuList,
    Profile,
    Topbar,
    Coupon,
    MenuListOther,
  },
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/globalStyle.scss';

.container-wrapper {
  display: flex;
  .SubNav {
    padding-right: 2rem;
  }
  .content {
    flex: 3;
    .container {
      border: 1px solid lightgray;
      margin-top: 4rem;
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
      .container {
        margin-top: 0rem;
      }
    }
  }
}

@media (max-width: 600px) {
  .SubNav {
    display: none !important;
  }
}
</style>
