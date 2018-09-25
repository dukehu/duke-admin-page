<template>
    <Row class="vm-table vm-panel">
        <div class="panel-heading">
            User List
        </div>
        <div class="panel-body">
            <Row type="flex" justify="space-between" class="control">
                <div class="search-bar">
                    <Input placeholder="Please enter ..." v-model="keyword" style="width: 300px" />
                    <Button @click="search"><i class="fa fa-search"></i></Button>
                </div>
                 <div>
                    <Button type="success" @click="saveUserModalShow = true" ><i class="fa fa-plus"></i> Add</Button>
                    <Button type="error"  :disabled="deleteDisabled" @click="modalDelete = true"><i class="fa fa-trash"></i> Delete</Button>
                </div>
            </Row>
            <Table 
                border
                :stripe="true"
                :columns="dataColumns" 
                :data="pageInfo.list" 
                @on-selection-change="selectChanged">
            </Table>
            <Row type="flex" justify="space-between" class="footer">
                <div class="info-bar">
                    Show
                    <Input-number 
                        class="input-number" 
                        v-model="pageSize" 
                        :max="pageInfo.total" 
                        :min="1" 
                        @on-change="updatePageSize">
                        {{ pageSize }}
                    </Input-number>
                    / Page
                </div>
                <div class="page">
                    <span class="total">Total {{ pageInfo.total }}</span>
                    <Page 
                        :total="pageInfo.total" 
                        :current="currentPage" 
                        :page-size="pageSize" 
                        @on-change="pageChange">
                    </Page>
                </div>
            </Row>
        </div>

        <!-- add user -->
        <Modal
            v-model="saveUserModalShow"
            title="Add"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="addOk">
            <Form :label-width="75">
                <Form-item label="User Name">
                    <Input v-model="user.realName" placeholder="Enter User Name ..." />
                </Form-item>
            </Form>
        </Modal>
    </Row>
</template>

<script>
export default {
    data() {
        return {
            saveUserModalShow: false,
            pageSize: 9,
            currentPage: 1,
            pageInfo: {},
            user: {},
            selectedUsers: [],
            deleteDisabled: true,
            RwdPnsmtNorm: false,
            keyword: '',
            dataColumns: [
                {type: 'selection', width: 60, align: 'center'},
                {id: '20156541', title: '账号', key: 'loginName'},
                {id: '20156542', title: '姓名', key: 'realName'},
                {id: '20156543', title: '状态', key: 'status'},
                {id: '20156544', title: '性别', key: 'gender'},
                {id: '20156545', title: '地址', key: 'avatar'},
                {id: '20156546', title: '注册时间', key: 'createtime'},
                {id: '20156547', title: '操作', key: 'action', width: 150, align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.modalEdit = true;
                                    }
                                }
                            }, 'Edit'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, 'Delete')
                        ]);
                    }
                }
            ]
        }
    },
    methods: {
        // 用户列表
        getUserList() {
            this.$axios('get','/api/admin/user', {
                keyword: this.keyword,
                page: this.currentPage,
                size: this.pageSize
            }).then(data => {
                this.pageInfo = data.data;
            })
        },
        // 改变每页条数
        updatePageSize() {
            this.getUserList();
        },
        // 点击上一页、下一页、页码时调用
        pageChange(page) {
            this.currentPage = page;
            this.getUserList();
        },
        selectChanged(data) {
            this.selectedUsers = data;
            let userIds = "";
            if(this.selectedUsers.length) {
                this.selectedUsers.forEach(user => {
                    userIds += user.id + ',';
                });
                userIds = userIds.substring(0, userIds.length - 1);
                console.log(userIds);
            }
        },
        search() {

        },
        selectChange(data) {
            this.dataDelete = data
        },
        addOk: function (data) {
            this.dataTable.unshift(data)
        },
        edit: function (data) {
            this.dataTable.forEach(function (elem) {
            if (elem.id === data.id) {
                for (let i in data) {
                elem[i] = data[i]
                }
            }
            })
        },
        deletefn: function (data) {
            for (let i = 0; i < this.dataTable.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (this.dataTable[i].id === data[j].id) {
                    this.dataTable.splice(i, 1)
                    }
                }
            }
        }
    },
    watch: {
        selectedUsers: function() {
            if (this.selectedUsers.length === 0) {
                this.deleteDisabled = true
            } else {
                this.deleteDisabled = false
            }
        }
    },
    created() {
        this.getUserList();
    }
}
</script>

<style>

</style>
