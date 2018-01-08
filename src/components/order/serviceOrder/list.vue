<template>
    <div>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"/>
        <!-- 编辑容器 -->
        <div v-if="pageType == 'edit'" class="testWrap">
            编辑
        </div>
        <!-- 详情容器 -->
        <infoPage v-if="pageType == 'info'"  class="testWrap" :message="parentMsg" v-on:returnList="changePageType"/>
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
                <Button style="float:left;margin-right:10px;" @click="exportData" type="success">订单导出</Button>
                <FormItem style="margin-bottom:10px;">
                    订单类型
                    <Select v-model="cd.orderType" style="width:100px">
                        <Option v-for="item in orderTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
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
                <FormItem style="margin-bottom:10px;">
                    下单时间
                    <DatePicker v-model="cd.startTime" type="date" placeholder="开始时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <DatePicker v-model="cd.endTime" type="date" placeholder="结束时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputVal">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                        <Option value="orderNo">订单号</Option>
                        <Option value="storeName">门店名称</Option>
                        <Option value="addressReveiver">收货人姓名</Option>
                        <Option value="memberPhone">收货人手机</Option>
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
    import common from '../../../base.js'
    export default {
        data () {
            return {
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
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'微信商城'
                    },{
                        value:'2',
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
                        label:'交易关闭'
                    },{
                        value:'2',
                        label:'待服务'
                    },{
                        value:'4',
                        label:'服务中'
                    },{
                        value:'5',
                        label:'待评价'
                    },{
                        value:'6',
                        label:'评价完成'
                    },
                ],//订单状态
                cd:{
                    startTime:'',//评论时间范围
                    endTime:'',//评论时间范围
                    selectType:'orderNo', //订单号
                    orderType:'',//订单类型
                    orderOrigin:'',//订单来源
                    orderStatus:'',//订单状态
                    inputVal:'', // 搜索条件
                }, //顶部搜索条件
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                tableColumns1: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '服务项目',
                        key: 'productName',
                        render:(h,params)=>{
                            return h('div',[
                                // h('img',{
                                //     attrs:{
                                //         src:params.row.productImg
                                //     },
                                //     style:{
                                //         width:'60px',
                                //         height:'60px',
                                //         marginRight:'8px',
                                //         verticalAlign:'middle'
                                //     }
                                // }),
                                h('span',params.row.productName)
                            ])
                        }
                    },
                    {
                        title: '单价',
                        key: 'payTime',
                        render: (h,params) =>{
                            return "268"
                        }
                    },
                    {
                        title: '订单总价',
                        key: 'amountTotal',
                        render:(h,params)=>{
                            return params.row.amountTotal/100
                        }
                    },
                    {
                        title: '服务状态',
                        key: 'status',
                        render:(h,params) =>{
                           let status = params.row.status;
                           let text = ''
                            if(status==0){
                                text = '待付款'
                            }else if(status==1){
                                text = '交易关闭'
                            }else if(status==2){
                                text = '待服务'
                            }else if(status==4){
                                text = '服务中'
                            }else if(status==5){
                                text = '待评价'
                            }else if(status==6){
                                text = '评价完成'
                            }
                           return h('div',text)
                        }
                    },
                    {   
                        title: '应/实付金额',
                        key: 'amountTotal',
                        render:(h,params)=>{
                            return h('div',(params.row.amountTotal-(params.row.amountReduce?params.row.amountReduce:0))/100)
                        }
                    },
                    {   
                        title: '美容院',
                        key: 'storeName',
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.storeName),
                                h('div',params.row.addressPhone),
                            ])
                        }
                    },
                    {   
                        title: '订单类型',
                        key: 'type',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.type==0){
                                str = '到店服务'
                            }else{
                                str = '上门服务'
                            }
                            return h('div',str)
                        }
                    },
                    // {   
                    //     title: '买家信息',
                    //     key: 'addressReveiver',
                    //     render:(h,params)=>{
                    //         if(params.row.type==1){
                    //             return h('div',[
                    //                 h('p',params.row.memberRealName),
                    //                 h('p',params.row.addressPhone),
                    //             ])
                    //         }else{
                    //             return h('div',[
                    //                 h('p',params.row.memberNickName ),
                    //                 h('p',params.row.addressPhone),
                    //             ])
                    //         }
                    //     }
                    // },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        // fixed: 'right',
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
                                            // this.show(params.index)
                                            this.changePageType('info');
                                            this.parentMsg = params.row.id
                                        }
                                    }
                                }, '查看'),
                            ]);
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
            /* 分页回掉函数 */
            changePage (page) {
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
                let url = common.path+"orderBase/front/findByPage";
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                }
                if(vm.cd.orderType){
                    ajaxData.type = vm.cd.orderType //类型
                }
                if(vm.cd.orderStatus){
                    ajaxData.status = vm.cd.orderStatus //状态
                }
                if(vm.cd.inputVal){
                    console.log(1111111111111);
                    ajaxData[vm.cd.selectType] = vm.cd.inputVal 
                }
                if(vm.cd.startTime){
                    ajaxData.addTime = vm.cd.startTime //地区
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
                vm.cd.startTime = '';//评价时间
                vm.cd.endTime = '';//评价时间
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
                        // console.log(data)
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
            infoPage,
            expandRow,
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