<template>
  <div>
    <div class="container-wrapper">
      <img class="img-profile" src="~/assets/img/user.png" />
      <div class="information w-full">
        <template v-if="loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </template>
        <template v-else
          ><div class="name pb-1">
            <span style="font-size: 14px; font-weight: 600">{{ comName }}</span>
          </div>
          <div class="address pb-1">
            <p style="font-size: 14px">{{ branchName }}</p>
            <p style="font-size: 14px" v-if="branchCode === '00000'">
              (สำนักงานใหญ่)
            </p>
          </div>
        </template>
        <div class="flex align-center">
          <img
            class="setting"
            src="~/assets/img/settings.svg"
            @click="$router.push('/profile/setting-profile')"
          />
          <a
            class="ml-1"
            @click="$router.push('/profile/setting-profile')"
            style="font-size: 14px"
          >
            ตั้งค่า</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { groupBusiness } from '~/api/Authenticate/CommandGroupBusiness'
import { AuthModel } from '~/types/AuthModel'
import { command105101Group3 } from '~/api/Profile/Command105101Group3'

export default Vue.extend({
  data() {
    return {
      comName: '' as string,
      branchCode: '' as string,
      branchName: '' as string,
      loading: true as boolean,
    }
  },
  mounted() {
    this.initialValue()
  },
  methods: {
    initialValue() {
      this.getProfile()
      this.$root.$on('updateProfile', () => {
        this.getProfile()
      })
    },
    async getProfile() {
      try {
        const response = await command105101Group3.command105101Group3(
          '0',
          this.auth.globalCode,
          this.auth.channelName
        )
        if (response && response.data) {
          const { mPerson } = response.data
          if (mPerson.length > 0) {
            this.comName = mPerson[0].personFirstname
            this.branchName = mPerson[0].depName
          }
        }
        const cmdGrpBusinessRes = await groupBusiness.commandGroupBusiness(
          0,
          this.auth.globalCode,
          this.auth.channelName
        )
        if (cmdGrpBusinessRes && cmdGrpBusinessRes.mCompany) {
          const { mCompany } = cmdGrpBusinessRes
          if (mCompany.mBranch && mCompany.mBranch.length > 0) {
            const { mBranch } = mCompany
            this.branchCode = mBranch[0].branchCode
          }
        }
        this.loading = false
      } catch (err) {
        console.log(err)
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
@import '@/assets/scss/globalStyle.scss';

.container-wrapper {
  border: 1px solid lightgray;
  display: flex;
  padding: 1rem;
  margin-bottom: 2rem;
  .img-profile {
    width: 72px;
    height: 72px;
    border-radius: 10rem;
  }
  .setting {
    width: 1.5rem;
  }
  .information {
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .address {
      p {
        margin: 0;
      }
    }
  }
}

@media (max-width: 1200px) {
  .container-wrapper {
    margin-bottom: 0;
  }
}

@media (min-width: 600px) {
}
</style>
