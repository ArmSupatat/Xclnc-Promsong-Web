<template>
  <div>
    <div class="d-flex align-center lg-hidden space">
      <v-app-bar-nav-icon class="drawer-icon" @click="drawer = true" />
    </div>

    <v-navigation-drawer v-model="drawer" class="drawer" temporary absolute>
      <v-list nav dense class="p-0">
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <div class="menu-card">
            <ul class="menu-list">
              <nuxt-link
                v-for="(link, index) in navLinks"
                :key="index"
                class="menu"
                :to="{ path: `${link.path}` }"
              >
                <div :class="`icon-nav-style ${link.icon}`"></div>
                <p style="margin: 0">{{ link.name }}</p>
              </nuxt-link>
            </ul>
          </div>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    drawer: false,
    group: null,
    navLinks: [
      {
        name: 'บัญชีของฉัน',
        icon: 'icon-customers',
        path: '/updateStore',
      },
      {
        name: 'การสั่งซื้อของฉัน',
        icon: 'icon-order',
        path: '/order',
      },
      {
        name: 'รายการโปรด',
        icon: 'icon-favorite',
        path: '/profile/favorite',
      },
      {
        name: 'คูปองของฉัน',
        icon: 'icon-coupon',
        path: '/profile/myCoupon',
      },
    ],
  }),
})
</script>

<style lang="scss" scoped>
.space {
  padding: 12px 1rem;
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}
.drawer-icon {
  color: #fff !important;
}
.menu-card {
  overflow: hidden;
  margin: 4rem 0 0 0;
  ul.menu-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
    padding: 2rem 1rem 1rem 1rem;
    a {
      font-size: 1rem;
      // font-weight: 900;
    }
    .menu {
      color: #000;
      text-align: left;
      padding: 16px 0px;
      display: flex;
      align-items: center;
      text-decoration: none;
      outline: none;
      &:focus,
      &:active,
      &:hover {
        color: #469b5c;
      }
      .icon-nav-style {
        width: 1.5em;
        height: 1.5em;
        margin-right: 16px;
        display: inline-block;
        background-color: #000;
        // background-repeat: no-repeat;
      }
      &:hover .icon-nav-style {
        background-color: #469b5c;
      }
      // .material-icons {
      //   margin-right: 16px;
      // }
    }
  }
}
.icon-customers {
  mask: url(../../assets/img/customers.svg) no-repeat;
}
.icon-order {
  mask: url(../../assets/img/order.svg) no-repeat;
}
.icon-favorite {
  mask: url(../../assets/img/favorite.svg) no-repeat;
}
.icon-coupon {
  mask: url(../../assets/img/coupon.svg) no-repeat;
}
.lg-hidden {
  display: none !important;
}

@media (max-width: 600px) {
  .lg-hidden {
    display: flex !important;
  }
}
</style>
