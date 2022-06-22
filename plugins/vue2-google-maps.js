import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyD9ROQI5qVvLhM_WguUMNJbhrtejYQ4lOo',
  },
  installComponents: true,
})
