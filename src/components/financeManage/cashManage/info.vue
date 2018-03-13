<template>
  <div class="testWrap">
      <div class="boxStyle infoPage">
        <h3 class="transactionTitle">提现详情</h3>
        <div class="transactionDetail">
            <Row>
                <Col span="8">申请时间：{{data.addTime?common.formatDate(data.addTime):''}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">用户信息：{{data.beauticianId}} {{data.beauticianPhone}}</Col>
                <Col span="8">所属门店：{{data.storeName}}</Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">开户人：{{data.beauticianId}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">开户银行：{{data.bankName}}</Col>
                <Col span="8">开户支行：{{data.bankBranch}}</Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">银行账号：{{data.bankCardNo}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="8">提现金额：{{data.withdrawAmount/100}}</Col>
                <Col span="8">手续费：{{data.taxation/100}}</Col>
                <Col span="8">打款金额：{{data.actualAmount/100}}</Col>
            </Row>
            <Row>
                <Col span="8">打款状态：{{playAmountStatus}}</Col>
                <Col span="8"></Col>
                <Col span="8"></Col>
            </Row>
            <Row>
                <Col span="20">打款时间：{{payMoneyTime}}</Col>
                <Col span="2"></Col>
                <Col span="2"></Col>
            </Row>
        </div>
        <Button v-if="!data.playAmountStatus" type="primary" style="margin-right:20px;" @click="makeMoney(infoId)">确认打款</Button>
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
                data:''
            }
        },
        computed:{
            //交易类型
            playAmountStatus:function(){
                let str = ''
                if(this.data.playAmountStatus=='1'){
                    str = '已打款'
                }else{
                    str = '未打款'
                }
                return str
            },
            payMoneyTime(){
                let str = '';
                if(this.data.playAmountStatus=='1'){
                    str = this.data.playAmountTime?common.formatDate(this.data.playAmountTime):'';
                    str += '(具体以银行到账时间为准)';
                }else{
                    str = '预计打款时间为';
                    str += this.data.readyPlayAmountTime?common.simpleFormatDate(this.data.readyPlayAmountTime,3):'';
                }
                return str;
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
                let url = common.path2+'beauticianTradeDetails/'+id
                this.$http.get(url).then(res=>{
                    console.log(res)
                    vm.data = res.data.data;
                })
            },
            makeMoney(id){
                console.log(this.infoId)
                let vm = this
                let url = common.path2+'beauticianTradeDetails/batchMoney/'+id;
                this.$http.get(url).then(res=>{
                    console.log(res)
                    if(res.data.code==200){
                        this.$Message.success('打款成功！')
                        vm.returnHome('list')
                    }
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