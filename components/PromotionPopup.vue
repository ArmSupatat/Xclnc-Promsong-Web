<template>
  <div class="promotion-wrapper">
    <modal
      name="modal-promotion"
      class="modal-promotion"
      :adaptive="true"
      width="50%"
      height="600px"
      @closed="$modal.hide('modal-promotion')"
    >
      <img src="/popup/songkarnprompt-01.png" />
    </modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted() {
    this.$modal.show('modal-promotion')
  },
})
</script>
<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
