<template>
  <div class="newyear-wrapper">
    <modal
      name="modal-newyear"
      :adaptive="true"
      height="60%"
      @closed="$modal.hide('modal-newyear')"
    >
      <div class="modal-newyear">
        <div class="px-6 py-6 newyear-title">
          <p>ประกาศวันหยุดช่วงเทศกาลปีใหม่</p>
          <p class="ma-0">ในวันที่ 31 ธันวาคม 2564 - 4 มกราคม 2565</p>
        </div>
        <div class="pa-6 newyear-content">
          <div class="part">
            <strong>การจัดส่งสินค้าก่อนปีใหม่</strong>
            <ul>
              <li>วันสุดท้ายที่รับออเดอร์ 29 ธันวาคม 2564</li>
              <li>วันสุดท้ายของการจัดส่ง 30 ธันวาคม 2564</li>
            </ul>
          </div>
          <div class="part my-6">
            <strong>การจัดส่งสินค้าหลังปีใหม่</strong>
            <ul>
              <li>เริ่มเปิดรับออเดอร์ 4 มกราคม 2565</li>
              <li>เริ่มจัดส่งสินค้า 5 มกราคม 2565 เป็นต้นไป</li>
            </ul>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted() {
    this.$modal.show('modal-newyear')
  },
})
</script>
<style lang="scss" scoped>
.modal-newyear {
  height: 100%;
  .newyear-title {
    color: #fff;
    font-size: 1.25rem;
    background-color: #dd6240;
  }
  .newyear-content {
    color: #51a206;
    overflow-y: auto;
  }
  @media only screen and (max-width: 768px) {
    .newyear-title {
      font-size: 1rem;
    }
    .newyear-content {
      height: calc(100% - 34%);
    }
  }
}
</style>
