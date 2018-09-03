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
        <Modal
            v-model="modalAdd"
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
            user: {},
            deleteDisabled: true,
            modalAdd: false,
            RwdPnsmtNorm: false,
            keyword: '',
            dataDelete: [],
            showNum: 10,
            currentPage: 1,
            totalSize: 2,
            dataColumns: [
                {id: '20156541', title: '账号', key: 'loginname'},
                {id: '20156542', title: '姓名', key: 'realname'},
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
            ],
            dataTable: [
                {loginname: '', realname: '', status: '', gender: '', avatar: '', createtime: ''},
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

<style>

</style>
