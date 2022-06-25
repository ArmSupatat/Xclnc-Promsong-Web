<template>
  <div class="app-Topbar">
    <div class="container-Topbar">
      <v-container>
        <v-row class="d-flex flex-row justify-between">
          <div
            class="d-flex align-center"
            @click="$router.push('/')"
            style="cursor: pointer"
          >
            <v-img
              :width="changeSizeScreen.logoProduct"
              src="/images/Logo.png"
              class="Logo"
            ></v-img>
          </div>
          <v-navigation-drawer v-model="drawer" class="drawer" temporary>
            <v-list nav dense class="p-0">
              <v-list-item-group
                v-model="group"
                active-class="deep-purple--text text--accent-4"
              >
                <div class="d-flex flex-column">
                  <div>
                    <div class="d-flex justify-between py-8 px-4 bgc-green">
                      <div class="hidden-xs-only">
                        <div class="d-flex">
                          <div style="width: 150px" v-if="loading">
                            <v-skeleton-loader
                              type="paragraph"
                            ></v-skeleton-loader>
                          </div>
                          <div
                            class="d-flex flex-column mt-2 cursor-pointer"
                            @click="$router.push('/profile/setting-profile')"
                            v-else
                          >
                            <v-row>
                              <div>
                                <v-img
                                  class="mr-2"
                                  :width="changeSizeScreen.icon"
                                  src="/images/account-circle.png"
                                ></v-img>
                              </div>
                              <v-col>
                                <span>{{ personFirstname }}</span></v-col
                              >
                            </v-row>
                            <v-row>
                              <v-col lg="2">
                                <v-img
                                  class="mr-2"
                                  :width="changeSizeScreen.icon"
                                  src="/images/compare-arrows.png"
                                ></v-img>
                              </v-col>
                              <v-col>
                                <p class="m-0 shop-name">
                                  {{ shopName }}
                                </p>
                                <p
                                  class="m-0 shop-name"
                                  v-if="branchCode === '00000'"
                                >
                                  (สำนักงานใหญ่)
                                </p>
                              </v-col>
                            </v-row>
                          </div>
                          <div class="d-flex flex-column mt-2">
                            <v-row>
                              <v-col>
                                <v-badge overlap color="#DD6241">
                                  <template v-slot:badge>
                                    <span>{{ sumNotification }}</span>
                                  </template>
                                  <v-img
                                    class="ml-1"
                                    :width="changeSizeScreen.icon"
                                    src="/images/list.png"
                                  ></v-img>
                                </v-badge>
                              </v-col>
                              <v-col
                                class="cart"
                                @click="$router.push('/cart')"
                              >
                                <v-badge overlap color="#DD6241">
                                  <template v-slot:badge>
                                    <span>{{ sumProductInBasket }}</span>
                                  </template>
                                  <v-img
                                    class="ml-1"
                                    :width="changeSizeScreen.icon"
                                    src="/images/Basket.png"
                                  ></v-img>
                                </v-badge>
                              </v-col>
                            </v-row>
                            <div class="flex justify-center">
                              <v-btn
                                class="cursor-pointer h-fit"
                                @click="logout"
                                outlined
                                >ลงชื่อออก</v-btn
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="hidden-sm-and-up" v-if="auth.globalCode">
                        <v-row>
                          <div style="width: 150px" v-if="loading">
                            <v-skeleton-loader
                              type="paragraph"
                            ></v-skeleton-loader>
                          </div>
                          <div
                            class="d-flex flex-column mt-2 cursor-pointer"
                            @click="$router.push('/profile/setting-profile')"
                            v-else
                          >
                            <v-row>
                              <div>
                                <v-img
                                  class="mr-2"
                                  :width="changeSizeScreen.icon"
                                  src="/images/account-circle.png"
                                ></v-img>
                              </div>
                              <v-col>
                                <span>{{ personFirstname }}</span></v-col
                              >
                            </v-row>
                            <v-row>
                              <v-col lg="2">
                                <v-img
                                  class="mr-2"
                                  :width="changeSizeScreen.icon"
                                  src="/images/compare-arrows.png"
                                ></v-img>
                              </v-col>
                              <v-col>
                                <p class="m-0 shop-name">
                                  {{ shopName }}
                                </p>
                                <p
                                  class="m-0 shop-name"
                                  v-if="branchCode === '00000'"
                                >
                                  (สำนักงานใหญ่)
                                </p>
                              </v-col>
                            </v-row>
                          </div>
                          <v-btn
                            class="cursor-pointer h-fit mt-4"
                            @click="logout"
                            outlined
                            >ลงชื่อออก</v-btn
                          >
                        </v-row>
                      </div>
                      <div class="hidden-sm-and-up" v-else>
                        <v-row>
                          <v-col class="d-flex align-center">
                            <button
                              @click="$router.push('/auth')"
                              class="btn-signin mx-sm-1 text-4xl"
                            >
                              เข้าสู่ระบบ
                            </button>
                            <v-divider
                              vertical
                              @click="$router.push('/register')"
                              class="mx-lg-2 mx-md-2 mx-sm-1 mx-1"
                            ></v-divider>

                            <button
                              @click="$router.push('/register')"
                              class="btn-signup mx-sm-1 mx-xs-1 text-4xl"
                            >
                              สมัครสมาชิก
                            </button>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                  <div class="py-8 px-4">
                    <div id="search">
                      <div
                        class="container-search-input d-flex flex-row align-center mb-4"
                      >
                        <span class="material-icons" style="color: #469b5c"
                          >search</span
                        >
                        <v-text-field
                          class="ml-2"
                          v-model="keywordSearch"
                          @keypress.enter="searchProduct"
                          @keydown.space.prevent
                          label="ค้นหาสินค้า"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="topic-wrapper">
                      <span
                        v-for="Topic in choiceSearch"
                        :key="Topic.topic"
                        class="mr-lg-5 mr-sm-2 d-flex flex-column"
                      >
                        <a :href="Topic.link" class="text-4xl">{{
                          Topic.topic
                        }}</a>
                      </span>
                    </div>
                  </div>
                </div>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>

          <div
            class="container-search d-flex flex-column justify-end flex-grow-1 ml-lx-5 ml-lg-5 ml-md-5 ml-sm-3 ml-2"
          >
            <div
              class="d-flex flex-row justify-space-between align-center respon-space"
            >
              <div id="search" class="hidden">
                <div
                  class="container-search-input d-flex flex-row align-center"
                >
                  <span class="material-icons" style="color: #469b5c"
                    >search</span
                  >
                  <v-text-field
                    class="ml-2"
                    v-model="keywordSearch"
                    @keypress.enter="searchProduct"
                    @keydown.space.prevent
                    label="ค้นหาสินค้า"
                  ></v-text-field>
                </div>
              </div>

              <div v-if="checkLogin === true && login === true">
                <div class="d-flex">
                  <!-- <div class="pt-4 mr-6" style="width: 150px" v-if="loading">
                    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
                  </div> -->
                  <div
                    class="d-flex flex-column mt-2 cursor-pointer"
                    @click="$router.push('/profile/setting-profile')"
                  >
                    <v-row class="hidden">
                      <div>
                        <v-img
                          class="mr-2"
                          :width="changeSizeScreen.icon"
                          src="/images/account-circle.png"
                        ></v-img>
                      </div>
                      <v-col> <span>อนันทรัพย์</span></v-col>
                    </v-row>
                    <v-row class="hidden">
                      <div>
                        <v-img
                          class="mr-2"
                          :width="changeSizeScreen.icon"
                          src="/images/compare-arrows.png"
                        ></v-img>
                      </div>
                      <v-col>
                        <p class="m-0 shop-name">Papa mama shop</p>
                        <p class="m-0 shop-name">(สำนักงานใหญ่)</p>
                      </v-col>
                    </v-row>
                  </div>
                  <div class="d-flex flex-column mt-2">
                    <v-row>
                      <v-col class="mr-4">
                        <v-badge overlap color="#DD6241">
                          <template v-slot:badge>
                            <span>{{ sumNotification }}</span>
                          </template>
                          <v-img
                            class="ml-1"
                            :width="changeSizeScreen.icon"
                            src="/images/list.png"
                          ></v-img>
                        </v-badge>
                      </v-col>
                      <v-col class="cart" @click="$router.push('/cart')">
                        <v-badge overlap color="#DD6241">
                          <template v-slot:badge>
                            <span>4</span>
                          </template>
                          <v-img
                            class="ml-1"
                            :width="changeSizeScreen.icon"
                            src="/images/Basket.png"
                          ></v-img>
                        </v-badge>
                      </v-col>
                    </v-row>
                    <div class="flex justify-center hidden">
                      <v-btn
                        class="cursor-pointer h-fit"
                        @click="logout"
                        outlined
                        >ลงชื่อออก</v-btn
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="hidden-xs-only hidden" v-else>
                <div class="d-flex align-center flex-row">
                  <v-row no-gutters>
                    <v-col>
                      <v-img
                        :width="changeSizeScreen.icon"
                        src="/images/Vector.png"
                        class="mx-1 ml-1"
                      ></v-img>
                    </v-col>
                    <v-col>
                      <button
                        @click="$modal.show('modal-account')"
                        class="btn-signin mx-sm-1 text-md-subtitle-1 text-sm-body-2"
                      >
                        เข้าสู่ระบบ
                      </button>
                      <client-only>
                        <modal
                          name="modal-account"
                          :adaptive="true"
                          width="50%"
                          height="50%"
                          @closed="$modal.hide('modal-account')"
                        >
                          <div
                            class="px-6 py-6 popup-login"
                            style="overflow: auto; height: 100%"
                          >
                            <h2 class="mb-4">เลือกประเภทผู้ใช้งาน</h2>
                            <button
                              @click="
                                $modal.hide('modal-account'),
                                  $router.push('/auth')
                              "
                              class="popup-button text-left"
                            >
                              <div class="select-user-container">
                                <div
                                  class="icon-operator style-icon-operator"
                                ></div>
                                ผู้ประกอบการ
                              </div>
                            </button>
                            <button
                              @click="
                                $modal.hide('modal-account'),
                                  $router.push('/auth')
                              "
                              class="popup-button text-left"
                            >
                              <div class="select-user-container">
                                <div class="icon-staff style-icon-staff"></div>
                                พนักงาน
                              </div>
                            </button>
                          </div>
                        </modal>
                      </client-only>
                    </v-col>
                    <v-divider
                      vertical
                      class="mx-lg-2 mx-md-2 mx-sm-1 mx-1"
                    ></v-divider>
                    <v-col>
                      <button
                        @click="$router.push('/register')"
                        class="btn-signup mx-sm-1 mx-xs-1 text-md-subtitle-1 text-sm-body-2"
                      >
                        สมัครสมาชิก
                      </button>
                    </v-col>
                    <v-col class="cart" @click="$router.push('/cart')">
                      <v-badge overlap color="#DD6241">
                        <template v-slot:badge>
                          <span>{{ sumProductInBasket }}</span>
                        </template>
                        <v-img
                          class="ml-1"
                          :width="changeSizeScreen.icon"
                          src="/images/Basket.png"
                        ></v-img>
                      </v-badge>
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                </div>
              </div>
              <div class="hidden-sm-and-up hidden" v-if="auth.globalCode">
                <v-row
                  ><v-col
                    class="d-flex align-center cart"
                    @click="$router.push('/cart')"
                  >
                    <v-badge overlap color="#DD6241">
                      <template v-slot:badge>
                        <span>{{ sumProductInBasket }}</span>
                      </template>
                      <v-img
                        class="ml-1"
                        :width="changeSizeScreen.icon"
                        src="/images/Basket.png"
                      ></v-img>
                    </v-badge>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-menu transition="slide-y-transition" right>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          class="material-icons success--text ml-3"
                          v-bind="attrs"
                          :style="`font-size:${changeSizeScreen.icon + 3}px`"
                          v-on="on"
                        >
                          perm_identity
                        </span>
                      </template>

                      <v-card elevation="0">
                        <v-list>
                          <v-list-item>
                            <v-list-item-avatar>
                              <v-img
                                src="/images/Vector.png"
                                class="mx-1 ml-1"
                              ></v-img>
                            </v-list-item-avatar>
                            <v-btn
                              class="cursor-pointer h-fit"
                              @click="logout"
                              outlined
                              >ลงชื่อออก</v-btn
                            >
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-col>
                </v-row>
              </div>
              <div class="hidden-sm-and-up hidden" v-else>
                <v-row
                  ><v-col
                    class="d-flex align-center cart"
                    @click="$router.push('/cart')"
                  >
                    <v-badge overlap color="#DD6241">
                      <template v-slot:badge>
                        <span>{{ sumProductInBasket }}</span>
                      </template>
                      <v-img
                        class="ml-1"
                        :width="changeSizeScreen.icon"
                        src="/images/Basket.png"
                      ></v-img>
                    </v-badge>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-menu transition="slide-y-transition" right>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          class="material-icons success--text ml-3"
                          v-bind="attrs"
                          :style="`font-size:${changeSizeScreen.icon + 3}px`"
                          v-on="on"
                        >
                          perm_identity
                        </span>
                      </template>

                      <v-card elevation="0">
                        <v-list>
                          <v-list-item>
                            <v-list-item-avatar>
                              <v-img
                                src="/images/Vector.png"
                                class="mx-1 ml-1"
                              ></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                              <v-list-item-subtitle class="d-flex"
                                ><button
                                  @click="$router.push('/auth')"
                                  class="btn-signin mx-sm-1 text-md-subtitle-1 text-sm-body-2"
                                >
                                  เข้าสู่ระบบ
                                </button>
                                <v-divider
                                  vertical
                                  @click="$router.push('/register')"
                                  class="mx-lg-2 mx-md-2 mx-sm-1 mx-1"
                                ></v-divider>

                                <button
                                  @click="$router.push('/register')"
                                  class="btn-signup mx-sm-1 mx-xs-1 text-md-subtitle-1 text-sm-body-2"
                                >
                                  สมัครสมาชิก
                                </button>
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-col>
                </v-row>
              </div>
            </div>
            <div>
              <span
                v-for="Topic in choiceSearch"
                :key="Topic.topic"
                class="mr-lg-5 mr-sm-2 hidden"
              >
                <a :href="Topic.link" class="Topic titel--text">{{
                  Topic.topic
                }}</a>
              </span>
            </div>
          </div>
          <div class="d-flex align-center lg-hidden">
            <v-app-bar-nav-icon class="drawer-icon" @click="drawer = true" />
          </div>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { authen } from '~/api/Authenticate/Authenticate'
