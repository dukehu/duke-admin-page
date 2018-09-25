<template>
    <Row class="vm-table vm-panel">
        <div class="panel-heading">
            Role List
        </div>
        <div class="panel-body">
            <Row type="flex" justify="space-between" class="control">
                <div class="search-bar">
                    <Input placeholder="Please enter ..." v-model="keyword" style="width: 300px" />
                    <Button @click="getRoles"><i class="fa fa-search"></i></Button>
                </div>
                <div>
                    <Button type="success" @click="showSaveRoleModal" ><i class="fa fa-plus"></i> Add</Button>
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
                        @on-change="changePageSize">
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
        <!-- add role -->
        <Modal
            draggable
            title="Add"
            v-model="saveRoleModalShow"
            :loading="saveRoleLoading"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="saveRole"
            width="600px">
                <div style="height:270px">
                    <div style="float:left; width:64%; overflow: auto; height: 270px;">
                        <Form :label-width="100" :rules="roleFormValidate" ref="role" :model="role">
                            <Form-item label="Role Name" prop="name">
                                <Input v-model="role.name" placeholder="Enter Role Name ..." />
                            </Form-item>
                            <Form-item label="Role Designate">
                                <select-user ref="userSelect"></select-user>
                            </Form-item>
                            <Form-item label="Role Sort" prop="sort">
                                <Input v-model="role.sort" placeholder="Enter Role Sort ..." />
                            </Form-item>
                            <Form-item label="Role Memo">
                                <Input v-model="role.memo" type="textarea" placeholder="Enter Role Memo ..." />
                            </Form-item>
                        </Form>
                    </div>
                    <div style="display: block; position: absolute; top: 50px; bottom: 60px; left: 65%; border: 1px dashed black"></div>
                    <div style="float:right; width:34%; padding-left:8px;overflow: auto; height: 270px;">
                        <Tree ref="rsTree" :data="resourceTree" show-checkbox></Tree>
                    </div>
                </div>
        </Modal>

        <!-- auth -->
        <Modal
            draggable
            title="Auth"
            v-model="authModalShow"
            ok-text="OK"
            cancel-text="Cancel"
            width="300px"
            @on-ok="saveAuth">
            <Tree ref="rsAuthTree" :data="resourceTree" show-checkbox style="overflow: auto; height: 370px;"></Tree>
        </Modal>

        <!-- edit role -->
        <Modal
            v-model="eidtRoleModalShow"
            title="Edit"
            ok-text="OK"
            cancel-text="Cancel"
            width="500px">
                <Form :label-width="80">
                    <Form-item label="Role Name">
                        <Input v-model="role.name" disabled />
                    </Form-item>
                    <Form-item label="Role Sort">
                        <Input v-model="role.sort" />
                    </Form-item>
                    <Form-item label="Role Memo">
                        <Input v-model="role.Memo" type="textarea" />
                    </Form-item>
                </Form>
        </Modal>
    </Row>
</template>

