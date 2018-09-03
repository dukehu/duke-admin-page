<template>
    <Row class="vm-table vm-panel">
        <div class="panel-heading">
            Resource List
        </div>
        <div class="panel-body">
            <Row type="flex" justify="space-between" class="control">
                <div class="search-bar" style="width:315px">
                    <Select v-model="serviceId">
                        <Option v-for="m in modules" value="m.id" :key="m.id">{{m.name}}</Option>
                    </Select>
                </div>
                <div>
                    <Button type="success" @click="saveRerourceModalShow = true" ><i class="fa fa-plus"></i> Add Resource</Button>
                    <Button type="success" @click="saveModuleModalShow = true" ><i class="fa fa-plus"></i> Add Module</Button>
                </div>
            </Row>
            <Row type="flex" justify="space-between"  style="height: 530px; border:1px solid darkgray">
                <Col span="6" style="border-right:1px solid darkgray; padding: 5px;">
                    <Tree :data="resourceTree" @on-select-change="selectResource"></Tree>
                </Col>
                <Col span="18" style="padding: 5px;overflow: auto; height: 500px;">
                    <Card shadow title="Column Name" :padding="0" style="width: 20%; float:left;border: 1px solid darkgray;">
                        <CellGroup>
                            <cell style="border-top: 1px solid darkgray; height: 40px;" title="Resource Name" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;" title="Resource Code" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;" title="Resource Icon" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;" title="Resource Router" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;" title="Resource Sort" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;" title="Resource Type" />
                            <cell style="border-top: 1px solid darkgray; height: 76px;" title="Resource Memo" />
                            <cell style="border-top: 1px solid darkgray; height: 80px;" title="Resource Auths" />
                            <cell style="border-top: 1px solid darkgray; height: 46px" title="Action" />
                        </CellGroup>
                    </Card> 
                    <Card title="Column Value" :padding="0" shadow style="width: 80%; float:right;border: 1px solid darkgray">
                        <CellGroup>
                            <cell style="border-top: 1px solid darkgray; height: 40px;" :title="resourceDetail.name" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;" :title="resourceDetail.code" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;" :title="resourceDetail.icon" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;" :title="resourceDetail.router" />
                            <cell style="border-top: 1px solid darkgray; height: 40px;">
                                {{resourceDetail.sort}}
                            </cell>
                            <cell style="border-top: 1px solid darkgray; height: 40px;">
                                <span v-show="resourceDetail.type === 1">模块</span>
                                <span v-show="resourceDetail.type === 2">栏目</span>
                                <span v-show="resourceDetail.type === 3">按钮</span>
                            </cell>
                            <cell style="border-top: 1px solid darkgray; height: 76px;" :title="resourceDetail.memo" />
                            <cell style="border-top: 1px solid darkgray; height: 80px;overflow: auto;" title="Only show titles">
                                <Tree :data="resourceDetail.authTree"></Tree>
                            </cell>
                            <cell style="border-top: 1px solid darkgray; height: 46px">
                                <Button type="warning">Edit</Button>
                                <Button type="success" @click="showAuthorizeForm">Authorize</Button>
                                <Button type="error">Delete</Button>
                            </cell>
                        </CellGroup>
                    </Card>
                </Col>
            </Row>
        </div>

        <!-- add module -->
        <Modal
            v-model="saveModuleModalShow"
            title="Add"
            ok-text="ok"
            cancel-text="Cancel"
            @on-ok="saveModule"
            :loading="saveModuleLoading"
            >
                <Form :label-width="100" :rules="moduleFormValidate" ref="module" :model="module">
                    <Form-item label="Module Name" prop="name">
                        <Input v-model="module.name"  placeholder="Enter Module Name..." />
                    </Form-item>
                    <Form-item label="Module Code" prop="code">
                        <Input v-model="module.code"  placeholder="Enter Module Code..." />
                    </Form-item>
                    <Form-item label="Router" prop="router">
                        <Input v-model="module.router" placeholder="Enter Module Router ..." />
                    </Form-item>
                    <Form-item label="Sort" prop="sort">
                        <Input v-model="module.sort" placeholder="Enter Module Sort ..." />
                    </Form-item>
                    <Form-item label="Module Memo" prop="memo">
                        <Input v-model="module.memo" type="textarea" placeholder="Enter resource Memo ..." />
                    </Form-item>
                </Form>
        </Modal>

        <!-- add resource -->
        <Modal
            v-model="saveRerourceModalShow"
            title="Add"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="saveResource"
            :loading="saveResourceLoading"
            width="500px">
                <Form :label-width="109" style="height: 350px;overflow: auto;" :rules="resourceFormValidate" ref="resource" :model="resource">
                    <Form-item label="Parent Node" prop="parentName">
                        <Button style="width: 354px;height:30px; text-align:left" @click="resourceModalShow = true" >{{resource.parentName}}</Button>
                    </Form-item>
                    <Form-item label="Icon" prop="icon">
                        <Input v-model="resource.icon"  placeholder="Enter Resource Icon..." />
                    </Form-item>
                    <Form-item label="Router" prop="router">
                        <Input v-model="resource.router" placeholder="Enter Resource Router ..." />
                    </Form-item>
                    <Form-item label="Sort" prop="sort">
                        <Input v-model="resource.sort" placeholder="Enter Resource Sort ..." />
                    </Form-item>
                    <Form-item label="Resource Name" prop="name">
                        <Input v-model="resource.name" placeholder="Enter Resource Name ..." />
                    </Form-item>
                    <Form-item label="Resource Code" prop="code">
                        <Input v-model="resource.code" placeholder="Enter Resource Name ..." />
                    </Form-item>
                    <Form-item label="Resource Type" prop="type">
                        <Select v-model="resource.type" placeholder="Select Resource Type...">
                            <Option value=2>栏目</Option>
                            <Option value=3>按钮</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="Resource Memo" prop="memo">
                        <Input v-model="resource.memo" type="textarea" placeholder="Enter resource Memo ..." />
                    </Form-item>
                </Form>
        </Modal>

        <!-- authorize -->
        <Modal
            v-model="authorizeModalShow"
            title="Authorize"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="authorize"
            width="1000px"
            draggable>
                <div style="height:300px">
                    <div style="float:left; width:59%;">
                        <div class="search-bar">
                            <RadioGroup v-model="requestMethod" type="button">
                                <Radio label="GET"></Radio>
                                <Radio label="POST"></Radio>
                                <Radio label="DELETE"></Radio>
                                <Radio label="PUT"></Radio>
                            </RadioGroup>
                            <Input placeholder="Please enter ..." v-model="url" style="width:91%" clearable />
                            <Button @click="searchOperationCode"><i class="fa fa-search"></i></Button>
                        </div>
                        <div style="overflow: auto; height: 240px;">
                            <Table
                                ref="row"
                                :show-header="false"
                                border
                                :stripe="true"
                                :columns="dataColumns" 
                                :data="operationCodes">
                            </Table>
                        </div>
                    </div>
                    <div style="display: block; position: absolute; top: 50px; bottom: 60px; left: 60%; border: 1px dashed black"></div>
                    <div style="float:right; width:39%; padding-left:8px;overflow: auto; height: 270px;">
                        <Tree ref="authorizeTree" :data="authTree" show-checkbox></Tree>
                        <Button type="warning" @click="cancelAuthorize" style="position:absolute;left;0;bottom:65px;">取消授权</Button>
                    </div>
                </div>
        </Modal>

        <!-- select resourse -->
        <Modal
            draggable
            v-model="resourceModalShow"
            title="Select Parent"
            ok-text="OK"
            cancel-text="Cancel"
            @on-ok="seleclParent"
            width="300px">
                <Tree @on-select-change="selectParentResource" style="overflow: auto; height: 240px;" :data="resourceTree"></Tree>
        </Modal>
    </Row>
