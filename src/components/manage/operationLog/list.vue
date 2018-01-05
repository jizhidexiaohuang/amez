<template>
    <div>
        <!-- 新增容器 -->
        <div v-if="pageType == 'add'"  class="testWrap" v-on:returnList="fnBackformAdd"/>
        <!-- 编辑容器 -->
        <div v-if="pageType == 'edit'" class="testWrap">
            编辑
        </div>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
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
                    <Select v-model="storeStatus" style="width:100px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <DatePicker v-model="cd.startTime" type="date" placeholder="开始时间" style="width:160px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <DatePicker v-model="cd.endTime" type="date" placeholder="结束时间" style="width:160px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;" v-show="false">
                    <Input v-model="value">
                    <Select v-model="selectType" slot="prepend" style="width: 80px">
                        <Option value="门店名称">门店名称</Option>
                        <Option value="注册手机">注册手机</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:220px;">
                    <Row>
                        <Col span="2"></Col>
                        <Col span="22">
                            <Input v-model="area" placeholder="账号名称"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                    <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh" v-show="false">重置</Button>
                </FormItem>
            </Form>
            <Row style="margin-bottom:10px;" v-show="false">
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
    </div>
</template>
<script>
    import common from '../../../base.js'
    export default {
        data () {
            return {
                value:'',
                selectType:'门店名称',
                storeStatus:'', //店铺状态下拉框
                area:'', //地区
                statusList:[
                    {
                        value:'0',
                        label:'所有部门'
                    },
                ],
                cd:{
                    startTime:'',//评论时间范围
                    endTime:'',//评论时间范围
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
                        title: '账号名称',
                        key: 'userName',
                    },
                    {   
                        title: '部门名称',
                        key: 'departmentName'
                    },
                    {
                        title: '最近登录时间',
                        key: 'loginTime',
                        render:(h,params)=>{
                            return common.formatDate(params.row.loginTime)
                        }
                    },
                    {
                        title: '登录IP',
                        key: 'loginIp',
                    },
                    {
                        title: '是否登录成功',
                        key: 'isLogin',
                        render:(h,params)=>{
                            if(params.row.isLogin){
                                return h('div','成功')
                            }else{
                                return h('div','失败')
                            }
                        }
                    },
                    {
                        title: '操作内容',
                        key: 'remarks',
                    },
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
            },
            /* 数据获取 */
            getData () {
                let vm = this;
                let start = (vm.pageNun-1)*vm.size;//从第几个开始
                let size = vm.size;//每页条数
                let url = common.path+"baseLogs/selectListByConditions?pageNo="+this.pageNun+'&pageSize='+this.size;
                let ajaxData = {
                    departmentName:'',
                    userName:'',
                    loginTime:''
                }
                vm.loading = true;
                this.$http.post(
                    url,
                    // JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    let oData = res.data
                    console.log(oData);
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
            //按条件查询
            // getDataByCondition(){
            //     let ajaxData = {
            //         departmentName:'财务部',
            //         userName:'刘飞华',
            //         loginTime:'2017-10-10'
            //     }
            //     let url = common.path+''
            // }
        },
        mounted: function(){
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
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