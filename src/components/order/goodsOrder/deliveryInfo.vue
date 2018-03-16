<template>
    <div class="boxStyle">
        <div style="margin-bottom: 40px; margin-top: 15px; min-height: 400px; position: relative;">
            <Row style="margin-bottom: 20px; margin-top: 20px; font-size: 16px;">
                <Col span="6" offset="2">
                    物流公司：{{ info.logisticsName }}
                </Col>
                <Col span="6">
                    运单号：{{ info.deliveryNo }}
                </Col>
                <Col span="6">
                    配送状态：{{ orderStatus }}
                </Col>
            </Row>
            <Spin fix v-if="spinShow"></Spin>
            <div class="item" v-for="(item,index) in list" style="margin-bottom: 15px;">
                <Row>
                    <Col span="22" offset="2" style="color:#d1d1d1;">{{ item.ftime }}</Col>
                </Row>
                <Row>
                    <Col span="22" offset="2">{{ item.context }}</Col>
                </Row>
            </div>
        </div>
        <Button type="primary" @click="handReturn('list')" style="margin-left: 100px;">返回</Button>
    </div>
</template>
<script>
import common from "../../../base.js";
export default {
    data () {
        return {
            list: [],
            spinShow: false,
            info: '', // 订单信息
        }
    },
    computed : {
        // 订单状态
        orderStatus : function(){
            if(this.info.state == 0){
                return '待付款';
            }else if(this.info.state == 1){
                return '待发货';
            }else if(this.info.state == 2){
                return '待收货';
            }else if(this.info.state == 3){
                return '已收货';
            }
        }
    },
    props: ["id"],
    methods: {
        // 返回
        handReturn (val) {
            this.$emit('returnList', val); 
        },
        // 查询物流信息
        fnGetDeliveryInfo () {
            let vm = this;
            let url = vm.common.path2 + 'orderGoodsBase/queryDeliveryInfo?orderNo='+vm.id;
            vm.spinShow = true;
            vm.$http.get(
                url
            ).then(function(res){
                let oData = res.data.data.linkedList;
                vm.spinShow = false;
                if(!!oData){
                    vm.list = oData;
                }else{
                    vm.list = [];
                }
                vm.info = res.data.data;
                console.log(oData);
            }).catch(function(err){
            })
        }
    },
    mounted: function () {
        console.log(this.id);
        this.fnGetDeliveryInfo();
    }
}
</script>
<style lang="scss" scoped>

</style>