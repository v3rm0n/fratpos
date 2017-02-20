<template>
  <div class="login-box">
    <div class="login-logo">
      <a href="#"><b>korp!</b>IS</a>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <div class="form-group has-feedback">
        <input type="email" v-model="username" class="form-control" name="username" placeholder="E-post"/>
        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input type="password" v-model="password" class="form-control" name="password" placeholder="Parool"/>
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="row">
        <div class="col-xs-8">
        </div>
        <!-- /.col -->
        <div class="col-xs-4">
          <button type="submit" @click="submit()" class="btn btn-primary btn-block btn-flat">Sisene</button>
        </div>
        <!-- /.col -->
      </div>
      <div>
        <br/>
        <div class="alert alert-danger wrong-password">
          Vale kasutajanimi ja/või parool
        </div>
      </div>
    </div>
    <!-- /.login-box-body -->
  </div>
</template>

<script>

  import { LOGIN } from 'store/mutations';
  import router from '../router';

  export default{
    mounted() {
      document.body.className += ' hold-transition';
      document.body.className += ' login-page';
    },
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      submit() {
        this.$store.dispatch(LOGIN, { username: this.username, password: this.password }).then(() => {
          router.push('users');
        });
      },
    },
  };
</script>

<style scoped>
  .wrong-password {
    margin-bottom: 0;
  }
</style>
