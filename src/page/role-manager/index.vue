<template>
    <Row class="vm-table vm-panel">
        <div class="panel-heading">
            Role List
        </div>
        <div class="panel-body">
            <Row type="flex" justify="space-between" class="control">
                <div class="search-bar">
                    <Input placeholder="Please enter ..." v-model="keyword" style="width: 300px" />
                    <Button @click="search"><i class="fa fa-search"></i></Button>
                </div>
                <div>
                    <Button type="success" @click="modalAdd = true" ><i class="fa fa-plus"></i> Add</Button>
                    <Button type="error"  :disabled="deleteDisabled" @click="modalDelete = true"><i class="fa fa-trash"></i> Delete</Button>
                </div>
            </Row>
            <Table
                border
                :stripe="true"
                :columns="dataColumns" 
                :data="dataTable" 
                @on-selection-change="selectChange">
            </Table>
            <Row type="flex" justify="space-between" class="footer">
                <div class="info-bar">
                    Show
                    <Input-number 
                        class="input-number" 
                        v-model="showNum" 
                        :max="totalSize" 
                        :min="1" 
                        @on-change="updateDataShow">
                        {{ showNum }}
                    </Input-number>
                    / Page
                </div>
                <div class="page">
                    <span class="total">Total {{ totalSize }}</span>
                    <Page 
                        :total="totalSize" 
                        :current="currentPage" 
                        :page-size="showNum" 
                        @on-change="pageChange">
                    </Page>
                </div>
            </Row>
        </div>
        <!-- add -->
        <Modal
            v-model="modalAdd"
            title="Add"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="addOk"
            width="600px">
                <div style="height:270px">
                    <div style="float:left; width:59%; overflow: auto; height: 270px;">
                        <Form :label-width="100">
                            <Form-item label="Role Name">
                                <Input v-model="role.name" placeholder="Enter Role Name ..." />
                            </Form-item>
                            <Form-item label="Role Designate">
                                <Input v-model="role.textarea" type="textarea"  placeholder="Enter Role Designate..." />
                            </Form-item>
                            <Form-item label="Role Sort">
                                <Input v-model="role.sort" placeholder="Enter Role Sort ..." />
                            </Form-item>
                            <Form-item label="Role Memo">
                                <Input v-model="role.Memo" type="textarea" placeholder="Enter Role Memo ..." />
                            </Form-item>
                        </Form>
                    </div>
                    <div style="display: block; position: absolute; top: 50px; bottom: 60px; left: 60%; border: 1px dashed black"></div>
                    <div style="float:right; width:39%; padding-left:8px;overflow: auto; height: 270px;">
                        <Tree :data="resourceTree" show-checkbox></Tree>
                    </div>
                </div>
        </Modal>

        <!-- edit -->
        <Modal
            v-model="modalEdit"
            title="Edit"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="addOk"
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
import DTable from '../../components/commons/d-table.vue';
export default {
    components: {DTable},
    data() {
        return {
            resourceTree: [
                {
                    title: 'parent 1',
                    expand: true,
                    children: [
                        {
                            title: 'parent 1-1',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-1-1'
                                },
                                {
                                    title: 'leaf 1-1-2'
                                }
                            ]
                        },
                        {
                            title: 'parent 1-2',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-2-1'
                                },
                                {
                                    title: 'leaf 1-2-1'
                                }
                            ]
                        }
                    ]
                }
            ],
            role: {},
            deleteDisabled: true,
            modalAdd: false,
            modalEdit: false,
            RwdPnsmtNorm: false,
            keyword: '',
            dataDelete: [],
            showNum: 10,
            currentPage: 1,
            totalSize: 2,
            dataColumns: [
                {id: '20156541', title: '序号', key: 'sort'},
                {id: '20156542', title: '角色名称', key: 'name'},
                {id: '20156543', title: '角色类型', key: 'type'},
                {id: '20156544', title: '是否激活', key: 'active'},
                {id: '20156545', title: '角色描述', key: 'memo'},
                {id: '20156546', title: '添加用户', key: 'creater'},
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
                                    type: 'primary',
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
            ],
            dataTable: [
                {sort: '1', name: '系统管理员', type: '内置角色', active: 1, memo: '系统管理员', creater: '胡明'},
            ]
        }
    },
    methods: {
        search() {

        },
        selectChange(data) {
            this.dataDelete = data
        },
        updateDataShow() {
            let startPage = (this.currentPage - 1) * this.showNum
            let endPage = startPage + this.showNum
            this.dataShow = this.data.slice(startPage, endPage)
        },
        pageChange(page) {
            this.currentPage = page
            this.updateDataShow()
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
    }
}
</script>

<style scoped>
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background-color:#c1c1c1;}
</style>
