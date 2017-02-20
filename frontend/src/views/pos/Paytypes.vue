<template>
  <div>
    <Page title="Makseviisid">
      <Box title="Makseviisid">
        <div slot="footer">
          <pagination v-if="$store.state.paytypes.length > 10" :pagination="pagination" :callback="paginate" class="pagination-sm no-margin pull-right"></pagination>
          <button type="button" @click="showDialog = true" class="btn btn-primary"><i class="fa fa-plus"></i> Lisa makseviis</button>
        </div>
      </Box>
    </Page>
    <PaytypeDialog id="paytypeDialog" :show="showDialog" @close="showDialog = false"></PaytypeDialog>
  </div>
</template>

<script>
  import Page from 'components/Page';
  import Box from 'components/Box';
  import Pagination from 'vue-bootstrap-pagination';
  import PaytypeDialog from '../dialog/Paytype';

  export default {
    name: 'Paytypes',
    components: {
      Page,
      Box,
      Pagination,
      PaytypeDialog,
    },
    methods: {
      paginate() {
      },
    },
    data() {
      return {
        showDialog: false,
        pagination: {
          total: 0,
          per_page: 10,
          current_page: 1,
          last_page: 5,
          to: 10,
        },
      };
    },
  };
</script>
