<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" @click="$emit('close')" class="close">&times;</button>
          <h4 class="modal-title">{{title}}</h4>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';

  export default{
    name: 'Modal',
    props: ['title', 'id', 'show'],
    watch: {
      show(value) {
        if (value) {
          $(`#${this.id}`).modal('show');
        } else {
          $(`#${this.id}`).modal('hide');
        }
        this.$emit('show', value);
      },
    },
  };
</script>