import { AuthModel } from '~/types/AuthModel'
import { command105101Group3 } from '~/api/Profile/Command105101Group3'
import { groupBusiness } from '~/api/Authenticate/CommandGroupBusiness'

export default Vue.extend({
  props: {
    checkLogin: Boolean,
  },
  data: () => ({
    drawer: false,
    group: null,
    keywordSearch: '' as string,
    personFirstname: '' as string,
    shopName: '' as string,
    branchCode: '' as string,
    loading: true as boolean,
    login: true as boolean,

    choiceSearch: [
      { link: '/product', topic: 'สินค้า' },
      { link: '#', topic: 'ดาวน์โหลด' },
      { link: '#', topic: 'โปรโมชั่น' },
    ],
  }),

  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
      listCart: (state: any) => state.cartStore.cart,
    }),
    sumProductInBasket(): number {
      const sumProductInCart =
        this.auth && this.auth.globalCode
          ? this.listCart.reduce((previosValue: any, currentValue: any) => {
              return previosValue + currentValue.stepQty
            }, 0)
          : 0
      return sumProductInCart ? parseInt(sumProductInCart) : 0
    },
    sumNotification(): number {
      return 0
    },
    changeSizeScreen(): object {
      const size = {
        logoProduct: 160,
        icon: 28,
        fontSignin: 18,
        fontSearch: 18,
        fontTopic: 12,
      }

      if (this.$vuetify.breakpoint.sm) {
        size.logoProduct = 120
        size.icon = 22
      } else if (this.$vuetify.breakpoint.xs) {
        if (this.$vuetify.breakpoint.width < 360) {
          size.logoProduct = 65
          size.icon = 20
        } else {
          size.logoProduct = 80
          size.icon = 22
        }
      }
      return size
    },
  },
  mounted() {
    this.initialValue()
  },
  methods: {
    initialValue() {
      this.getProfileDetail()
      this.$root.$on('updateProfile', () => {
        this.getProfileDetail()
      })
    },
    async getProfileDetail() {
      if (this.auth.globalCode && this.auth.channelName) {
        const response = await command105101Group3.command105101Group3(
          '0',
          this.auth.globalCode,
          this.auth.channelName
        )
        if (response && response.data) {
          const { mPerson } = response.data
          if (mPerson.length > 0) {
            this.personFirstname = mPerson[0].personFirstname.split(' ')[0]
            this.shopName = mPerson[0].depName
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
      }
    },
    async searchProduct(e: any) {
      this.keywordSearch = e.target.value.replace(/\s/g, '')

      if (this.keywordSearch) {
        this.$router.push(`/product/search/${this.keywordSearch}`)
        this.keywordSearch = ''
      }
    },
    logout() {
      // let loader = this.$loading.show()
      // const response = await authen.logout(
      //   this.auth.globalCode,
      //   this.auth.channelName
      // )
      // if (response && response.alert.length > 0) {
      //   const alert = response.alert[0]
      //   if (alert.alertApiCode === '200') {
      //     this.$store.commit('authStore/logout')
      //     this.$forceUpdate()
      this.login = false
      this.$router.push('/')
      //     } else {
      //       console.log(alert.alertDisplay)
      //     }
      //   }
      //   loader.hide()
    },
  },
})
</script>

<style lang="scss" scoped>
@import url('~/assets/css/Topbar.css');
@import '@/assets/scss/globalStyle.scss';

.bgc-green {
  background-color: rgba(0, 0, 0, 0.1);
}

.lg-hidden {
  display: none;
}

.drawer {
  display: none;
}
.drawer-icon {
  display: none;
}

@media (max-width: 1200px) {
}

@media (max-width: 600px) {
  .text-4xl {
    font-size: 0.9rem;
  }
  .lg-hidden {
    display: unset;
  }
  .respon-space {
    justify-content: flex-end !important;
    padding-right: 1rem;
  }
  .hidden {
    display: none;
  }
  .drawer-icon {
    display: unset;
  }
  .drawer {
    position: absolute;
    display: unset;
    height: 100vh !important;
    width: 16rem !important;
  }
  .nav {
    display: none !important;
  }
  .topic-wrapper {
    height: 8rem;
    justify-content: space-around;
    display: flex;
    flex-direction: column;
    .Topic {
      font-size: 0.8rem;
    }
  }
}
</style>
