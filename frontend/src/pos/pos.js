import Vue from 'vue';
import App from './App';
import router from '../router';
import store from '../store/store';
import { config } from '../store/api';

config.addPosUserHeader = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
