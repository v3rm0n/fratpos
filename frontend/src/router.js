import Vue from 'vue';
import VueRouter from 'vue-router';
import Profile from 'views/Profile';
import Users from 'views/Users';
import Statuses from 'views/Statuses';
import Income from 'views/Income';
import Obligations from 'views/Obligations';
import Roles from 'views/Roles';
import Accounts from 'views/Accounts';
import Journals from 'views/Journals';
import Reports from 'views/Reports';
import Products from 'views/pos/Products';
import Transactions from 'views/pos/Transactions';
import Paytypes from 'views/pos/Paytypes';
import Stocktakings from 'views/pos/Stocktakings';
import Feedback from 'views/pos/Feedback';

Vue.use(VueRouter);

const routes = [
  { path: '/profile', component: Profile },
  { path: '/profile/:id', component: Profile },

  { path: '/users', component: Users },
  { path: '/statuses', component: Statuses },
  { path: '/income', component: Income },
  { path: '/obligations', component: Obligations },

  { path: '/roles', component: Roles },

  { path: '/accounts', component: Accounts },
  { path: '/journals', component: Journals },
  { path: '/reports', component: Reports },

  { path: '/products', component: Products },
  { path: '/transactions', component: Transactions },
  { path: '/paytypes', component: Paytypes },
  { path: '/stocktakings', component: Stocktakings },
  { path: '/feedback', component: Feedback },
];

export default new VueRouter({
  mode: 'history',
  routes,
});
