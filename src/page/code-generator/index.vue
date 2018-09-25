<template>
    <Row class="vm-table vm-panel">
        <div class="panel-heading">
            当前正在进行第 {{ current + 1 }} 步
        </div>
        <div class="panel-body">
            <Row type="flex" justify="space-between" class="control">
                <Steps :current="current">
                    <Step title="数据库配置信息"></Step>
                    <Step title="生成哪些"></Step>
                    <Step title="生成中···"></Step>
                    <Step title="完成"></Step>
                </Steps>
            </Row>
            <Card :bordered="true" v-show="this.current == 0">
                <Form :label-width="120" style="width:40%;">
                    <FormItem label="主机名或IP地址：">
                        <Input placeholder="Enter something..." />
                    </FormItem>
                    <FormItem label="端口：">
                        <Input placeholder="Enter something..." />
                    </FormItem>
                    <FormItem label="数据库名称">
                        <Input placeholder="Enter something..." />
                    </FormItem>
                    <FormItem label="用户名：">
                        <Input placeholder="Enter something..." />
                    </FormItem>
                    <FormItem label="密码：">
                        <Input placeholder="Enter something..." />
                    </FormItem>
                </Form>
            </Card>
            
            <Card :bordered="true" v-show="this.current == 1">
                <Collapse accordion v-model="value3">
                    <Panel name="1">
                        生成模块
                        <div slot="content">
                            <CheckboxGroup>
                                <Checkbox label="domain"></Checkbox>
                                <Checkbox label="mapper-xml"></Checkbox>
                                <Checkbox label="mapper-interface"></Checkbox>
                                <Checkbox label="service"></Checkbox>
                                <Checkbox label="controller"></Checkbox>
                                <Checkbox label="RestService"></Checkbox>
                            </CheckboxGroup>
                        </div>
                    </Panel>
                    <Panel name="2">
                        需要生成的表
                        <div slot="content">
                            <Table :columns="columns" :data="dbTables"></Table>
                        </div>
                    </Panel>
                </Collapse>
            </Card>
            
            <Card :bordered="true" v-show="this.current == 2">
                系统正在努力生成中，请稍后...
            </Card>
            <Row justify="space-between" class="footer">
                <Button type="primary" @click="previous">Previous step</Button>
                <Button type="primary" @click="next">Next step</Button>
            </Row>
        </div>
    </Row>
</template>

<script>
import dbDetails from './table-expand-db-details.vue';
export default {
    components: { dbDetails },
    data () {
        return {
            current: 0,
            value3: '1',
            value4: '1-1',
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '表名称',
                    key: 'name'
                },
                {
                    title: '表描述',
                    key: 'age'
                },
                {
                    title: '创建时间',
                    key: 'address'
                }
            ],
            dbTables: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park'
                },
                {
                    name: 'Jim Green',
                    age: 25,
                    address: 'London No. 1 Lake Park'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park'
                }
            ]
        }
    },
    methods: {
        next () {
            if (this.current == 3) {
            } else {
                this.current += 1;
            }
        },
        previous() {
            if(this.current == 0) {

            } else {
                this.current--;
            }
        }
    }
}
</script>

<style scoped>
</style>
