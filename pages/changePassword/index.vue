<template>
  <v-app>
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
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Profile from '~/components/layout/Profile.vue'
import MenuList from '~/components/layout/MenuList.vue'

export default Vue.extend({
  components: {
    Profile,
    MenuList,
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
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
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
