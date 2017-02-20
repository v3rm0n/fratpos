import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './mutations';
import * as api from './api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedInUser: null,
    currentUser: null,
    users: [],
    statuses: [],
    roles: [],
    permissions: [],
    products: [],
    paytypes: [],
    transactions: [],
  },
  mutations: {
    [types.SWITCH_USER](state, payload) {
      state.currentUser = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.FETCH_USERS](state, payload) {
      state.users = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.FETCH_STATUSES](state, payload) {
      state.statuses = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.FETCH_PRODUCTS](state, payload) {
      state.products = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.FETCH_PAYTYPES](state, payload) {
      state.paytypes = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.FETCH_TRANSACTIONS](state, payload) {
      state.transactions = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.FETCH_ROLES](state, payload) {
      state.roles = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.FETCH_PERMISSIONS](state, payload) {
      state.permissions = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.LOGIN](state, payload) {
      state.loggedInUser = payload.body;// eslint-disable-line no-param-reassign
    },
    [types.LOGOUT](state) {
      state.loggedInUser = null;// eslint-disable-line no-param-reassign
    },
  },
  actions: {
    [types.FETCH_USERS]: ({ commit }) =>
      api.UserResource.get().then(response => commit(types.FETCH_USERS, response)),

    [types.SWITCH_USER]: ({ commit }, payload) => {
      if (payload.user) {
        commit(types.SWITCH_USER, payload.user);
      } else {
        api.UserResource.get({ id: payload.id })
          .then(response => commit(types.SWITCH_USER, response));
      }
    },

    [types.FETCH_USER_ME]: ({ commit }) =>
      api.Authentication.loggedInUser().then(response => commit(types.LOGIN, response)),

    [types.SAVE_USER]: ({ dispatch }, payload) =>
      api.UserResource.save(payload)
        .then((response) => {
          dispatch(types.FETCH_USERS);
          return response.body;
        }),

    [types.FETCH_STATUSES]: ({ commit }) =>
      api.StatusResource.get().then(response => commit(types.FETCH_STATUSES, response)),

    [types.FETCH_PAYTYPES]: ({ commit }) =>
      api.PaytypeResource.get().then(response => commit(types.FETCH_PAYTYPES, response)),

    [types.SAVE_PAYTYPE]: ({ dispatch }, payload) =>
      api.PaytypeResource.save(payload)
        .then(() =>
          dispatch(types.FETCH_PAYTYPES)
        ),

    [types.REMOVE_PAYTYPE]: ({ dispatch }, payload) =>
      api.PaytypeResource.remove(payload)
        .then(() =>
          dispatch(types.FETCH_PAYTYPES)
        ),

    [types.FETCH_TRANSACTIONS]: ({ commit }) =>
      api.TransactionResource.get().then(response => commit(types.FETCH_TRANSACTIONS, response)),

    [types.FETCH_PRODUCTS]: ({ commit }) =>
      api.ProductResource.get().then(response => commit(types.FETCH_PRODUCTS, response)),

    [types.FETCH_ROLES]: ({ commit }) =>
      api.RoleResource.get().then(response => commit(types.FETCH_ROLES, response)),

    [types.SAVE_ROLE]: ({ dispatch }, payload) =>
      api.RoleResource.save(payload)
        .then(() =>
          dispatch(types.FETCH_ROLES)
        ),

    [types.FETCH_PERMISSIONS]: ({ commit }) =>
      api.PermissionResource.get().then(response => commit(types.FETCH_PERMISSIONS, response)),

    [types.SAVE_ROLE_PERMISSION]: ({ dispatch }, payload) =>
      api.RoleResource.addPermission(payload, null),

    [types.REMOVE_ROLE_PERMISSION]: ({ dispatch }, payload) =>
      api.RoleResource.removePermission(payload),

    [types.LOGIN]: ({ commit }, payload) =>
      api.Authentication.login(payload.username, payload.password)
        .then(response => commit(types.LOGIN, response)),

    [types.LOGOUT]: ({ commit }) =>
      api.Authentication.logout().then(() => commit(types.LOGOUT)),
  },
});

