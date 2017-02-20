<template>
  <div id="app">
    <div class="container"><br/>
      <div class="row">
        <div class="col-md-6 col-xs-6">
          <h3>korp! Kassa</h3>
        </div>
        <div class="col-md-6 col-xs-6">
          <button id="feedback-btn" @click="openFeedbackDialog()" class="btn btn-info pull-right">Tagasiside</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div v-if="userSelected" class="form-search userform has-feedback input-group has-success">
            <input type="text" placeholder="Kliendi nimi" v-model="user" data-animation="am-flip-x" @click="clear()" class="form-control search-query"/><span class="input-group-btn">
          <button data-type="last" @click="openInfoDialog(user)" class="btn btn-primary">Info</button></span>
          </div>
          <div v-else class="form-search userform has-feedback search-only has-error"><i class="search-icon glyphicon glyphicon-search"></i>
            <input id="usernotselected" type="text" placeholder="Kliendi nimi" v-model="user" data-animation="am-flip-x" class="form-control search-query"/><span class="glyphicon glyphicon-remove form-control-feedback"></span>
          </div>
        </div>
        <div class="col-md-8">
          <button href="#" @click="toggleShowAllProducts()" v-if="haveZeroQuantity" class="btn pull-right">Kuva kõiki tooteid</button>
        </div>
      </div>
      <br class="visible-xs visible-sm"/>
      <div class="row">
        <div class="col-md-12">
          <table class="table table-bordered table-hover table-condensed table-striped">
            <thead>
            <tr>
              <th>Toode</th>
              <th class="choosequantity">Kogus</th>
              <th class="quantity">Laoseis</th>
              <th class="price">Hind</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in filteredProducts" :class="{danger: product.quantity <= 0}">
              <td>{{product.name}}</td>
              <td><span @click="changeQuantity(product, 1)" class="glyphicon glyphicon-plus"></span>{{quantity(product)}}<span @click="changeQuantity(product, -1)" class="glyphicon glyphicon-minus"></span></td>
              <td ng-bind="product.quantity"></td>
              <td>{{product.price}} €</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <h2><span>Summa:</span> {{sum}} €</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="btn-group">
            <button v-for="paytype in $store.state.paytypes" @click="pay(paytype)" :disabled="isDisabled(paytype)" disabled="disabled" class="btn btn-lg btn-primary">{{paytype.name}}</button>
          </div>
        </div>
      </div>
      <br/>
      <div class="row">
        <div class="col-md-12">
          <h4>Viimased tehingud</h4>
          <table v-if="$store.state.transactions.length > 0" class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>Aeg</th>
              <th>Nimi</th>
              <th>Summa</th>
              <th>Makseviis</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="transaction in filteredTransactions" @click="openTransactionDialog(transaction)">
              <td>{{transaction.formattedTime}}</td>
              <td>{{transaction.user.label}}</td>
              <td>{{transaction.sum}} €</td>
              <td>{{transaction.paytype}}</td>
            </tr>
            <tr v-if="showAllTransactions" @click="toggleTransactions(false)">
              <td colspan="4" style="text-align:center"><span class="glyphicon glyphicon-arrow-up"></span><span>Näita vähem</span><span class="glyphicon glyphicon-arrow-up"></span></td>
            </tr>
            <tr v-else @click="toggleTransactions(true)">
              <td colspan="4" style="text-align:center"><span class="glyphicon glyphicon-arrow-down"></span><span>Näita kõiki</span><span class="glyphicon glyphicon-arrow-down"></span></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'bootflat/css/bootstrap.min.css';
  import 'bootflat/bootflat/css/bootflat.css';
  import 'toastr/build/toastr.css';

  import { FETCH_USERS, FETCH_PRODUCTS, FETCH_TRANSACTIONS, FETCH_PAYTYPES } from 'store/mutations';
  import sortBy from 'lodash/fp/sortBy';
  import filter from 'lodash/fp/filter';

  // TODO: focus

  export default {
    name: 'app',
    beforeMount() {
      this.$store.dispatch(FETCH_USERS);
      this.$store.dispatch(FETCH_PRODUCTS);
      this.$store.dispatch(FETCH_TRANSACTIONS);
      this.$store.dispatch(FETCH_PAYTYPES);
    },
    data() {
      return {
        user: null,
        showAllProducts: false,
        showAllTransactions: false,
        selectedProducts: [],
      };
    },
    methods: {
      toggleTransactions(show) {
        this.showAllTransactions = show;
      },
      toggleShowAllProducts() {
        this.showAllProducts = !this.showAllProducts;
      },
      openFeedbackDialog() {
      },
      openInfoDialog() {
      },
      clear() {
        this.user = null;
      },
      isDisabled(paytype) {
        if (this.user && this.user.status) {
          return !paytype.allowedForStatus.some(status => status.name === this.user.status.name);
        }
        return true;
      },
      pay() {
      },
    },
    computed: {
      userSelected() {
        return this.user != null;
      },
      haveZeroQuantity() {
        return this.$store.state.products.some(product => product.quantity <= 0);
      },
      sum() {
        return this.selectedProducts.reduce((sum, product) =>
          sum + (product.price * product.quantity)
          , 0);
      },
      showAllTransactions() {
      },
      filteredProducts() {
        const filteredProducts = sortBy(this.$store.state.products)('name');
        if (this.showAllProducts || !this.$store.state.products) {
          return filteredProducts;
        }
        return filter(filteredProducts)(product => product.quantity > 0);
      },
      filteredTransactions() {
      },
    },
  };
</script>

<style>
  .admin.container {
    padding-top: 50px;
    padding-bottom: 50px;
  }

  .table th.choosequantity {
    width: 30%;
  }

  .table th.quantity {
    width: 10%;
  }

  .table th.price {
    width: 10%;
  }

  .userform span.glyphicon.form-control-feedback {
    top: 0px;
  }

  .userform span.input-group-btn {
    top: -10px;
  }

  .userform {
    min-height: 55px;
  }

  .userform.search-only .form-control {
    padding-left: 40px;
  }

  .admin .table-hover tbody tr {
    cursor: pointer;
  }

  [ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
    display: none !important;
  }

  .modal-backdrop.am-fade {
    opacity: .5;
    transition: opacity .15s linear;
  }

  .modal-backdrop.am-fade.ng-enter {
    opacity: 0;
  }

  .modal-backdrop.am-fade.ng-enter, .modal-backdrop.am-fade.ng-enter.ng-enter-active {
    opacity: .5;
  }

  .modal-backdrop.am-fade.ng-leave {
    opacity: .5;
  }

  .modal-backdrop.am-fade.ng-leave, .modal-backdrop.am-fade.ng-leave-active {
    opacity: 0;
  }
</style>
