<template>
    <Row class="header" type="flex" align="middle">
      <div class="logo">
        <span>D-</span>Admin
      </div>
      <Dropdown class="login-info" placement="bottom-end">
        <Button>
            <img src="../../assets/img/photo.jpg" height="30" alt="">Admin
            <Icon type="arrow-down-b"></Icon>
        </Button> 
        <Dropdown-menu slot="list">
            <Dropdown-item divided><i class="fa fa-key"></i>Log out</Dropdown-item>
            <Dropdown-item divided><i class="fa fa-cog"></i>Setting</Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
    </Row>  
</template>

<script>
export default {

}
</script>

<style>

</style>
