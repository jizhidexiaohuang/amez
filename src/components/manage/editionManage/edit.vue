<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" style="padding-bottom: 20px;">
            <FormItem  label="apk路径" prop="apkUrl">
                <Input v-model="formValidate.apkUrl" placeholder="请填写apk路径"></Input>
            </FormItem>
            <FormItem  label="版本号" prop="apkVersion">
                <Input v-model="formValidate.apkVersion" placeholder="请填写版本号"></Input>
            </FormItem>
            <FormItem label="客户端类型" prop="appClientType">
                <RadioGroup v-model="formValidate.appClientType">
                    <Radio label="1">门店端</Radio>
                    <Radio label="2">用户端</Radio>
                    <Radio label="3">美容师端</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="系统类型" prop="appSystemType">
                <RadioGroup v-model="formValidate.appSystemType">
                    <Radio label="1">安卓</Radio>
                    <Radio label="2">ios</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="描述" prop="des">
                <Input v-model="formValidate.des" placeholder="请填写描述"></Input>
            </FormItem>
            <FormItem label="更新类型" prop="updateStatus">
                <RadioGroup v-model="formValidate.updateStatus">
                    <Radio label="1">强制更新</Radio>
                    <Radio label="2">手动更新</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="备注" prop="remarks">
                <Input v-model="formValidate.remarks" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请填写备注..."></Input>
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
                    'apkUrl':'',
                    'apkVersion':'',
                    'appClientType':'1',
                    'appSystemType':'1',
                    'des':'',
                    'remarks':'',
                    'updateStatus':'1'
                },
                ruleValidate: {
                },
            }
        },
        props: ["sendChild"],
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加短信模板
                        let ajaxData = {
                            apkUrl: vm.formValidate.apkUrl,
                            apkVersion: vm.formValidate.apkVersion,
                            appClientType: vm.formValidate.appClientType,
                            appSystemType: vm.formValidate.appSystemType,
                            des: vm.formValidate.des,
                            remarks: vm.formValidate.remarks,
                            updateStatus: vm.formValidate.updateStatus,
                            id:vm.sendChild.id,
                        }
                        let url = vm.common.path2 + "baseAppUpdateVersions/update"
                        vm.$http.put(
                            url,
                            ajaxData,
                        ).then(function(res){
                            let oData = res.data
                            vm.$emit('returnList', 'list'); 
                            vm.$Message.success('成功');
                        }).catch(function(err){
                            vm.$Message.success(err);
                        })
                    } else {
                        this.$Message.error('提交失败!');
                    }
                })
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            // 获取短信模板详情
            fnQueryById () {
                let vm = this;
                let id = vm.sendChild.id;
                let url = vm.common.path2 + "baseAppUpdateVersions/"+id;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data.data;
                    console.log(11111111111);
                    console.log(oData);
                    vm.fnInitQuery(oData);
                }).catch(function(err){
                    console.log(err);
                })
            },
            // 短信模板的内容遍历出来
            fnInitQuery (data) {
                let vm = this;
                vm.formValidate.apkUrl = data.apkUrl;
                vm.formValidate.apkVersion = data.apkVersion;
                vm.formValidate.appClientType = data.appClientType;
                vm.formValidate.appSystemType = data.appSystemType;
                vm.formValidate.des = data.des;
                vm.formValidate.remarks = data.remarks;
                vm.formValidate.updateStatus = data.updateStatus;
            },
        },
        mounted: function(){
            this.fnQueryById();
        },
        components:{
            MyUpload
        }
    }
</script>
<style scoped>
</style>

