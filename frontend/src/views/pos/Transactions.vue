<template>
  <div>
    <Page title="Tehingud">
      <Box title="Tehingud">
        <div slot="footer">
          <pagination :pagination="pagination" :callback="paginate" class="pagination-sm no-margin pull-right"></pagination>
        </div>
      </Box>
    </Page>
  </div>
</template>

<script>
  import Page from 'components/Page';
  import Box from 'components/Box';
  import Pagination from 'vue-bootstrap-pagination';

  export default {
    name: 'Transactions',
    components: {
      Page,
      Box,
      Pagination,
    },
    methods: {
      paginate() {
      },
    },
    data() {
      return {
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
