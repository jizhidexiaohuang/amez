<template>
  <div>
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
</template>
<script>
    export default {
        data() {
            return {
                table:{
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                    tableData1: [],
                },
                tableColumns1:[
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '订单号',
                        key: 'orderNo',
                        width:120
                    },
                    {
                        title: '付款时间',
                        key: 'payTime',
                        width:100,
                        render:(h,params)=>{
                            return h('div',this.common.formatDate(params.row.payTime))
                        }
                    },
                    {
                        title: '服务信息',
                        key: 'productName',
                        width:120,
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.productName),
                                h('div','￥'+params.row.productPrice/100)
                            ])
                        }
                    },
                    {
                        title: '付款方式',
                        key: 'payMethod',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.payMethod=='1'){
                                str = '支付宝'
                            }else if(params.row.payMethod=='2'){
                                str = '微信'
                            }else if(params.row.payMethod=='3'){
                                str = '会员卡'
                            }else if(params.row.payMethod=='4'){
                                str = '一卡通'
                            }else if(params.row.payMethod=='5'){
                                str = '余额'
                            }
                            return str;
                        }
                    },
                    {
                        title: '实付款',
                        key: 'actualPay',
                        render:(h,params)=>{
                            return h('div',params.row.actualPay/100)
                        }
                    },
                    {
                        title: '订单状态',
                        key: 'tradeStatus',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.tradeStatus=='1'){
                                str = '已完成'
                            }else if(params.row.tradeStatus=='0'){
                               str = '未完成'
                            }
                            return str;
                        }
                    },
                    {
                        title: '结算金额',
                        key: 'settleAmount',
                        render:(h,params)=>{
                            return h('div',params.row.settleAmount/100)
                        }
                    },
                    {
                        title: '美容师提成',
                        key: 'memberDeduct',
                        width:100,
                        render:(h,params)=>{
                            return h('div',params.row.memberDeduct/100)
                        }
                    },
                    {
                        title: '预计净收入',
                        key: 'netAmount',
                        width:100,
                        render:(h,params)=>{
                            return h('div',params.row.netAmount/100)
                        }
                    },
                ]
            }
        },
        methods:{
            /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;
                vm.getData();             
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
            getData(){
                let vm = this;
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = this.common.path2 +"storeTradeDetails/selectListByConditions?pageNo="+start+'&pageSize='+size;
                vm.table.loading = true;
                let ajaxData = {
                    storeId:this.totalMonth.storeId,
                    statisticsYearMonth:this.totalMonth.statisticsYearMonth
                };
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
                    vm.$emit('listenTotal',oData.data.total)
                    vm.table.tableData1 = oData.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            }
        },
        beforeMount: function(){
            console.log(this.totalMonth)
            this.getData();
        },
        props:['totalMonth']
    }
</script>
<style lang="scss" scoped>

</style>
