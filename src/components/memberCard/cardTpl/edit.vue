<template>
  <div class="testWrap">
      <div class="boxStyle editPage">
        <h3>{{parent.parentName}}</h3>
        <Form ref="formValidate" :label-width="0" style="margin-left:10px;">
            <Row>
                <Col span="24">
                    <FormItem label="图片样式" prop="brandLogo" v-if="testCode">
                        <MyUpload :uploadConfig="uploadConfig" :defaultList="defaultList" v-on:listenUpload="getUploadList"></MyUpload>
                    </FormItem>
                </Col>
            </Row>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')" style="margin-left:55px">保存</Button>
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
                testCode: false,
                defaultList:[],//默认图片
                uploadConfig:{
                    num:100
                },
                brandLogo:'',//图片途径
                imgList:[], //图片数组
            }
        },
        methods:{
            returnHome(type){
                this.$emit('returnList',type)
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let url = common.path2+'memberCardTemplate/insertByBatch';
                        console.log(url)
                        let ajaxData = {
                            id:this.parent.parentId,
                            parentGroupCount:this.imgList.length,
                            bgImgList:this.imgList
                        }
                        console.log(JSON.stringify(ajaxData))
                        this.$http.post(
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
                // vm.brandLogo = data;
                if(data.length>0){
                    this.imgList = [];
                    for(var i=0;i<data.length;i++){
                        vm.imgList.push(data[i].url)
                    }
                }
                console.log(data);
            },
            //根据id查数据
            getDataById(id){
                let vm = this;
                let url = common.path2+'memberCardTemplate/front/findByPage';
                let ajaxData = {
                    "parentGroupId": id
                }
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    let oData = res.data;
                    console.log(oData)
                    var list = oData.data.list;
                    console.log(list)
                    for(var i=0;i<list.length;i++){
                        vm.defaultList.push({
                            url:list[i].bgImgUrl
                        })
                    }
                    vm.testCode = true;
                })
            }
        },
        
        beforeMount:function(){
            this.getDataById(this.parent.parentId);
        },
        mounted: function(){
            
        },
        components:{
            MyUpload
        },
        props:['parent']
    }
</script>
<style lang="scss" scoped>
.editPage{
    h3{
        margin-bottom:10px;
        margin-left:10px;
        border-bottom:1px solid #e2e2e2;
        padding-bottom:6px;
    }
}
</style>