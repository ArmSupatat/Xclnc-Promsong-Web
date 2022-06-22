<template>
  <div class="text-center">
    <h1>this is email : {{ email }}</h1>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      email: this.$route.params.email,
    }
  },
})
</script>
