<template>
    <div :class="['item','clear','banner-item',curIndex == index?'active':'']">
        <div class="aActivityItem" v-for="(item,index) in uploadList">
            <div class="activityIcon">
                <img :src="imgArrs[index]" />
            </div>
            <div class="activityText">
                <h3 class="line">{{ item.title1 }}</h3>
                <p class="line" style="font-size: 12px;">{{ item.title2 }}</p>
            </div>
        </div>
        <!-- 编辑区域 -->
        <div class="item-edit-box" v-if="curIndex == index">
            <div class="edit-box-inner">
                <h3 style="width:90%; margin-left:5%; line-height: 30px;">活动区</h3>
                <Form style="padding:15px 10px;">
                    <FormItem label="" v-if="testCode">
                        <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
                        <span style="color:red;">注：图片大小建议640px*300px</span>
                    </FormItem>
                    <FormItem label="">
                        <Button v-if="false" type="primary" @click="fnHandleSubmit">确定</Button>
                        <Button v-if="false" type="error" @click="fnHandleDelete">删除</Button>
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
                    type: 'Activity', // 编辑类型
                    data: {
                        text: '区域2',
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
                    num:4,// 上传图片的数量限制
                    name: false,// 是否显示名称
                    src: true,// 是否显示链接
                    title1: true, // 是否显示一级标题
                    title2: true, // 是否显示二级标题
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
                vm.oData = !!!vm.datas?vm.oData:vm.datas;
                vm.fnInitBox();
            },
            /* 初始化编辑区域 */
            fnInitBox () {
                let vm = this;
                let oData = vm.oData.data;
                vm.edit.value = oData.text;
                vm.defaultList = []; // 默认滞空
                vm.defaultList = oData.imgList; // 传过来的数据赋值给默认数组
                vm.uploadList = oData.imgList; // 保存要提交的数据
                vm.fnGetArrs();
                vm.testCode = true;
            },
            /* 把编辑区域的数据替换到要提交的数据里边 */
            changeData () {
                let vm = this;
                // vm.oData.data.text = vm.edit.value;
                vm.oData.data.imgList = vm.uploadList;
            },
            /* 确定替换数据,也就是更新左侧的视图,并且把数据返回给父组件 */
            fnHandleSubmit () {
                let vm = this;
                 /* 把编辑区域的数据替换到要提交的数据里边 */
                vm.changeData();
                let obj = vm.oData;
                vm.fnGetArrs();
                vm.curImg = 0; // 默认轮播图显示第一张
                vm.$emit('getData', obj); 
            },
            /* 删除模块 */
            fnHandleDelete () {
                let vm = this;
                vm.$emit('deleteModal');
            },
            // 上传成功之后,把数组赋值给uploadList;
            getUploadList (data) {
                let vm = this;
                vm.uploadList = vm.fnFilterDatas(data);
                vm.fnHandleSubmit(); // 上传成功之后就刷新实时区域的显示效果
            },
            // 重新组织数据,因为img遍历不出是数组元素是对象的图片路径
            fnGetArrs () {
                let vm = this;
                vm.imgArrs = [];
                if(!!vm.uploadList){
                    vm.uploadList.forEach(function(item,index){
                        vm.imgArrs.push(item.url);
                    })
                }
            },
            // 轮播图的控制
            fnChangeImg (index) {
                let vm = this;
                vm.curImg = index;
            },
             /* 数据过滤 */
            fnFilterDatas (data) {
                let arrs = [];
                data.forEach(function(item,index){
                    var obj = {};
                    obj.url = item.url;
                    obj.myId = item.myId;
                    obj.src = item.src;
                    obj.title1 = item.title1;
                    obj.title2 = item.title2;
                    arrs.push(obj);
                })
                return arrs;
            }
        },
        mounted: function(){
            let vm = this;
            /* 对传递过来的数据进行处理 */
            vm.fnInitData();
        },
        watch:{
            curIndex (curVal,oldVal) {
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
    clear:both;
}
.banner-item{
    width: 100%;
    min-height: 70px;
    clear: both;
    border: 2px solid #ccc;
    .title{
        width: 100%; height: 100%;
        text-align:center;
        line-height: 70px;
    }
    .aActivityItem{
        width: 50%;
        float: left;
        height: 70px;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        .activityIcon{
            width: 40%;
            height: 70px; 
            overflow: hidden;
            float: left;
            img{
                display:block;
                width: 40px; height: 40px;
                margin: 0 auto;
                margin-top: 15px;
            }
        }
        .activityText{
            width: 60%;
            height: 70px;
            overflow: hidden;
            float: left;
            h3{
                width: 100%;
                padding-right: 3px;
                padding-left: 3px;
                margin-top: 15px;
            }
            p{
                width: 100%;
                padding-right: 3px;
                padding-left: 3px;
                color: #ccc;
                font-size: 10px!important;
            }
        }
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