<template>
  <v-app>
    <Topbar />
    <v-container>
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">รายการโปรด</a>
        <span class="mx-3 make--text">/</span>
        <a href="#" class="secondary--text">สะโพกไก่ ตราเบทาโกร</a>
      </div>
      <div class="flex-row">
        <div class="profile-space">
          <Profile />
          <MenuList />
        </div>
        <div class="lists-space">
          <ProductDetail2 />
          <div class="mb-12 field flex justify-end">
            <button type="submit" class="cancel-button is-primary is-fullwidth">
              ยกเลิก
            </button>
            <button type="submit" class="submit-button is-primary is-fullwidth">
              บันทึก
            </button>
          </div>
        </div>
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
@import '@/assets/scss/_variables.scss';

.button {
  background-color: gray;
  color: #fff;
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  &:hover {
    background-color: #469b5c;
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.profile-space {
  width: 360px;
  margin-right: 30px;
}
.lists-space {
  width: 75%;
}
.submit-button {
  background-color: #469b5c;
  color: #fff;
  width: 150px;
  padding: 0.5rem;
  border-radius: 6px;
  margin-left: 5px;
}
.cancel-button {
  background-color: transparent;
  color: #000;
  width: 150px;
  padding: 0.5rem;
  border-radius: 6px;
  margin-right: 5px;
  border: 1px solid lightgray;
}
.flex {
  display: flex;
}
.subtext-color {
  color: $subtext-color;
}
</style>
