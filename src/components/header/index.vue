<template>
    <Row class="header" type="flex" align="middle">
      <div class="logo">
        <span>D-</span>Admin
      </div>
      <Dropdown class="login-info" placement="bottom-end" @on-click="changeMenu">
        <Button>
            <img src="../../assets/img/photo.jpg" height="30" alt="">Admin
            <Icon type="arrow-down-b"></Icon>
        </Button> 
        <Dropdown-menu slot="list">
            <Dropdown-item divided name="logout"><i class="fa fa-key"></i>Log out</Dropdown-item>
            <Dropdown-item divided name="profile"><i class="fa fa-cog"></i>Profile</Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
    </Row>  
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    changeMenu(name) {
      if('logout' === name) {
        this.logOut();
      }
      if('profile' === name) {
        this.goProfile();
      }
    },
    logOut() {
      this.$axios('post',"/api/auth/auth/sign_out").then(res => {
          console.log(111);
      });
    },
    goProfile() {
      alert("Profile");
    }
  }
}
</script>

<style>

</style>
