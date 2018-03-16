<template>
    <div>
        <!-- 模态框 -->
        <Modal
            v-model="modal.sendModal"
            title="填写物流信息"
            width="700"
            @on-ok="fnAsyncOK">
            <Form style="min-height:250px;" :label-width="80">
                <FormItem label="物流公司：">
                    <Select v-model="company.companyCode">
                        <Option v-for="item in companyList" :value="item.companyCode">{{ item.companyName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="物流单号：">
                    <Input v-model="company.deliveryOrderNo" placeholder="请填写物流单号"></Input>
                </FormItem>
            </Form>
        </Modal>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"/>
        <!-- 编辑容器 -->
        <div v-if="pageType == 'edit'" class="testWrap">
            编辑
        </div>
        <deliveryInfo v-if="pageType == 'delivery'" class="testWrap" :id="id" v-on:returnList="changePageType"></deliveryInfo>
        <!-- 详情容器 -->
        <infoPage v-if="pageType == 'info'" class="testWrap" :orderId="orderId" v-on:returnList="changePageType"/>
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
                <Button style="float:left;margin-right:10px;" @click="exportData" type="success" v-if="false">订单导出</Button>
                <FormItem style="margin-bottom:10px;" v-if="false">
                    订单类型
                    <Select v-model="cd.orderType" style="width:100px">
                        <Option v-for="item in orderTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;" v-if="false">
                    订单来源
                    <Select v-model="cd.orderOrigin" style="width:100px">
                        <Option v-for="item in orderOriginList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    订单状态
                    <Select v-model="cd.orderStatus" style="width:100px">
                        <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;" v-if="false">
                    下单时间
                    <DatePicker v-model="cd.addTime" type="daterange" placement="bottom-end" placeholder="请填写时间范围" style="width:200px"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputVal">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                        <Option value="orderNo">订单号</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:220px;" v-show="false">
                    <Row>
                        <Col span="22">
                            <Input v-model="area" placeholder="门店名称/注册手机"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                    <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
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
    import expandRow from './table-expand.vue'
    import infoPage from './info.vue'
    import deliveryInfo from './deliveryInfo.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                id: '', // 查询物流用的id
                modal: {
                    loading: false,
                    sendModal: false, // 模态框控制开关
                },
                orderInfo: '', // 订单信息
                companyList: [], // 物流公司
                company:{
                    companyCode:'', // 快递公司编码
                    deliveryOrderNo: '', // 快递单号
                    companyName: '', // 快递公司名称
                },
                orderId: '', // 订单id,
                // goodsInfoList: [], // 商品信息
                src:'../../../static/images/footer/1_1.png',
                area:'',
                parentMsg:'',
                orderTypeList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'1',
                        label:'上门服务'
                    },{
                        value:'0',
                        label:'到店服务'
                    },
                ],  //订单类型
                orderOriginList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'1',
                        label:'微信商城'
                    },{
                        value:'0',
                        label:'APP商城'
                    },
                ],  //订单类型
                orderStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'0',
                        label:'待付款'
                    },{
                        value:'1',
                        label:'待发货'
                    },{
                        value:'2',
                        label:'待收货'
                    },{
                        value:'3',
                        label:'已收货'
                    }
                ],//订单状态
                cd:{
                    addTime:[],//评论时间范围
                    selectType:'orderNo', //订单号
                    orderType:'',//订单类型
                    orderOrigin:'',//订单来源
                    orderStatus:'',//订单状态
                    inputVal:'', // 搜索条件
                }, //顶部搜索条件
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                tableColumns1: [
                    /* {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    }, */
                    {
                        title: '订单编号',
                        key: '',
                        width: 180,
                        render: (h,params) => {
                            const row = params.row;
                            return row.orderNo;
                        }
                    },
                    {   
                        title: '商品总数量',
                        key: '',
                        width: 100,
                        render:(h,params)=>{
                            const nums = params.row.nums
                            return nums
                        }
                    },
                    {   
                        title: '订单总金额（元）',
                        key: '',
                        width: 135,
                        render:(h,params)=>{
                            const amountTotal = params.row.amountTotal
                            return +amountTotal/100
                        }
                    },
                    {   
                        title: '下单时间',
                        key: '',
                        width: 150,
                        render:(h,params)=>{
                            const addTime = params.row.addTime
                            return this.common.baseFormatDate(addTime)
                        }
                    },
                    {   
                        title: '美容师所属门店',
                        key: '',
                        render:(h,params)=>{
                            const storeName = params.row.beauticianBelongStoreName
                            return storeName
                        }
                    },
                    {
                        title: '订单状态',
                        key: '',
                        width: 100,
                        render:(h,params) =>{
                            const _s = params.row.status;
                            // 0：待付款, 1:待发货, 2:待收货, 3:已收货,
                            // red  yellow blue  green
                            const color = _s === 0 ? '#ccc' : _s === 1 ? 'red' : _s === 2 ? 'blue' : 'green';
                            const text = _s === 0 ? '待付款' : _s === 1 ? '待发货' : _s === 2 ? '待收货' : '已收货';
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color,
                                    // background: color,
                                }
                            }, text);
                        }
                    },
                    {
                        title: '操作',
                        key: '',
                        width: 160,
                        render: (h, params) => {
                            const row = params.row;
                            let arrs = [];
                            /* 查看按钮 */
                            let see_obj = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.orderId = row.id;
                                        // this.goodsInfoList = row.goodsInfoList;
                                        this.changePageType('info');
                                    }
                                }
                            }, '查看');
                            /* 发货按钮 */
                            let send_obj = h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.modal.sendModal = true;
                                        this.orderInfo = row;
                                    }
                                }
                            }, '发货');
                            /* 查看物流 */
                            let logistics_obj = h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.id = row.orderNo;
                                        this.changePageType('delivery');
                                    }
                                }
                            }, '查看物流');
                            arrs.push(see_obj);
                            row.status == 1 && arrs.push(send_obj); 
                            (row.status == 2 || row.status == 3) && arrs.push(logistics_obj);
                            // arrs.push(logistics_obj);
                            return h('div', arrs);
                        }
                    }
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
        methods: {
            /* 发货的回调函数 */
            fnAsyncOK () {
                // vm.modal.loading = true;
                let vm = this;
                vm.companyList.forEach((item,index) => {
                    if(item.companyCode == vm.company.companyCode){
                        vm.company.companyName = item.companyName;
                    }
                })
                let url = vm.common.path2 + 'orderGoodsBase/deliverGoods?orderNo='+vm.orderInfo.orderNo+'&companyCode='+vm.company.companyCode+'&deliveryOrderNo='+vm.company.deliveryOrderNo+'&companyName='+vm.company.companyName;
                vm.$http.get(
                    url
                ).then(function(res){
                    vm.getData();
                    vm.modal.loading = true;
                    vm.modal.mineModal = false;
                }).catch(function(err){
                    console.log(err);
                    vm.getData();
                })
            },
            /* 获取物流公司 */
            fnGetCompanyList () {
                let vm = this;
                let url = vm.common.path2 + 'expressCompany/front/findByPage?pageSize=1000';
                vm.$http.post(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then(res =>{
                    vm.companyList = res.data.data.list;
                }).catch(err =>{
                    console.log(err);
                })

            },
            /* 分页回掉函数 */
            changePage (page) {
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
                let url = common.path2+"orderGoodsBase/front/findByPage?pageNo="+start+'&pageSize='+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                }
                if(vm.cd.orderType){
                    ajaxData.type = vm.cd.orderType //类型
                }
                if(vm.cd.orderOrigin){
                    ajaxData.orderSource = vm.cd.orderOrigin //来源
                }
                if(vm.cd.orderStatus){
                    ajaxData.status = vm.cd.orderStatus //状态
                }
                if(vm.cd.inputVal){
                    ajaxData[vm.cd.selectType] = vm.cd.inputVal 
                }
                if(vm.cd.addTime&&vm.cd.addTime[0]&&vm.cd.addTime[1]){
                    ajaxData.addTime = vm.cd.addTime //地区
                }
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
                    let oData = res.data.data
                    vm.table.recordsTotal = oData.total;
                    if(!!oData.list){
                        vm.table.tableData1 = oData.list;
                    }else{
                        vm.table.tableData1 = [];
                    }
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
             /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.addTime = [];//评价时间
                vm.cd.orderType = '';// 状态
                vm.cd.orderStatus = '';// 输入框类型
                vm.cd.inputVal = "";// 输入框的值
                vm.cd.orderOrigin = '';//订单来源
                vm.cd.selectType = 'orderNo';
            },
            //导出Excel
            exportData(){
                this.$refs.table.exportCsv({
                    filename: '数据',
                    original :true,                 
                    data: this.table.tableData1.filter((data, index) => {
                        //订单总价
                        data.amountTotal = data.amountTotal;
                        //订单类型
                        if(data.type=='0'){
                            data.type = '到店服务'
                        }else{
                            data.type = '上门服务'
                        }
                        //服务状态
                        switch(data.status){
                            case 0:return data.status = '待付款'; break;
                            case 1:return data.status = '交易关闭'; break;
                            case 2:return data.status = '待服务'; break;
                            case 3:return data.status = '退款中'; break;
                            case 4:return data.status = '待评价'; break;
                            case 5:return data.status = '评价完成'; break;
                        }
                    })
                });
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
            },
            /* 全选时的回调函数 */
            fnSelectAll (selection) {
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
            }
        },
        mounted: function(){
            this.fnGetCompanyList();
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            infoPage,
            expandRow,
            deliveryInfo
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