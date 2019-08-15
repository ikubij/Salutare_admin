// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";

//Import vueX for state Management
import Vuex from 'vuex'

Vue.use(Vuex)

// GoogleMap
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBkiC5jKXqMYjOSsMtiRbAEsnqOx0bElJQ",
   // key: "AIzaSyA0QHikg8YnIOu6Wgv6L-WXYYdRdYGZWx0",
  //  key: "AIzaSyAg1pj14hTbCBv55xv-WKbOfIlXrSU6R8g",
    libraries: "places" // necessary for places input
  }
});

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist
  }
});

// Webpack & babel access vm due to the way it scopes modules.
//window.app = vm

