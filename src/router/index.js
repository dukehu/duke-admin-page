import Vue from 'vue'
import Router from 'vue-router'
import User from  '@/page/user-manager/index.vue';
import Role from  '@/page/role-manager/index.vue';
import Resource from  '@/page/resource-manager/index.vue';
import OperationCode from  '@/page/operation-code-manager/index.vue';
import Logging from  '@/page/logging-manager/index.vue';
import Desc from  '@/page/desc/index.vue';
import Generator from  '@/page/code-generator/index.vue';
import Login from  '@/page/login/index.vue';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'desc',
      component: Desc
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/role',
      name: 'role',
      component: Role
    },
    {
      path: '/resource',
      name: 'resource',
      component: Resource
    },
    {
      path: '/operationCode',
      name: 'operationCode',
      component: OperationCode
    },
    {
      path: '/logging',
      name: 'logging',
      component: Logging
    },
    {
      path: '/generator',
      name: 'generator',
      component: Generator
    },
    {
      path: '/login',
      name: 'Login',
      components: {
        blank: Login
      }
    }
  ]
})
