<template>
  <div class="testWrap">
      <div class="boxStyle infoPage">
        <h3 class="transactionTitle">数据概览</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">账单月份：{{data.statisticsYearMonth}}</Col>
                <Col span="8">店铺信息：{{storeMsg.storeName||''}}</Col>
                <Col span="8">联系方式：{{storeMsg.storeTel||''}}</Col>
            </Row>
            <Row>
                <Col span="8">打款状态：{{data.playStatus?'已打款':'未打款'}}</Col>
                <Col span="8">开户银行：{{storeExtend.praBank}}</Col>
                <Col span="8">开户地区：{{storeExtend.praArea}}</Col>
            </Row>
            <Row>
                <Col span="8">支行名称：{{storeExtend.praBankBranch}}</Col>
                <Col span="8">开户名：{{storeExtend.praAccountName}}</Col>
                <Col span="8">开户账号：{{storeExtend.praBankCardNumber}}</Col>
            </Row>
            <Row>
                <Col span="8">
                    <Button v-if="!data.playStatus" type="error" @click.native="payMoney()">确认打款</Button>
                    <Button v-if="data.playStatus" type="info">已打款</Button>
                </Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
        </div>
        <div class="transactionDetail">
            <Row>
                <Col span="8">月订单总量：{{data.monthlyOrderQuantity}}笔</Col>
                <Col span="8">本月销售总额：{{data.totalSalesThisMonth/100}}元</Col>
                <Col span="8">已服务订单：{{data.serviceOrder}}笔</Col>
            </Row>
            <Row>
                <Col span="8">已服务订单金额：{{data.serviceOrderAmount/100}}元</Col>
                <Col span="8">已完成订单：{{data.orderCompleted}}笔</Col>
                <Col span="8">已完成订单金额：{{data.orderCompletedAmount/100}}元</Col>
            </Row>
            <Row>
                <Col span="8">退款订单：{{data.refundOrder}}笔</Col>
                <Col span="8">退款金额：{{data.refundOrderAmount/100}}元</Col>
                <Col span="8">会员卡售卡：{{data.cardNumber}}张</Col>
            </Row>
            <Row>
                <Col span="8">会员卡售卡奖励：{{data.sellCardRewards/100}}元</Col>
                <Col span="8">月净收入：{{data.onNetIncome/100}}元</Col>
            </Row>
        </div>
        <Tabs type="card" :animated="false">
            <TabPane :label="'月订单总量（'+monthTotal+'）'"><totalMonthlyOrders v-if="totalMonthCtrl" :totalMonth="totalMonth" v-on:listenTotal="getMonthTotal"></totalMonthlyOrders></TabPane>
            <TabPane :label="'已完成订单（'+completeTotal+'）'"><completedOrder v-if="totalMonthCtrl" :totalMonth="totalMonth" v-on:listenTotal="getCompleteTotal"></completedOrder></TabPane>
            <TabPane :label="'退款订单（'+refundTotal+'）'"><refundOrder v-if="totalMonthCtrl" :totalMonth="totalMonth" v-on:listenTotal="getRefundTotal"></refundOrder></TabPane>
            <TabPane :label="'会员卡售卡（'+cardTotal+'）'"><membershipCard v-if="totalMonthCtrl" :totalMonth="totalMonth" v-on:listenTotal="getCardTotal"></membershipCard></TabPane>
        </Tabs>
        <Button type="ghost" @click.native="returnHome('list')">返回</Button>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    import totalMonthlyOrders from './totalMonthlyOrders.vue'
    import completedOrder from './completedOrder.vue'
    import refundOrder from './refundOrder.vue'
    import membershipCard from './membershipCard.vue'
    export default {
        data () {
            return {
                src:'../../../static/images/footer/1_1.png',
                data:'',
                storeMsg:'',
                storeExtend:'',
                totalMonth:{},
                totalMonthCtrl:false,
                monthTotal:'',
                completeTotal:'',
                refundTotal:'',
                cardTotal:'',
            }
        },
        computed:{
            //交易类型
            tradeType:function(){
                let str = ''
                if(this.financialTrade.tradeType=='1'){
                    str = '服务订单'
                }else if(this.financialTrade.tradeType=='2'){
                    str = '订单退款'
                }else if(this.financialTrade.tradeType=='3'){
                    str = '会员卡售卡'
                }else if(this.financialTrade.tradeType=='4'){
                    str = '会员卡充值'
                }
                return str
            },
            tradeStatus:function(){
                let str = ''
                if(this.financialTrade.tradeStatus==0){
                    str = '待付款'
                }else if(this.financialTrade.tradeStatus==1){
                    str = '交易关闭'
                }else if(this.financialTrade.tradeStatus==2){
                    str = '待服务'
                }else if(this.financialTrade.tradeStatus==4){
                    str = '服务中'
                }else if(this.financialTrade.tradeStatus==5){
                    str = '待评价'
                }else if(this.financialTrade.tradeStatus==6){
                    str = '评价完成'
                }else if(this.financialTrade.tradeStatus==7){
                    str = '购卡成功'
                }else if(this.financialTrade.tradeStatus==8){
                    str = '充值成功'
                }
                return str
            },
            payType:function(){
                let str = ''
                if(this.financialTrade.payType=='alipay'){
                    str = '支付宝'
                }else if(this.financialTrade.payType=='wechatpay'){
                    str = '微信支付'
                }
                return str  
            }
        },
        methods:{
            //返回
            returnHome(type){
                this.$emit('returnList',type)
            },
            //获取数据
            getData(id){
                let vm = this
                let url = common.path2+'storeTradeStatistics/'+id
                this.$http.get(url).then(res=>{
                    console.log(res);
                    vm.data = res.data.data;
                })
            },
            //获取店铺的基本信息
            getMsgByStoreId(id){
                let vm = this
                let url = common.path2+'store/detail/'+id
                this.$http.get(url).then(res=>{
                    console.log(res);
                    vm.storeMsg = res.data.data.store;
                    vm.storeExtend = res.data.data.storeExtend;
                })
            },
            //打款
            payMoney(){
                let vm = this;
                let url = common.path2+'storeTradeStatistics/update';
                let ajaxData = {
                    id:this.parentMsg.infoId,
                    playStatus:1
                }
                this.$http.put(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                    ).then(res=>{
                        console.log(res)
                        if(res.data.code==200){
                            vm.$Message.success('打款成功！');
                            vm.returnHome('list');
                        }
                })
            },
            getMonthTotal(val){
                console.log(val)
                this.monthTotal = val;
            },
            getCompleteTotal(val){
                this.completeTotal = val;
            },
            getRefundTotal(val){
                this.refundTotal = val;
            },
            getCardTotal(val){
                this.cardTotal = val;
            },
        },
        beforeMount:function(){
            this.getData(this.parentMsg.infoId);
            // this.getMsgByStoreId(this.parentMsg.storeId)
            this.getMsgByStoreId(11)
        },
        mounted:function(){
            this.totalMonth.storeId = this.parentMsg.storeId;
            this.totalMonth.statisticsYearMonth = this.parentMsg.statisticsYearMonth;
            this.totalMonthCtrl = true;
        },
        props:['parentMsg'],
        components:{
            totalMonthlyOrders,
            completedOrder,
            refundOrder,
            membershipCard
        }
    }
