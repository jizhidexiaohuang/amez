<template>
  <div class="testWrap">
      <div class="boxStyle infoPage">
        <h3 class="transactionTitle">交易详情</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">付款时间：{{common.formatDate(financialTrade.payTime)}}</Col>
                <Col span="8">订单号：{{financialTrade.orderNo}}</Col>
                <Col span="8">交易流水号：{{financialTrade.tradeNo}}</Col>
            </Row>
            <Row>
                <Col span="8">交易类型：{{tradeType}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">售卡门店：{{financialTrade.storeName}}</Col>
                <Col span="8">老板姓名：{{financialTradeDetail.bossName}}</Col>
                <Col span="8">老板手机：{{financialTradeDetail.bossPhone}}</Col>
            </Row>
            <Row>
                <Col span="8">买家昵称：{{financialTradeDetail.buyersNickName}}</Col>
                <Col span="8">注册手机：{{financialTradeDetail.buyersPhone}}</Col>
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
                    <Col span="4">{{detailInfo.brandName}}会员卡</Col>
                    <Col span="4">{{detailInfo.balance/100}}</Col>
                    <Col span="4">{{detailInfo.content}}</Col>
                    <Col span="4">{{payType||'微信'}}</Col>
                    <Col span="4">{{detailInfo.payAmount/100}}</Col>
                </Row>
                </div>
            </div>
        </div>
        <h3 class="transactionTitle">结算信息</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">交易状态：{{tradeStatus}}</Col>
                <Col span="8">结算时间：{{common.formatDate(financialTrade.settlementTime)}}</Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">平台佣金：{{financialTrade.platformCommission/100}}</Col>
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
            returnHome(type){
                this.$emit('returnList',type)
            },
            //获取数据
            getData(id){
                let vm = this
                let url = common.path+'financialTrade/findDetailById/'+id
                this.$http.get(url).then(res=>{
                    console.log(res)
                    vm.financialTrade = res.data.data.financialTrade
                    vm.financialTradeDetail = res.data.data.financialTradeDetail
                    vm.detailInfo = JSON.parse(res.data.data.financialTradeDetail.detailInfo)
                    vm.settlementInfo = JSON.parse(res.data.data.financialTradeDetail.settlementInfo)
                    console.log(vm.detailInfo)
                })
            },
        },
        beforeMount:function(){
            this.getData(this.rechargeId)
        },
        props:['rechargeId']
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
            margin:20px 20px;
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
</style>