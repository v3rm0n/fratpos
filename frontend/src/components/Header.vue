<template>
  <!-- Main Header -->
  <header class="main-header">

    <!-- Logo -->
    <a href="#" class="logo">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>L</b>IS</span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><b>korp!</b>IS</span>
    </a>

    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>
      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- User Account Menu -->
          <li class="user user-menu">
            <!-- Menu Toggle Button -->
            <router-link to="/profile">
              <span><i class="fa fa-user"></i> <span>{{user.label}}</span></span>
            </router-link>
          </li>
          <li>
            <a href="#" @click="logout()"><i class="fa fa-sign-out"></i> Logi välja</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>

  import { LOGOUT } from 'store/mutations';

  export default {
    data() {
      return {
        user: this.$store.state.loggedInUser,
      };
    },
    methods: {
      logout() {
        this.$store.dispatch(LOGOUT);
      },
    },
  };
</script>
