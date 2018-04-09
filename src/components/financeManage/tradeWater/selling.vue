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
                <Col span="8">售卡门店：{{data.storeName}}</Col>
                <Col span="8">老板姓名：{{data.storeBboss}}</Col>
                <Col span="8">老板手机：{{data.storePhone}}</Col>
            </Row>
            <Row>
                <Col span="8">买家昵称：{{data.buyersNickname}}</Col>
                <Col span="8">注册手机：{{data.buyersPhone}}</Col>
                <Col span="8"></Col>
            </Row>
        </div>
        <div class="service_info">
            <h3>会员卡信息</h3>
            <div class="table">
                <div class="title">
                <Row>
                    <Col span="4">会员卡</Col>
                    <Col span="4">面值</Col>
                    <Col span="4">卡内容</Col>
                    <Col span="4">支付方式</Col>
                    <Col span="4">实付金额</Col>
                </Row>
                </div>
                <div class="content">
                <Row>
                    <Col span="4">{{data.membershiCard||'空'}}</Col>
                    <Col span="4">{{data.faceValue/100}}</Col>
                    <Col span="4" class="spec">{{data.cardContent}}</Col>
                    <Col span="4">{{payMethod}}</Col>
                    <Col span="4">{{data.actuallyAmount/100}}</Col>
                </Row>
                </div>
            </div>
        </div>
        <h3 class="transactionTitle">结算信息</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">交易状态：{{tradeStatus}}</Col>
                <Col span="8">结算时间：{{common.formatDate(data.settlementTime)}}</Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">平台佣金：{{data.platformCommission/100}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">售卡渠道奖励：{{data.sellCardChannelReward/100}}</Col>
                <Col span="8"></Col>
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
                let str = '未知'
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
            },
        },
        beforeMount:function(){
            this.getData(this.sellingId)
        },
        props:['sellingId']
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
                line-height: 80px;
                img{
                    width:70px;
                    height:70px;
                    vertical-align: middle;
                    margin-right:10px;
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
.spec{
    line-height: 20px;
    padding-top:15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>