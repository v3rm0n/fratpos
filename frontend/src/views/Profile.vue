<template>
  <Page v-if="user" title="Profiil">
    <div class="row">
      <div class="col-md-3">
        <!-- Profile Image -->
        <div class="box box-primary">
          <div class="box-body box-profile">

            <h3 class="profile-username text-center">{{fullName}}</h3>

            <p class="text-muted text-center">{{user.beerName}}</p>

            <ul class="list-group list-group-unbordered">
              <li class="list-group-item">
                <b>Staatus</b> <a class="pull-right">{{user.status.name}}</a>
              </li>
              <li class="list-group-item">
                <b>Kassa saldo</b> <a class="pull-right">{{user.balance}}</a>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="user.userProfile" class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title">Muu info</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body">

            <div v-if="user.userProfile.email">
              <strong><i class="fa fa-envelope margin-r-5"></i> E-post</strong>
              <p class="text-muted"><a :href="'mailto:' + user.userProfile.email">{{user.userProfile.email}}</a></p>
              <hr/>
            </div>

            <div v-if="user.userProfile.address">
              <strong><i class="fa fa-map-marker margin-r-5"></i> Elukoht</strong>
              <p class="text-muted">{{user.userProfile.address}}</p>
              <hr/>
            </div>

            <div v-if="user.userProfile.phone">
              <strong><i class="fa fa-phone margin-r-5"></i> Telefon</strong>
              <p class="text-muted">{{user.userProfile.phone}}</p>
              <hr/>
            </div>

            <div v-if="user.userProfile.birthdate">
              <strong><i class="fa fa-gift margin-r-5"></i> Sünniaeg</strong>
              <p class="text-muted">{{formattedBirthdate}}</p>
              <hr/>
            </div>

            <strong><i class="fa fa-lock margin-r-5"></i> Rollid</strong>
            <p>
              <span class="label label-success" style="margin-right: 5px;white-space: normal;" v-for="role in user.roles">{{role.name}} <i class="fa fa-times" style="cursor: pointer;" @click="removeRole(role)"></i></span>
            </p>
            <div v-authorize="'ROLES_MODIFY'" v-if="$store.state.roles.length > 0">
              <select @change="addRole()" class="form-control" v-model="newRole">
                <option value="">Lisa roll...</option>
                <option v-for="role in $store.state.roles" :value="role">{{role.name}}</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
  import Page from 'components/Page';
  import Box from 'components/Box';
  import authorize from 'directives/authorize';
  import moment from 'moment';
  import { FETCH_ROLES, SWITCH_USER } from 'store/mutations';
  import { mapState } from 'vuex';

  export default {
    name: 'Profile',
    components: {
      Page,
      Box,
      authorize,
    },
    methods: {
      addRole() {

      },
      removeRole() {

      },
    },
    computed: mapState({
      user: 'currentUser',
      fullName(state) {
        if (state.currentUser) {
          return `${state.currentUser.firstName} ${state.currentUser.lastName}`;
        }
        return null;
      },
      formattedBirthdate(state) {
        return moment(state.currentUser.userProfile.formattedBirthdate, 'HH:mm DD.MM.YYYY').format('LL');
      },
    }),
    data() {
      return {
        newRole: null,
      };
    },
    beforeMount() {
      this.$store.dispatch(FETCH_ROLES);
      const id = this.$route.params.id;
      if (id === undefined || id === this.$store.state.loggedInUser.id) {
        this.$store.dispatch(SWITCH_USER, { user: this.$store.state.loggedInUser });
      } else {
        this.$store.dispatch(SWITCH_USER, { id });
      }
    },
  };
</script>
