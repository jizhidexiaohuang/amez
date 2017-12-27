<style scoped>
    .expand-row{
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="24">
                <span class="expand-key">备注: </span>
                <span class="expand-value">{{ row.roleCode }}</span>
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