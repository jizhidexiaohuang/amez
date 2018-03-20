<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" style="padding-bottom: 20px;">
            <FormItem  label="版本名称" prop="versionName">
                <Input v-model="formValidate.versionName" placeholder="请填写版本名称"></Input>
            </FormItem>
            <FormItem  label="apk路径" prop="updateUrl">
                <Input v-model="formValidate.updateUrl" placeholder="请填写apk路径"></Input>
            </FormItem>
            <FormItem  label="版本号" prop="versionCode">
                <Input v-model="formValidate.versionCode" placeholder="请填写版本号"></Input>
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
            <FormItem label="更新类型" prop="forced">
                <RadioGroup v-model="formValidate.forced">
                    <Radio label="1">强制更新</Radio>
                    <Radio label="2">手动更新</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="是否忽略更新" prop="ignoreUpdate">
                <RadioGroup v-model="formValidate.ignoreUpdate">
                    <Radio label="1">不忽略</Radio>
                    <Radio label="2">忽略</Radio>
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
    export default {
        data () {
            return {
                formValidate: {
                    'versionName':'',
                    'updateUrl':'',
                    'versionCode':'',
                    'appClientType':'1',
                    'appSystemType':'1',
                    'des':'',
                    'remarks':'',
                    'forced':'1',
                    'ignoreUpdate':'1',
                },
                ruleValidate: {
                    versionName: [
                        {required: true, message: '请填写版本名称', pattern: /.+/, trigger: 'change'}
                    ],
                    updateUrl: [
                        {required: true, message: '请填写apk路径', pattern: /.+/, trigger: 'change'}
                    ],
                    versionCode: [
                        {required: true, message: '请填写版本号', pattern: /.+/, trigger: 'change'}
                    ],
                    des: [
                        {required: true, message: '请填写描述', pattern: /.+/, trigger: 'change'}
                    ],
                    remarks: [
                        {required: true, message: '请填写备注', pattern: /.+/, trigger: 'change'}
                    ],
                },
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // 'updateUrl':'',
                        // 'versionCode':'',
                        // 'appClientType':'1',
                        // 'appSystemType':'1',
                        // 'des':'',
                        // 'remarks':'',
                        // 'forced':'1'
                        //添加品牌服务
                        let ajaxData = {
                            versionName: vm.formValidate.versionName,
                            updateUrl: vm.formValidate.updateUrl,
                            versionCode: vm.formValidate.versionCode,
                            appClientType: vm.formValidate.appClientType,
                            appSystemType: vm.formValidate.appSystemType,
                            des: vm.formValidate.des,
                            remarks: vm.formValidate.remarks,
                            forced: vm.formValidate.forced,
                            ignoreUpdate: vm.formValidate.ignoreUpdate,
                        }
                        let url = vm.common.path2+"baseAppUpdateVersions/insert";
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
        },
        mounted: function(){
        },
        components:{
        }
    }
</script>
<style scoped>
</style>

