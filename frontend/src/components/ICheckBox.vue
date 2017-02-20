<template>
  <input type="checkbox" :checked="value"/>
</template>

<script>
  import $ from 'jquery';
  import 'icheck';
  import 'icheck/skins/flat/yellow.css';

  export default {
    name: 'ICheckBox',
    props: ['value'],
    mounted() {
      $(this.$el).iCheck({
        checkboxClass: 'icheckbox_flat-yellow',
        radioClass: 'iradio_flat-yellow',
      }).on('ifChanged', () => {
        this.$emit('change', event.target.checked);
      });
    },
  };
</script>
