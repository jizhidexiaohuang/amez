<template>
    <div>
        <!-- 新增容器 -->
        <GradePage v-if="pageType == 'grade'"  class="testWrap" v-on:returnList="fnBackformAdd"/>
        <!--成长值设置-->
        <RulesPage v-if="pageType == 'rules'"  class="testWrap" v-on:returnList="fnBackformAdd"/>
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
            <Form :model="cd" inline v-show="false">
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
                    <Select v-model="selectType" slot="prepend" style="width: 80px">
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
                <Col span="10">
                    <Button style="float:left;margin-right:10px;" @click.native="changePageType('grade')" type="success" icon="android-add">新增店铺等级</Button>
                    <Button style="float:left;" @click.native="changePageType('rules')" type="primary" icon="android-add">成长规则设置</Button>
                </Col>
            </Row>
            <Table
                :loading="table.loading" 
                :data="table.tableData1" 
                :columns="tableColumns1" 
                stripe
                @on-select="fnSelect"
                @on-select-all="fnSelectAll"
            ></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page 
                        :total="table.recordsTotal" 
                        :current="table.pageNun"
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
    import GradePage from './grade.vue'
    import RulesPage from './rules.vue'
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
                tableColumns1: [
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '店铺等级',
                        key: 'levelName',
                    },
                    {   
                        title: '成长值范围',
                        key: 'beginUpgradeValue',
                        render:(h,params)=>{
                            return h('div',params.row.beginUpgradeValue+'--'+params.row.endUpgradeValue)
                        }
                    },
                    {
                        title: '排序',
                        key: 'sort',
                    },
                    {
                        title: '图标',
                        key: 'levelLogo',
                        render:(h,params)=>{
                            if(params.row.levelLogo){
                                return h('div',[
                                    h('img',{
                                        attrs:{
                                            src:params.row.levelLogo
                                        },
                                        style:{
                                            width:'36px',
                                            height:'40px'
                                        }
                                    })
                                ])
                            }else{
                                h('div','无图标')
                            }
                        }
                    },
                   
                ],
                table:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10
                }
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            },
            /* 数据获取 */
            getData () {
                let vm = this;
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path2+"storeLevel/findListByAll";
                // let url = "http://172.16.20.151:8080/product/front/findByPage?pageNo=1&pageSize=1";
                let ajaxData = {
                    pageNo:start,
                    pageSize: size
                }
                vm.table.loading = true;
                this.$http.get(
                    url,
                    // ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    let oData = res.data
                    console.log(oData);
                    vm.table.recordsTotal = oData.data.length;
                    vm.table.tableData1 = oData.data;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.table.size = size;
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
            fnBackformAdd (type) {
                this.changePageType(type);
                this.getData();
            },
            changePageType (type) {
                this.pageType = type;
            },
            /* 刷新 */
            refreshTable () {
                var vm = this;
                vm.table.pageNun = 1;
                vm.table.size = 10;
                vm.getData();
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
                        vm.getData();//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            }
        },
        mounted: function(){
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            GradePage,
            RulesPage
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