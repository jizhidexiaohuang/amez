<template>
    <div>
        <Row class="expand-row">
            <Col span="4">
                <span class="expand-key">订单类型: </span>
                <span class="expand-value">{{ row.type ==0?'到店服务':'上门服务'}}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">订单编号: </span>
                <span class="expand-value">{{ row.orderNo }}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">下单时间: </span>
                <span class="expand-value">{{ row.orderSource ==0?'APP商城':'微信商城' }}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">下单时间: </span>
                <span class="expand-value">{{ common.formatDate(row.addTime) }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>