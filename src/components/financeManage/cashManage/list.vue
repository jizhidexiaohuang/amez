<template>
    <div>
        <!-- 服务订单容器 -->
        <infoPage v-if="pageType == 'info'" class="testWrap" :infoId="infoId" v-on:returnList="fnBackformAdd"></infoPage>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
            <Form :model="cd" inline>
                <Button style="float:left;margin-right:10px;" type="success" @click="makeMoney()">批量打款</Button>
                <Button style="float:left;margin-right:10px;" @click="exportData" type="success">导出Excel</Button>
                <FormItem style="margin-bottom:10px;">
                    打款状态
                    <Select v-model="cd.playMoneyStatus" style="width:100px">
                        <Option v-for="item in playMoneyStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    提现申请时间
                    <DatePicker v-model="cd.WithdrawalsTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请填写时间范围" style="width: 250px"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    打款时间
                    <DatePicker v-model="cd.payMoneyTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请填写时间范围" style="width: 250px"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputVal">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                        <Option value="beauticianId">提现人名字</Option>
                        <Option value="beauticianPhone">手机号码</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                    <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
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
    import infoPage from './info.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                infoId:'',//服务订单id
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
                ],  //打款状态
                cd:{
                    WithdrawalsTime:[],//提现申请时间
                    payMoneyTime:[],//打款时间
                    inputVal:'',
                    selectType:'beauticianId',
                    playMoneyStatus:'',//支付类型
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
                        title: '申请时间',
                        width:150,
                        key: 'addTime',
                        render:(h,params)=>{
                            return h('div',common.formatDate(params.row.addTime))
                        }
                    },
                    {
                        title: '提现人',
                        key: 'beauticianPhone',
                        width:120,
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.beauticianName),
                                h('div',params.row.beauticianPhone),
                            ])
                        }
                    },
                    {
                        title: '所属门店',
                        key: 'storeName',
                        width:120
                    },
                    {
                        title: '提现金额',
                        key: 'withdrawAmount',
                        width:90
                    },
                    {
                        title: '手续费(3%)',
                        key: 'taxation',
                        width:80
                    },
                    {
                        title: '打款金额',
                        key: 'actualAmount',
                        width:90
                    },
                    {
                        title: '开户名',
                        key: 'beauticianName',
                        width:80
                    },
                    {
                        title: '提现账户',
                        key: 'bankBranch',
                        width:160,
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.bankBranch),
                                h('div',params.row.bankCardNo),
                            ])
                        }
                    },
                    {
                        title: '打款状态',
                        key: 'playAmountStatus',
                        width:100,
                        render:(h,params)=>{
                            let str = ''
                            if(params.row.playAmountStatus=='1'){
                                str = '已打款'
                            }else{
                                str = '未打款'
                            }
                            return h('div',str)
                        }
                    },
                    {
                        title: '打款时间',
                        key: 'playAmountTime',
                        width:120,
                        align: 'center',
                        render:(h,params)=>{
                            if(params.row.playAmountStatus=='1'){
                                return h('div',params.row.playAmountTime?common.formatDate(params.row.playAmountTime):'')
                            }else{
                                return h('div','-')
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        align: 'center',
                        render:(h,params)=>{
                            return h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.infoId = params.row.id
                                            this.changePageType('info');
                                        }
                                    }
                                }, params.row.playAmountStatus?'查看':'打款')
                        }
                    }
                ],
                tableColumns2: [
                    {
                        title: '申请时间',
                        key: 'addTime',
                    },
                    {
                        title: '提现人',
                        key: 'beauticianName',
                    },
                    {
                        title: '提现人手机号',
                        key: 'beauticianPhone',
                    },
                    {
                        title: '所属门店',
                        key: 'storeName',
                    },
                    {
                        title: '提现金额',
                        key: 'withdrawAmount',
                    },
                    {
                        title: '手续费(3%)',
                        key: 'taxation',
                    },
                    {
                        title: '打款金额',
                        key: 'actualAmount',
                    },
                    {
                        title: '开户名',
                        key: 'beauticianName',
                    },
                    {
                        title: '提现银行',
                        key: 'bankBranch',
                    },
                    {
                        title: '提现卡号',
                        key: 'bankCardNo',
                    },
                    {
                        title: '打款状态',
                        key: 'playAmountStatus',
                    },
                    {
                        title: '打款时间',
                        key: 'playAmountTime',
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
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path2+"beauticianTradeDetails/withdrawList?pageNo="+start+'&pageSize='+size;
                let ajaxData = {}
                if(vm.cd.playMoneyStatus){
                    ajaxData.playAmountStatus = vm.cd.playMoneyStatus;
                }
                if(vm.cd.inputVal){
                    ajaxData.beauticianNameAndPhone = vm.cd.inputVal;
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
                    console.log(res.data.data.list);
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
                vm.cd.payTime = [];//支付时间
                vm.cd.balanceTime = [];//结算时间
                vm.cd.orderStatus = '';//订单状态
                vm.cd.transactionType = '';//订单来源
                vm.cd.payType = '';//支付类型
                vm.cd.selectType = 'beauticianId';// 状态
                vm.cd.inputVal = "";// 输入框的值
            },
            //导出Excel
            exportData(){
                this.table.tableData1.filter((data, index) => {
                    //提现时间 
                    data.addTime = data.addTime?common.formatDate(data.addTime):'';
                    //打款时间 
                    data.playAmountTime = data.playAmountTime?common.formatDate(data.playAmountTime):'';
                    //提现人手机
                    data.beauticianPhone = '="'+data.beauticianPhone+'"';
                    //提现金额  
                    data.withdrawAmount = '="'+data.withdrawAmount/100+'"';
                    //手续费  
                    data.taxation = '="'+data.taxation/100+'"';
                    //打款金额  
                    data.actualAmount = '="'+data.actualAmount/100+'"';
                    //提现卡号 
                    data.bankCardNo = '="'+data.bankCardNo+'"';
                    //交易类型
                    if(data.playAmountStatus==1){
                        data.playAmountStatus = '已打款'
                    }else{
                        data.playAmountStatus = '未打款'
                    }
                })
                this.$refs.table.exportCsv({
                    filename: '提现管理',
                    columns: this.tableColumns2,
                    data: this.table.tableData1
                });
                this.getData();
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
                console.log(this.ids)
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
            makeMoney(){
                let vm = this
                let url = common.path2+'beauticianTradeDetails/batchMoney/'+vm.ids;
                this.$http.get(url).then(res=>{
                    if(res.data.code==200){
                        this.$Message.success('打款成功！')
                        vm.getData()
                    }
                })
                  
            },
            selected(arr){
                for(var i=0;i<arr.length;i++){
                    if(arr[i].playAmountStatus=='1'){
                        arr[i]._disabled = true
                    }
                }
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
