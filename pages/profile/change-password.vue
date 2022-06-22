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
        <ChangePassword />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import MenuList from '~/components/layout/MenuList.vue'
import Profile from '~/components/layout/Profile.vue'
import ChangePassword from '~/components/ChangePassword.vue'

export default Vue.extend({
  components: {
    MenuList,
    Profile,
    Topbar,
    ChangePassword,
  },
})
</script>

<style lang="scss" scoped>
.container-wrapper {
  display: flex;
  .SubNav {
    padding-right: 2rem;
    justify-content: space-between;
  }
  .content {
    flex: 3;
    margin-top: 4rem;
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
    padding: 12px 1.5rem !important;
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
    margin-top: 2rem !important;
  }
}
</style>