</script>
<style lang="scss" scoped>
.infoPage{
    padding:20px 50px;
    .transactionTitle{
        padding-bottom:10px;
        border-bottom:1px dashed #e2e2e2;
    }
    .transactionDetail{
        margin:20px 0px;
        border:1px solid #dddee1;
        border-bottom:none;
        .ivu-row{
            height: 50px;
            line-height: 50px;
            border-bottom:1px solid #dddee1;
            padding-left:50px;
        }
    }
    .service_info,.service_info_1{
        .table{
            border:1px solid #dddee1;
            margin:20px 0px;
            .title{
                background:#dddee1;
                .ivu-col{
                    line-height:40px;
                }
            }
            .content{
                padding:5px 0;
                line-height: 80px;
                img{
                    width:70px;
                    height:70px;
                    vertical-align: middle;
                    margin-right:10px;
                    float: left;
                }
            }
            .ivu-col{
                text-align: center;        
            }
        }
    }
    .service_info_1{
        .table{
            .ivu-col ivu-col-span-8{
                line-height: 40px;
            }
            .title{
                line-height: 40px;
            }
            .content{
                line-height: 40px;
            }
        }
    }
    //总价
    .discount{
      text-align: right;
      .total_pay{
        padding:5px 0px;
        strong{
          font-size: 20px;
        }
      }
    }
}
</style>