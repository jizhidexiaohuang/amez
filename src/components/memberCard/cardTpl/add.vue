<template>
  <div class="testWrap">
      <div class="boxStyle editPage">
        <h2>新建模板组</h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Row>
                <Col span="8">
                    <FormItem label="模板组名" prop="brandName">
                        <Input v-model="formValidate.brandName"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="模板图片" prop="brandLogo">
                        <MyUpload :uploadConfig="uploadConfig" :defaultList="defaultList" v-on:listenUpload="getUploadList"></MyUpload>
                    </FormItem>
                </Col>
            </Row>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')" style="margin-right:8px">保存</Button>
                <Button type="ghost" @click.native="returnHome('list')">返回</Button>
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
                defaultList:[],//默认图片
                uploadConfig:{
                    num:1000
                },
                brandLogo:[],//图片途径
                formValidate: {
                    brandName: '',
                },
                 ruleValidate: {
                    brandName: [
                        { required: true, message: '品牌名称不能为空', trigger: 'blur' }
                    ],
                 },
            }
        },
        methods:{
            returnHome(type){
                this.$emit('returnList',type)
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let url = common.path+'storeChainBrand/insert';
                        let ajaxData = {
                            brandName:this.formValidate.brandName,
                            brandOwnershipCompany:this.formValidate.brandOwnershipCompany,
                            brandLogo:this.brandLogo,
                        }
                        console.log(ajaxData)
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
                            if(res.status==200){
                                this.$Message.success('操作成功!');
                                this.returnHome('list');
                            }
                        })
                    } else {
                        this.$Message.error('操作失败!');
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
.editPage{
    h2{
        margin-bottom:10px;
    }
}
</style>