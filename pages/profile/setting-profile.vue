<template>
  <div>
    <Topbar />
    <MenuListOther />
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
        <ProfileSetting />
        <div class="button-wrapper">
          <div style="font-size: 14px; font-weight: 600">เปลี่ยนรหัสผ่าน</div>
          <div class="button" @click="$router.push('/profile/change-password')">
            <img src="~/assets/img/key.svg" alt="" />
            <div style="font-size: 14px; font-weight: 600">
              คลิกเพื่อเปลี่ยนรหัสผ่าน
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import MenuList from '~/components/layout/MenuList.vue'
import Profile from '~/components/layout/Profile.vue'
import ProfileSetting from '~/components/ProfileSetting.vue'
import MenuListOther from '~/components/layout/MenuListOther.vue'

export default Vue.extend({
  components: {
    MenuList,
    Profile,
    Topbar,
    ProfileSetting,
    MenuListOther,
  },
  data: () => ({
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
.menu-card {
  overflow: hidden;
  margin: 0;
  ul.menu-list {
    padding-top: 2rem;
    a {
      font-size: 1.4rem;
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
        width: 1.2em;
        height: 1.2em;
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
.container-wrapper {
  display: flex;
  .SubNav {
    padding-right: 2rem;
    justify-content: space-between;
  }
  .content {
    flex: 3;
    .button-wrapper {
      border: 1px solid lightgray;
      margin: 4rem 0;
      padding: 3rem;
      .button {
        border: 1px solid lightgray;
        border-radius: 9px;
        padding: 1rem 3.5rem;
        max-width: fit-content;
        display: flex;
        margin-top: 1rem;
        cursor: pointer;
        img {
          padding-right: 1rem;
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .container-wrapper {
    display: flex;
    flex-direction: column;
    padding: 0 1.5rem 0 1.5rem !important;
    .SubNav {
      padding-right: 0;
      display: flex;
    }
  }
}

@media (max-width: 600px) {
  .SubNav {
    display: none !important;
  }
  .content {
    .button-wrapper {
      .button {
        padding: 1rem 1.5rem !important;
      }
    }
  }
}
</style>
