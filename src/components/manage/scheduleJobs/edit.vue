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
        props: ["sendChild"],
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加短信模板
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
                            id:vm.sendChild.id,
                        }
                        let url = vm.common.path2 + "scheduleJob/edit"
                        vm.$http.post(
                            url,
                            ajaxData,
                        ).then(function(res){
                            let oData = res.data
                            vm.$emit('returnList', 'list'); 
                            vm.$Message.success(res.data.message);
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
                let url = vm.common.path2 + "scheduleJob/"+id;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data.data;
                    vm.fnInitQuery(oData);
                }).catch(function(err){
                })
            },
            // 短信模板的内容遍历出来
            fnInitQuery (data) {
                let vm = this;
                vm.formValidate.jobName = data.jobName;
                vm.formValidate.cronExpression = data.cronExpression;
                vm.formValidate.isConcurrent = data.isConcurrent;
                vm.formValidate.jobClass = data.jobClass;
                vm.formValidate.jobCode = data.jobCode;
                vm.formValidate.jobMethod = data.jobMethod;
                vm.formValidate.jobState = data.jobState;
                vm.formValidate.description = data.description;
                vm.switch1 = data.isEnable == 1?true:false;
            },
            // 开关控制
            changeSwitch1 (status) {
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

