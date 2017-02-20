<template>
  <div>
    <section class="content-header">
      <h1>{{title}}</h1>
    </section>
    <section class="content">
      <slot></slot>
    </section>
  </div>
</template>

<script>
  export default{
    name: 'page',
    props: ['title'],
  };
</script>
