<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="分类名称" prop="categoryName">
                <Input v-model="formValidate.categoryName" placeholder="请填写分类名称"></Input>
            </FormItem>
            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
            </FormItem>
            <FormItem label="图标">
                <MyUpload :defaultList="defaultList" v-on:listenUpload="getUploadList"></MyUpload>
            </FormItem>
            <FormItem  label="状态">
                <iSwitch size="large" v-model="switch1" @on-change="changeSwitch1">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </iSwitch>
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
                uploadList:[],//图片列表
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
                switch1: false,
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
                        }
                        let url = vm.common.path+"productCategory/insert";
                        vm.$http.post(
                            url,
                            JSON.stringify(ajaxData),
                            {
                                headers:{
                                    'Content-type':'application/json;charset=UTF-8'
                                }
                            }
                        ).then(function(res){
                            let oData = res.data
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
            // 开关控制
            changeSwitch1 () {
                this.$Message.info('开关状态：' + status);
            }
        },
        mounted: function(){
        },
        components:{
            MyUpload
        }
    }
</script>
<style scoped>
</style>

