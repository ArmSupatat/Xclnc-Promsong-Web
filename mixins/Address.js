import Vue from 'vue'
import districts from '~/json/districts.json'
import provinces from '~/json/provinces.json'
import sDistricts from '~/json/subDistricts.json'

export default Vue.extend({
  data() {
    return {
      info: { provinceId: 0, districtId: 0, sDistrictId: 0 },
      subDistrictName: '',
    }
  },
  computed: {
    provinces() {
      return provinces
    },
    districts() {
      return districts.filter(
        (each) => each.PROVINCE_ID === String(this.info.provinceId)
      )
    },
    sDistricts() {
      return sDistricts.filter(
        (each) => each.DISTRICT_ID === String(this.info.districtId)
      )
    },
    provinceIdXShow() {
      const province = provinces.find(
        (each) => each.PROVINCE_ID === this.info.provinceId
      )
      return province ? province.PROVINCE_NAME : null
    },
    districtIdXShow() {
      const district = districts.find(
        (each) => each.DISTRICT_ID === this.info.districtId
      )
      return district ? district.DISTRICT_NAME : null
    },
    sDistrictIdXShow() {
      const sDistrict = sDistricts.find(
        (each) => each.SUB_DISTRICT_ID === this.info.sDistrictId
      )
      return sDistrict ? sDistrict.SUB_DISTRICT_NAME : null
    },
  },
  watch: {
    subDistrictName() {
      if (this.subDistrictName) {
        const sDistrict = sDistricts.find(
          (each) => each.SUB_DISTRICT_NAME === this.subDistrictName
        )
        this.info.sDistrictId = sDistrict ? sDistrict.SUB_DISTRICT_ID : -1
      }
    },
  },
})
