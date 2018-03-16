<template>
  <div class="testWrap">
    <div class="infoPage boxStyle">
    <Steps :current="progress">
        <Step title="买家付款" :content="common.formatDate(orderBase.payTime)"></Step>
        <Step title="发货时间" :content="showTime(orderBase.deliveryTime)"></Step>
        <Step title="收货完成" :content="showTime(orderBase.receiveTime)"></Step>
    </Steps>
    <!-- 订单信息 -->
    <div class="order_info">
      <h4>订单信息</h4>
      <Row>
        <Col span="8">订单号：{{orderBase.orderNo}}</Col>
        <Col span="8">订单状态：{{orderType}}</Col>
      </Row>
      <Row>
        <Col span="8">支付单号：{{orderBase.tradeNo}}</Col>
        <Col span="8">付款方式：{{payType}}</Col>
      </Row>
    </div>
    <!-- 买家信息 -->
    <div class="order_info">
      <h4>买家信息</h4>
      <Row>
        <Col span="8">购买人：{{orderBase.addressReveiver}}</Col>
        <Col span="8">联系电话：{{orderBase.addressPhone}}</Col>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8">上门地址：{{!!orderBase.addressRegson?orderBase.addressRegson:orderBase.address}}</Col>
      </Row>
      <Row>
        <Col span="8">备注：{{orderBase.remark?orderBase.remark:'无'}}</Col>
      </Row>
    </div>
    <!-- 美容院信息 -->
    <div class="order_info">
      <h4>美容院信息</h4>
      <Row>
        <Col span="8">美容师名称：{{orderBase.beauticianRealName}}</Col>
        <Col span="8">美容师类型：{{ orderBase.beauticianType == 0?'店长':'兼职员工' }}</Col>
        <Col span="8">注册手机：{{orderBase.beauticianPhone}}</Col>
      </Row>
      <Row>
        <Col span="8">门店：{{orderBase.beauticianBelongStoreName}}</Col>
      </Row>
    </div>

    <div class="service_info">
      <h3>商品信息</h3>
      <div class="table">
        <div class="title">
          <Row>
            <Col span="6">商品名称</Col>
            <Col span="6">单价（元）</Col>
            <Col span="6">数量</Col>
            <Col span="6">总价（元）</Col>
          </Row>
        </div>
        <div class="content">
          <Row v-for="(item,index) in goodsInfoList">
            <Col span="6"><img :src="item.coverImg" alt=""><span>{{ item.physicalName }}</span></Col>
            <Col span="6">￥{{ +item.salePrice/100 }}</Col>
            <Col span="6">{{ item.nums }}</Col>
            <Col span="6">{{ (+item.salePrice/100)*(+item.nums) }}</Col>
          </Row>
        </div>
      </div>
    </div>
    <div class="discount">
      <div class="total_pay">
        <Button style="float:left;" type="success" @click.native="returnHome('list')">返回</Button>
        实付金额：<strong>￥{{ allPrice }}</strong>
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
      goodsInfoList:[],
    };
  },
  computed:{
    // 总付金额
    allPrice : function () {
      var num = 0;
      this.goodsInfoList.forEach(( item,index ) => {
        num += (+item.salePrice/100)*(+item.nums);
      })
      return num;
    },
    // 订单状态    
    orderType:function(){
      let str = ""
      if(this.orderBase.status == 1){
        str = "待发货";
        this.progress = 1;
      }else if(this.orderBase.status == 2){
        str = '待收货'
        this.progress = 2;
      }else if(this.orderBase.status == 3){
        str = '已收货'
        this.progress = 3;
      }
      return str
    },
    // 支付方式
    payType:function(){
      let str = '';
      if(this.orderBase.payType == 'wechatpay'){
        str = '微信支付'
      }else if(this.orderBase.payType == 'alipay'){
        str = '支付宝支付'
      }else if(this.orderBase.payType == 'memberCardPay'){
        str = '会员支付'
      }else if(this.orderBase.payType == 'oneCardPay'){
        str = '一卡通'
      }else if(this.orderBase.payType == 'balancePay') {
        str = '贷款'
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
      let url = common.path2+'orderGoodsBase/queryDetailsById/'+id;
      this.$http.get(url).then(res=>{
        console.log(res.data.data);
        vm.orderBase = res.data.data.orderGoodsBase;
        if(!!res.data.data.goodsInfoList){
          vm.goodsInfoList = res.data.data.goodsInfoList;
        }else{
          vm.goodsInfoList = [];
        }
        console.log('~~~~~~~~~~~~~~~')
        console.log(vm.orderBase);
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
    },
  },
  mounted: function() {
    // 获取商品信息
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

