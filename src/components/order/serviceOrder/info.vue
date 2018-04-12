<template>
  <div class="testWrap">
    <RefundPage v-if="pageType == 'refund'" :refundId="refundId" v-on:return="goBackList"/>
    <div class="infoPage boxStyle" v-if="pageType == 'info'">
    <Steps :current="progress">
        <Step title="提交订单" :content="common.formatDate(orderBase.addTime)"></Step>
        <Step title="付款时间" :content="showTime(orderBase.payTime)"></Step>
        <Step title="服务开始时间" :content="showTime(orderBase.actualStartTime)"></Step>
        <Step title="服务完成" :content="showTime(orderBase.actualEndTime)"></Step>
    </Steps>
    <div class="order_info">
      <h4>订单信息</h4>
      <Row>
        <Col span="8">订单号：{{orderBase.orderNo}}</Col>
        <Col span="8">订单状态：{{orderType}}</Col>
        <Col span="8">订单来源：{{orderBase.orderSource==0?'APP商城':'微信商城'}}</Col>
      </Row>
      <Row>
        <Col span="8">订单类型：{{orderBase.type==0?'到店订单':'上门订单'}}</Col>
        <Col span="8">支付单号：{{orderBase.tradeNo}}</Col>
        <Col span="8">付款方式：{{payType}}</Col>
      </Row>
    </div>
    <div class="order_info">
      <h4>买家信息</h4>
      <Row>
        <Col span="8">购买人：{{orderBase.type?orderBase.customerName:orderBase.memberName}}</Col>
        <Col span="8">联系电话：{{orderBase.type?orderBase.customerPhone:orderBase.memberPhone}}</Col>
        <Col span="8"></Col>
      </Row>
      <Row v-if="orderBase.type">
        <Col span="8">上门地址：{{orderBase.customerAddress}}</Col>
      </Row>
      <Row>
        <Col span="8">备注：{{orderBase.remark?orderBase.remark:'无'}}</Col>
      </Row>
    </div>
    <div class="order_info">
      <h4>美容院信息</h4>
      <Row>
        <Col span="8">门店：{{orderBase.storeName}}</Col>
        <Col span="8">老板姓名：{{orderBase.storeOwnerName}}</Col>
        <Col span="8">注册手机：{{orderBase.storeTel}}</Col>
      </Row>
      <Row>
        <Col span="8">地址：{{orderBase.storeAddress}}</Col>
        <Col span="8"></Col>
        <Col span="8">服务美容师：{{orderBase.beauticianName}}</Col>
      </Row>
    </div>
    <div class="service_info">
      <h3>服务信息 <span class="service_type">{{orderBase.type==0?'到店订单':'上门订单'}}</span></h3>
      <div class="table">
        <div class="title">
          <Row>
            <Col span="6">服务</Col>
            <Col span="6">单价</Col>
            <Col span="6">订单总额</Col>
            <Col span="6">售后</Col>
          </Row>
        </div>
        <div class="content">
          <Row>
            <Col span="6"><img :src="orderBase.productImg" alt=""><span>{{orderBase.productName}}</span></Col>
            <Col span="6">￥{{orderBase.productPrice/100}}</Col>
            <Col span="6">{{orderBase.amountTotal/100}}<span v-if="orderBase.type">(含上门费：￥{{(orderBase.amountTotal-orderBase.productPrice)/100}})</span></Col>
            <Col span="6" v-if="orderBase.returnStatus=='0'">-</Button></Col>
            <Col span="6" v-if="orderBase.returnStatus!='0'"><Button type="ghost" @click="changePageType('refund');">{{returnStatus}}</Button></Col>
          </Row>
        </div>
      </div>
    </div>
    <div class="discount">
      <div class="ticket" v-if="orderBase.couponReduce">
        优惠券：-￥{{orderBase.couponReduce/100}} <span>满100减{{orderBase.couponReduce/100}}</span>
      </div>
      <div class="member_card" v-if="orderBase.memberCardReduce">
        会员卡：-￥{{orderBase.memberCardReduce/100}} <span>一卡通折扣</span>
      </div>
      <div class="total_pay">
        <Button style="float:left;" type="success" @click.native="returnHome('list')">返回</Button>
        实付金额：<strong>￥{{orderBase.amountPay/100}}</strong>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import RefundPage from './refund.vue'
