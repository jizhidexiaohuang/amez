<template>
  <div class="testWrap">
      <div class="boxStyle editPage">
        <h2>编辑连锁品牌</h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Row>
                <Col span="8">
                    <FormItem label="品牌名称" prop="brandName">
                        <Input v-model="formValidate.brandName"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                    <FormItem label="品牌Logo" prop="brandLogo" v-if="testCode">
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
                <Button type="primary" :disabled="btnCtrl" @click="handleSubmit('formValidate')">保存</Button>
                <Button v-show="false" type="ghost" @click="handleReset('formValidate')" style="margin:0px 8px">取消</Button>
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
                testCode: false,
                defaultList:[],//默认图片
                uploadConfig:{
                    num:1
                },
                formValidate: {
                    brandName: '',
                    brandOwnershipCompany: '',
                    brandLogo:'',//图片途径
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
                        let url = common.path2+'storeChainBrand/edit';
                        let ajaxData = {
                            id:this.editId,
                            brandName:this.formValidate.brandName,
                            brandOwnershipCompany:this.formValidate.brandOwnershipCompany,
                            brandLogo:this.formValidate.brandLogo,
                        }
                        console.log(ajaxData)
                        this.btnCtrl = true;
                        this.$http.put(
                            url,
                            JSON.stringify(ajaxData),
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
                                this.btnCtrl = false;
                            }
                        }).catch(err=>{
                            this.btnCtrl = false;
                            this.$Message.error('操作失败!');
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
                console.log(data);
                if(data[0]){
                    vm.formValidate.brandLogo = data[0].response.data;
                }
            },
            //根据id查数据
            getDataById(id){
                let url = common.path2+'storeChainBrand/queryById/'+id;
                this.$http.get(url).then(res=>{
                    let data = res.data.data;
                    console.log(data)
                    this.formValidate.brandName = data.brandName;
                    this.formValidate.brandOwnershipCompany = data.brandOwnershipCompany;
                    this.defaultList.push({
                        'url':data.brandLogo
                    });
                    this.formValidate.brandLogo = data.brandLogo;
                    this.testCode = true;
                })
            }
        },
        
        beforeMount:function(){
            this.getDataById(this.editId);
        },
        mounted: function(){
            
        },
        components:{
            MyUpload
        },
        props:['editId']
    }
</script>
<style lang="scss" scoped>
.editPage{
    h2{
        margin-bottom:10px;
    }
}
</style>