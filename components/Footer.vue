<template>
  <div>
    <v-footer padless>
      <v-card flat tile class="Footer">
        <v-container class="p-6">
          <div>
            <v-row
              no-gutters
              class="mb-8 d-flex flex-column d-sm-flex flex-sm-row"
            >
              <v-col>
                <v-card outlined class="contactTitel mb-2 text_14_px">
                  ข้อมูลติดต่อ
                </v-card>
                <v-col v-for="item in dataContact" :key="item.Text">
                  <v-row no-gutters>
                    <v-col cols="1" class="mr-1">
                      <v-icon small>{{ item.icon }}</v-icon>
                    </v-col>
                    <v-col class="text text_14_px">
                      <!-- <v-card outlined style="align-item: center;" class="contactDetail"> -->
                      {{ item.Text }}
                      <!-- </v-card> -->
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <div class="wrapper d-flex">
                <v-col class="ml-md-16 ml-sm-0">
                  <v-card outlined class="contactTitel text_14_px">
                    สินค้า
                  </v-card>
                  <v-card
                    outlined
                    class="contactDetail text_14_px text-color"
                    v-for="item in productContent"
                    :key="item"
                  >
                    <p>{{ item }}</p>
                  </v-card>
                </v-col>

                <v-col class="ml-md-16 ml-sm-0">
                  <v-card outlined class="contactTitel text_14_px">
                    เกี่ยวกับ พร้อมส่ง
                  </v-card>
                  <v-card
                    outlined
                    class="contactDetail text_14_px text-color"
                    v-for="item in aboutProduct"
                    :key="item"
                  >
                    <p>{{ item }}</p>
                  </v-card>
                </v-col>
              </div>
              <v-col class="ml-md-16 ml-sm-0 mt-respon-4">
                <v-card outlined class="contactTitel">
                  <p class="text_14_px">ดาวน์โหลดแอปพลิเคชั่น</p>
                </v-card>
                <v-card outlined class="contactDetail mb-2">
                  <span class="text_14_px text-color">
                    แอป พร้อมส่ง พร้อมให้บริการแล้วบน Google Play ตอนนี้
                  </span>
                </v-card>
                <v-card outlined class="contactDetail mb-2">
                  <v-row no-gutters class="mt-xl-3 mt-gl-3 mt-sm-3 mt-md-2">
                    <div>
                      <img src="/images/QrCode-App.png" class="img-QRcode" />
                    </div>
                    <v-col
                      class="
                        ml-lg-4 ml-md-3 ml-sm-2 ml-1
                        d-flex
                        flex-column
                        justify-space-around
                      "
                    >
                      <img
                        src="/images/Googlepay.png"
                        class="img-Googlepay"
                        alt=""
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </div>
          <v-divider> </v-divider>
          <div>
            <v-card-text>
              <p class="dark--text text-center text_3">
                @ 2020 Promptsong. All Reserved
              </p>
            </v-card-text>
          </div>
        </v-container>
      </v-card>
    </v-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => ({
    contactTitel: [
      'ข้อมูลติดต่อ',
      'สินค้า',
      'เกี่ยวกับ พร้อมส่ง',
      'ดาวน์โหลดแอปพลิเคชั่น',
    ],
    dataContact: [
      {
        icon: 'room',
        Text: 'ที่อยู่ : 46/21 ถนนเจริญราษฎร์ แขวงบางโคล่ เขตบางคอแหลม บางโคล่ กรุงเทพ 10120',
      },
      { icon: 'call', Text: 'โทร : +66 85 842 6501' },
      { icon: 'mail', Text: 'อีเมล : information@promptsong.com' },
      { Text: 'Facebook : Promptsong - พร้อมส่ง' },
      { Text: 'Youtube : ' },
    ],

    productContent: [
      'สินค้าใหม่',
      'สินค้าค้าขายดีที่สุด',
      'ราคาลดลง',
      'ร้านค้า',
      'โปรโมชั่น',
    ],
    aboutProduct: [
      'เกี่ยวกับเรา',
      'ร่วมงานกับเรา',
      'นโยบายความเป็นส่วนตัว',
      'ข้อตกลงและเงื่อนไข',
    ],
  }),
})
</script>
<style lang="scss" scoped>
@import url('~/assets/css/Footer.css');
@import '@/assets/scss/globalStyle.scss';

p {
  margin: 0;
}

.text-color {
  color: #000 !important;
}

.text_11_px {
  font-size: 11px;
}

.text_14_px {
  font-size: 14px;
}

.text_2 {
  font-size: 0.5rem;
}

.text_3 {
  font-size: 0.75rem;
}

.text_4 {
  font-size: 1rem;
}

.text {
  align-items: center;
  display: flex;
}

@media (max-width: 1200px) {
}

@media (max-width: 600px) {
  .wrapper {
    display: flex;
    margin-top: 1rem;
  }

  .mt-respon-4 {
    margin-top: 1rem !important;
  }
}
</style>
