<template>
  <div class="testWrap">
      <div class="boxStyle infoPage">
        <h3 class="transactionTitle">交易详情</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">交易时间：45345</Col>
                <Col span="8">交易流水号：5345345</Col>
                <Col span="8">交易类型：534534543</Col>
            </Row>
            <Row>
                <Col span="8">交易方式：45345</Col>
                <Col span="8"></Col>
                <Col span="8">买家注册手机：5345345</Col>
            </Row>
            <Row>
                <Col span="8">门店名称：45345</Col>
                <Col span="8">店长手机：5345345</Col>
                <Col span="8">老板注册手机：534534543</Col>
            </Row>
        </div>
        <div class="service_info">
            <h3>服务信息</h3>
            <div class="table">
                <div class="title">
                <Row>
                    <Col span="6">服务</Col>
                    <Col span="6">单价</Col>
                    <Col span="6">数量</Col>
                    <Col span="6">总价</Col>
                </Row>
                </div>
                <div class="content">
                <Row>
                    <Col span="6"><img :src="src" alt=""><span>4546546</span></Col>
                    <Col span="6">￥4444</Col>
                    <Col span="6">(含上门费：￥30.00)</Col>
                    <Col span="6">45345345</Col>
                </Row>
                </div>
            </div>
        </div>
        <div class="discount">
            <div class="total_pay">
                实付金额：<strong>￥399.98</strong>
            </div>
        </div>
        <div class="service_info_1">
            <div class="table">
                <div class="title">
                <Row>
                    <Col span="8">总金额</Col>
                    <Col span="8">优惠总金额</Col>
                    <Col span="8">实收金额</Col>
                </Row>
                </div>
                <div class="content">
                <Row>
                    <Col span="8">4546546</Col>
                    <Col span="8">￥4444</Col>
                    <Col span="8">(含上门费：￥30.00)</Col>
                </Row>
                </div>
            </div>
        </div>
        <div class="service_info_1">
            <div class="table">
                <div class="title">
                    <Row>
                        <Col span="12">平台佣金</Col>
                        <Col span="12">(支付接口)交易手续费6 ‰</Col>
                    </Row>
                </div>
                <div class="content">
                    <Row>
                        <Col span="12">4546546</Col>
                        <Col span="12">￥4444</Col>
                    </Row>
                </div>
            </div>
        </div>
        <div class="service_info_1">
            <div class="table">
                <div class="title">
                    <Row>
                        <Col span="12">平台优惠</Col>
                        <Col span="12">优惠金额</Col>
                    </Row>
                </div>
                <div class="content">
                    <Row>
                        <Col span="12">E卡（1233434454）</Col>
                        <Col span="12">-15.00</Col>
                    </Row>
                    <Row>
                        <Col span="12">一卡通（1233434454）</Col>
                        <Col span="12">-15.00</Col>
                    </Row>
                    <Row>
                        <Col span="12">平台优惠券（1233434454）</Col>
                        <Col span="12">-15.00</Col>
                    </Row>
                    <Row>
                        <Col span="12">总计</Col>
                        <Col span="12">-45.00</Col>
                    </Row>
                </div>
            </div>
        </div>
        <Button type="success" @click.native="returnHome('list')">返回</Button>
      </div>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                src:'../../../static/images/footer/1_1.png',
            }
        },
        methods:{
            returnHome(type){
                this.$emit('returnList',type)
            }
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
        padding:20px 0px;
        .ivu-col-span-8{
            height: 30px;
        }
    }
    .service_info,.service_info_1{
        .table{
            border:1px solid #dddee1;
            margin-top:20px;
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