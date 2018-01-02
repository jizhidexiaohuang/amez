<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <Spin fix v-if="spinShow"></Spin>
            <FormItem  label="分类名称" prop="categoryName">
                <Input v-model="formValidate.categoryName" placeholder="请填写分类名称"></Input>
            </FormItem>
            <FormItem  label="状态">
                <iSwitch size="large" v-model="switch1" @on-change="changeSwitch1">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </iSwitch>
            </FormItem>
            <FormItem label="轮播图" v-if="testCode"> 
                <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
            </FormItem>
            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                formValidate: {
                    categoryName: '',// 分类名称
                    categoryLogo:'',//图片地址
                    categoryParentId: 0,//父类id
                },
                ruleValidate: {
                },
                defaultList: [],
                uploadConfig: {
                    num:1
                },
                uploadList:[],//图片列表
                // path:"http://172.16.20.151:8009/system/api/file/uploadForKindeditor"
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                testCode: false,
                spinShow: false,// 加载开关
                auditCode: false, // 审核开关
                switch1: false,// 一级分类开关
            }
        },
        props: ["sendChild"],
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加品牌服务
                        let ajaxData = {
                            categoryName: vm.formValidate.categoryName, // 分类名称
                            categoryLogo: vm.uploadList.length>0?vm.uploadList[0].url:"",//封面图
                            categoryParentId: vm.formValidate.categoryParentId,// 父类id
                            id:vm.sendChild.id,
                            isEnabled: !!!vm.switch1?0:1,//开启状态
                        }
                        console.log(ajaxData);
                        let url = vm.common.path + "productCategory/edit"
                        vm.$http.put(
                            url,
                            ajaxData,
                        ).then(function(res){
                            let oData = res.data
                            console.log(oData);
                            vm.$emit('returnList', 'list'); 
                            vm.$Message.success('成功');
                        }).catch(function(err){
                            console.log(err);
                            vm.$Message.success(err);
                        })
                        console.log(ajaxData);
                    } else {
                        this.$Message.error('提交失败!');
                    }
                })
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
                console.log(vm.uploadList);
            },
            // 获取产品信息
            fnQueryById () {
                let vm = this;
                let id = vm.sendChild.id;
                let url = vm.common.path + "productCategory/queryById/"+id;
                vm.spinShow = true;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data.data;
                    console.log(oData);
                    vm.fnInitQuery(oData);
                    vm.spinShow = false;
                }).catch(function(err){
                    console.log(err);
                    vm.spinShow = false;
                })
            },
            // 产品的信息遍历出来
            fnInitQuery (data) {
                let vm = this;
                vm.formValidate.categoryName = data.categoryName;
                vm.formValidate.categoryParentId = data.categoryParentId;
                vm.switch1 = data.isEnabled;
                // 封面图以及轮播图的处理
                if(!!!data.categoryLogo){

                }else{
                    vm.formValidate.categoryLogo = data.categoryLogo;//封面图
                    vm.defaultList = [
                        {
                            'url':data.categoryLogo
                        }
                    ]
                }
                vm.testCode = true;
                vm.uploadList = vm.defaultList;
            },
            // 开关控制
            changeSwitch1 () {
                this.$Message.info('开关状态：' + status);
            }
        },
        mounted: function(){
            console.log(this.sendChild);
            console.log(1);
            this.fnQueryById();
        },
        components:{
            MyUpload
        }
    }
</script>
<style scoped>
</style>

