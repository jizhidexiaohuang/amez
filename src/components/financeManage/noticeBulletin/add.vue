<template>
  <div class="testWrap">
      <div class="boxStyle">
        <h3>新建通知公告</h3>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <FormItem label="客户端" prop="client">
                <RadioGroup v-model="formValidate.client">
                    <Radio label="0">美容邦用户端</Radio>
                    <Radio label="1">美容邦门店端</Radio>
                    <Radio label="2">美容邦邦女郎端</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem v-if="false" label="品牌Logo" prop="brandLogo">
                <MyUpload :uploadConfig="uploadConfig" :defaultList="defaultList" v-on:listenUpload="getUploadList"></MyUpload>
            </FormItem>
            <FormItem label="公告内容" prop="bulletinContent">
                <Col span="7">
                    <Input v-model="formValidate.bulletinContent" type="textarea" :autosize="{minRows: 6,maxRows: 8}" placeholder="输入该卡的介绍，使用须知等"></Input>
                </Col>
            </FormItem>
            <FormItem label="公告时间" prop="announcementTime">
                <DatePicker v-model="formValidate.announcementTime" format="yyyy/MM/dd" type="daterange" placement="top-start" placeholder="请选择日期" style="width:280px;"></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" :disabled="btnCtrl" @click="handleSubmit('formValidate')" style="margin:0px 8px">保存</Button>
                <Button v-if="false" type="ghost" @click="handleReset('formValidate')" style="margin:0px 8px">取消</Button>
                <Button type="success" @click.native="returnHome('list')">返回</Button>
            </FormItem>
        </Form>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                btnCtrl:false,
                defaultList:[],//默认图片
                uploadConfig:{
                    num:1
                },
                brandLogo:[],//图片途径
                formValidate: {
                    client: '0', //客户端
                    bulletinContent: '', //公告内容
                    announcementTime:'' //公告时间
                },
                 ruleValidate: {
                    
                 },
            }
        },
        methods:{
            returnHome(type){
                this.$emit('returnList',type)
            },
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let url = common.path2+'notificationNotices/insert';
                        let ajaxData = {
                            usedType:this.formValidate.client,
                            noticeContent:this.formValidate.bulletinContent,
                            noticeStartTime:common.simpleFormatDate(this.formValidate.announcementTime[0],3),
                            noticeEndTime:common.simpleFormatDate(this.formValidate.announcementTime[1],3)
                        }
                        console.log(ajaxData)
                        this.btnCtrl = true;
                        this.$http.post(
                            url,
                            ajaxData,
                            {
                                headers:{
                                    'Content-type':'application/json;charset=UTF-8'
                                }
                            }
                        ).then(res=>{
                            console.log(res)
                            if(res.data.code==200){
                                this.$Message.success('操作成功!');
                                this.returnHome('list');
                                vm.btnCtrl = false;
                            }
                        }).catch(err=>{
                            console.log(err)
                            this.$Message.error('操作失败!');
                            vm.btnCtrl = false;
                        })
                    } else {
                        this.$Message.error('数据不完整!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            getUploadList(data){
                let vm = this;
                console.log(data)
                if(data[0]){
                    vm.brandLogo = data[0].response.data;
                }
            }
        },
        components:{
            MyUpload
        }
    }
</script>
<style lang="scss" scoped>
    h3{
        margin-bottom:10px;
        margin-left:10px;
        border-bottom:1px solid #eee;
        padding-bottom:6px;
    }
</style>