<template>
  <div class="menu-card">
    <ul class="menu-list">
      <nuxt-link
        v-for="(link, index) in navLinks"
        :key="index"
        class="menu"
        :to="{ path: `${link.path}` }"
      >
        <div :class="`icon-nav-style ${link.icon}`"></div>
        <p
          :class="`${link.path === $route.path ? 'active' : ''}`"
          style="margin: 0"
        >
          {{ link.name }}
        </p>
      </nuxt-link>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
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
    }
  },
})
</script>
<style lang="scss" scoped>
.menu-card {
  overflow: hidden;
  margin: 0;
  background-color: #fff;
  border: 1px solid lightgray;
  ul.menu-list {
    padding: 32px;
    a {
      font-size: 16px;
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
      .active {
        color: #469b5c;
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

@media (max-width: 1200px) {
  .menu-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 67%;
    ul.menu-list {
      display: flex;
      width: 100%;
      justify-content: space-between;
      p {
        font-size: 0.7rem;
      }
      .menu {
        .icon-nav-style {
          margin-right: 3px;
        }
      }
    }
  }
}

@media (min-width: 600px) {
}
</style>
