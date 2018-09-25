<template>
    <div class="userSelect">
        <div class="designate" @click="selectUserModalShow">
            <Tag 
                v-for="user in selectedUser" 
                :key="user.id" 
                :name="user.id" 
                closable 
                @on-close="deleteUser">
                {{ user.name }}
            </Tag>
        </div>

        <!-- select user -->
        <Modal
            v-model="showSelectUserModal"
            title="Select User"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="selectUserOk"
            width="452px"
            :class-name="modalClass"
            >
                <Transfer
                    :list-style="userSelectStyle"
                    :titles = "titles"
                    :data="toBeSelectUserList"
                    :target-keys="selectedUserList"
                    filterable
                    @on-change="selectUser">
                </Transfer>
        </Modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            modalClass: "modalClass",
            showSelectUserModal: false,
            userSelectStyle: { height: '250px' },
            titles: ['To be selected', 'Selected'],
            selectedUser: [],
            toBeSelectUserList: [],
            selectedUserList: [],
        }
    },
    methods: {
        // 从服务端查询用户数据，并且展示选人框
        selectUserModalShow() {
            this.$axios('get','/api/admin/user').then(data => {
                this.toBeSelectUserList = [];
                let userList = data.data;
                userList.forEach((user, i) => {
                    this.toBeSelectUserList.push({
                        key: user.id + "_" + user.realName,
                        label: user.realName,
                        description: '',
                        disabled: user.status != 1
                    });
                });
                this.showSelectUserModal = true;
            })
        },
        // 重待选区将用户选择
        selectUser(newTargetKeys, direction, moveKeys) {
            this.selectedUserList = newTargetKeys;
        },
        // 去掉已选的用户
        deleteUser(event, userId) {
            this.selectedUser.forEach(user => {
                if(user.id === userId) {
                    this.selectedUser.pop(user);x
                }
            });
        },
        selectUserOk() {
            this.selectedUserList.forEach(user => {
                let array = user.split("_");
                this.selectedUser.push({
                    id: array[0],
                    name: array[1]
                });
            })
        }
    }
}
</script>

<style>
.designate {
    width: 260px; 
    height: 55px; 
    text-align: left; 
    padding: 5px 18px; 
    border: 1px solid #dddee1;
    overflow-Y: auto; 
    overflow-X: hidden; 
    border-radius: 5px;
    cursor: pointer;
}
.modalClass {
    z-index: 1001;
}
</style>