import common from "../../../base.js";
export default {
  data() {
    return {
      src:'../../../static/images/footer/1_1.png',
      orderBase:"",
      progress:0,
      pageType:'info'
    };
  },
  computed:{
    // 订单状态    
    orderType:function(){
      let str = ""
      if(this.orderBase.status == 0){
        str = "待付款";
        this.progress = 1;
      }else if(this.orderBase.status == 1){
        str = '交易关闭'
        this.progress = 1;
      }else if(this.orderBase.status == 2){
        str = '待服务'
        this.progress = 2;
      }else if(this.orderBase.status == 4){
        str = '服务中'
        this.progress = 3;
      }else if(this.orderBase.status == 5){
        str = '待评价';
        this.progress = 4;
      }else if(this.orderBase.status == 6){
        str = '评价完成';
        this.progress = 4;
      }
      return str
    },
    // 支付方式
    payType:function(){
      let str = '';
      if(this.orderBase.payType=='wxpay'){
        str = '微信支付'
      }else if(this.orderBase.payType=='alipay'){
        str = '支付宝支付'
      }else if(this.orderBase.payType=='cardpay'){
        str = '会员卡支付'
      }else if(this.orderBase.payType=='oneCardPay'){
        str = '一卡通支付'
      }else if(this.orderBase.payType=='balancePay'){
        str = '余额支付'
      }
      return str;
    },
    //售后状态
    returnStatus:function(){
      let str = '';
      if(this.orderBase.returnStatus==0){
        str = '-'
      }else if(this.orderBase.returnStatus==1){
        str = '退款中'
      }else if(this.orderBase.returnStatus==2){
        str = '退款完成'
      }else if(this.orderBase.returnStatus==3){
        str = '拒绝退款'
      }
      return str;
    },
    unitPrice:function(){
      return this.orderBase.amountTotal/this.orderBase.nums
    }
  },
  methods: {
    getData(id){
      let vm = this;
      let url = common.path2+'orderBase/queryOrderInfoById/'+id;
      this.$http.get(url).then(res=>{
        console.log(res.data.data)
        vm.orderBase = res.data.data;
        vm.refundId = res.data.data.id;
      }).catch(err=>{
        console.log(err)
      })
    },
    changePageType (type) {
        this.pageType = type;
    },
    //进度条展示时间
    showTime:function(value){
      let str = ''
      if(value!=null){
        str = common.formatDate(value)
      }else{
        str = ''
      }
      return str 
    },
    returnHome(type){
        this.$emit('returnList',type)
    },
    goBackList(type){
      this.$emit('returnList',type)
    }
  },
  mounted: function() {
    this.getData(this.message);
  },
  activated: function() {},
  components: {
    RefundPage
  },
  props:['message']
};
</script>
<style lang="scss" scoped>
  .infoPage{
    background:#fff;
    height: auto;
    padding:20px 50px;
    h2{
      padding-bottom:20px;
    }
    .ivu-steps{
      padding-bottom:20px;
    }
    .order_info{
      padding:20px 20px 10px 20px;
      background:#f2f2f2;
      border-bottom:1px dashed #dddee1;
      h4{
        padding-bottom:10px;
      }
      .ivu-col{
        height: 30px;
      }
    }
    .service_info{
      padding-bottom:20px;
      h3{
        margin-bottom:10px;
        margin-top:10px;
          .service_type{
            display: inline-block;
            border:1px solid #8a8d98;
            padding:2px 6px;
          }
      }
      .table{
        border:1px solid #dddee1;
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
    .discount{
      text-align: right;
      .total_pay{
        strong{
          font-size: 20px;
        }
      }
      .ticket,.member_card{
        margin:8px 0;
        span{
          display: inline-block;
          width:80px;
          text-align: center;
          padding:3px 5px;
          border:1px solid #8a8d98;
        }
      }
    }
    .refund{
      color:blue;
    }
  }
</style>

