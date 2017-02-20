<template>
  <Modal title="Lisa/Muuda makseviisi" :id="id" :show="show" @close="$emit('close')">
    <div slot="body">
      <form role="form" @submit="save(paytype)" class="form-horizontal">
        <div class="form-group">
          <label for="paytypeName" class="control-label col-sm-2">Nimetus</label>
          <div class="col-sm-5">
            <!-- TODO: focusme -->
            <input id="paytypeName" type="text" placeholder="Nimetus" v-model="paytype.name" class="form-control"/>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-2"></div>
          <div class="col-sm-5">
            <div class="checkbox">
              <ICheckBox id="affectsBalance" v-model="paytype.affectsBalance"></ICheckBox>
              <label for="affectsBalance">Mõjutab saldot</label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-2"></div>
          <div class="col-sm-5">
            <div class="checkbox">
              <ICheckBox id="affectsQuantity" v-model="paytype.affectsQuantity"></ICheckBox>
              <label for="affectsQuantity">Mõjutab laoseisu</label>
            </div>
          </div>
        </div>
        <br/>
        <div class="form-group">
          <label class="control-label col-sm-2">Lubatud staatustele</label>
          <div class="col-sm-5">
            <div v-for="status in $store.state.statuses" class="checkbox">
              <ICheckBox :id="'status_' + status.id" v-model="allowedForStatus[status.id]"></ICheckBox>
              <label :for="'status_' + status.id">{{status.name}}</label>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button v-if="paytype.id !== undefined" @click="remove()" class="btn btn-danger">Kustuta</button>
      <button @click="save()" class="btn btn-success">Salvesta</button>
    </div>
  </Modal>
</template>

<script>
  import Modal from 'components/Modal';
  import ICheckBox from 'components/ICheckBox';
  import { FETCH_STATUSES, SAVE_PAYTYPE, REMOVE_PAYTYPE } from 'store/mutations';
  import notify from '../../notify';

  export default {
    name: 'PaytypeDialog',
    components: {
      Modal,
      ICheckBox,
    },
    methods: {
      save() {
        this.$store.dispatch(SAVE_PAYTYPE, this.paytype).then(() => {
          notify.success('Makseviis edukalt lisatud!');
          this.$emit('close');
        }, () => notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!'));
      },
      remove() {
        this.$store.dispatch(REMOVE_PAYTYPE, this.paytype).then(() => {
          notify.success('Makseviis edukalt eemaldatud!');
          this.$emit('close');
        }, () => notify.error('Eemaldamine ebaõnnestus, kontrolli andmeid!'));
      },
    },
    data() {
      return {
        paytype: {},
        allowedForStatus: [],
      };
    },
    props: ['id', 'show'],
    beforeMount() {
      this.$store.dispatch(FETCH_STATUSES);
    },
  };
</script>
