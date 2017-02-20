import Vue from 'vue';
import flatMap from 'lodash/flatMap';
import find from 'lodash/find';
import store from 'store/store';

function userHasPermission(user, permission) {
  const permissions = flatMap(user.roles, role => role.permissions);
  return find(permissions, { name: permission }) !== undefined;
}

export default Vue.directive('authorize', {
  bind(el, binding) {
    const permission = binding.value;
    if (!userHasPermission(store.state.loggedInUser, permission)) {
      el.style.display = 'none';// eslint-disable-line no-param-reassign
    }
  },
});
