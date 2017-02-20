<template>
  <Page title="Rollid ja õigused">
    <Box>
      <div slot="body">
        <div class="row">
          <div class="col-md-4">
            <div class="input-group margin">
              <input type="text" class="form-control" v-model="newRole"/>
              <span class="input-group-btn">
									<button type="button" @click="addRole()" class="btn btn-info btn-flat">Lisa roll</button>
								</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-bordered table-hover">
              <thead>
              <tr>
                <th>Õigused</th>
                <th :colspan="$store.state.roles.length" style="text-align: center;">Rollid</th>
              </tr>
              </thead>
              <tbody>
              <tr style="text-align: center;">
                <td></td>
                <td v-for="role in $store.state.roles">{{role.name}}</td>
              </tr>
              <tr style="text-align: center;" v-for="permission in $store.state.permissions">
                <td>{{permission.description}}</td>
                <td v-for="role in $store.state.roles">
                  <ICheckBox @change="change(permission, role)" v-model="rolePermissions[permission.id][role.id]"></ICheckBox>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button type="button" @click="save()" class="btn btn-primary">Salvesta</button>
      </div>
    </Box>
  </Page>
</template>

<script>
  import Page from 'components/Page';
  import Box from 'components/Box';
  import ICheckBox from 'components/ICheckBox';
  import { FETCH_ROLES, FETCH_PERMISSIONS, SAVE_ROLE, SAVE_ROLE_PERMISSION, REMOVE_ROLE_PERMISSION } from 'store/mutations';
  import notify from '../notify';

  export default {
    name: 'Roles',
    components: {
      Page,
      Box,
      ICheckBox,
    },
    methods: {
      addRole() {
        this.$store.dispatch(SAVE_ROLE, { name: this.newRole }).then(() => {
          notify.success('Roll edukalt lisatud!');
          this.newRole = null;
        }, () => notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!'));
      },
      change(permission, role) {
        const checked = this.rolePermissions[permission.id][role.id];
        this.changedPermissions[permission.id] = this.changedPermissions[permission.id] || {};
        this.changedPermissions[permission.id][role.id] = { checked, role };
      },
      save() {
        const changes = [];
        for (const permissionId of Object.keys(this.changedPermissions)) {
          const roles = this.changedPermissions[permissionId];
          for (const key of Object.keys(roles)) {
            const obj = roles[key];
            if (!obj.checked) {
              changes.push(this.$store.dispatch(SAVE_ROLE_PERMISSION,
                { roleId: obj.role.id, id: permissionId }));
            } else {
              changes.push(this.$store.dispatch(REMOVE_ROLE_PERMISSION,
                { roleId: obj.role.id, id: permissionId }));
            }
          }
        }
        Promise.all(changes).then(() => {
          notify.success('Õigused edukalt lisatud!');
          this.newRole = null;
          this.$store.dispatch(FETCH_ROLES);
        }, () => notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!'));
      },
    },
    data() {
      return {
        newRole: null,
        changedPermissions: {},
      };
    },
    computed: {
      rolePermissions() {
        const rolePermissions = [];
        this.$store.state.roles.forEach((role) => {
          role.permissions.forEach((permission) => {
            rolePermissions[permission.id] = rolePermissions[permission.id] || {};
            rolePermissions[permission.id][role.id] = true;
          });
        });
        return rolePermissions;
      },
    },
    beforeMount() {
      this.$store.dispatch(FETCH_ROLES);
      this.$store.dispatch(FETCH_PERMISSIONS);
    },
  };
</script>
