<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <ul class="sidebar-menu">
        <li class="header">MENÜÜ</li>
        <li v-for="item in menu" :class="{treeview: item.menu != null, active: isActive(item)}">
          <a v-if="item.menu" href="#">
            <i class="fa" :class="item.icon"></i> <span>{{item.name}}</span> <i class="fa fa-angle-left pull-right"></i>
          </a>
          <router-link v-else :to="item.href">
            <i class="fa" :class="item.icon"></i> <span>{{item.name}}</span>
          </router-link>
          <ul v-if="item.menu" class="treeview-menu">
            <router-link tag="li" active-class="active" :to="subitem.href" v-for="subitem in item.menu">
              <a><i class="fa" :class="subitem.icon"></i> {{subitem.name}}</a>
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
  import 'admin-lte/bootstrap/js/bootstrap';
  import 'admin-lte/dist/js/app';

  export default {
    methods: {
      isActive(item) {
        return this.$route.path === item.href;
      },
    },
    data() {
      return {
        menu: [
          {
            icon: 'fa-users',
            name: 'Liikmed',
            menu: [
              { icon: 'fa-list', href: '/users', name: 'Nimekiri' },
              { icon: 'fa-graduation-cap', href: '/statuses', name: 'Staatused' },
              { icon: 'fa-arrow-left', href: '/obligations', name: 'Kohustused' },
              { icon: 'fa-arrow-right', href: '/income', name: 'Laekumised' },
            ],
          },
          { icon: 'fa-lock', href: '/roles', name: 'Rollid ja õigused' },
          {
            icon: 'fa-book',
            name: 'Raamatupidamine',
            menu: [
              { icon: 'fa-folder-open-o', href: '/accounts', name: 'Kontod' },
              { icon: 'fa-exchange', href: '/journals', name: 'Kanded' },
              { icon: 'fa-pie-chart', href: '/reports', name: 'Aruanded' },
            ],
          },
          {
            icon: 'fa-shopping-cart',
            name: 'Kassa',
            menu: [
              { icon: 'fa-cubes', href: '/products', name: 'Laoseis' },
              { icon: 'fa-exchange', href: '/transactions', name: 'Tehingud' },
              { icon: 'fa-money', href: '/paytypes', name: 'Makseviis' },
              { icon: 'fa-tasks', href: '/stocktaking', name: 'Inventuur' },
              { icon: 'fa-edit', href: '/feedback', name: 'Tagasiside' },
            ],
          },
        ],
      };
    },
  };
</script>
