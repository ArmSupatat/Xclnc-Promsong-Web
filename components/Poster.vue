<template>
  <div>
    <v-carousel
      cycle
      hide-delimiter-background
      show-arrows-on-hover
      class="lg-responsive"
    >
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        :src="item.src"
      ></v-carousel-item>
    </v-carousel>
    <v-carousel
      cycle
      hide-delimiters
      :show-arrows="false"
      class="xs-responsive"
    >
      <v-carousel-item
        v-for="(responsiveItems, i) in responsiveItems"
        :key="i"
        :src="responsiveItems.src"
      ></v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: '/images/Promptsong01.jpg',
        },
        {
          src: '/images/Promptsong02.jpg',
        },
      ],
      responsiveItems: [
        {
          src: '/images/Mobile_Promptsong01.jpg',
        },
        {
          src: '/images/Mobile_Promptsong02.jpg',
        },
      ],
    }
  },
}
</script>

<style scoped>
@import url('~/assets/css/Poster.css');
</style>
