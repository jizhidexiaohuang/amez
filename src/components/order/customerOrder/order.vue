<template>
  <div class="testWrap">
    <div class="infoPage boxStyle">
    <Steps :current="progress">
        <Step title="提交订单" :content="orderBase.applyTime?common.formatDate(orderBase.applyTime):''"></Step>
        <Step title="付款时间" :content="showTime(orderBase.applyTime)"></Step>
        <Step title="服务开始时间" :content="showTime(orderBase.applyTime)"></Step>
        <Step title="服务完成" :content="showTime(orderBase.applyTime)"></Step>
    </Steps>
    <div class="order_info">
      <h4>订单信息</h4>
      <Row>
        <Col span="8">订单号：{{orderBase.orderNo}}</Col>
        <Col span="8">订单状态：{{returnStatus}}</Col>
        <Col span="8">订单来源：微信商城</Col>
      </Row>
      <Row>
        <Col span="8">订单类型：{{orderBase.returnType==1?'换货':'退款'}}</Col>
        <Col span="8">支付单号：{{orderBase.orderNo}}</Col>
        <Col span="8">付款方式：微信支付</Col>
      </Row>
    </div>
    <div class="order_info">
      <h4>买家信息</h4>
      <Row>
        <Col span="8">购买人：{{orderBase.memberName}}</Col>
        <Col span="8">联系电话：13232434352</Col>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8">上门地址：深圳市罗湖区翠竹路崔雍华府A栋302</Col>
      </Row>
      <Row>
        <Col span="8">备注：上门前请提前联系</Col>
      </Row>
    </div>
    <div class="order_info">
      <h4>美容院信息</h4>
      <Row>
        <Col span="8">门店：唯伊美高端美容体验中心</Col>
        <Col span="8">老板姓名：朱艳林</Col>
        <Col span="8">注册手机：15987635412</Col>
      </Row>
      <Row>
        <Col span="8">地址：深圳市罗湖区金光华广场6楼</Col>
        <Col span="8">服务美容师：艾小美</Col>
      </Row>
    </div>
    <div class="service_info">
      <h3>服务信息 <span class="service_type">{{orderBase.returnType==1?'换货':'退款'}}订单</span></h3>
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
            <Col span="6"><img :src=src alt=""><span>胸部艾灸+腹部艾灸</span></Col>
            <Col span="6">￥{{orderBase.fee}}</Col>
            <Col span="6">￥288.00(含上门费：￥30.00)</Col>
            <Col span="6">{{returnStatus}}</Col>
          </Row>
        </div>
      </div>
    </div>
    <div class="discount">
      <div class="ticket">
        优惠券：-￥20.00 <span>满100减20</span>
      </div>
      <div class="member_card">
        会员卡：-￥20.00 <span>一卡通折扣</span>
      </div>
      <div class="total_pay">
        <Button style="float:left;" type="success" @click.native="returnHome('list')">返回</Button>
        实付金额：<strong>{{orderBase.fee}}</strong>
      </div>
    </div>
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
    };
  },
  computed:{
    // 订单状态    
    returnStatus:function(){
      let str = ""
      if(this.orderBase.returnStatus == 2){
        str = "申请中";
        this.progress = 1;
      }else if(this.orderBase.returnStatus == 3){
        str = '审核通过'
        this.progress = 2;
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
      let url = common.path+'orderReturn/queryById/'+id;
      this.$http.get(url).then(res=>{
        console.log(res)
        vm.orderBase = res.data.data;
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
        this.$emit('returnList',type)
    }
  },
  mounted: function() {
    this.getData(this.orderId);
  },
  activated: function() {},
  components: {},
  props:['orderId']
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
  }
</style>