<script>
import selectUser from '../../components/commons/d-select-user.vue';
export default {
    components: {selectUser},
    data() {
        return {
            currentPage: 1,
            pageSize: 9,
            saveRoleModalShow: false,
            saveRoleLoading: true,
            eidtRoleModalShow: false,
            deleteDisabled: true,
            authModalShow: false,
            selectedRoles: [],
            resourceTree: [],
            role: {
                name: '',
                userIds: '',
                sort: 1,
                memo: '',
                resourceIds: ''
            },
            roleId: '',
            keyword: '',
            dataDelete: [],
            dataColumns: [
                {type: 'selection', width: 60, align: 'center'},
                {id: '20156541', title: '序号', key: 'sort'},
                {id: '20156542', title: '角色名称', key: 'name'},
                {id: '20156543', title: '角色类型', key: 'roleType', 
                    render: (h, params) => {
                        return  h('Tag', params.row.roleType === 1 ? '自定义角色' : '内置角色')
                    }
                },
                {id: '20156544', title: '是否激活', key: 'status'},
                {id: '20156545', title: '角色描述', key: 'memo'},
                {id: '20156546', title: '创建用户', key: 'creater'},
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
                                        this.eidtRoleModalShow = true;
                                    }
                                }
                            }, 'Edit'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.showAuthModal(params.row.id);
                                    }
                                }
                            }, 'Auth')
                        ]);
                    }
                }
            ],
            pageInfo: {},
            roleFormValidate: {
                name: [
                    {required: true, message: 'Role Name cannot be empty', trigger: 'blur'}
                ],
                sort: [
                    {required: true, message: 'Role Sort cannot be empty', trigger: 'blur'}
                ],
            }
        }
    },
    methods: {
        // 角色列表
        getRoles() {
            this.$axios('get','/api/admin/role', {
                name: this.keyword,
                page: this.currentPage,
                size: this.pageSize
            }).then(data => {
                this.pageInfo = data.data;
            })
        },
        // 展示新增角色的modal
        showSaveRoleModal() {
            this.getResourceTree('');
            this.saveRoleModalShow = true;
        },
        // 保存角色数据
        saveRole() {
            this.$refs.role.validate((valid) => {   
                if (valid) {
                    let usres = this.$refs.userSelect.selectedUser;
                    let nodes = this.$refs.rsTree.getCheckedNodes();
                    let userIds = '';
                    let resourceIds = '';
                    if(usres.length) {
                        usres.forEach(user => {
                            userIds += user.id + ',';
                        });
                        userIds = userIds.substring(0, userIds.length - 1);
                        this.role.userIds = userIds;
                    }
                    if(nodes.length) {
                        nodes.forEach(node => {
                            resourceIds += node.key + ',';
                        });
                        resourceIds = resourceIds.substring(0, resourceIds.length - 1);
                        this.role.resourceIds = resourceIds;
                    }
                    console.log(this.role);
                    this.$axios('post','/api/admin/role',this.role).then(data => {
                        this.saveRoleModalShow = false;
                        this.$Message.success('Add Successful!');
                        this.getRoles();
                    })
                } else {
                    this.saveRoleModalShow = true;
                    this.$Message.error('Fail!');
                }
            })
        },
        // 获取资源树
        getResourceTree(rId) {
            this.$axios('get','/api/admin/resource/tree', {roleId: rId}).then(data => {
                this.resourceTree = data.data;
            })
        },
        // 显示授权页面
        showAuthModal(rId) {
            this.roleId = rId;
            this.getResourceTree(rId);
            this.authModalShow = true;
        },
        // 保存授权信息
        saveAuth() {
            let nodes = this.$refs.rsAuthTree.getCheckedNodes();
            let resourceIds = '';
            if(nodes.length) {
                nodes.forEach(node => {
                    resourceIds += node.key + ',';
                });
                resourceIds = resourceIds.substring(0, resourceIds.length - 1);
            }

            this.$axios('post','/api/admin/role/auth',{
                roleId: this.roleId,
                resourceIds: resourceIds
            }).then(data => {
                this.authModalShow = false;
                this.$Message.success('Auth Successful!');
            })
        },
        // 改变每页条数
        changePageSize() {
            this.getRoles();
        },
        // 改变当前页
        pageChange(page) {
            this.currentPage = page;
            this.getRoles();
        },
        // 选择的数据发生变化
        selectChanged(data) {
            this.selectedRoles = data;
            let roleIds = "";
            if(this.selectedRoles.length) {
                this.selectedRoles.forEach(role => {
                    roleIds += role.id + ',';
                });
                roleIds = roleIds.substring(0, roleIds.length - 1);
                console.log(roleIds);
            }
        } 
    },
    created() {
        this.getRoles();
    },
    watch: {
        selectedRoles: function() {
            if (this.selectedRoles.length === 0) {
                this.deleteDisabled = true
            } else {
                this.deleteDisabled = false
            }
        }
    }
}
</script>

<style scoped>
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background-color:#c1c1c1;}
</style>
