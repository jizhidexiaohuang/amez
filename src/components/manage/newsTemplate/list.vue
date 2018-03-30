
<template>
    <div>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 新增 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"></AddPage>
        <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'"  class="testWrap" :sendChild="sendChild" v-on:returnList="changePageType"/>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Form :model="cd" inline v-if="false">
                    <FormItem style="margin-bottom:10px;">
                        评价时间
                        <DatePicker v-model="cd.time" type="date" placeholder="请选择评价时间" style="width:200px;"></DatePicker>
                    </FormItem>
                </Form>
                <Row style="margin-bottom:10px;">
                    <Col span="5">
                        <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search" v-if="false">查询</Button>
		                <Button v-if="!!operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    </Col>
                    <Col span="3" offset="16" v-if="!!operators.add">
                        <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">新增模板</Button>
                    </Col>
                </Row>
                <Table
                    :loading="table.loading" 
                    :data="table.tableData1" 
                    :columns="table.tableColumns" 
                ></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page 
                            :total="table.recordsTotal" 
                            :current="table.pageNun"
                            :page-size="table.pageSize"
                            show-sizer 
                            @on-change="changePage"
                            @on-page-size-change="changeSize"
                        ></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    /* =======================可编辑表格 start====================== */
    const cellInput = (vm, h, param, key) => {
        return h('Input', {
            props: {
                type: 'text',
                value: vm.edittingStore[param.index][key]
            },
            on: {
                'on-change' (event) {
                    vm.edittingStore[param.index][key] = event.target.value;
                }
            }
        });
    };
    const saveIncellEditBtn = (vm, h, param) => {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'checkmark'
            },
            on: {
                click: (event) => {
                    let key = param.column.key;
                    let oldValue = vm.table.tableData1[param.index][key];
                    let id = param.row.id;
                    let value = vm.edittingStore[param.index][key];
                    vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                    vm.table.tableData1 = JSON.parse(JSON.stringify(vm.edittingStore));
                    vm.handleSubmit(id,key,value);
                }
            }
        });
    };
    const incellEditBtn = (vm, h, param) => {
        if (vm.hoverShow) {
            return h('div', {
                'class': {
                    'show-edit-btn': vm.hoverShow
                }
            }, [
                h('Button', {
                    props: {
                        type: 'text',
                        icon: 'edit'
                    },
                    on: {
                        click: (event) => {
                            vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                            vm.table.tableData1 = JSON.parse(JSON.stringify(vm.edittingStore));
                        }
                    }
                })
            ]);
        }else{
            return h('Button', {
                props: {
                    type: 'text',
                    icon: 'edit'
                },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        vm.table.tableData1 = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            });
        }
    };
    const commonRender = (vm, h, params) => {
        let currentRow = vm.table.tableData1[params.index];
        return h('Row',{
            props: {
                type: 'flex',
                align: 'middle',
                justify: 'center'
            }
        },[
            h('Col',{
                props: {
                    span: '22'
                }
            },[
                !currentRow.edittingCell[params.column.key] ? h('span', currentRow[params.column.key]) : cellInput(vm, h, params, params.column.key)
            ]),
            h('Col',{
                props: {
                    span: '2'
                }
            },[
                currentRow.edittingCell[params.column.key] ? saveIncellEditBtn(vm, h, params) : incellEditBtn(vm, h, params)
            ])
        ])
    }
    /* =====================可编辑表格 end============================ */

    import MyUpload from '../../common/upload.vue'
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    export default {
        data () {
            return {
                hoverShow: true,
                edittingStore: [], // 可编辑表格的数据备份
                operators: {},
                table:{
                    pageSize:10,//每页显示的数量
                    recordsTotal:0,//总数量
                    pageNun:1,//索引
                    loading: false,//加载状态
                    size: 10,//长度 
                    tableData1: [],//数据
                    //table头
                    tableColumns: [
                        {
                            title: '短信名称',
                            key: 'smsName',
                            render: (h,params) => {
                                return commonRender(this,h,params)
                            }
                        },
                        {
                            title: '短信编码',
                            key: 'smsCode',
                            render: (h,params) => {
                                return commonRender(this,h,params)
                            }
                        },
                        {   
                            title: '短信类型',
                            key: 'smsType',
                            render: (h,params) => {
                                const row = params.row;
                                const color = row.smsType == 0 ? 'yellow': row.smsType == 1 ? 'green': row.smsType == 2?'blue':'white';
                                const text = row.smsType == 0 ? '验证码': row.smsType == 1?'短信通知': row.smsType == 2? '短信推广': '';
                                return text;
                            }
                        },
                        {
                            title: '更新时间',
                            key: 'updateTime',
                            render: (h,params) => {
                                const row = params.row;
                                return this.common.formatDate(row.updateTime);
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 210,
                            render: (h, params) => {
                                let arrs = [];
                                let obj1 = h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let row = params.row;
                                            this.sendChild.id = row.id;
                                            this.changePageType('edit');
                                        }
                                    }
                                }, '编辑');
                                if(!!this.operators.edit){
                                    arrs.push(obj1);
                                }
                                let obj2 = h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let row = params.row;
                                            this.fnDeleteItem(row.id);
                                        }
                                    }
                                }, '删除');
                                if(!!this.operators.delete){
                                    arrs.push(obj2);
                                }
                                return h('div', arrs);
                            }
                        }
                    ],
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',//子页面类型
                 /* 传递给子组件的数据 */
                sendChild:{
                    id: "", // 编辑选项的id
                },
            }
        },
        methods: {
            /* ==============================可编辑表格 start ==================== */
            /* 表格数据过滤 */
            dataInit(res) {
                let vm = this;
                let cloneData = JSON.parse(JSON.stringify(res.data.data.list));
                let arrs = [];
                arrs = cloneData.map(item =>{
                    let edittingCell = {};
                    edittingCell['smsName'] = false;
                    vm.$set(item,'edittingCell',edittingCell);
                    return item;
                })
                vm.table.tableData1 = arrs;
                // 深拷贝数组
                vm.edittingStore = JSON.parse(JSON.stringify(vm.table.tableData1));
                vm.table.recordsTotal = res.data.data.total; // 总数量
                vm.table.loading = false;
            },
            /* 单行编辑 */
            handleSubmit (id,key,value) {
                let ajaxData = {};
                let vm = this;
                ajaxData['id'] = id;
                ajaxData[key] = value;
                console.log(ajaxData);
                let url = vm.common.path2 + "baseSmsTemplates/update"
                vm.$http.put(
                    url,
                    ajaxData,
                ).then(function(res){
                    let _switch = false;
                    vm.$Message.success('修改成功');
                    vm.edittingStore.forEach((item,index) => {
                        for(var i in item.edittingCell){
                            console.log(item.edittingCell[i]);
                            if(!!item.edittingCell[i]){
                                _switch = true;
                            }
                        }
                    })
                    if(!!_switch){
                        return false;
                    }
                    vm.getData();
                }).catch(function(err){
                    vm.$Message.error('提交失败!');
                })
            },
            /* ==============================可编辑表格 end ==================== */

            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
            },
            /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.size = 10;//页数
                vm.table.pageNun = 1;//索引
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = vm.common.path2+"baseSmsTemplates/selectListByConditions?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    categoryParentId: 0
                }
                vm.table.loading = true;
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then(function(res){
                    vm.dataInit(res);
                }).catch(function(err){
                })
            },
            /* 删除一条列表 */
            fnDeleteItem (id) {
                let vm = this;
                this.$Modal.confirm({
                    title: '删除短信模板',
                    content: '确定要删除此短信模板吗？',
                    onOk: function(){
                        let url = vm.common.path2+"baseSmsTemplates/"+id;
                        this.$http.delete(
                            url
                        ).then(function(res){
                            let oData = res.data;
                            if(oData.code == 200){
                                setTimeout(function(){
                                    vm.$Message.success('删除成功');
                                },500)
                                vm.getData();
                            }else{
                                vm.$Message.error(oData.message);
                            }
                        }).catch(function(err){
                            vm.$Message.error(err);
                        })
                    }
                })
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            /* 控制当前显示页面的类型 */
            changePageType (type) {
                // this.getData();
                this.pageType = type;
                if(type == "list"){
                    this.table.pageSize = this.table.size;
                    this.getData();
                }
            },
            /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
            fnExistTabList () {
                let vm = this;
                if(!!vm.activatedType){
                    let arrs = [];
                    let type = vm.$store.getters.tabTrue;
                    if(!!!type){
                        vm.table.tableData1 = [];//为了处理进来的时候看到之前缓存的页面
                        vm.table.loading = true;//进一步模拟第一次进来时的页面效果
                        vm.pageType = 'list'//显示列表页，放在这里是给上边的处理留点时间，也就是初始化放在这段代码上边
                        
                        vm.getData('init');//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
        },
        mounted: function(){
            this._u.operatorsEdit(this); // 控制页面按钮的显示
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            MyUpload,
            AddPage,
            EditPage,
        }
    }
</script>
<style scoped>
</style>