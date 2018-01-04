<template>
  <div class="infoPage">
    <Steps :current="progress">
        <Step title="买家申请退款" :content="common.formatDate(orderBase.applyTime)"></Step>
        <Step title="卖家处理申请" :content="showTime(orderBase.applyTime)"></Step>
        <Step title="退款完成" :content="showTime(orderBase.applyTime)"></Step>
    </Steps>
    <div class="order_info">
      <h4>售后信息</h4>
      <Row>
        <Col span="8">退款流水号：{{orderBase.orderNo}}</Col>
        <Col span="8">售后状态：{{returnStatus}}</Col>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8">买家：{{orderBase.memberName}}</Col>
        <Col span="8">联系电话：13232434352</Col>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8">退款金额：{{orderBase.fee}}</Col>
        <Col span="8">退款原因：{{orderBase.reason}}</Col>
        <Col span="8"></Col>
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
            <Col span="8"><img :src=src alt=""><span>胸部艾灸+腹部艾灸</span></Col>
            <Col span="8">￥{{orderBase.fee}}</Col>
            <Col span="8">￥288.00(含上门费：￥30.00)</Col>
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
        实付金额：<strong>￥{{orderBase.fee}}</strong>
      </div>
    </div>
    <div class="order_info">
      <h3>客服介入退款</h3>
      <Row>
        <Col span="8">处理结果：同意退款给买家</Col>
        <Col span="8"></Col>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8" style="padding-left:60px;">
            <RadioGroup v-model="refundType">
                <Radio label="全额退款"></Radio>
                <Radio label="部分退款"></Radio>
            </RadioGroup>
        </Col>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8">退款金额：<InputNumber  :min="1" v-model="refundMonry"></InputNumber></Col>
        <Col span="8"></Col>
      </Row>
      <Row style="margin:10px 0px;">
        <Col span="8" style="padding-left:60px;">
          <Button @click.native="returnHome('list')">确定</Button>
          <Button style="margin-left:20px;">取消</Button>
        </Col>
        <Col span="8"></Col>
      </Row>
      <div class="log">
        <h3>协商处理记录</h3>
        <Row>
          <Col span="6">平台：2017-07-1-20 12：20：30</Col>
          <Col span="6">客服介入，支持买家，退款成功</Col>
          <Col span="6"></Col>
        </Row>
        <Row>
          <Col span="6">买家：2017-07-1-20 12：20：30</Col>
          <Col span="6">卖家拒绝退款，买家申请客服介入</Col>
        </Row>
        <Row>
          <Col span="6">买家：2017-07-1-20 12：20：30</Col>
          <Col span="6">卖家拒绝退款，未及时处理，退款关闭</Col>
        </Row>
        <Row>
          <Col span="6">卖家：2017-07-1-20 12：20：30</Col>
          <Col span="6">卖家拒绝退款</Col>
        </Row>
        <Row>
          <Col span="6">卖家：2017-07-1-20 12：20：30</Col>
          <Col span="6">卖家同意退款，退款成功</Col>
        </Row>
        <Row>
          <Col span="6">平台：2017-07-1-20 12：20：30</Col>
          <Col span="6">卖家未及时处理，系统自动退款</Col>
        </Row>
        <Row>
          <Col span="6">买家：2017-07-1-20 12：20：30</Col>
          <Col span="6">提交退款申请</Col>
        </Row>
      </div>
    </div>
    <Button style="margin-top:10px;" type="success" @click.native="returnHome('list')">返回</Button>
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
    };
  },
  computed:{
    // 订单状态    
    returnStatus:function(){
      let str = ""
      if(this.orderBase.returnStatus == 2){
        str = "申请中";
        this.progress = 2;
      }else if(this.orderBase.returnStatus == 3){
        str = '审核通过'
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
      border-bottom:1px dashed #dddee1;
      h4{
        padding-bottom:10px;
      }
      .ivu-col{
        height: 40px;
        line-height: 40px;
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