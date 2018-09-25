<template>
    <Row class="vm-table vm-panel">
        <div class="panel-heading">
            Operation Code List
        </div>
        <div class="panel-body">
            <Row type="flex" justify="space-between" class="control">
                <div class="search-bar">
                    <Select v-model="serviceId" @on-change="changeService" style="width:200px">
                        <Option v-for="service in services" :value="service.id" :key="service.id">
                            {{ service.name }}
                        </Option>
                    </Select>
                    <Select v-model="controller" @on-change="changeController" style="width:200px">
                        <Option v-for="c in controllers" :value="c" :key="c">
                            {{ c }}
                        </Option>
                    </Select>
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

        <!-- add -->
        <Modal
            :loading="loading"
            v-model="modalAdd"
            title="Add"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="saveOperationCode"
            width="500px">
                <Form :rules="operationCodeFormValidate" ref="operationCode" :model="operationCode" :label-width="115">
                    <Form-item label="Service Id" prop="serviceId">
                        <Select v-model="operationCode.serviceId" placeholder="Select service ...">
                            <Option value="duke-blog">duke-blog</Option>
                            <Option value="duke-admin">duke-admin</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="Name" prop="name">
                        <Input v-model="operationCode.name" placeholder="Enter Operation Code Name..." />
                    </Form-item>
                    <Form-item label="Code" prop="code">
                        <Input v-model="operationCode.code" placeholder="Enter Operation Code ..." />
                    </Form-item>
                    <Form-item label="Request Method" prop="requestMethod">
                        <RadioGroup v-model="operationCode.requestMethod" type="button">
                            <Radio label="GET"></Radio>
                            <Radio label="POST"></Radio>
                            <Radio label="DELETE"></Radio>
                            <Radio label="PUT"></Radio>
                        </RadioGroup>
                    </Form-item>
                    <Form-item label="Url" prop="url">
                        <Input v-model="operationCode.url" placeholder="Enter Url ..." />
                    </Form-item>
                    <Form-item label="Controller" prop="controller">
                        <Input v-model="operationCode.controller" placeholder="Enter Controller ..." />
                    </Form-item>
                    <Form-item label="memo">
                        <Input v-model="operationCode.memo" type="textarea" placeholder="Enter Memo ..." />
                    </Form-item>
                </Form>
        </Modal>
    </Row>
</template>

<script>
export default {
    data() {
        return {
            pageSize: 9,
            currentPage: 1,
            pageInfo: {},
            services: [
                {id: 'duke-admin', name: '后台管理'},
                {id: 'duke-blog', name: '博客项目'},
            ],
            controllers: [],
            serviceId: 'duke-admin',
            controller: '',
            operationCode: {
                serviceId: '',
                name: '',
                code: '',
                requestMethod: '',
                url: '',
                controller: '',
                memo: ''
            },
            modalAdd: false,
            loading: true,
            dataColumns: [
                {type: 'selection', width: 60, align: 'center'},
                {id: '20180801', title: 'Service Id',  key: 'serviceId'},
                {id: '20180802', title: 'Name',  key: 'name'},
                {id: '20180803', title: 'Operation Code',  key: 'code'},
                {id: '20180804', title: 'Request Method',  key: 'requestMethod'},
                {id: '20180805', title: 'Url',  key: 'url'},
                {id: '20180806', title: 'Controller',  key: 'controller'},
                {id: '20180807', title: 'Memo',  key: 'memo'},
                {id: '20180808', title: 'Action',  key: 'action', width: 150, align: 'center',
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
            operationCodeFormValidate: {
                serviceId: [
                    {required: true, message: 'Service Id cannot be empty', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: 'Name cannot be empty', trigger: 'blur'}
                ],
                code: [
                    {required: true, message: 'Code cannot be empty', trigger: 'blur'}
                ],
                requestMethod: [
                    {required: true, message: 'Request Method cannot be empty', trigger: 'blur'}
                ],
                url: [
                    {required: true, message: 'Url cannot be empty', trigger: 'blur'}
                ],
                controller: [
                    {required: true, message: 'Controller cannot be empty', trigger: 'blur'}
                ]
            },
            selectedOperationCodes: {},
            deleteDisabled: true,
            modalDelete: false
        }
    },
    methods: {
        // 改变每页条数
        updatePageSize() {
            this.getOperationCodes();
        },
        // 点击上一页、下一页、页码时调用
        pageChange(page) {
            this.currentPage = page;
            this.getOperationCodes();
        },
        // 改变服务搜索下拉框
        changeService() {
            this.controller = '';
            this.getControllers();
            this.getOperationCodes();
        },
        // 改变controller搜索下拉框
        changeController() {
            this.getOperationCodes();
        },
        // 保存操作码
        saveOperationCode() {
            this.$refs.operationCode.validate((valid) => {
                if (valid) {
                    this.$axios('post',"/api/admin/operation_code",this.operationCode).then(res => {
                        this.modalAdd = false;
                        this.$Message.success('Add Successful!');
                    });
                } else {
                    this.modalAdd = true;
                    this.$Message.error('Fail!');
                }
            })
        },
        // controller列表
        getControllers() {
            this.$axios('get','/api/admin/operation_code/controller/' + this.serviceId).then(data => {
                this.controllers = data.data;
            })
        },
        // 操作码列表
        getOperationCodes() {
            this.$axios('get','/api/admin/operation_code', {
                serviceId: this.serviceId,
                controller: this.controller,
                page: this.currentPage,
                size: this.pageSize
            }).then(data => {
                this.pageInfo = data.data;
            })
        },
        // 选择的数据发生变化
        selectChanged(data) {
            this.selectedOperationCodes = data;
            let operationCodeIds = "";
            if(this.selectedOperationCodes.length) {
                this.selectedOperationCodes.forEach(operationCode => {
                    operationCodeIds += operationCode.id + ',';
                });
                operationCodeIds = operationCodeIds.substring(0, operationCodeIds.length - 1);
                console.log(operationCodeIds);
            }
        },
        getServices() {

        }
    },
    created() {
       this.getControllers();
       this.getOperationCodes();
       this.getServices();
    },
    watch: {
        selectedOperationCodes: function() {
            if (this.selectedOperationCodes.length === 0) {
                this.deleteDisabled = true
            } else {
                this.deleteDisabled = false
            }
        }
    },
}
</script>

<style>

</style>
