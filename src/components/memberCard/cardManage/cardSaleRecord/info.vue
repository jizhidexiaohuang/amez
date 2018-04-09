<template>
    <div class="infoPage">
        <h3>订单详情</h3>
        <div class="orderDetail">
          <h4>交易详情</h4>
          <Row>
              <Col span="8">交易时间：{{this.common.baseFormatDate(orderBase.useTime)}}</Col>
              <Col span="8">交易流水号：{{orderBase.tradeNo}}</Col>
              <Col span="8"></Col>
          </Row>
          <Row>
              <Col span="8">发卡方：{{orderBase.issueType?orderBase.issueStoreName:orderBase.brandName}}</Col>
              <Col span="8">售卡方：{{orderBase.buycardType?orderBase.saleStoreName:'平台售卡'}}</Col>
              <Col span="8"></Col>
          </Row>
          <Row>
              <Col span="8">买家：{{orderBase.memberNickname}}({{orderBase.registerPhone}})</Col>
              <Col span="8">支付方式：{{payType}}</Col>
              <Col span="8"></Col>
          </Row>
          <Row>
              <Col span="8">交易金额：￥{{orderBase.tradeAmount/100}}</Col>
              <Col span="8">售卡方抽佣：{{incentive?'￥'+incentive/100:''}}</Col>
              <Col span="8"></Col>
          </Row>
        </div>
        <div class="service_info">
            <h4>会员卡信息</h4>
            <div class="table">
                <div class="title">
                <Row>
                    <Col span="3">会员卡</Col>
                    <Col span="3">面值</Col>
                    <Col span="3">卡内容</Col>
                    <Col span="3">有效期</Col>
                    <Col span="3">适用门店</Col>
                    <Col span="3">适用服务</Col>
                    <Col span="3">会员卡说明</Col>
                </Row>
                </div>
                <div class="content">
                <Row>
                    <Col span="3" class="normal">{{orderBase.cardName?orderBase.cardName:'韵美会员卡'}}</Col>
                    <Col span="3" class="normal">￥{{orderBase.balance/100}}</Col>
                    <Col span="3" class="spec">
                        <span>{{(orderBase.discount/10+'').replace('.','')}}折</span><br/>
                        <span>{{orderBase.supportRecharge?'不支持':'支持'}}充值</span>
                    </Col>
                    <Col span="3" class="normal">{{effectiveType}}</Col>
                    <Col span="3" class="spec">
                        <span>{{orderBase.useStoreListSize}}家</span><br/>
                        <Button size="small" @click="businessCtrl = true">查看</Button>
                    </Col>
                    <Col span="3" class="spec">
                        <span>{{orderBase.useServiceListSize}}项服务</span><br/>
                        <Button size="small" @click="serviceCtrl = true">查看</Button>
                    </Col>
                    <Col span="3" class="remark">{{orderBase.remark}}</Col>
                </Row>
                </div>
            </div>
        </div>
        <Button type="ghost" @click="handReturn('list')">返回</Button>
        <Modal
            v-model="businessCtrl"
            title="适用门店"
            @on-ok="ok"
            width=740
            @on-cancel="cancel">
            <businessList></businessList>
        </Modal>
        <Modal
            v-model="serviceCtrl"
            title="适用服务"
            @on-ok="ok"
            width=740
            @on-cancel="cancel">
            <serviceList :discount="discount"></serviceList>
        </Modal>
    </div>
</template>
<script>
    import businessList from '../card/businessList.vue'
    import serviceList from '../card/serviceList.vue'
    export default {
        data () {
            return {
                orderBase:'',
                businessCtrl:false,
                serviceCtrl:false,
                discount:'',
                incentive:''
            }
        },
        computed:{
            payType:function(){
                let str ;
                if(this.orderBase.payType=='0'){
                    str = '微信支付'
                }else if(this.orderBase.payType=='1'){
                    str = '支付宝支付'
                }else{
                    str = '其他'
                }
                return str;
            },
            effectiveType(){
                let str ;
                if(this.orderBase.effectiveType=='0'){
                    str = '永久有效'
                }else if(this.orderBase.effectiveType=='1'){
                    str = '永久有效'
                }else{
                    str = '永久有效'
                }
                return str;
            }
        },
        methods:{
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            getData(id){
                let vm = this;
                let url = this.common.path2+'memberCardTradeRecode/queryCardSaleDetailById/'+id;
                this.$http.get(url).then(res=>{
                    console.log(res);
                    let oData = res.data.data;
                    console.log(oData)
                    vm.orderBase = oData;
                    vm.discount = oData.discount/100;
                    this.$store.commit('BUSINESS_ID',oData.useStoreList);
                    this.$store.commit('SERVICE_ID',oData.useServiceList);
                })
            },
            getIncentive(tradeNo){
                let vm = this;
                let url = this.common.path2+'storeTradeDetails/selectListByConditions';
                let ajaxData = {}
                ajaxData.orderNo = tradeNo;
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                    ).then(res=>{
                        if(res.data.data.list.length!=0){
                            vm.incentive = res.data.data.list[0].incentive;
                        }
                })
            },
            ok () {
                
            },
            cancel () {
                
            }
        },
        mounted:function(){
            console.log(this.parentMsg)
            this.getData(this.parentMsg.infoId);
            this.getIncentive(this.parentMsg.tradeNo);
        },
        props:['parentMsg'],
        components:{
            businessList,
            serviceList
        }
    }
</script>
<style scoped lang="scss">
    .infoPage{
        padding:0 20px;
        h3{
            border-bottom:1px solid #e2e2e2;
            padding-bottom:6px;
        }
        .orderDetail{
            margin-top:15px;
            h4{
                border-bottom:1px dashed #e2e2e2;
                padding-bottom:4px;
                margin-bottom:10px;
            }
            .ivu-row{
                line-height: 30px;
                height: 30px;
            }
        }
        .service_info{
            h4{
                margin-top:15px;
            }
            .table{
                border:1px solid #dddee1;
                margin:8px 0px;
                .title{
                    background:#dddee1;
                    .ivu-col{
                        line-height:40px;
                    }
                }
                .content{
                    padding:5px 0;
                }
                .ivu-col{
                    text-align: center;        
                }
                .ivu-col-span-3{
                    // line-height: 80px;
                }
                .spec{
                    line-height: 20px;
                    padding:15px 0px;
                }
                .normal{
                    padding-top:25px;
                }
            }
        }
    }
    .remark{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        padding-top:10px;
    }
</style>
