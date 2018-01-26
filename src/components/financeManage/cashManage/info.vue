<template>
  <div class="testWrap">
      <div class="boxStyle infoPage">
        <h3 class="transactionTitle">提现详情</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">申请时间：{{financialTrade.payTime?common.formatDate(financialTrade.payTime):''}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">用户信息：{{financialTrade.orderNo}}</Col>
                <Col span="8">所属门店：{{financialTrade.tradeNo}}</Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">开户人：{{tradeType}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">开户银行：{{financialTrade.storeName}}</Col>
                <Col span="8">开户支行：{{financialTradeDetail.bossName}}</Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">银行账号：{{financialTradeDetail.bossPhone}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">提现金额：{{financialTradeDetail.beauticianName}}</Col>
                <Col span="8">手续费：{{financialTradeDetail.beauticianPhone}}</Col>
                <Col span="8">打款金额：{{financialTradeDetail.buyersNickName}}</Col>
            </Row>
            <Row>
                <Col span="8">打款状态：{{financialTradeDetail.buyersPhone}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="20">打款时间：2017-11-28 18:32：20 (具体以银行到账时间为准) / 预计打款时间为2017-11-28</Col>
                <Col span="2"></Col>
                <Col span="2"></Col>
            </Row>
        </div>
        <Button type="primary" style="margin-right:20px;">确认打款</Button>
        <Button type="ghost" @click.native="returnHome('list')">返回</Button>
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
                    console.log(vm.detailInfo)
                })
            }
        },
        beforeMount:function(){
            this.getData(this.infoId)
        },
        props:['infoId']
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