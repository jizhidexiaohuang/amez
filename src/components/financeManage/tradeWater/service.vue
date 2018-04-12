<template>
  <div class="testWrap">
      <div class="boxStyle infoPage">
        <h3 class="transactionTitle">交易详情</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">付款时间：{{data.payTime?common.formatDate(data.payTime):''}}</Col>
                <Col span="8">订单号：{{data.orderNumber}}</Col>
                <Col span="8">交易流水号：{{data.transactionSerialNumber}}</Col>
            </Row>
            <Row>
                <Col span="8">交易类型：{{tradeType}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">卖家信息：{{data.storeName}}</Col>
                <Col span="8">老板姓名：{{data.storeBboss}}</Col>
                <Col span="8">老板手机：{{data.storePhone}}</Col>
            </Row>
            <Row>
                <Col span="8">美容师：{{data.beauticianName}}</Col>
                <Col span="8">注册手机：{{data.beauticianPhone}}</Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">买家昵称：{{data.buyersNickname}}</Col>
                <Col span="8">注册手机：{{data.buyersPhone}}</Col>
                <Col span="8"></Col>
            </Row>
        </div>
        <div class="service_info">
            <h3>服务信息</h3>
            <div class="table">
                <div class="title">
                <Row>
                    <Col span="3">服务</Col>
                    <Col span="3">单价</Col>
                    <Col span="3">总价</Col>
                    <Col span="3">支付方式</Col>
                    <Col span="3">优惠券优惠</Col>
                    <Col span="3">会员卡优惠</Col>
                    <Col span="3">一卡通优惠</Col>
                    <Col span="3">实付金额</Col>
                </Row>
                </div>
                <div class="content">
                <Row>
                    <Col span="3" class="serviceName"><span>{{data.serviceName}}</span></Col>
                    <Col span="3">{{data.unitPrice/100}}</Col>
                    <Col span="3">{{data.totalPrice/100}}</Col>
                    <Col span="3">{{payMethod}}</Col>
                    <Col span="3">{{data.coupons/100}}</Col>
                    <Col span="3">{{data.membershipCardDiscount/100}}</Col>
                    <Col span="3">{{data.oneCartoonPreferential/100}}</Col>
                    <Col span="3">{{data.actuallyAmount/100}}</Col>
                </Row>
                </div>
            </div>
        </div>
        <h3 class="transactionTitle">结算信息</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">交易状态：{{tradeStatus}}</Col>
                <Col span="8"></Col>
                <Col span="8">结算时间：{{data.settlementTime?common.formatDate(data.settlementTime):''}}</Col>
            </Row>
            <Row>
                <Col span="8">平台佣金：{{data.platformCommission/100}}</Col>
                <Col span="8">结算金额：{{data.settlementAmount/100}}</Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">门店净收入：{{data.storeNetIncome/100}}</Col>
                <Col span="8">美容师提成：{{data.beauticianCommission/100}}</Col>
                <Col span="8"></Col>
            </Row>
        </div>
        <Button type="success" @click.native="returnHome('list')">返回</Button>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    export default {
        data () {
            return {
                src:'../../../static/images/footer/1_1.png',
                data:''
            }
        },
        computed:{
            //交易类型
            tradeType:function(){
                let str = ''
                if(this.data.tradeType=='1'){
                    str = '服务订单'
                }else if(this.data.tradeType=='2'){
                    str = '会员卡售卡'
                }else if(this.data.tradeType=='3'){
                    str = '会员卡充值'
                }
                return str
            },
            tradeStatus:function(){
                let str = ''
                if(this.data.tradeType=='1'){
                    if(this.data.tradeStatus==1){
                        str = '待服务'
                    }else if(this.data.tradeStatus==2){
                        str = '服务中'
                    }else if(this.data.tradeStatus==3){
                        str = '服务完成'
                    }else if(this.data.tradeStatus==4){
                        str = '交易完成'
                    }else if(this.data.tradeStatus==5){
                        str = '退款中'
                    }else if(this.data.tradeStatus==6){
                        str = '退款完成'
                    }
                }else if(this.data.tradeType=='2'){
                    if(this.data.tradeStatus==1){
                        str = '售卡完成'
                    }
                }else if(this.data.tradeType=='3'){
                    if(this.data.tradeStatus==1){
                        str = '充值完成'
                    }
                }
                return str
            },
            payMethod:function(){
                let str = ''
                if(this.data.payMethod=='1'){
                    str = '支付宝'
                }else if(this.data.payMethod=='2'){
                    str = '微信支付'
                }else if(this.data.payMethod=='3'){
                    str = '会员卡支付'
                }else if(this.data.payMethod=='4'){
                    str = '一卡通支付'
                }else if(this.data.payMethod=='5'){
                    str = '余额支付'
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
                let url = common.path2+'platformTradeDetails/'+id
                this.$http.get(url).then(res=>{
                    console.log(res)
                    vm.data = res.data.data;
                })
            }
        },
        beforeMount:function(){
            this.getData(this.serviceId)
        },
        props:['serviceId']
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
        .ivu-col-span-8{
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
                line-height: 60px;
                .serviceName{
                    line-height: 30px;
                    // text-align: left;
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
    button{
        margin-top:20px;
    }
}
</style>