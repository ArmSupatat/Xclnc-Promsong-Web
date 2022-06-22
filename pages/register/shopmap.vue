<template>
  <div class="ma-15">
    <div class="HeaderShopMap">เลือกตำแหน่งที่ตั้ง</div>
    <div class="GoogleMapCustom">
      <GMap
        :isLoading="isLoading"
        :locations="company"
        :address="address.addr"
        @dragendGmapMarker="dragendGmapMarker"
        @selectThisLocation="selectThisLocation"
        @confirmSaveShopMap="confirmSaveShopMap"
        @handlePlace="handlePlace"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GMap from '~/components/GMap.vue'
import { locLatlng } from '~/api/Location/GetAddrByLatLong'
import { getCompany } from '~/api/Company/GetCompany'
import { AuthModel } from '~/types/AuthModel'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {
    GMap,
  },
  // middleware: ['authenticated', 'checkRegister'],
  data() {
    return {
      isLoading: false,
      address: {} as any,
      place: '',
      company: [],
      coordinates: {
        lat: 0,
        lng: 0,
      },
    }
  },
  mounted() {
    this.getListCompany()
  },
  methods: {
    async getListCompany() {
      const response = await getCompany.getCompany(
        this.auth.globalCode,
        this.auth.channelName
      )
      this.company = response.getShopResponse
    },
    async dragendGmapMarker(location: any) {
      this.coordinates = {
        lat: location.lat,
        lng: location.lng,
      }
      const response = await locLatlng.GetAddrByLatLong(
        String(this.coordinates.lat),
        String(this.coordinates.lng)
      )
      this.address = response.length === 1 ? response[0] : {}
      this.address.addr = this.address.addr
        ? this.address.addr
        : `${response[0].streetName}\r\n ตำบล${response[0].sDistrictIdXShow} อำเภอ${response[0].districtIdXShow} จังหวัด${response[0].provinceIdXShow} ${response[0].zipCode}`
      this.$store.commit('registerStore/setRegister', {
        lat: this.coordinates.lat,
        lng: this.coordinates.lng,
      })
    },
    selectThisLocation() {
      this.$store.commit('registerStore/setRegister', {
        lat: this.coordinates.lat,
        lng: this.coordinates.lng,
      })
      this.$router.push({ path: '/register/shop', query: { e1: '2' } })
    },
    handlePlace(place: string) {
      this.place = place
    },
    confirmSaveShopMap() {},
  },
  computed: {
    ...mapState({
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
</script>

<style>
@import url('~/assets/css/Shop.css');
</style>
