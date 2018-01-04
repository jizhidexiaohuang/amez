<template>
  <div class="testWrap">
      <div class="boxStyle editPage">
        <h2>新增连锁品牌</h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <Row>
                <Col span="8">
                    <FormItem label="品牌名称" prop="brandName">
                        <Input v-model="formValidate.brandName"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                    <FormItem label="品牌Logo" prop="brandLogo">
                        <MyUpload :uploadConfig="uploadConfig" :defaultList="defaultList" v-on:listenUpload="getUploadList"></MyUpload>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                    <FormItem label="品牌所属公司" prop="brandOwnershipCompany">
                        <Input v-model="formValidate.brandOwnershipCompany"></Input>
                    </FormItem>
                </Col>
            </Row>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin:0px 8px">取消</Button>
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
                defaultList:[],//默认图片
                uploadConfig:{
                    num:1
                },
                brandLogo:[],//图片途径
                formValidate: {
                    brandName: '',
                    brandOwnershipCompany: '',
                },
                 ruleValidate: {
                    brandName: [
                        { required: true, message: '品牌名称不能为空', trigger: 'blur' }
                    ],
                    brandOwnershipCompany: [
                        { required: true, message: '品牌所属公司不能为空', trigger: 'blur' }
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
                vm.brandLogo = data[0].response.data;
                console.log(data[0].response.data);
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