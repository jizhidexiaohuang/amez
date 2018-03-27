<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="短信名称" prop="smsName">
                <Input v-model="formValidate.smsName" placeholder="请填写短信名称"></Input>
            </FormItem>
            <FormItem  label="短信编码" prop="smsCode">
                <Input v-model="formValidate.smsCode" placeholder="请填写短信编码"></Input>
            </FormItem>
            <FormItem label="短信类型" prop="smsType">
                <RadioGroup v-model="formValidate.smsType">
                    <Radio label="0">验证码</Radio>
                    <Radio label="1">短信通知</Radio>
                    <Radio label="2">短信推广</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="短信模板" prop="smsTemplate">
                <Input v-model="formValidate.smsTemplate" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写短信模板..."></Input>
            </FormItem>
            <FormItem label="备注" prop="remarks">
                <Input v-model="formValidate.remarks" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写备注..."></Input>
            </FormItem>
            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
            </FormItem>
            <FormItem>
                <Button :disabled="!!btnCode" type="primary" @click="handleSubmit('formValidate')">提交</Button>
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
                btnCode: false,
                formValidate: {
                    smsName: '',// 短信名称
                    smsCode: '',// 短信编码
                    smsType: '0',// 短信类型
                    remarks: '',// 备注
                    smsTemplate: '',// 短信模板
                },
                ruleValidate: {
                    smsName: [
                        {required: true, message: '请填写短信名称', pattern: /.+/, trigger: 'change'}
                    ],
                    smsCode: [
                        {required: true, message: '请填写短信编码', pattern: /.+/, trigger: 'change'}
                    ],
                    smsTemplate: [
                        {required: true, message: '请填写短信模板', pattern: /.+/, trigger: 'change'}
                    ],
                },
                path:this.common.path21+"system/api/file/uploadForKindeditor",
                spinShow: false,// 加载开关
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
                            smsName: vm.formValidate.smsName, // 短信名称
                            smsCode: vm.formValidate.smsCode, // 短信编码
                            smsType: vm.formValidate.smsType, // 短信类型
                            remarks: vm.formValidate.remarks, // 备注
                            smsTemplate: vm.formValidate.smsTemplate, // 备注
                            id:vm.sendChild.id,
                        }
                        let url = vm.common.path2 + "baseSmsTemplates/update"
                        vm.btnCode = true;
                        vm.$http.put(
                            url,
                            ajaxData,
                        ).then(function(res){
                            let oData = res.data
                            vm.$emit('returnList', 'list'); 
                            vm.btnCode = false;
                            vm.$Message.success('成功');
                        }).catch(function(err){
                            vm.btnCode = false;
                            vm.$Message.error('提交失败!');
                        })
                    } else {
                        vm.$Message.error('提交失败!');
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
                let url = vm.common.path2 + "baseSmsTemplates/"+id;
                vm.spinShow = true;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data.data;
                    vm.fnInitQuery(oData);
                    vm.spinShow = false;
                }).catch(function(err){
                    vm.spinShow = false;
                })
            },
            // 短信模板的内容遍历出来
            fnInitQuery (data) {
                let vm = this;
                vm.formValidate.smsName = data.smsName;
                vm.formValidate.smsCode = data.smsCode;
                vm.formValidate.smsType = data.smsType;
                vm.formValidate.remarks = data.remarks;
                vm.formValidate.smsTemplate = data.smsTemplate;
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

