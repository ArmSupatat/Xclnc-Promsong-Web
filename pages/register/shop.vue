<template>
  <v-app>
    <Topbar />
    <!-- <Navigationdrawers class="hidden-sm-and-up" /> -->
    <v-container class="d-flex flex-column">
      <div class="py-5 hidden-xs-only">
        <a href="/" class="make--text">หน้าหลัก</a
        ><span class="mx-3 make--text">/</span
        ><a href="#" class="secondary--text">ข้อมูลผู้ประกอบการ</a>
      </div>
      <span v-if="false">{{ shop }}</span>

      <div class="d-flex justify-center cust text-field-details-messages">
        <v-stepper alt-labels v-model="e1" class="ShopStepper elevation-0">
          <v-stepper-header>
            <v-stepper-step
              :complete="e1 > 1"
              step="1"
              class="txtStepper text-no-wrap"
            >
              ข้อมูลผู้ประกอบการ
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :complete="e1 > 2"
              step="2"
              class="txtStepper text-no-wrap"
            >
              ข้อมูลที่อยู่
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" class="txtStepper text-no-wrap">
              เลือกประเภทร้านอาหาร
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items class="mt-n3 mt-xs-n5">
            <v-stepper-content step="1">
              <v-card class="border_stapper rounded-0">
                <div class="ma-7">
                  <div class="Subtitle1 mb-1">ข้อมูลผู้ประกอบการ</div>
                  <div class="Body2 mb-5">
                    สำหรับการใช้งานครั้งแรก กรุณากรอกข้อมูล
                  </div>

                  <v-row>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="pa-0">
                      <v-combobox
                        v-model="shop.shopName"
                        :items="listCompany"
                        item-text="companyName"
                        item-value="companyName"
                        :return-object="false"
                        label="ชื่อสถานประกอบการ *"
                        clearable
                        append-icon=""
                        outlined
                        class="rounded-lg mb-6"
                        :rules="[rules.required]"
                      >
                      </v-combobox>
                    </v-col>
                  </v-row>

                  <div class="InputLable">ที่ตั้งสถานประกอบการ *</div>
                  <v-radio-group
                    row
                    style="margin-top: 10px"
                    v-model="shop.isFoodCenter"
                  >
                    <v-radio label="ศูนย์อาหาร" :value="false"></v-radio>
                    <v-radio label="ร้านอาหาร" :value="true"></v-radio>
                  </v-radio-group>
                  <v-row class="row-mbn" v-if="messageCmdError">
                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                      lg="12"
                      xl="12"
                      class="py-0"
                    >
                      {{ messageCmdError }}
                    </v-col>
                  </v-row>
                </div>
              </v-card>

              <div class="d-flex">
                <v-spacer></v-spacer>
                <div style="flex-wrap: wrap">
                  <v-btn
                    text
                    dark
                    @click="createCmdBusiness()"
                    :disabled="!shop.shopName"
                    :class="{
                      'btn-ready': !!shop.shopName,
                      'btn-disable': !shop.shopName,
                    }"
                    >ถัดไป</v-btn
                  >
                </div>
              </div>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card class="border_stapper rounded-0">
                <div class="ma-8">
                  <!-- ร้านอาหาร -->
                  <div class="Subtitle1 mb-1">ที่อยู่</div>
                  <div class="Body2 mb-5">
                    สำหรับการส่งสินค้า และออกใบกำกับภาษี
                  </div>

                  <div class="ml-n3 mr-n3">
                    <!-- ศูนย์อาหาร -->
                    <div v-if="shop.isFoodCenter">
                      <v-row class="row-mbn">
                        <v-col
                          cols="12"
                          sm="12"
                          md="8"
                          lg="8"
                          xl="8"
                          class="py-0"
                        >
                          <div class="foodcenter">
                            <v-select
                              v-model="shop.foodCenterId"
                              :items="listAllShop"
                              item-text="foodCenterName"
                              item-value="foodCenterId"
                              label="ศูนย์อาหาร"
                              outlined
                              class="rounded-lg"
                              @click="dialogFoodCenter = true"
                              :menu-props="{
                                maxHeight: 0,
                              }"
                            ></v-select>
                          </div>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="12"
                          md="4"
                          lg="4"
                          xl="4"
                          class="py-0"
                        >
                          <v-text-field
                            v-model="shop.addressNumber"
                            label="เลขที่"
                            outlined
                            class="rounded-lg"
                            :disabled="shop.isFoodCenter"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row class="row-mbn">
                        <v-col
                          cols="12"
                          sm="12"
                          md="4"
                          lg="4"
                          xl="4"
                          class="py-0"
                        >
                          <v-text-field
                            v-model="shop.moo"
                            label="หมู่"
                            outlined
                            class="rounded-lg"
                            :disabled="shop.isFoodCenter"
                          ></v-text-field>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="12"
                          md="8"
                          lg="8"
                          xl="8"
                          class="py-0"
                        >
                          <v-text-field
                            v-model="shop.buildingName"
                            label="ชื่ออาคาร/หมู่บ้าน"
                            outlined
                            class="rounded-lg"
                            :disabled="shop.isFoodCenter"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row class="row-mbn" v-if="messageCmdPltError">
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                          lg="12"
                          xl="12"
                          class="py-0"
                        >
                          {{ messageCmdPltError }}
                        </v-col>
                      </v-row>
                    </div>

                    <!-- ร้านอาหาร -->
                    <div v-if="!shop.isFoodCenter">
                      <v-row class="row-mbn">
                        <v-col
                          cols="12"
                          sm="12"
                          md="4"
                          lg="4"
                          xl="4"
                          class="py-0"
                        >
                          <v-text-field
                            v-model="shop.addressNumber"
                            label="เลขที่"
                            outlined
                            class="rounded-lg mt-2"
                          ></v-text-field>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="12"
                          md="4"
                          lg="4"
                          xl="4"
                          class="py-0"
                        >
                          <v-text-field
                            v-model="shop.moo"
                            label="หมู่"
                            outlined
                            class="rounded-lg mt-2"
                          ></v-text-field>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="12"
                          md="4"
                          lg="4"
                          xl="4"
                          class="py-0"
                        >
                          <v-text-field
                            v-model="shop.buildingName"
                            label="ชื่ออาคาร/หมู่บ้าน"
                            outlined
                            class="rounded-lg mt-2"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </div>

                    <v-row class="row-mbn">
                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        <v-text-field
                          v-model="shop.lock"
                          label="ล็อค"
                          outlined
                          class="rounded-lg mt-2"
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        <v-text-field
                          v-model="shop.floor"
                          label="ชั้น"
                          outlined
                          class="rounded-lg mt-2"
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        <v-text-field
                          v-model="shop.addressAlley"
                          label="ตรอก/ซอย"
                          outlined
                          class="rounded-lg mt-2"
                          :disabled="shop.isFoodCenter"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="row-mbn">
                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        <v-text-field
                          v-model="shop.addressRoad"
                          label="ถนน"
                          outlined
                          class="rounded-lg mt-2"
                          :disabled="shop.isFoodCenter"
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        <v-select
                          v-model="info.provinceId"
                          :items="provinces"
                          item-text="PROVINCE_NAME"
                          item-value="PROVINCE_ID"
                          label="จังหวัด *"
                          outlined
                          class="rounded-lg mt-2"
                          :disabled="shop.isFoodCenter"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        <v-select
                          v-model="info.districtId"
                          :items="districts"
                          item-text="DISTRICT_NAME"
                          item-value="DISTRICT_ID"
                          label="เขต/อำเภอ *"
                          outlined
                          class="rounded-lg mt-2"
                          :disabled="shop.isFoodCenter"
                          :rules="[rules.required]"
                        >
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row class="row-mbn">
                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        <v-select
                          v-model="info.sDistrictId"
                          :items="sDistricts"
                          item-text="SUB_DISTRICT_NAME"
                          item-value="SUB_DISTRICT_ID"
                          label="แขวง/ตำบล *"
                          outlined
                          class="rounded-lg mt-2"
                          :disabled="shop.isFoodCenter"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        <v-text-field
                          v-model="shop.addessPostcode"
                          label="รหัสไปรษณีย์ *"
                          outlined
                          class="rounded-lg mt-2"
                          :disabled="shop.isFoodCenter"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <div v-if="!shop.isFoodCenter">
                      <div class="Subtitle1 mt-10 mb-1">ปักหมุดสถานที่</div>
                      <div class="Body2 mb-5">
                        เพื่อการจัดการสินค้าที่แม่นยำมากขึ้น
                      </div>
                      <GMap
                        :isLoading="isLoading"
                        :locations="listCompany"
                        :address="address"
                        @dragendGmapMarker="dragendGmapMarker"
                        @selectThisLocation="selectThisLocation"
                        @confirmSaveShopMap="confirmSaveShopMap"
                        @handlePlace="handlePlace"
                      />
                    </div>

                    <v-row class="row-mbn" v-if="messageCmdPltError">
                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                        lg="4"
                        xl="4"
                        class="py-0"
                      >
                        {{ messageCmdPltError }}
                      </v-col>
                    </v-row>
                  </div>

                  <!-- ศูนย์อาหาร -->
                  <div v-if="shop.isFoodCenter">
                    <div class="Subtitle1 mt-8 mb-1">ปักหมุดสถานที่</div>
                    <div class="Body2 mb-5">
                      เพื่อการจัดการสินค้าที่แม่นยำมากขึ้น
                    </div>
                    <v-btn
                      outlined
                      class="btn-normal"
                      @click="confirmDialogMap = true"
                    >
                      <v-icon
                        size="20"
                        class="pr-1"
                        color="rgba(0, 0, 0, 0.54);"
                        >place</v-icon
                      >
                      เปิดแผนที่</v-btn
                    >
                  </div>
                </div>
              </v-card>
              <div class="d-flex">
                <v-spacer></v-spacer>
                <div style="flex-wrap: wrap">
                  <v-btn outlined class="btn-normal mr-4" @click="e1 -= 1"
                    >ย้อนกลับ</v-btn
                  >
                  <v-btn
                    text
                    dark
                    class="btn-ready"
                    @click="confirmSaveRegister"
                    >ถัดไป</v-btn
                  >
                </div>
              </div>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="border_stapper rounded-0">
                <div class="ma-7">
                  <div class="d-flex flex-wrap">
                    <div>
                      <div class="Subtitle1 mb-1">ประเภทร้านอาหาร</div>
                      <div class="Body2 mb-5">
                        เลือกประเภทร้าน เพื่อเพิ่มความสะดวกในการเลือกซื้อสินค้า
                      </div>
                    </div>
                    <v-spacer></v-spacer>
                    <div
                      class="
                        container-search-input
                        d-flex
                        flex-row
                        align-center
                        none-details-messages
                      "
                    >
                      <span class="material-icons custGreen">search</span>
                      <v-text-field
                        class="ml-2"
                        @keydown.space.prevent
                        label="ค้นหาประเภทร้านอาหาร"
                        v-model="searchShopType"
                      ></v-text-field>
                    </div>
                  </div>

                  <div class="shoptyp">
                    <v-item-group>
                      <v-row>
                        <v-col
                          v-for="item in shoptypList"
                          :key="item.platformShopTypId"
                          class="col-shoptyp"
                        >
                          <v-item v-slot="{ active, toggle }">
                            <v-card
                              :color="active ? '#F6FFED' : ''"
                              class="
                                d-flex
                                flex-column
                                align-center
                                justify-space-around
                              "
                              height="180"
                              @click="toggle"
                              outlined
                              :style="
                                active ? 'border : solid 1px #469B5C;' : ''
                              "
                            >
                              <div @click="selPltForm(item.platformShopTypId)">
                                <v-img
                                  contain
                                  :src="item.platformShopTypUrl"
                                  class="img-shoptyp"
                                ></v-img>

                                <div class="text-center">
                                  {{
                                    item.platformShopTypName
                                      ? item.platformShopTypName
                                      : item.platformShopTypIdXShow
                                  }}
                                </div>
                              </div>
                            </v-card>
                          </v-item>
                        </v-col>
                      </v-row>
                    </v-item-group>
                    <div class="msgErrPlt">
                      <v-row class="row-mbn" v-if="messageCmdPltError">
                        <v-col
                          cols="12"
                          sm="12"
                          md="4"
                          lg="4"
                          xl="4"
                          class="py-0"
                        >
                          {{ messageCmdPltError }}
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </div>
              </v-card>

              <div class="d-flex">
                <v-spacer></v-spacer>
                <div style="flex-wrap: wrap">
                  <v-btn outlined class="btn-normal mr-4" @click="e1 -= 1"
                    >ย้อนกลับ</v-btn
                  >
                  <v-btn
                    text
                    dark
                    class="btn-ready"
                    @click="confirmSaveRegister"
                    >บันทึก</v-btn
                  >
                </div>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </div>
    </v-container>

    <v-dialog v-model="dialogFoodCenter" max-width="540px">
      <div class="pa-9">
        <div class="d-flex">
          <div
            class="
              container-search-input
              d-flex
              flex-row
              align-center
              mb-2
              none-details-messages
              pr-8
            "
            style="flex-grow: 1"
          >
            <span class="material-icons custGreen">search</span>
            <v-text-field
              class="ml-2"
              @keydown.space.prevent
              label="ค้นหาศูนย์อาหาร"
            ></v-text-field>
          </div>

          <button class="elevation-0 btn-signin">
            <span class="material-icons"> filter_list </span>
          </button>
        </div>
        <v-list>
          <v-list-item-group v-model="selectFoodCenterId">
            <template v-for="item in listAllShop">
              <v-list-item
                two-line
                :key="item.foodCenterId"
                @click="
                  shop.foodCenterId = item.foodCenterId
                  dialogFoodCenter = false
                  selectFoodCenter()
                "
              >
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.foodCenterName"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="item.foodCenterAddr"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider :key="item.foodCenterId"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </div>
    </v-dialog>
    <v-dialog v-model="dialogConfirm" max-width="300">
      <v-card>
        <v-card-title class="textConfirmDialogMapTitle">
          <p class="new-line">
            <span>บันทึกข้อมูลผู้ประกอบการ</span><span>เรียบร้อย</span>
          </p>
        </v-card-title>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn class="Button" color="white" @click="$router.push('/')"
            >ดำเนินการต่อ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialogMap" max-width="300">
      <v-card>
        <v-card-title class="textConfirmDialogMapTitle">
          <p>
            อนุญาตให้ “แผนที่” เข้าถึง<br />ตำแหน่ง ที่ตั้งของคุณระหว่าง<br />ที่คุณใช้งานเว็บไซต์
            หรือไม่
          </p>
        </v-card-title>
        <v-card-subtitle class="textConfirmDialogMapSubtitle">
          <p>
            ตำแหน่งที่ตั้งปัจจุบันของคุณจะแสดงบนแผนที่ และถูกใช้สำหรับเส้นทาง
            ผลการค้นหาในบริเวณ ใกล้เคียง และเวลาเดินทางโดยประมาณ
          </p>
        </v-card-subtitle>
        <v-card-actions style="padding-bottom: 16px !important">
          <v-spacer></v-spacer>
          <v-btn class="Button" color="white" @click="confirmDialogCancel"
            >ยกเลิก</v-btn
          >
          <v-btn class="Button" color="white" @click="confirmDialogComplete"
            >อนุญาต</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <Footer /> -->
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Topbar from '~/components/Topbar.vue'
//import Footer from '~/components/Footer.vue'
import { mapState } from 'vuex'

