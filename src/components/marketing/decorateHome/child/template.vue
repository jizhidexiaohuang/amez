<template>
    <div :class="['item','banner-item',curIndex == index?'active':'']">
        <!-- 显示区域 -->
        <div class="title" v-if="">{{ oData.data.text }}</div>
        <!-- 编辑区域 -->
        <div class="item-edit-box" v-show="curIndex == index">
            <div class="edit-box-inner">
                <Input v-model="edit.value" placeholder="请输入内容" style="width: 200px; margin-left:10px;"></Input>
                <Button type="primary" @click="fnHandleSubmit">click me</Button>
                <Button type="error" @click="fnHandleDelete">delete me</Button>
            </div>
            <!-- 小箭头 -->
            <div class="arrow"></div>
        </div>
    </div>
</template>
<script>
    export default {
        props: [
            "curIndex", // 当前选中的区域
            "index", // 自身的索引值
            "datas", // 传递过来的数据
        ],
        data(){
            return {
                /* 属于改编辑模块的数据风格，根据父组件的数据 */
                oData:{
                    type: 'Banner', // 编辑类型
                    data: {
                        text: '区域1'
                    }, // 数据
                }, 
                /* 编辑区域的字段 */ 
                edit:{
                    value:''
                }
            }
        },
        methods: {
            /* 根据父组件传递过来的数据初始化数据 */
            fnInitData () {
                let vm = this;
                vm.oData = !!!vm.datas?vm.oData:vm.datas;
                vm.fnInitBox();
            },
            /* 初始化编辑区域 */
            fnInitBox () {
                let vm = this;
                let oData = vm.oData.data;
                vm.edit.value = oData.text;
            },
            /* 把编辑区域的数据替换到要提交的数据里边 */
            changeData () {
                let vm = this;
                vm.oData.data.text = vm.edit.value;
            },
            /* 确定替换数据 */
            fnHandleSubmit () {
                let vm = this;
                vm.changeData();
                let obj = vm.oData;
                vm.$emit('getData', obj); 
            },
            /* 删除模块 */
            fnHandleDelete () {
                let vm = this;
                vm.$emit('deleteModal');
            }
        },
        mounted: function(){
            let vm = this;
            /* 对传递过来的数据进行处理 */
            vm.fnInitData();
        },
        watch:{
            curIndex (curVal,oldVal) {
                console.log("新值:"+curVal);
                console.log("旧值:"+oldVal);
                this.fnInitData();
            }
        }
    };
</script>
<style lang='scss' scoped>
    .item{
    position: relative;
}
.banner-item{
    width: 100%;
    height: 150px;
    border: 2px solid #ccc;
    .title{
        width: 100%; height: 100%;
        text-align:center;
        line-height: 150px;
    }
}
.item-edit-box{
    position: absolute;
    min-height: 150px;
    width: 420px;
    right: -445px;
    top: -2px;
    .edit-box-inner{
        border:1px solid #d1d1d1;
        border-radius: 5px;
        background: #f8f8f8;  
        height: 160px;
    }
    .arrow{
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 7px 6px 0;
        border-color: transparent #d1d1d1 transparent transparent;
        position: absolute;
        left: -6px;
        top: 19px;
    }
    .arrow:after{
        content: "";
        border-right-color: #f8f8f8;
        left: 2px;
        top: -6px;
    }
}
.active{
    border: 2px dashed red;
}
</style>