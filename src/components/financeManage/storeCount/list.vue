<template>
    <div>
        <!-- 服务订单容器 -->
        <infoPage v-if="pageType == 'info'" class="testWrap" :parentMsg="parentMsg" v-on:returnList="fnBackformAdd"></infoPage>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
            <Form :model="cd" inline>
                <Button v-if="operators.batchesOfMoney" style="float:left;margin-right:10px;" type="success" @click="payMoney()">批量打款</Button>
                <Button v-if="false" style="float:left;margin-right:10px;" type="success">批量发送对账单</Button>
                <Button v-if="operators.excel" style="float:left;margin-right:10px;" @click="exportData" type="success">导出Excel</Button>
                <FormItem style="margin-bottom:10px;">
                    交易月份
                    <Select v-model="cd.year" style="width:100px">
                        <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="cd.month" style="width:100px">
                        <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    打款状态
                    <Select v-model="cd.playMoneyStatus" style="width:100px">
                        <Option v-for="item in playMoneyStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputVal">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                        <Option value="storeName">门店名称</Option>
                        <Option value="storePhone">老板手机</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Button v-if="operators.see" style="margin-left:5px;" @click.native="getData('see')" type="primary" icon="ios-search">查询</Button>
                    <Button v-if="operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                </FormItem>
            </Form>
            <Row style="margin-bottom:10px;">
                <Col span="10">
                    <Button style="float:left;margin-right:10px;" @click.native="changePageType('add')" type="success" v-show="false">导出Excel</Button>
                    <Button style="float:left;" @click.native="changePageType('list')" type="primary" icon="android-add" v-show="false">成长规则设置</Button>
                </Col>
            </Row>
            <Table
                :loading="table.loading" 
                :data="table.tableData1" 
                :columns="tableColumns1" 
                ref="table"
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
    import infoPage from './info.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                operators:{},
                parentMsg:{
                    infoId:'',
                    storeId:''
                },
                storeId:'',
                ids:'',
                playMoneyStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'1',
                        label:'已打款'
                    },{
                        value:'0',
                        label:'未打款'
                    }
                ],  //交易状态
                yearList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'2017',
                        label:'2017'
                    },{
                        value:'2018',
                        label:'2018'
                    }
                ],  //年
                monthList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'01',
                        label:'1'
                    },{
                        value:'02',
                        label:'2'
                    },{
                        value:'03',
                        label:'3'
                    },{
                        value:'04',
                        label:'4'
                    },{
                        value:'05',
                        label:'5'
                    },{
                        value:'06',
                        label:'6'
                    },{
                        value:'07',
                        label:'7'
                    },{
                        value:'08',
                        label:'8'
                    },{
                        value:'09',
                        label:'9'
                    },{
                        value:'10',
                        label:'10'
                    },{
                        value:'11',
                        label:'11'
                    },{
                        value:'12',
                        label:'12'
                    }
                ],  //月
                cd:{
                    inputVal:'',
                    selectType:'storeName',
                    playMoneyStatus:'',//交易状态
                    year:'',
                    month:''
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
                tableColumns1: [
                    {
                        type: 'selection',
                        // title:'序号',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '月份',
                        width:90,
                        key: 'statisticsYearMonth'
                    },
                    {
                        title: '门店信息',
                        key: 'storeName',
                        width:110,
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.storeName),
                                h('div',params.row.storePhone)
                            ])
                        }
                    },
                    {
                        title: '月订单总量',
                        key: 'monthlyOrderQuantity',
                        width:100
                    },
                    {
                        title: '本月销售总额（元）',
                        key: 'totalSalesThisMonth',
                        width:100,
                        render:(h,params)=>{
                            return h('div',params.row.totalSalesThisMonth/100)
                        }
                    },
                    {
                        title: '已完成订单（笔）',
                        key: 'orderCompleted',
                        width:100
                    },
                    {
                        title: '已完成订单总金额（元）',
                        key: 'orderCompletedAmount',
                        width:100,
                        render:(h,params)=>{
                            return h('div',params.row.orderCompletedAmount/100)
                        }
                    },
                    {
                        title: '退款订单（笔）',
                        key: 'refundOrder',
                        width:100,
                    },
                    {
                        title: '退款金额（元）',
                        key: 'refundOrderAmount',
                        width:100,
                        render:(h,params)=>{
                            return h('div',params.row.refundOrderAmount/100)
                        }
                    },
                    {
                        title: '会员卡售卡（张）',
                        key: 'cardNumber',
                        width:100
                    },
                    {
                        title: '售卡奖励（元）',
                        key: 'sellCardRewards',
                        width:100,
                        render:(h,params)=>{
                            return h('div',params.row.sellCardRewards/100)
                        }
                    },
                    {
                        title: '月净收入（元）',
                        key: 'onNetIncome',
                        width:100,
                        render:(h,params)=>{
                            return h('div',params.row.onNetIncome/100)
                        }
                    },
                    {
                        title: '打款状态',
                        key: 'playStatus',
                        width:150,
                        render:(h,params)=>{
                            if(params.row.playStatus==1){
                                return h('div',[
                                    h('div','已打款'),
                                    h('div',params.row.playTime?common.formatDate(params.row.playTime):'')
                                ])
                            }else{
                                return h('div','未打款')
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 130,
                        render: (h, params) => {
                            let arr = [];
                            let infoButton = h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.parentMsg.infoId = params.row.id;
                                        this.parentMsg.storeId = params.row.storeId;
                                        this.changePageType('info');
                                    }
                                }
                            }, '详情');
                            let playMoneyButton = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.parentMsg.infoId = params.row.id;
                                        this.parentMsg.storeId = params.row.storeId;
                                        this.parentMsg.statisticsYearMonth = params.row.statisticsYearMonth;
                                        this.changePageType('info');
                                    }
                                }
                            }, '打款');
                            if(params.row.playStatus=='1'){
                                if(this.operators.info){
                                    arr.push(infoButton)
                                }
                                return h('div',arr)
                            }else{
                                if(this.operators.info){
                                    arr.push(infoButton)
                                }
                                if(this.operators.playMoney){
                                    arr.push(playMoneyButton)
                                }
                                return h('div',arr)
                            }
                        }
                    }
                ],
                tableColumns2: [
                    {
                        title: '月份',
                        key: 'statisticsYearMonth'
                    },
                    {
                        title: '门店名称',
                        key: 'storeName',
                    },
                    {
                        title: '门店号码',
                        key: 'storePhone',
                    },
                    {
                        title: '月订单总量',
                        key: 'monthlyOrderQuantity',
                    },
                    {
                        title: '本月销售总额（元）',
                        key: 'totalSalesThisMonth',
                    },
                    {
                        title: '已完成订单（笔）',
                        key: 'orderCompleted',
                    },
                    {
                        title: '已完成订单总金额（元）',
                        key: 'orderCompletedAmount',
                    },
                    {
                        title: '退款订单（笔）',
                        key: 'refundOrder',
                    },
                    {
                        title: '退款金额（元）',
                        key: 'refundOrderAmount',
                    },
                    {
                        title: '会员卡售卡（张）',
                        key: 'cardNumber',
                    },
                    {
                        title: '售卡奖励（元）',
                        key: 'sellCardRewards',
                    },
                    {
                        title: '月净收入（元）',
                        key: 'onNetIncome',
                    },
                    {
                        title: '打款状态',
                        key: 'playStatus',
                    },
                    {
                        title: '打款时间',
                        key: 'playTime',
                    },
                ],
                table:{
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                    tableData1: [],
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
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                if(!!init&&init=='see'){
                    start = 1;
                }
                let url = common.path2+"storeTradeStatistics/selectListByConditions?pageNo="+start+'&pageSize='+size;
                let ajaxData = {}
                if(vm.storeId){
                    ajaxData.storeId = vm.storeId;
                }
                if(vm.cd.inputVal){
                    ajaxData[vm.cd.selectType] = vm.cd.inputVal;
                }
                if(vm.cd.playMoneyStatus){
                    ajaxData.playStatus = vm.cd.playMoneyStatus;
                }
                if(vm.cd.year&&!vm.cd.month){
                    ajaxData.statisticsYear = vm.cd.year;
                }
                if(vm.cd.year&&vm.cd.month){
                    ajaxData.statisticsYearMonth = vm.cd.year+'-'+vm.cd.month;
                }
                if(!vm.cd.year&&vm.cd.month){
                    this.$Message.error('请输入年份!');
                    return false;
                }
                console.log(ajaxData)
                vm.table.loading = true;
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = oData.data.list;
                    vm.selected(oData.data.list)
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
            /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.playMoneyStatus = '';//订单状态
                vm.cd.selectType = 'storeName';// 状态
                vm.cd.inputVal = "";// 输入框的值
                vm.cd.year = '';
                vm.cd.month = '';
            },
            //导出Excel
            exportData(){
                this.table.tableData1.filter((data, index) => {
                    //月份
                    data.statisticsYearMonth = '="'+data.statisticsYearMonth+'"';
                    //门店号码 
                    data.storePhone = '="'+data.storePhone+'"';
                    //本月销售总额 
                    data.totalSalesThisMonth = '="'+data.totalSalesThisMonth/100+'"';
                    //已完成订单总额  
                    data.orderCompletedAmount = '="'+data.orderCompletedAmount/100+'"';
                    //退款金额  
                    data.refundOrderAmount = '="'+data.refundOrderAmount/100+'"';
                    //售卡奖励  
                    data.sellCardRewards = '="'+data.sellCardRewards/100+'"';
                    //月净收入  
                    data.onNetIncome = '="'+data.onNetIncome/100+'"';
                    //打款时间
                    data.playTime = data.playTime?common.formatDate(data.playTime):'';
                    //打款状态 playStatus
                    if(data.playStatus==1){
                        data.playStatus = '已完成'
                    }else{
                        data.playStatus = '未完成'
                    }
                })
                this.$refs.table.exportCsv({
                    filename: '店铺交易流水',
                    columns: this.tableColumns2,
                    data: this.table.tableData1
                });
                this.getData()
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
                for(var i=0;i<selection.length;i++){
                    this.ids += selection[i].id + ',';
                }
                this.ids = this.ids.substr(0,this.ids.length - 1)
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
            },
            // 批量打款
            payMoney(){
                let vm = this
                let url = common.path2+'storeTradeStatistics/batchMoney/'+vm.ids;
                this.$http.get(url).then(res=>{
                    if(res.data.code==200){
                        this.$Message.success('打款成功！')
                        vm.getData()
                    }
                })
            },
            selected(arr){
                for(var i=0;i<arr.length;i++){
                    if(arr[i].playStatus=='1'){
                        arr[i]._disabled = true
                    }
                }
            },
            /*===================== 菜单权限配置 start ====================*/
            /* 获取该菜单拥有的权限 */
            fnGetOperators () {
                let vm = this;
                function fnGetDatas (id,vm) {
                    let list = [];
                    let menuArrs = []; // 相同menuId的数组
                    let strArrs = []; // 权限数组 ["add","edit"]
                    /* 菜单对应的权限组 */
                    if(!!JSON.parse(window.localStorage.getItem("userInfo")).operator.list){
                        list = JSON.parse(window.localStorage.getItem("userInfo")).operator.list;
                    }
                    /* 每个用户有可能被分配了多个角色，所以需要合并相同menuId的权限组 */
                    for(var c = 0;c<list.length;c++){
                        if(list[c].menuId == id){
                            menuArrs.push(list[c]);
                        }
                    }

                    for(var j = 0;j<menuArrs.length;j++){
                        if(!!menuArrs[j].operCode){
                            vm.fnChangeOperators(menuArrs[j].operCode.split(","));
                        }
                    }
                }
                /* 得到所有的菜单 */
                let arrs = JSON.parse(window.localStorage.getItem("userInfo")).menu;
                for(var i = 0;i<arrs.length;i++){
                    if(!!arrs[i].hasChildList){
                        for(var j = 0;j<arrs[i].childList.length;j++){
                            if(arrs[i].childList[j].href == this.$route.path){
                                fnGetDatas(arrs[i].childList[j].menuId,vm)
                            }
                        }
                    }else{
                        if(arrs[i].href == this.$route.path){
                            fnGetDatas(arrs[i].menuId,vm)
                        }
                    }
                }
            },
            /* 权限的遍历 */
            fnChangeOperators (arrs) {
                // operators{}是开关对象
                let vm = this;
                arrs.forEach(function(item,index){
                    vm.operators[item] = true;
                })
            }
            /*=================== 菜单权限配置 end ===========================*/
        },
        mounted: function(){
            if(JSON.parse(window.localStorage.getItem('userInfo')).store){
                this.storeId = JSON.parse(window.localStorage.getItem('userInfo')).store.id;
            }
            this.fnGetOperators();
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            infoPage
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
