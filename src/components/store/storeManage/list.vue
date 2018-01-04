<template>
    <div>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="fnBackformAdd"/>
        <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'" class="testWrap" v-on:returnList="fnBackformAdd" :editId="editId"></EditPage>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <Row style="margin-bottom:10px;" v-show="false">
                <Col span="5">
                    <ButtonGroup>
                        <Button @click.native="changePageType('list')" type="primary" size="small" icon="ios-search">新增</Button>
                        <Button @click.native="refreshTable" type="warning" size="small" icon="refresh">刷新</Button>
                        <Button type="error" size="small" icon="android-delete">删除</Button>
                    </ButtonGroup>
                </Col>
                <Col span="3" offset="16">
                    <Input size="small" placeholder="please write text" icon="ios-search"></Input>
                </Col>
            </Row>
            <Form :model="cd" inline>
                        <FormItem style="margin-bottom:10px;">
                            状态
                            <Select v-model="storeStatus" style="width:80px">
                                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem style="margin-bottom:10px;">
                            开店时间
                            <DatePicker v-model="cd.time" type="date" placeholder="请选择评价时间" style="width:200px;"></DatePicker>
                        </FormItem>
                        <FormItem style="margin-bottom:10px;">
                           <Input v-model="value">
                            <Select v-model="selectType" slot="prepend" style="width: 100px">
                                <Option value="门店名称">门店名称</Option>
                                <Option value="注册手机">注册手机</Option>
                            </Select>
                          </Input>
                        </FormItem>
                        <FormItem style="margin-bottom:10px; width:250px;">
                            <Row>
                                <Col span="4">地区</Col>
                                <Col span="20">
                                    <Input v-model="area" placeholder="全部（省-市-区）"></Input>
                                </Col>
                            </Row>
                        </FormItem>
            </Form>
            <Row style="margin-bottom:10px;">
                <Col span="5">
                    <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                    <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">重置</Button>
                </Col>
                <Col span="3" offset="16">
                    <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">新增门店</Button>
                </Col>
            </Row>
            <Table
                :loading="loading" 
                :data="tableData1" 
                :columns="tableColumns1" 
                stripe
                border
                @on-select="fnSelect"
                @on-select-all="fnSelectAll"
            ></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page 
                        :total="recordsTotal" 
                        :current="pageNun"
                        show-sizer 
                        @on-change="changePage"
                        @on-page-size-change="changeSize"
                    ></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                editId:0,//传给编辑页面的id
                value:'',
                selectType:'门店名称',
                storeStatus:'', //店铺状态下拉框
                area:'', //地区
                statusList:[
                    {
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'已冻结'
                    },{
                        value:'2',
                        label:'已关闭'
                    },
                ],
                cd:{
                    time:[],//评论时间范围
                    operType:"1"//评论类型、不用重置
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
                tableData1: [],
                tableColumns1: [
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '门店名称',
                        key: 'storeName',
                    },
                    {   
                        title: '老板姓名',
                        key: 'bossName'
                    },
                    {
                        title: '注册手机',
                        key: 'storeTel'
                    },
                    {
                        title: '门店地址',
                        key: 'storeAddress',
                    },
                    {
                        title: '申请时间',
                        key: 'storeTime',
                    },
                    {
                        title: '保证金',
                        key: 'paymentAmount',
                        render:(h,params)=>{
                            if(!params.row.paymentAmount){
                                return 1000
                            }else{
                                return params.row.paymentAmount
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'storeState',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.storeState==0){
                                str = '已关闭'
                            }else if(params.row.storeState==1){
                                str = '运营中'
                            }else if(params.row.storeState==2){
                                str = '待审核'
                            }else if(params.row.storeState==3){
                                str = '已冻结'
                            }
                            return str;
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
                        // align: 'center',
                        // fixed: 'right',
                        render: (h, params) => {
                           if(params.row.storeState==0){
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
                                            this.editId = params.row.id
                                            this.changePageType('edit');
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                           this.openStore(params.row.id) 
                                        }
                                    }
                                }, '开启')
                            ]);
                           }else if(params.row.storeState==3){
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
                                            this.editId = params.row.id
                                            this.changePageType('edit');
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.openStore(params.row.id)
                                        }
                                    }
                                }, '激活')
                            ]);
                           }else if(params.row.storeState==1){
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
                                            this.editId = params.row.id
                                            this.changePageType('edit');
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.closeStore(params.row.id)
                                        }
                                    }
                                }, '关闭'),
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
                                            this.frozenStore(params.row.id)
                                        }
                                    }
                                }, '冻结'),
                            ]);
                           }else if(params.row.storeState==2){
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
                                            this.editId = params.row.id
                                            this.changePageType('edit');
                                        }
                                    }
                                }, '编辑'),
                            ]);
                           }
                        }
                    }
                ],
                test:1,
                recordsTotal:0,
                pageNun:1,
                loading: false,
                size: 10,
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.pageNun = page;   
                vm.getData();             
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            },
            /* 数据获取 */
            getData () {
                let vm = this;
                let start = (vm.pageNun-1)*vm.size;//从第几个开始
                let size = vm.size;//每页条数
                let url = common.path+"store/front/findByPage?pageNo="+this.pageNun+'&pageSize='+this.size;
                // let url = "http://172.16.20.151:8080/product/front/findByPage?pageNo=1&pageSize=1";
                let ajaxData = {
                    pageNo:start,
                    pageSize: size
                }
                vm.loading = true;
                this.$http.post(
                    url,
                    // ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res.data.data);
                    let oData = res.data
                    vm.recordsTotal = oData.data.total;
                    vm.tableData1 = res.data.data.list;
                    vm.loading = false;
                }).catch(function(err){
                })
            }, 
            /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.size = size;
                vm.getData();
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
                console.log(row);
                console.log(selection);
            },
            /* 全选时的回调函数 */
            fnSelectAll (selection) {
                console.log(selection);
            },
            fnBackformAdd () {
                this.changePageType("list");
                this.getData();
            },
            changePageType (type) {
                this.pageType = type;
            },
            /* 刷新 */
            refreshTable () {
                var vm = this;
                vm.pageNun = 1;
                vm.size = 10;
                vm.getData();
            },
            /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
            fnExistTabList () {
                let vm = this;
                if(!!vm.activatedType){
                    let arrs = [];
                    let type = vm.$store.getters.tabTrue;
                    if(!!!type){
                        vm.tableData1 = [];//为了处理进来的时候看到之前缓存的页面
                        vm.loading = true;//进一步模拟第一次进来时的页面效果
                        vm.pageType = 'list'//显示列表页，放在这里是给上边的处理留点时间，也就是初始化放在这段代码上边
                        vm.getData();//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
            //冻结店铺
            frozenStore(id){
                let vm = this;
                this.$Modal.confirm({
                    title:'冻结店铺',
                    content:'冻结后，该店铺将无法交易，确认冻结该店铺？',
                    onOk(){
                        let url = common.path+'store/freeze/'+id;
                        this.$http.put(url).then(res=>{
                            if(res.status==200){
                                this.$Message.success('冻结成功！')
                                vm.getData()
                            }
                        })
                    }
                });
            },
            //开启店铺
            openStore(id){
                let vm = this
                this.$Modal.confirm({
                    title:'开启店铺',
                    content:'开启后，该店铺可以继续开展美容邦相关业务，确认开启该店铺？',
                    onOk(){
                        let url = common.path+'store/open/'+id;
                        this.$http.put(url).then(res=>{
                            if(res.status==200){
                                this.$Message.success('开启成功！')
                                vm.getData()
                            }
                        })
                    }
                });
            },
            //关闭店铺
            closeStore(id){
                let vm = this
                this.$Modal.confirm({
                    title:'关闭店铺',
                    content:'关闭后，该店铺将无法开展美容邦相关业务，确认关闭该店铺？',
                    onOk(){
                        let url = common.path+'store/close/'+id;
                        this.$http.put(url).then(res=>{
                            if(res.status==200){
                                this.$Message.success('关闭成功！')
                                vm.getData()
                            }
                        })
                    }
                });
            },
        },
        mounted: function(){
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            AddPage,
            EditPage
        }
    }
</script>
<style scoped>
    .testWrap{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px; top:0px;
        z-index: 1;
        padding:5px 10px 10px 10px;
    }
    .fl{
        float: left; 
    }
    .fr{
        float: right;
    }
</style>