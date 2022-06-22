<template>
  <div>
    <GmapMap
      class="asdasd02"
      id="as03"
      ref="mapRef"
      style="width: 100%; height: 500px; border: 1px solid #dbdee7"
      :center="{ lat: coordinates.lat, lng: coordinates.lng }"
      :zoom="20"
      :options="{
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        disableDefaultUi: true,
      }"
      @click="infoOpened = false"
    >
      <GmapMarker
        class="asdasd01"
        id="as02"
        :position="mapCoordinates"
        :draggable="true"
        :clickable="true"
        @click="infoOpened = !infoOpened"
        @dragend="dragendGmapMarker"
      />
      <GmapInfoWindow
        class="asdasd"
        id="as01"
        :position="mapCoordinates"
        :options="{
          pixelOffset: { width: 0, height: -40 },
        }"
        :opened="infoOpened"
        @closeclick="infoOpened = false"
      >
        <div @click="$emit('selectThisLocation')">
          <div
            style="
              font-family: Prompt;
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 21px;
              color: #ffffff;
            "
          >
            เลือกตำแหน่งนี้ >
          </div>
          <div
            style="
              font-family: Prompt;
              font-style: normal;
              font-weight: 500;
              font-size: 16px;
              line-height: 24px;
              color: #ffffff;
            "
          >
            {{ address }}
          </div>
        </div>
      </GmapInfoWindow>
    </GmapMap>
    <div id="searchlocation">
      <div
        class="
          container-search-input
          d-flex
          flex-row
          align-center
          mt-6
          none-details-messages
        "
      >
        <span class="material-icons custGreen">search</span>
        <v-autocomplete
          v-model="place"
          :items="locations"
          :loading="isLoading"
          item-text="companyName"
          label="ค้นหาสถานที่"
          clearable
          append-icon=""
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                กรุณาเลือก
                <strong>สถานที่</strong>
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:selection="{ attr, on, item, selected }">
            <v-chip
              v-bind="attr"
              :input-value="selected"
              v-on="on"
              close
              @click:close="place = ''"
            >
              <!-- <v-icon left> mdi-bitcoin </v-icon> -->
              <span v-text="item.companyName"></span>
            </v-chip>
          </template>
          <template v-slot:item="{ item }">
            <v-list-item-avatar @click="dialogSaveShop = true">
              <img src="/images/place.svg" />
            </v-list-item-avatar>
            <v-list-item-content @click="dialogSaveShop = true">
              <v-list-item-title v-text="item.companyName"></v-list-item-title>
              <v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-text="`เลือก`" @click="dialogSaveShop = true">
            </v-list-item-action>
          </template>
        </v-autocomplete>
      </div>
    </div>
    <v-dialog v-model="dialogSaveShop" max-width="300">
      <v-card>
        <v-card-title class="textConfirmDialogMapTitle">
          <p>บันทึกข้อมูลผู้ประกอบการเรียบร้อย</p>
        </v-card-title>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn class="Button" color="white" @click="confirmSaveShopMap"
            >ดำเนินการต่อ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    isLoading: Boolean,
    locations: Array,
    address: String,
  },
  data() {
    return {
      zoom: 8,
      coordinates: {
        lat: 0,
        lng: 0,
      },
      map: null,
      infoOpened: false,
      dialogSaveShop: false,
      place: '',
    }
  },
  created() {
    this.$getLocation({})
      .then((coordinates) => {
        this.coordinates = coordinates
      })
      .catch((error) => alert(error))
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then((map) => (this.map = map))
  },
  methods: {
    dragendGmapMarker(location) {
      this.$emit('dragendGmapMarker', {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      })
    },
    confirmSaveShopMap() {
      this.dialogSaveShop = false
      this.$emit('confirmSaveShopMap')
    },
  },
  computed: {
    mapCoordinates() {
      if (!this.map) {
        return {
          lat: 0,
          lng: 0,
        }
      }
      return {
        lat: this.map.getCenter().lat(),
        lng: this.map.getCenter().lng(),
      }
    },
  },
  watch: {
    place() {
      this.$emit('handlePlace', this.place)
    },
  },
})
</script>
<style scoped></style>
