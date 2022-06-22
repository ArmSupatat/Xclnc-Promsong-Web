<template>
  <div class="text-center">
    <p>Path url : http://localhost:3000/signin/</p>
    <div><h1>this is Sign-in</h1></div>
    <signin />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import component from path/name  file
import signin from '~/components/singin.vue'
export default Vue.extend({
  components: {
    signin,
  },
})
</script>
