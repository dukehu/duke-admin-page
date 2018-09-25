<template>
    <div class="sidebar">
      <Menu theme="dark" width="100%" class="menu" :active-name="activeName" :accordion="true">
          <Submenu :name="menuItem.name" v-for="menuItem in menuItems" :key="menuItem.id">
              <template slot="title">
                  <i :class="menuItem.icon"></i>
                  {{menuItem.name}}
              </template>
              <Menu-item :name="child.name"  v-for="child in menuItem.children" :key="child.id">
                <router-link :to="child.router">
                  {{child.name}}
                </router-link>
              </Menu-item>
          </Submenu>
      </Menu>
    </div>
</template>

<script>
export default {
    name: 'bodyLeft',
    data() {
        return {
            menuItems: [
                {id: 'manage', name: '后台管理', icon: 'fa fa-cogs', children: [
                    {id: 'desc', name: '简述', router: '/'},
                    {id: 'user', name: '用户管理', router: '/user'},
                    {id: 'service', name: '服务管理', router: '/service'},
                    {id: 'role', name: '角色管理', router: '/role'},
                    {id: 'resource', name: '资源管理', router: '/resource'},
                    {id: 'operationCode', name: '操作码管理', router: '/operationCode'}
                ]},
                {id: 'monitor', name: '服务监控', icon: 'fa fa-bar-chart', children: [
                    {id: 'logging', name: '日志管理', router: '/logging'},
                    {id: 'user', name: 'SQL 监控', router: '/user'},
                    {id: 'code-genderator', name: '代码生成', router: '/generator'}
                ]},
            ],
            activeName: 'Dashboard'
        }
    },
    mounted: function () {
        this.activeName = this.$route.name
    },
}
</script>

<style>

</style>
