<template>
    <div>
        <Row class="expand-row">
            <Col span="7">
                <span class="expand-key">交易类型: </span>
                <span class="expand-value">{{row.transactionSerialNumber}}</span>
            </Col>
            <Col span="6">
                <span class="expand-key">支付方式: </span>
                <span class="expand-value">{{payMethod}}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">结算时间: </span>
                <span class="expand-value">{{settlementTime}}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        },
        computed:{
            tradeType(){
                let str = ''
                if(this.row.tradeType=='1'){
                    str = '服务订单'
                }else if(this.row.tradeType=='2'){
                    str = '会员卡售卡'
                }else if(this.row.tradeType=='3'){
                    str = '会员卡充值'
                }
                return str;
            },
            payMethod(){
                let str = ''
                if(this.row.payMethod=='1'){
                    str = '支付宝支付'
                }else if(this.row.payMethod=='2') {
                    str = '微信支付'
                }else if(this.row.payMethod=='3') {
                    str = '会员卡支付'
                }else if(this.row.payMethod=='4') {
                    str = '一卡通支付'
                }else if(this.row.payMethod=='5') {
                    str = '余额支付'
                }
                return str
            },
            settlementTime(){
                let str = ''
                if(this.row.settlementTime){
                    str = this.common.formatDate(this.row.settlementTime)
                }else{
                    str = '无'
                }
                return str;
            }
        }
    };
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>