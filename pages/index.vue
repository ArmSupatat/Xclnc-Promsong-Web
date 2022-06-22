<template>
  <v-app>
    <div class="Homepage">
      <Topbar />
      <Poster />
      <Promotion />
      <Groupproduct />
      <Productrecommend />
      <Producttoship />
      <Application />
      <Footer />
      <ProductSelectUnit :action="actionModal" />
      <NewYear v-if="isNewYear" />
      <PromotionPopup v-if="isPromotion" />
    </div>
  </v-app>
</template>

<script>
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
import Footer from '~/components/Footer.vue'
import Promotion from '~/components/Promotion.vue'
import Groupproduct from '~/components/Groupproduct.vue'
import Productrecommend from '~/components/Productrecommend.vue'
import Producttoship from '~/components/Producttoship.vue'
import Poster from '~/components/Poster.vue'
import ProductSelectUnit from '~/components/ProductSelectUnit.vue'
import Application from '~/components/Application.vue'
import NewYear from '~/components/NewYear.vue'
import PromotionPopup from '~/components/PromotionPopup.vue'
import { getLookUpAuthenGetDate } from '~/api/LookUp/GetLookUpAuthenGetDate'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {
    Topbar,
    Footer,
    Promotion,
    Poster,
    Groupproduct,
    Productrecommend,
    Producttoship,
    ProductSelectUnit,
    Application,
    NewYear,
    PromotionPopup,
  },
  data: () => ({
    actionModal: '',
    data: '',
    isNewYear: false,
    isPromotion: false,
  }),

  created() {
    this.getCurrentDate()
    this.$root.$on('productSeleted', (product) => {
      this.actionModal = product
    })
  },
  methods: {
    async getCurrentDate() {
      const getDateResp = await getLookUpAuthenGetDate.getLookUpAuthenGetDate(
        this.auth.globalCode,
        this.auth.channelName
      )
      const { serverInfo } =
        getDateResp && getDateResp.data ? getDateResp.data : null
      const start = this.$moment('2021-12-23', 'YYYY-MM-DD')
        .locale('th')
        .toDate()
      const end = this.$moment('2022-01-05', 'YYYY-MM-DD').locale('th').toDate()
      const currentDate = this.$moment(
        serverInfo[0].serverDatetime,
        'YYYY-MM-DDTHH:mm:ss.SSS'
      )
        .local('th')
        .toDate()
      this.isNewYear = currentDate >= start && currentDate <= end

      const startPromotion = this.$moment('2022-03-29', 'YYYY-MM-DD')
        .locale('th')
        .toDate()
      const endPromotion = this.$moment('2022-04-18', 'YYYY-MM-DD')
        .locale('th')
        .toDate()
      this.isPromotion =
        currentDate >= startPromotion && currentDate <= endPromotion
    },
  },
  computed: {
    ...mapState({
      auth: (state) => state.authStore.auth,
    }),
  },
})

// Facebook Pixel Code
!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  }
  if (!f._fbq) f._fbq = n
  n.push = n
  n.loaded = !0
  n.version = '2.0'
  n.queue = []
  t = b.createElement(e)
  t.async = !0
  t.src = v
  s = b.getElementsByTagName(e)[0]
  s.parentNode.insertBefore(t, s)
})(
  window,
  document,
  'script',
  'https://connect.facebook.net/en_US/fbevents.js'
),
  fbq('init', '338306041210060'),
  fbq('track', 'PageView')
// End Facebook Pixel Code
</script>

<style scoped>
@import url('~/assets/css/');
</style>
