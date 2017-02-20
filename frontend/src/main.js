import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/store';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