</template>

<script>
export default {
    data() {
        return {
            saveModuleModalShow: false,
            saveRerourceModalShow: false,
            authorizeModalShow: false,
            resourceModalShow: false,
            saveResourceLoading: true,
            saveModuleLoading: true,
            parentNode: '',
            resourceId: '',
            serviceId: 'duke-admin',
            serviceListLoading: false,
            authTree: [],
            modules: [
                {id: 'duke-admin', name: '后端管理'},
                {id: 'duke-blog', name: '博客项目'},
            ],
            dataColumns: [
                {id: '20156540', title: 'name', key: 'name'},
                {id: '20156541', title: 'url', key: 'url'},
                {id: '20156547', title: '操作', key: 'action', width: 150, align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.authorize(params);
                                        }
                                    }
                                }, 'authorize')
                            ]);
                        }
                    }
            ],
            operationCodes: [],
            resourceTree: [],
            url: '',
            requestMethod: 'GET',
            switchValue: true,
            resource: {
                parentName: '',
                parentId: '',
                icon: '',
                router: '',
                sort: 1,
                name: '',
                code: '',
                type: 1,
                memo: ''
            },
            module: {
                name: '',
                code: '',
                router: '',
                sort: 1,
                memo: ''
            },
            resourceDetail: {
                name: 'test',
                code: 'test',
                icon: 'test',
                router: '/test',
                sort: '999',
                type: '999',
                memo: 'test',
                authTree: [],
            },
            resourceFormValidate: {
                parentName: [
                    {required: true, message: 'Parent Name cannot be empty', trigger: 'blur'}
                ],
                icon: [
                    {required: true, message: 'Resource Icon cannot be empty', trigger: 'blur'}
                ],
                router: [
                    {required: true, message: 'Resource Router cannot be empty', trigger: 'blur'}
                ],
                sort: [
                    {required: true, message: 'Resource Sort cannot be empty', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: 'Resource Name cannot be empty', trigger: 'blur'}
                ],
                code: [
                    {required: true, message: 'Resource Code cannot be empty', trigger: 'blur'}
                ],
                type: [
                    {required: true, message: 'Resource Type cannot be empty', trigger: 'blur'}
                ]
            },
            moduleFormValidate: {
                name: [
                    {required: true, message: 'Module Name cannot be empty', trigger: 'blur'}
                ],
                code: [
                    {required: true, message: 'Module Code cannot be empty', trigger: 'blur'}
                ],
                router: [
                    {required: true, message: 'Module Router cannot be empty', trigger: 'blur'}
                ],
                sort: [
                    {required: true, message: 'Module Sort cannot be empty', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        // 授权
        authorize(params) {
            var row = params.row;
            var operationCodeId = row.id;
            this.$axios('post',"/api/admin/resource_operationcode",{
                resourceId: this.resourceId,
                operationCodeId: operationCodeId
            }).then(res => {
                this.$Message.success('Authorize Successful!');
                this.getAuthTree();
            });
        },
        // 取消授权
        cancelAuthorize() {
            var nodes = this.$refs.authorizeTree.getCheckedNodes();
            let operationCodeIds = '';
            nodes.forEach((node, i) => {
                let tmpId = node.id;
                if(tmpId) {
                    operationCodeIds += tmpId + ','
                }
            });
            if(operationCodeIds) {
                operationCodeIds = operationCodeIds.substring(0, operationCodeIds.length - 1);
                this.$Modal.confirm({
                    title: 'Prompt',
                    content: '<p>Are you sure want to cancel the authorization?</p>',
                    loading: true,
                    onOk: () => {
                        this.$axios('post','/api/admin/resource_operationcode/cancel_authorize', {
                            resourceId: this.resourceId,
                            operationCodeIds: operationCodeIds
                        }).then(data => {
                            this.$Modal.remove();
                            this.$Message.info('Authorization Cancel Successful!');
                            this.getAuthTree();
                        })
                    }
                });
            } else {
                this.$Message.info('No Authorization Checked!');
            }
        },
        // 显示授权页面的
        showAuthorizeForm() {
            this.getAuthTree();
            this.authorizeModalShow = true;
        },
        // 按条件查找操作码
        searchOperationCode() {
            this.$axios('get','/api/admin/operation_code/request_method_url', {
                requestMethod: this.requestMethod,
                url: this.url
            }).then(data => {
                this.operationCodes = data.data;
            })
        },
        moduleList() {

        },
        // 保存资源
        saveResource() {
            this.$refs.resource.validate((valid) => {
                if (valid) {
                    this.$axios('post',"/api/admin/resource",this.resource).then(res => {
                        this.saveRerourceModalShow = false;
                        this.$Message.success('Add Successful!');
                    });
                } else {
                    this.saveRerourceModalShow = true;
                    this.$Message.error('Fail!');
                }
            })
        },
        // 保存模块
        saveModule() {
            this.$refs.module.validate((valid) => {
                if (valid) {
                    console.log(this.resource);
                    this.$axios('post',"/api/admin/resource/module",{
                        name: this.module.name,
                        code: this.module.code,
                        router: this.module.router,
                        sort: this.module.sort,
                        memo: this.module.memo
                    }).then(res => {
                        this.saveModuleModalShow = false;
                        this.$Message.success('Add Successful!');
                    });
                } else {
                    this.saveModuleModalShow = true;
                    this.$Message.error('Fail!');
                }
            })
        },
        // 添加资源是，选择父级资源的
        selectParentResource(item) {
            var resourceId = item[0].key;
            var resourceName = item[0].title;
            this.parentNode = resourceName;
            this.resource.parentId = resourceId;
        },
        // 选择右侧资源树的
        selectResource(item) {
            var resourceId = item[0].key;
            this.resourceId = resourceId;
            var resourceName = item[0].title;
            this.resource.parentName = resourceName;
            this.resource.parentId = resourceId;
            this.getResourceDetail(resourceId);
        },
        // 获取资源详情的
        getResourceDetail(resourceId) {
            this.$axios('get','/api/admin/resource/' + resourceId).then(data => {
                this.resourceDetail = data.data;
            })
        },
        seleclParent() {
            this.resource.parentName = this.parentNode;
        },
        // 获取模块列表的
        getModules() {
            this.$axios('get','/api/admin/module').then(data => {
                this.modules = data.data;
            })
        },
        // 获取资源树的
        getResourceTree() {
            this.$axios('get','/api/admin/resource/tree', {
                parentId: this.serviceId
            }).then(data => {
                this.resourceTree = data.data;
                if(this.resourceTree) {
                    this.resourceTree[0].expand = true;
                    this.resourceId = this.resourceTree[0].key;
                    this.getResourceDetail(this.resourceTree[0].key);
                }
            })
        },
        // 获取权限树的
        getAuthTree() {
            this.$axios('get','/api/admin/resource_operationcode/auth_tree', {
                resourceId: this.resourceId
            }).then(data => {
                this.authTree = data.data;
                if(this.authTree) {
                    this.authTree[0].expand = true;
                }
            })
        }
    },
    created() {
        this.getModules();
        this.getResourceTree();
    }
}
</script>

<style scoped>
::cell {
    border-top: 1px solid black
}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background-color:#c1c1c1;}
</style>
