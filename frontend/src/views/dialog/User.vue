<template>
  <Modal title="Lisa liige" :id="id" :show="show" @close="$emit('close')" @show="handleShow">
    <div slot="body">
      <form role="form" @submit="save()" class="form-horizontal">
        <div class="form-group">
          <label for="inputStatus" class="control-label col-sm-2">Staatus</label>
          <div class="col-sm-3">
            <select id="inputStatus" v-model="user.status" required="required" class="form-control">
              <option v-for="status in $store.state.statuses" :value="status">{{status.name}}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="inputFirstname" class="control-label col-sm-2">Eesnimi</label>
          <div class="col-sm-5">
            <input id="inputFirstname" type="text" placeholder="Eesnimi" v-model="user.firstName" class="form-control"/>
          </div>
        </div>
        <div class="form-group">
          <label for="inputLastname" class="control-label col-sm-2">Perenimi</label>
          <div class="col-sm-5">
            <input id="inputLastname" type="text" placeholder="Perenimi" v-model="user.lastName" class="form-control"/>
          </div>
        </div>
        <div class="form-group">
          <label for="inputBeername" class="control-label col-sm-2">Õllenimi</label>
          <div class="col-sm-5">
            <input id="inputBeername" type="text" placeholder="Õllenimi" v-model="user.beerName" class="form-control"/>
          </div>
        </div>
        <div class="form-group">
          <label for="inputBalance" class="control-label col-sm-2">Saldo</label>
          <div class="col-sm-3">
            <div class="input-group">
              <input id="inputBalance" type="number" placeholder="0" v-model="user.balance" class="form-control"/><span class="input-group-addon">€</span>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button @click="save()" class="btn btn-success">Salvesta</button>
    </div>
  </Modal>
</template>

<script>
  import Modal from 'components/Modal';
  import { FETCH_STATUSES, SAVE_USER } from 'store/mutations';
  import notify from '../../notify';

  export default {
    name: 'UserDialog',
    components: {
      Modal,
    },
    methods: {
      handleShow(value) {
        this.$emit('show', value);
      },
      save() {
        this.$store.dispatch(SAVE_USER, this.user).then((user) => {
          notify.success('Liige edukalt lisatud!');
          this.$emit('save', user);
        }, () => notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!'));
      },
    },
    data() {
      return {
        user: {},
      };
    },
    props: ['id', 'show'],
    beforeMount() {
      this.$store.dispatch(FETCH_STATUSES);
    },
  };
</script>
