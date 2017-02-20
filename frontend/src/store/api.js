import Vue from 'vue';
import VueResource from 'vue-resource';
import { btoa } from 'abab';
import Cookies from 'cookies-js';

Vue.use(VueResource);

export const config = {
  addPosUserHeader: false,
};

Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST' || request.method === 'DELETE') {
    request.headers.set('X-XSRF-TOKEN', Cookies.get('XSRF-TOKEN'));
  }
  if (config.addPosUserHeader) {
    request.headers.set('POS_USER', 'CN=kassa/emailAddress=leola@leola.ee');
  }
  next();
});

export const UserResource = Vue.resource('/api/users{/id}');
export const ProductResource = Vue.resource('/api/products{/id}');
export const StatusResource = Vue.resource('/api/statuses{/id}');
export const PaytypeResource = Vue.resource('/api/paytypes{/id}');
export const TransactionResource = Vue.resource('/api/transactions{/id}');
export const FeedbackResource = Vue.resource('/api/feedbacks{/id}');
export const StocktakingResource = Vue.resource('/api/stocktakings{/id}');

const rolePermissions = {
  removePermission: { method: 'DELETE', url: '/api/roles/{roleId}/permissions/{id}' },
  addPermission: { method: 'POST', url: '/api/roles/{roleId}/permissions/{id}' },
};
export const RoleResource = Vue.resource('/api/roles{/id}', {}, rolePermissions);

export const PermissionResource = Vue.resource('/api/permissions{/id}');
export const ObligationResource = Vue.resource('/api/obligations{/id}');
export const AccountResource = Vue.resource('/api/accounts{/id}');
export const AccountTypeResource = Vue.resource('/api/accounttypes{/id}');
export const JournalResource = Vue.resource('/api/journals{/id}');
export const JournalTypeResource = Vue.resource('/api/journaltypes{/id}');

export const Authentication = {
  login(username, password) {
    return Vue.http.get('/api/users/me', { headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` } });
  },
  logout() {
    return Vue.http.post('/api/logout');
  },
  loggedInUser() {
    return Vue.http.get('/api/users/me');
  },
};
