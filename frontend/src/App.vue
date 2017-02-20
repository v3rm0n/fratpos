<template>
  <div id="app">
    <div v-if="isLoggedIn()" class="hold-transition skin-yellow sidebar-mini">
      <mainHeader></mainHeader>
      <sideMenu></sideMenu>
      <router-view class="content-wrapper"></router-view>
      <mainFooter></mainFooter>
    </div>
    <div v-else>
      <login></login>
    </div>
  </div>
</template>

<script>
  import 'admin-lte/bootstrap/css/bootstrap.css';
  import 'admin-lte/dist/css/AdminLTE.css';
  import 'admin-lte/dist/css/skins/skin-yellow.css';
  import 'ionicons/dist/css/ionicons.css';
  import 'font-awesome/css/font-awesome.css';

  import 'pace-progress/themes/yellow/pace-theme-flat-top.css';
  // import 'pace-progress';

  import MainHeader from './components/Header';
  import MainFooter from './components/Footer';
  import SideMenu from './components/SideMenu';
  import Login from './views/Login';
  import router from './router';
  import { FETCH_USER_ME } from './store/mutations';

  export default {
    name: 'app',
    components: {
      MainHeader,
      MainFooter,
      SideMenu,
      Login,
    },
    beforeMount() {
      this.$store.dispatch(FETCH_USER_ME).then(() => {
        router.push('users');
      });
    },
    methods: {
      isLoggedIn() {
        return this.$store.state.loggedInUser != null;
      },
    },
  };
</script>
