<template>
  <div class="navbar">
    <v-navigation-drawer v-model="sidebar">
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <span class="hidden-sm-and-up">
        <v-app-bar-nav-icon @click="sidebar = !sidebar"> </v-app-bar-nav-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn text v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
        },
      ],
    }
  },
  data() {
    return {
      appTitle: 'Promptsong - พร้อมส่ง',
      sidebar: false,
      menuItems: [
        { title: 'Home', path: '/', icon: 'home' },
        { title: 'Product', path: '/product', icon: 'flutter_dash' },
        { title: 'About', path: '/about', icon: 'info' },
        { title: 'Login', path: '/auth', icon: 'login' },
      ],
    }
  },
})
</script>
