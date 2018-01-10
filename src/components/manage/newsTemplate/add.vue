<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="短信名称" prop="">
                <Input v-model="formValidate.smsName" placeholder="请填写短信名称"></Input>
            </FormItem>
            <FormItem  label="短信编码" prop="">
                <Input v-model="formValidate.smsCode" placeholder="请填写短信编码"></Input>
            </FormItem>
            <FormItem label="短信类型" prop="">
                <RadioGroup v-model="formValidate.smsType">
                    <Radio label="0">验证码</Radio>
                    <Radio label="1">短信通知</Radio>
                    <Radio label="2">短信推广</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="备注" prop="">
                <Input v-model="formValidate.remarks" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写备注..."></Input>
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
    export default {
        data () {
            return {
                formValidate: {
                    smsName: '',// 短信名称
                    smsCode: '',// 短信编码
                    smsType: '0',// 短信类型
                    remarks: '',// 备注
                },
                ruleValidate: {
                },
                path:this.common.path1+"system/api/file/uploadForKindeditor",
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加品牌服务
                        console.log(1)
                        let ajaxData = {
                            smsName: vm.formValidate.smsName, // 短信名称
                            smsCode: vm.formValidate.smsCode, // 短信编码
                            smsType: vm.formValidate.smsType, // 短信类型
                            remarks: vm.formValidate.remarks, // 备注
                        }
                        console.log(ajaxData);
                        let url = vm.common.path2+"baseSmsTemplates/insert";
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

