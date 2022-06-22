<template>
  <div>
    <p>
      e-mail :
      <input type="email" v-model="email" style="border: 1px solid black" />
    </p>
    <p>password : <input type="password" style="border: 1px solid black" /></p>
    {{ email }}
    <v-btn @click="next">Sign In</v-btn>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => ({
    email: '' as string,
    mockAccount: {
      email: 'zxcasd@gmail.com',
    },
  }),
  methods: {
    next() {
      if (this.email === this.mockAccount.email) {
        this.$router.push(`/singin/${this.email}`)
      }
    },
  },
})
</script>
