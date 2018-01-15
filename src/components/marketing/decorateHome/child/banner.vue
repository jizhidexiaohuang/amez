<template>
    <div :class="['item','banner-item',curIndex == index?'active':'']">
        <!-- 显示区域 {{ oData.data.text }} -->
        <div class="title">
            <div class="aItem">
                <img v-for="(item,index) in imgArrs" :src="item" v-show="curImg == index"/>
                <ul>
                    <li v-for="(one,index) in imgArrs" :class="curImg == index?'active1':''" @click="fnChangeImg(index)"></li>
                </ul>
            </div>
        </div>
        <!-- 编辑区域 -->
        <div class="item-edit-box" v-if="curIndex == index">
            <div class="edit-box-inner">
                <h3 style="width:90%; margin-left:5%; line-height: 30px;">轮播图</h3>
                <Form style="padding:15px 10px;">
                    <FormItem label="" v-if="testCode">
                        <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
                        <span style="color:red;">注：图片大小建议640px*300px</span>
                    </FormItem>
                    <FormItem label="">
                        <Button v-if="false" type="primary" @click="fnHandleSubmit">确定</Button>
                        <Button type="error" @click="fnHandleDelete">删除</Button>
                    </FormItem>
                </Form>
            </div>
            <!-- 小箭头 -->
            <div class="arrow"></div>
        </div>
    </div>
</template>
<script>
    import MyUpload from './upload.vue'
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
                        text: '区域1',
                        imgList: [],
                    }, // 数据
                }, 
                /* 编辑区域的字段 */ 
                edit:{
                    value:''
                },
                defaultList: [], // 上传控件默认显示的图片
                /* 上传控件的配置 */
                uploadConfig: { 
                    num:4// 上传图片的数量限制
                },
                uploadList:[],// 用来保存图片上传之后的数据，最终提交的时候，是根据这个变量来拿的
                testCode: false, 
                imgArrs:[],
                curImg:0,
            }
        },
        methods: {
            /* 根据父组件传递过来的数据初始化数据 */
            fnInitData () {
                let vm = this;
                console.log(1111111111);
                console.log(vm.datas);
                vm.oData = !!!vm.datas?vm.oData:vm.datas;
                vm.fnInitBox();
            },
            /* 初始化编辑区域 */
            fnInitBox () {
                let vm = this;
                let oData = vm.oData.data;
                vm.edit.value = oData.text;
                vm.defaultList = [];
                vm.defaultList = oData.imgList;
                vm.uploadList = oData.imgList;
                vm.fnGetArrs();
                vm.testCode = true;
            },
            /* 把编辑区域的数据替换到要提交的数据里边 */
            changeData () {
                let vm = this;
                // vm.oData.data.text = vm.edit.value;
                vm.oData.data.imgList = vm.uploadList;
            },
            /* 确定替换数据 */
            fnHandleSubmit () {
                let vm = this;
                 /* 把编辑区域的数据替换到要提交的数据里边 */
                vm.changeData();
                let obj = vm.oData;
                vm.fnGetArrs();
                vm.curImg = 0;
                vm.$emit('getData', obj); 
            },
            /* 删除模块 */
            fnHandleDelete () {
                let vm = this;
                vm.$emit('deleteModal');
            },
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
                vm.fnHandleSubmit();
            },
            fnGetArrs () {
                let vm = this;
                vm.imgArrs = [];
                if(!!vm.uploadList){
                    vm.uploadList.forEach(function(item,index){
                        vm.imgArrs.push(item.url);
                    })
                }
            },
            fnChangeImg (index) {
                let vm = this;
                vm.curImg = index;
            }
        },
        mounted: function(){
            let vm = this;
            /* 对传递过来的数据进行处理 */
            vm.fnInitData();
        },
        watch:{
            curIndex (curVal,oldVal) {
                // console.log("新值:"+curVal);
                // console.log("旧值:"+oldVal);
                this.fnInitData();
            },
        },
        components:{
            MyUpload
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
        min-height: 160px;
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
.ivu-form-item{
    margin-bottom:0px;
}
.aItem{
    width: 100%; height: 100%;
    position: relative;
}
.aItem img{
    display: block;
    width: 100%;
    height: 100%;
}
.aItem ul{
    position: absolute;
    width: 200px;
    height: 10px;
    left: 50%; margin-left: -100px;
    bottom: 10px;
    display: flex;
    flex-flow:row nowrap;
    justify-content: center;
}
.aItem ul li{
    margin-left:2px; margin-right:2px;
    width: 10px; height: 10px; 
    border-radius: 50%;
    background: #ccc;
    cursor:pointer;
}
.active1{
    background: red!important;
}
</style>