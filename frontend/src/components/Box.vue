<template>
  <div class="box">
    <div class="box-header">
      <h3 class="box-title">{{title}}</h3>
      <div class="box-tools">
        <slot name="tools"></slot>
      </div>
    </div>
    <div class="box-body">
      <slot name="body"></slot>
    </div>
    <div class="box-footer clearfix no-border">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'box',
    props: ['title'],
  };
</script>
