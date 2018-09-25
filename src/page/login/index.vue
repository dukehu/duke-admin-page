<template>
  <Row class="vm-login vm-panel">
   <Col span="24" class="login-form">
     <div class="login-header">
       <p><span>D-</span>ADMIN</p>
     </div>
     <div class="login-form">
        <Input v-model="username" placeholder="please enter username" />
        <Input v-model="password" type="password" placeholder="Please enter password" />
        <Button type="primary">Login</Button>
     </div>
     <div class="login-footer">
       <Checkbox v-model="remenber">Remenber</Checkbox>
       <span class="forget"><a href="#">Forget Password</a></span>
     </div>
   </Col>
  </Row>
</template>
<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        remenber: false
      }
    }
  }
</script>


<style scoped>

</style>
