<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" style="padding-bottom: 20px;">
            <FormItem  label="定时任务名称" prop="jobName">
                <Input v-model="formValidate.jobName" placeholder="请填写定时任务名称"></Input>
            </FormItem>
            <FormItem  label="定时任务Corn表达式" prop="cronExpression">
                <Input v-model="formValidate.cronExpression" placeholder="请填写定时任务Corn表达式"></Input>
            </FormItem>
            <FormItem label="能否并发运行" prop="isConcurrent">
                <RadioGroup v-model="formValidate.isConcurrent">
                    <Radio label="1">可以</Radio>
                    <Radio label="0">不可以</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem  label="是否启用">
                <iSwitch size="large" v-model="switch1" @on-change="changeSwitch1">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </iSwitch>
            </FormItem>
            <FormItem  label="定时任务完整类名称" prop="jobClass">
                <Input v-model="formValidate.jobClass" placeholder="请填写定时任务完整类名称"></Input>
            </FormItem>
            <FormItem  label="job唯一代码" prop="jobCode">
                <Input v-model="formValidate.jobCode" placeholder="请填写job唯一代码"></Input>
            </FormItem>
            <FormItem  label="定时任务方法名称" prop="jobMethod">
                <Input v-model="formValidate.jobMethod" placeholder="请填写定时任务方法名称"></Input>
            </FormItem>
            <FormItem label="常job状态" prop="jobState">
                <RadioGroup v-model="formValidate.jobState">
                    <Radio label="1">正常运行</Radio>
                    <Radio label="2">运行异常</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="备注" prop="description">
                <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请填写备注..."></Input>
            </FormItem>

            <FormItem>
                <Button :disabled="!!btnCode" type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                btnCode: false,
                formValidate: {
                    'jobName': '', // 定时任务名称
                    'cronExpression': '', // 定时任务Corn表达式
                    'isConcurrent': '1', // 能否并发运行
                    'jobClass': '', // 定时任务完整类名称
                    'jobCode': '', // job唯一代码
                    'jobMethod': '', // 定时任务方法名称
                    'jobState': '1', // 常job状态
                    'description': '', // 备注
                },
                ruleValidate: {
                    jobName: [
                        {required: true, message: '请填写定时任务名称', pattern: /.+/, trigger: 'change'}
                    ],
                    cronExpression: [
                        {required: true, message: '请填写定时任务Corn表达式', pattern: /.+/, trigger: 'change'}
                    ],
                    jobClass: [
                        {required: true, message: '请填写定时任务完整类名称', pattern: /.+/, trigger: 'change'}
                    ],
                    jobCode: [
                        {required: true, message: '请填写job唯一代码', pattern: /.+/, trigger: 'change'}
                    ],
                    jobMethod: [
                        {required: true, message: '请填写定时任务方法名称', pattern: /.+/, trigger: 'change'}
                    ],
                },
                switch1: false,
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加品牌服务

                        // 'jobName': '', // 定时任务名称
                        // 'cronExpression': '', // 定时任务Corn表达式
                        // 'isConcurrent': '1', // 能否并发运行
                        // 'jobClass': '', // 定时任务完整类名称
                        // 'jobCode': '', // job唯一代码
                        // 'jobMethod': '', // 定时任务方法名称
                        // 'jobState': '1', // 常job状态
                        // 'description': '', // 备注
                        let ajaxData = {
                            jobName: vm.formValidate.jobName,
                            cronExpression: vm.formValidate.cronExpression,
                            isConcurrent: vm.formValidate.isConcurrent,
                            jobClass: vm.formValidate.jobClass,
                            jobCode: vm.formValidate.jobCode,
                            jobMethod: vm.formValidate.jobMethod,
                            jobState: vm.formValidate.jobState,
                            description: vm.formValidate.description,
                            isEnable: !!!vm.switch1?0:1,//开启状态
                        }
                        let url = vm.common.path2+"scheduleJob/create";
                        vm.btnCode = true;
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
                            vm.btnCode = false;
                            vm.$Message.success('成功');
                        }).catch(function(err){
                            vm.$Message.error('提交失败!');
                            vm.btnCode = false;
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
            // 开关控制
            changeSwitch1 (status) {
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