import Navigationdrawers from '~/components/Navigationdrawers.vue'
import GMap from '~/components/GMap.vue'
import { lookup } from '~/api/LookUp/GetLookUpPlatformShopTyp'
import { locLatlng } from '~/api/Location/GetAddrByLatLong'
import { AuthModel } from '~/types/AuthModel'
import { RegisterInput } from '~/types/RegisterInput'
import Address from '~/mixins/Address'
import { commandBusiness } from '~/api/Authenticate/CreateCommandBusiness'
import { groupBusiness } from '~/api/Authenticate/CommandGroupBusiness'
import { getCompany } from '~/api/Company/GetCompany'
import {
  CreateCommandBusinessInput,
  CreateCommandBusinessMCompany,
  CreateCommandBusinessMCompanyMBranch,
} from '~/types/CreateCommandBusinessInput'
import { commandPltformShopTyp } from '~/api/Authenticate/CreateCommandPlatformShopTyp'
import { command432101Group3 } from '~/api/Authenticate/Command432101Group3'
import {
  CreatePlatformShopTypInput,
  CreatePlatformShopTypMBranch,
  CreatePlatformShopTypMShop,
  CreatePlatformShopTypMShopPlatformTyp,
} from '~/types/CreatePlatformShopTypInput'

export default Address.extend({
  layout: 'default',
  // middleware: ['authenticated', 'checkRegister'],
  mixins: [Address],
  data: () => ({
    e1: 1,
    address: '' as string,
    dialogFoodCenter: false,
    dialogConfirm: false,
    messageCmdError: '' as string,
    messageCmdPltError: '' as string,
    listAllShop: [
      {
        foodCenterName: 'ศูนย์อาหาร 1',
        foodCenterAddr: 'ที่อยู่ 1',
        foodCenterId: 1,
      },
      {
        foodCenterName: 'ศูนย์อาหาร 2',
        foodCenterAddr: 'ที่อยู่ 2',
        foodCenterId: 2,
      },
      {
        foodCenterName: 'ศูนย์อาหาร 3',
        foodCenterAddr: 'ที่อยู่ 3',
        foodCenterId: 3,
      },
    ] as object[],
    selectFoodCenterId: 0 as number,
    searchShopType: '' as string,
    shopType: 0 as number,
    shoptypList: [] as [],
    subDistrictName: '' as string,
    shop: {
      isFoodCenter: true as boolean,
      shopName: '' as string,
      foodCenterId: 0 as number,
      addressNumber: '' as string,
      moo: '' as string,
      buildingName: '' as string,
      lock: '' as string,
      floor: '' as string,
      addressAlley: '' as string,
      addressRoad: '' as string,
      addressCity: 0 as number,
      addressState: 0 as number,
      addressDistrict: 0 as number,
      addessPostcode: '' as string,
      countryId: 0 as number,
    },
    rules: {
      required: (value: any) => !!value || 'กรุณาระบุ',
    },
    confirmDialogMap: false,
    isLoading: false,
    place: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
    listCompany: [],
  }),
  mounted() {
    this.getLookUpPlatformShopTyp()
    this.getAddressByLocation()
    this.getListCompany()
  },
  methods: {
    selPltForm(pltFormId: number) {
      this.shopType = pltFormId
    },
    async getLookUpPlatformShopTyp() {
      try {
        const response = await lookup.getLookUpPlatformShopTyp(
          { pagingFrom: '0', pagingTo: '100', search: this.searchShopType },
          this.auth.globalCode,
          this.auth.channelName
        )
        this.shoptypList = response && response.data ? response.data : []
      } catch (e) {
        console.log(e)
      }
    },
    async getAddressByLocation() {
      const response = await locLatlng.GetAddrByLatLong(
        this.coordinates.lat
          ? String(this.coordinates.lat)
          : String(this.register.lat),
        this.coordinates.lng
          ? String(this.coordinates.lng)
          : String(this.register.lng)
      )
      if (response.length > 0) {
        const address = response[0]
        this.address = `${address.streetName}\r\n ตำบล${address.sDistrictIdXShow} อำเภอ${address.districtIdXShow} จังหวัด${address.provinceIdXShow} ${address.zipCode}`
        this.shop.addressNumber = address.houseNo
        this.shop.moo = address.mooNo
        this.shop.buildingName = address.buildingName
        // this.shop.lock = address.houseNo
        this.shop.floor = address.floorNo
        this.shop.addressAlley = address.soiName
        this.shop.addressRoad = address.streetName
        this.shop.addressState = address.provinceId
        this.shop.addressDistrict = address.districtId
        // this.shop.addressCity = address.sDistrictId
        this.subDistrictName = address.sDistrictIdXShow
        this.shop.countryId = address.countryId
        this.shop.addessPostcode = address.zipCode
      }
    },
    async createCmdBusiness() {
      const loader = this.$loading.show()
      try {
        const cmdGrpBusinessRes = await groupBusiness.commandGroupBusiness(
          0,
          this.auth.globalCode,
          this.auth.channelName
        )
        let { alert, mCompany } = cmdGrpBusinessRes
        if (alert && alert.length > 0 && mCompany) {
          if (alert[0].alertId === -1) {
            const { mBranch } = mCompany
            const mBranchReq: CreateCommandBusinessMCompanyMBranch = {
              branchCode: mBranch[0].branchCode,
              branchName: this.shop.shopName,
              branchId: mBranch[0].branchId,
              shipPlaceId: mBranch[0].shipPlaceId,
              businessGrpIdx: this.shop.isFoodCenter ? 1 : 2,
              cObjId: mBranch[0].cObjId,
              comId: mBranch[0].comId,
              depId: mBranch[0].depId,
            }
            const listMBranch: CreateCommandBusinessMCompanyMBranch[] = []
            listMBranch.push(mBranchReq)
            const mComReq: CreateCommandBusinessMCompany = {
              comId: mCompany.comId,
              comCode: mCompany.comCode,
              comName: this.shop.shopName,
              addr: mCompany.address,
              businessTypIdx: mCompany.businessTypIdx,
              projCustComCode: mCompany.projCustComCode,
              presentVatRptFlag: mCompany.presentVatRptFlag,
              vatRptFlag: mCompany.vatRptFlag,
              copyComId: mCompany.copyComId,
              finChartCount: mCompany.finChartCount,
              tel: mCompany.tel,
              copyAllLevelFlag: mCompany.copyAllLevelFlag,
              email: mCompany.email,
              website: mCompany.website,
              taxNo: mCompany.taxNo,
              apvFlag: 'Y',
              cObjId: mCompany.cObjId,
              depId: mCompany.depId,
              houseNo: mCompany.houseNo,
              buildingName: mCompany.buildingName,
              roomNo: mCompany.roomNo,
              floorNo: mCompany.floorNo,
              soiName: mCompany.soiName,
              villageName: mCompany.villageName,
              mooNo: mCompany.mooNo,
              streetName: mCompany.streetName,
              sDistrictId: mCompany.sDistrictId,
              districtId: mCompany.districtId,
              provinceId: mCompany.provinceId,
              zipCode: mCompany.zipCode,
              newLineColIdx: mCompany.newLineColIdx,
              latitude: mCompany.latitude,
              longtitude: mCompany.longtitude,
              mobile: mCompany.mobile,
              mBranch: listMBranch,
            }
            const listMCompany: CreateCommandBusinessMCompany[] = []
            listMCompany.push(mComReq)
            const request: CreateCommandBusinessInput = {
              mCompany: listMCompany,
            }
            const createCmdBusinessRes =
              await commandBusiness.createCmdBusiness(
                request,
                this.auth.globalCode,
                this.auth.channelName
              )
            alert = createCmdBusinessRes.alert
            if (alert.length > 0) {
              if (alert[0].alertApiCode === '200') {
                this.e1 = 2
                this.getListCompany()
              } else {
                this.messageCmdError = alert[0].alertDisplay
              }
            }
          } else {
            this.messageCmdError = alert[0].alertDisplay
          }
        }
        loader.hide()
      } catch (err) {
        loader.hide()
      }
    },
    selectFoodCenter() {},

    confirmDialogCancel() {
      this.confirmDialogMap = false
    },
    confirmDialogComplete() {
      this.$router.push({
        path: '/register/shopmap',
      })
    },
    async confirmSaveRegister() {
      const loader = this.$loading.show()
      try {
        const command432101Group3Res =
          await command432101Group3.command432101Group3(
            0,
            this.auth.globalCode,
            this.auth.channelName
          )
        let { alert, mShop } = command432101Group3Res
        if (alert && alert.length > 0 && mShop) {
          if (alert[0].alertId === -1) {
            const { mBranch } = mShop
            const mBranchReq: CreatePlatformShopTypMBranch = {
              branchId: mBranch[0].branchId,
              branchCode: mBranch[0].branchCode,
              branchName: mBranch[0].branchName,
              mainBranchFlag: mBranch[0].mainBranchFlag,
              headOfficeFlag: mBranch[0].headOfficeFlag,
              houseNo: this.shop.addressNumber,
              platformComBillFlag: mBranch[0].platformComBillFlag,
              buildingName: this.shop.buildingName,
              businessGrpIdx: mBranch[0].businessGrpIdx,
              roomNo: mBranch[0].roomNo,
              floorNo: this.shop.floor,
              soiName: this.shop.addressAlley,
              villageName: mBranch[0].villageName,
              mooNo: this.shop.moo,
              streetName: this.shop.addressRoad,
              sDistrictId: this.shop.addressCity,
              districtId: this.shop.addressDistrict,
              provinceId: this.shop.addressState,
              countryId: this.shop.countryId,
              addr: this.address,
              addrEn: mBranch[0].addrEn,
              zipCode: this.shop.addessPostcode,
              newLineColIdx: mBranch[0].newLineColIdx,
              latitude: String(this.coordinates.lat),
              longtitude: String(this.coordinates.lng),
              tel: mBranch[0].tel,
              fax: mBranch[0].fax,
              mobile: mBranch[0].mobile,
              email: mBranch[0].email,
              shipPlaceId: mBranch[0].shipPlaceId,
              activeTyp: mBranch[0].activeTyp,
              remark: mBranch[0].remark,
              comId: mBranch[0].comId,
              depId: mBranch[0].depId,
              cObjId: mBranch[0].cObjId,
              contactAddrItem: mBranch[0].contactAddrItem,
            }

            const listMBranchReq: CreatePlatformShopTypMBranch[] = []
            listMBranchReq.push(mBranchReq)
            const listMShopPlatformShopTypReq: CreatePlatformShopTypMShopPlatformTyp[] =
              []
            if (this.e1 === 3) {
              const mShopPlatformShopTypReq: CreatePlatformShopTypMShopPlatformTyp =
                {
                  comId: mBranch[0].comId,
                  depId: mBranch[0].depId,
                  shopId: mShop.shopId,
                  platformShopTypId: this.shopType,
                  // xsysId,
                  // activeTyp,
                  // itemNo: 1,
                  // remark,
                  cObjId: mShop.cObjId,
                }
              listMShopPlatformShopTypReq.push(mShopPlatformShopTypReq)
            }
            const mShopReq: CreatePlatformShopTypMShop = {
              shopId: mShop.shopId,
              shopCode: mShop.shopCode,
              shopName: mShop.shopName,
              shopNameEn: mShop.shopNameEn,
              whId: mShop.whId,
              cashBasketId: mShop.cashBasketId,
              defArInvDepId: mShop.defArInvDepId,
              rvCusId: mShop.rvCusId,
              activeTyp: mShop.activeTyp,
              shopDepId: mShop.shopDepId,
              remark: mShop.remark,
              apvFlag: this.e1 === 2 ? 'N' : 'Y',
              comId: mShop.comId,
              headOfficeFlag: mShop.headOfficeFlag,
              depId: mShop.depId,
              cObjId: mShop.cObjId,
              mBranch: listMBranchReq,
              mShopPlatformShopTyp:
                this.e1 === 3
                  ? listMShopPlatformShopTypReq
                  : mShop.mShopPlatformShopTyp,
            }
            const listMShopReq: CreatePlatformShopTypMShop[] = []
            listMShopReq.push(mShopReq)
            const request: CreatePlatformShopTypInput = { mShop: listMShopReq }
            const commandPltformShopTypRes =
              await commandPltformShopTyp.createPlatformShopTyp(
                request,
                this.auth.globalCode,
                this.auth.channelName
              )
            const { data } = commandPltformShopTypRes
            if (data.alert.length > 0) {
              if (data.alert[0].alertApiCode === '200') {
                if (this.e1 === 2) {
                  this.e1 = 3
                } else {
                  this.dialogConfirm = true
                }
              } else {
                this.messageCmdPltError = data.alert[0].alertDisplay
              }
            }
          } else {
            this.messageCmdPltError = alert[0].alertDisplay
          }
        }
        loader.hide()
      } catch (err) {
        loader.hide()
      }
    },
    async dragendGmapMarker(location: any) {
      this.coordinates = {
        lat: location.lat,
        lng: location.lng,
      }
      this.getAddressByLocation()
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
    confirmSaveShopMap() {
      console.log('confirm')
    },
    async getListCompany() {
      const response = await getCompany.getCompany(
        this.auth.globalCode,
        this.auth.channelName
      )
      this.listCompany = response.getShopResponse
    },
  },

  created() {
    this.e1 = this.$route.query.e1 ? Number(this.$route.query.e1) : this.e1
  },
  computed: {
    ...mapState({
      register: (state: any): RegisterInput => state.registerStore.register,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
  components: {
    Topbar,
    //Footer,
    GMap,
    Navigationdrawers,
  },
  watch: {
    searchShopType() {
      this.getLookUpPlatformShopTyp()
    },
    e1() {
      this.e1 === 2 && this.$route.query.lat
        ? null
        : this.$router.push({
            path: '/register/shop',
            query: { e1: String(this.e1) },
          })
    },
  },
})
</script>
<style>
@import url('~/assets/css/Shop.css');
</style>
