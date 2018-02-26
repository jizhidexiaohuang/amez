<template>
  <div class="testWrap">
      <div class="boxStyle infoPage">
        <h3 class="transactionTitle">数据概览</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">账单月份：{{financialTrade.payTime?common.formatDate(financialTrade.payTime):''}}</Col>
                <Col span="8">店铺信息：{{financialTrade.orderNo}}</Col>
                <Col span="8">联系方式：{{financialTrade.tradeNo}}</Col>
            </Row>
            <Row>
                <Col span="8">打款状态：{{tradeType}}</Col>
                <Col span="8">开户银行：{{financialTrade.storeName}}</Col>
                <Col span="8">开户地区：{{financialTradeDetail.bossName}}</Col>
            </Row>
            <Row>
                <Col span="8">支行名称：{{financialTradeDetail.bossPhone}}</Col>
                <Col span="8">开户名：{{financialTradeDetail.beauticianName}}</Col>
                <Col span="8">开户账号：{{financialTradeDetail.beauticianPhone}}</Col>
            </Row>
            <Row>
                <Col span="8">
                    <Button type="error">确认打款</Button>
                    <Button type="info">发送对账单</Button>
                </Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
        </div>
        <div class="transactionDetail">
            <Row>
                <Col span="8">月订单总量：{{financialTrade.payTime?common.formatDate(financialTrade.payTime):''}}</Col>
                <Col span="8">本月销售总额：{{financialTrade.orderNo}}</Col>
                <Col span="8">已服务订单：{{financialTrade.tradeNo}}</Col>
            </Row>
            <Row>
                <Col span="8">已服务订单金额：{{tradeType}}</Col>
                <Col span="8">已完成订单：{{financialTrade.storeName}}</Col>
                <Col span="8">已完成订单金额：{{financialTradeDetail.bossName}}</Col>
            </Row>
            <Row>
                <Col span="8">退款订单：{{financialTradeDetail.bossPhone}}</Col>
                <Col span="8">退款金额：{{financialTradeDetail.beauticianName}}</Col>
                <Col span="8">会员卡售卡：{{financialTradeDetail.beauticianPhone}}</Col>
            </Row>
            <Row>
                <Col span="8">会员卡售卡奖励：{{financialTradeDetail.buyersNickName}}</Col>
                <Col span="8">月净收入：{{financialTradeDetail.buyersPhone}}</Col>
            </Row>
        </div>
        <Tabs type="card">
            <TabPane label="月订单总量（1200）"><totalMonthlyOrders></totalMonthlyOrders></TabPane>
            <TabPane label="已完成订单（1135）"><completedOrder></completedOrder></TabPane>
            <TabPane label="退款订单（10）"><refundOrder></refundOrder></TabPane>
            <TabPane label="会员卡售卡（10）"><membershipCard></membershipCard></TabPane>
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
                financialTrade:'',
                financialTradeDetail:'',
                detailInfo:'',
                settlementInfo:''
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
                let url = common.path2+'financialTrade/findDetailById/'+id
                this.$http.get(url).then(res=>{
                    console.log(res)
                    vm.financialTrade = res.data.data.financialTrade
                    vm.financialTradeDetail = res.data.data.financialTradeDetail
                    vm.detailInfo = JSON.parse(res.data.data.financialTradeDetail.detailInfo)
                    vm.settlementInfo = JSON.parse(res.data.data.financialTradeDetail.settlementInfo)
                })
            }
        },
        Mounted:function(){
            this.getData(this.infoId)
        },
        props:['infoId'],
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