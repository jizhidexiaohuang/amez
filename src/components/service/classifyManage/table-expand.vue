<style scoped>
    .expand-row{
    }
</style>
<template>
    <div>
        <Row class="expand-row" v-for="item in list" :key="item.id">
            <Col span="3">
                <span class="expand-key">分类名称: </span>
                <span class="expand-value">{{ item.categoryName }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">商品数量: </span>
                <span class="expand-value">10</span>
            </Col>
            <Col span="2">
                <span class="expand-key">状态: </span>
                <span class="expand-value" v-if="!!item.isEnabled">开启</span>
                <span class="expand-value" v-if="!!!item.isEnabled">关闭</span>
            </Col>
            <Col span="2">
                <span class="expand-key">操作: </span>
                <Button  size="small" @click="fnDoSome(item.id)">编辑</Button>
                <Button  size="small" @click="fnDelete(item.id)">删除</Button>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        },
        data () {
            return {
                list:[],// 接口返回的数据
            }
        },
        mounted: function(){
            this.getData();
        },
        methods: {
            getData: function(){
                let vm = this;
                let categoryParentId = vm.row.id;
                let start = 1;//从第几个开始
                let size = 1000;//每页条数
                let url = vm.common.path+"productCategory/front/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    categoryParentId: categoryParentId
                }
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then(function(res){
                    let oData = res.data.data
                    console.log(oData.list);
                    vm.list = oData.list;
                }).catch(function(err){
                    console.log(err);
                })
            },
            fnDoSome: function(id){
                console.log(id);

            },
            fnDelete: function(id){
                let vm = this;
                let url = vm.common.path + "productCategory/deleteById/" + id;
                vm.$http.delete(
                    url
                ).then(function(res){
                    vm.$Message.success('删除成功');
                    console.log(res);
                    vm.getData();
                }).catch(function(err){
                    console.log(err);
                    vm.$Message.error(err);
                })
            }
        },
    };
</script>
<style scoped>
.ivu-table-expanded-cell{
    padding:0px!important;
}
.expand-row{
    height:40px;
    line-height:40px; 
    border-bottom:1px dotted #ccc;
}
</style>