<template>
  <div>
    <Page title="Liikmed">
      <Box>
        <div slot="tools" class="input-group input-group-sm search">
          <input type="text" v-model="filter" placeholder="Kasutaja nimi" class="form-control pull-right"/>
          <div class="input-group-addon">
            <i class="fa fa-search"></i>
          </div>
        </div>
        <div slot="body">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th @click="sort('status.name')">Staatus</th>
              <th @click="sort('firstName')">Eesnimi</th>
              <th @click="sort('lastName')">Perenimi</th>
              <th @click="sort('beerName')">Õllenimi</th>
              <th @click="sort('balance')">Saldo</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in filteredUsers" @click="openProfile(user.id)">
              <td>{{user.status ? user.status.name : ''}}</td>
              <td>{{user.firstName}}</td>
              <td>{{user.lastName}}</td>
              <td>{{user.beerName}}</td>
              <td>{{user.balance}} €</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th>Kokku</th>
              <th>{{totalBalance}} €</th>
            </tr>
            </tfoot>
          </table>
          <br/>
        </div>
        <div slot="footer">
          <pagination :pagination="pagination" :callback="paginate" size="small" class="no-margin pull-right"></pagination>
          <button type="button" @click="showDialog = true" class="btn btn-primary"><i class="fa fa-plus"></i> Lisa liige</button>
        </div>
      </Box>
    </Page>
    <UserDialog id="userDialog" :show="showDialog" @close="showDialog = false" @save="userCreated"></UserDialog>
  </div>
</template>

<script>
  import Page from 'components/Page';
  import Box from 'components/Box';
  import { FETCH_USERS } from 'store/mutations';
  import orderBy from 'lodash/fp/orderBy';
  import UserDialog from 'views/dialog/User';
  import Pagination from 'vue-bootstrap-pagination';
  import router from '../router';

  export default {
    name: 'Users',
    components: {
      Page,
      Box,
      UserDialog,
      Pagination,
    },
    computed: {
      totalBalance() {
        const users = this.filteredUsers;
        if (users !== undefined) {
          return users.reduce((sum, user) => sum + user.balance, 0);
        }
        return 0;
      },
      filteredUsers() {
        let users = this.$store.state.users;
        this.pagination.total = users.length;
        this.pagination.last_page = Math.ceil(users.length / this.pagination.per_page);
        if (this.filter !== null && this.filter.length > 0) {
          users = users.filter(user =>
            user.label.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
          );
        }
        users = orderBy([this.asc ? 'asc' : 'desc'])([this.sortfield])(users);
        const currentPage = this.pagination.current_page;
        return users.slice((currentPage - 1) * 10, currentPage * 10);
      },
    },
    methods: {
      userCreated() {
        this.showDialog = false;
        // this.openProfile(user.id);
      },
      paginate() {
        return this.filteredUsers;
      },
      openProfile(id) {
        router.push(`/profile/${id}`);
      },
      sort(sortfield) {
        if (this.sortfield === sortfield) {
          this.asc = !this.asc;
        }
        this.sortfield = sortfield;
      },
    },
    beforeMount() {
      this.$store.dispatch(FETCH_USERS);
    },
    data() {
      return {
        filter: null,
        sortfield: 'label',
        asc: false,
        showDialog: false,
        pagination: {
          total: 0,
          per_page: 10,
          current_page: 1,
          last_page: 0,
          to: 10,
        },
      };
    },
  };
</script>

<style>
  .search {
    width: 150px;
  }

  table thead tr {
    cursor: pointer;
  }

  .no-margin ul {
    margin: 0 !important;
  }
</style>
