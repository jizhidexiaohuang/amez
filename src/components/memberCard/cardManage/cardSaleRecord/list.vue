<template>
    <div>
        <!-- 详情容器 -->
        <InfoPage v-if="pageType == 'info'"  :parentMsg="parentMsg" v-on:returnList="fnBackformAdd"/>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'">
            <div class="">
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
                <Button v-if="operators.excel" style="float:left;margin-right:10px;" @click="exportData" type="success">Excel导出</Button>
                <FormItem style="margin-bottom:10px;">
                    发卡方
                    <Select v-model="cd.brandId" style="width:120px">
                        <Option v-for="(item, index) in makeCardList" :value="item.id" :key="index">{{ item.brandName }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    售卡方
                    <Select v-model="cd.salesType" style="width:100px">
                        <Option v-for="(item, index) in salesTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    售卡时间
                    <DatePicker v-model="cd.saleCardTime" type="daterange" placement="bottom-end" placeholder="请填写时间范围" style="width:200px"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputVal">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 120px">
                        <Option value="cardName">会员卡名称</Option>
                        <Option value="registerPhone">买家注册手机</Option>
                        <Option value="memberNickname">买家昵称</Option>
                        <Option value="saleStoreName">售卡店铺名称</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Button v-if="operators.see" style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                    <Button v-if="operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    <Button v-if="false" style="margin-left:5px;" @click.native="changePageType('add')" type="success" icon="android-add">新增会员卡</Button>
                </FormItem>
            </Form>
            <Table
                :loading="table.loading" 
                :data="table.tableData1" 
                :columns="tableColumns1" 
                ref="table"
                stripe
                border
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
    import InfoPage from './info.vue'
    import common from '../../../../base.js'
    export default {
        data () {
            return {
                operators:{},
                src:'../../../static/images/footer/1_1.png',
                editId:'',
                parentMsg:{},
                makeCardList:[],//制卡方
                salesTypeList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'平台售卡'
                    },
                    {
                        value:'1',
                        label:'店铺售卡'
                    },
                ],
                cd:{
                    saleCardTime:[],//制卡时间
                    selectType:'cardName', //订单号
                    brandId:'',//制卡方
                    salesType:'', //售卡方
                    inputVal:'', // 搜索条件
                }, //顶部搜索条件
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                tableColumns1: [
                    {
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '交易时间',
                        key: 'useTime',
                        width:150,
                        render:(h,params)=>{
                            return h('div',this.common.baseFormatDate(params.row.useTime))
                        }
                    },
                    {
                        title: '会员卡信息',
                        key: 'cardName',
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.cardName),
                                h('div','￥'+params.row.tradeAmount/100)
                            ])
                        }
                    },
                    {
                        title: '交易金额',
                        key: 'tradeAmount',
                        render:(h,params)=>{
                            return h('div','￥'+params.row.tradeAmount/100)
                        }
                    },
                    {
                        title: '支付方式',
                        key: 'payType',
                        render:(h,params)=>{
                            let str;
                            if(params.row.payType=='0'){
                                str = '微信支付'
                            }else if(params.row.payType=='1'){

                                str = '支付宝支付'
                            }else if(params.row.payType=='2'){
                                str = '其他'
                            }
                            return str;
                        }
                    },
                    {   
                        title: '发卡方',
                        key: 'storeName',
                        render:(h,params)=>{
                            if(params.row.issueType){
                                return h('div',params.row.issueStoreName)
                            }else{
                                return h('div',params.row.brandName)
                            }
                        }
                    },
                    {   
                        title: '售卡方',
                        key: 'saleStoreName',
                        render:(h,params)=>{
                            if(params.row.buycardType){
                                return h('div',params.row.saleStoreName)
                            }else{
                                return h('div','平台售卡')
                            }
                        }
                    },
                    {   
                        title: '买家信息',
                        key: 'memberNickname',
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.memberNickname),
                                h('div',params.row.registerPhone)
                            ])
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let arr = [];
                            let infoButton = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.parentMsg.infoId = params.row.id;
                                        this.parentMsg.tradeNo = params.row.tradeNo;
                                        this.changePageType('info');
                                    }
                                }
                            }, '查看');
                            if(this.operators.info){
                                arr.push(infoButton)
                            }
                            return h('div', arr);
                        }
                    }
                ],
                tableColumns2: [
                    {
                        title: '交易时间',
                        key: 'useTime',
                    },
                    {
                        title: '会员卡名称',
                        key: 'cardName',
                    },
                    {
                        title: '会员卡面值',
                        key: 'balance',
                    },
                    {
                        title: '交易金额',
                        key: 'tradeAmount',
                    },
                    {
                        title: '支付方式',
                        key: 'payType',
                    },
                    {   
                        title: '发卡方',
                        key: 'storeName',
                    },
                    {   
                        title: '售卡方',
                        key: 'saleStoreName',
                    },
                    {   
                        title: '买家昵称',
                        key: 'memberNickname',
                    },
                    {   
                        title: '买家手机号',
                        key: 'registerPhone',
                    },
                ],
                table:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                }
            }
        },
        computed:{
            getCardName(){
                return this.$store.getters.cardName; 
            }
        },
        methods: {
            //获取连锁品牌
            getBrand(){
                let url = this.common.path2+"storeChainBrand/front/findByPage";
                let ajaxData = {
                    pageNo:1,
                    pageSize:1000
                }
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    let data = res.data.data.list;
                    this.makeCardList = data;
                    console.log(data)
                })
            },
            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
            },
            // 返回之后加载数据
            fnBackformAdd(){
                this.changePageType("list");
                this.getData();
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path2+"memberCardTradeRecode/bg/queryListCardSaleRecode?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    useType:2
                }
                if(vm.cd.brandId){
                    ajaxData.brandId = vm.cd.brandId //发卡方
                }
                if(vm.cd.salesType){
                    ajaxData.buycardType = vm.cd.salesType //发卡方
                }
                if(vm.cd.inputVal){
                    ajaxData[vm.cd.selectType] = vm.cd.inputVal 
                    if(vm.cd.selectType=='cardName'){
                        vm.$store.commit('CARD_NAME',vm.cd.inputVal)
                    }
                }
                if(vm.cd.saleCardTime&&vm.cd.saleCardTime[0]&&vm.cd.saleCardTime[1]){
                    ajaxData.startTime = common.formatDate(vm.cd.saleCardTime[0]);
                    ajaxData.endTime = common.formatDate(vm.cd.saleCardTime[1]);
                }
                console.log(ajaxData)
                vm.table.loading = true;
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    let oData = res.data
                    console.log('售卡记录')
                    console.log(oData);
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = res.data.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
             /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.saleCardTime = [];//评价时间
                vm.cd.brandId = '';// 发卡方
                vm.cd.salesType = ''; //售卡方
                vm.cd.inputVal = "";// 输入框的值
                vm.cd.selectType = 'cardName';
            },
            //导出Excel
            exportData(){
                this.table.tableData1.filter((data, index) => {
                    //交易时间
                    data.useTime = '="'+common.formatDate(data.useTime)+'"';
                    //会员卡面值
                    data.balance = data.balance/100;
                    //交易金额 
                    data.tradeAmount = data.tradeAmount/100;
                    //发卡方
                    if(data.issueType){
                        data.storeName = data.issueStoreName
                    }else{
                        data.storeName = data.brandName
                    }
                    //售卡方
                    if(data.buycardType){
                        data.saleStoreName = data.saleStoreName
                    }else{
                        data.saleStoreName = '平台售卡'
                    }
                    //支付方式 
                    if(data.payType =='0'){
                        data.payType = '微信支付'
                    }else if(data.payType=='1'){
                        data.payType = '支付宝支付'
                    }else{
                        data.payType = '其他'
                    }
                    //用户注册手机号 
                    data.registerPhone = '="'+data.registerPhone+'"';
                })
                this.$refs.table.exportCsv({
                    filename: '售卡记录',
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
                        vm.getData('init');//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
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
            this.getBrand();
            this.fnGetOperators();
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            InfoPage
        },
        watch:{
            getCardName:{
                handler(val){
                    if(val){
                        this.cd.inputVal = val;
                        this.getData();
                    }
                }
            }
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