<template>
  <div class="testWrap">
    <div class="infoPage boxStyle">
    <Steps :current="progress">
        <Step title="买家申请退款" :content="orderBase.applyRefundTime?common.formatDate(orderBase.applyRefundTime):''"></Step>
        <Step title="卖家处理申请" :content="orderBase.auditTime?showTime(orderBase.auditTime):''"></Step>
        <Step title="退款完成" :content="orderBase.successRefundTime?showTime(orderBase.successRefundTime):''"></Step>
    </Steps>
    <div class="order_info spec">
      <h4>售后信息</h4>
      <Row>
        <Col span="8">退款流水号：{{orderBase.orderNo}}</Col>
        <Col span="8">售后状态：{{returnStatus}}</Col>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8">买家：{{orderBase.memberName}}</Col>
        <Col span="8">联系电话：{{orderBase.memberPhone}}</Col>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8">退款金额：￥{{orderBase.refundAmount/100}}</Col>
        <Col span="8">退款原因：{{orderBase.reason}}</Col>
        <Col span="8"></Col>
      </Row>
    </div>
    <div class="order_info">
      <h4>美容院信息</h4>
      <Row>
        <Col span="8">门店：{{orderBase.storeName}}</Col>
        <Col span="8">老板姓名：{{orderBase.storeBossName}}</Col>
        <Col span="8">注册手机：{{orderBase.storeBossPhone}}</Col>
      </Row>
      <Row>
        <Col span="8">地址：{{orderBase.storeAddress}}</Col>
        <Col span="8">服务美容师：{{orderBase.serverBeauticianName}}</Col>
      </Row>
    </div>
    <div class="service_info">
      <h3>服务信息</h3>
      <div class="table">
        <div class="title">
          <Row>
            <Col span="8">服务</Col>
            <Col span="8">单价</Col>
            <Col span="8">订单总额</Col>
          </Row>
        </div>
        <div class="content">
          <Row>
            <Col span="8"><img :src=orderBase.productImg alt=""><span>{{orderBase.productName}}</span></Col>
            <Col span="8">￥{{orderBase.productPrice/100}}</Col>
            <Col span="8">￥{{orderBase.amountTotal/100}}{{orderBase.orderType?'(含上门费：￥'+(orderBase.amountTotal-orderBase.productPrice)/100+')':''}}</Col>
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
        实付金额：<strong>￥{{orderBase.actualPay/100}}</strong>
      </div>
    </div>
    <div class="order_info" v-if="!!consultRecord">
      <h3 v-if="orderBase.returnStatus=='3'">平台介入退款</h3>
      <Row v-if="orderBase.returnStatus=='3'">
        <Col span="8">处理结果：同意退款给买家</Col>
        <Col span="8"></Col>
        <Col span="8"></Col>
      </Row>
      <Row v-if="false">
        <Col span="8" style="padding-left:60px;">
            <RadioGroup v-model="refundType">
                <Radio label="全额退款"></Radio>
                <Radio label="部分退款"></Radio>
            </RadioGroup>
        </Col>
        <Col span="8"></Col>
      </Row>
      <Row v-if="false">
        <Col span="8">退款金额：<InputNumber  :min="1" v-model="refundMonry"></InputNumber></Col>
        <Col span="8"></Col>
      </Row>
      <Row style="margin:10px 0px;" v-if="orderBase.returnStatus=='3'">
        <Col span="8" style="padding-left:60px;">
          <Button type="error" @click="refund">确定</Button>
          <Button style="margin-left:20px;">取消</Button>
        </Col>
        <Col span="8"></Col>
      </Row>
      <div class="log">
        <h3>协商处理记录</h3>
        <Row v-for="(item,index) in consultRecord" :key="index">
          <Col span="6">{{item.operType=='1'?'卖家':(item.operType=='2'?'平台':'买家')}}：{{item.addTime?showTime(item.addTime):''}}</Col>
          <Col span="6">{{item.operContent}}</Col>
          <Col span="6"></Col>
        </Row>
      </div>
    </div>
    <Button style="margin-top:10px;" type="success" @click.native="returnHome('list')">返回</Button>
    </div>
  </div>
</template>
<script>
import common from "../../../base.js";
export default {
  data() {
    return {
      src:'../../../static/images/footer/1_1.png',
      orderBase:"",
      progress:0,
      refundMonry:0,//退款金额
      refundType:'全额退款',//退款类型
      consultRecord:[]
    };
  },
  computed:{
    // 订单状态    
    returnStatus:function(){
      let str = ""
      if(this.orderBase.returnStatus == 1){
        str = "待卖家处理退款申请";
        this.progress = 2;
      }else if(this.orderBase.returnStatus == 2){
        str = '退款成功'
        this.progress = 3;
      }else if(this.orderBase.returnStatus == 3){
        str = '卖家拒绝退款'
        this.progress = 3;
      }
      return str
    },
    //售后状态
    customerService:function(){
      let str = '';
      if(this.orderBase.returnStatus==0){
        str = '-'
      }else if(this.orderBase.returnStatus==1){
        str = '退款'
      }else{
        str = '退款完成'
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
      let url = common.path2+'orderBase/queryOrderRefundDetails/'+id;
      this.$http.get(url).then(res=>{
        console.log(res)
        vm.orderBase = res.data.data;
        vm.consultRecord = res.data.data.list;
      }).catch(err=>{
        console.log(err)
      })
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
        this.$emit('return',type)
    },
    refund(){
      let url = common.path2+'orderBase/auditOrderRefundByPlatForm/'+this.refundId;
      this.$http.get(url).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  mounted: function() {
    this.getData(this.refundId);
  },
  activated: function() {},
  components: {},
  props:['refundId']
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
      h4{
        padding-bottom:10px;
      }
      .ivu-col{
        height: 40px;
        line-height: 40px;
      }
    }
    .spec{
      border-bottom:1px dashed #dddee1;
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
  }
</style>