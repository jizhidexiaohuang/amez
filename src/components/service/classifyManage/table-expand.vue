<style scoped>
    .expand-row{
    }
</style>
<template>
    <div>
        <Row class="expand-row" v-for="item in list" :key="item.id">
            <Col span="3">
                <span class="expand-key">分类名称: </span>
                <span class="expand-value">{{ item.categoryName }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">状态: </span>
                <span class="expand-value" v-if="!!item.isEnabled">开启</span>
                <span class="expand-value" v-if="!!!item.isEnabled">关闭</span>
            </Col>
            <Col span="6">
                <span class="expand-key">操作: </span>
                <Button  size="small" @click="fnDoSome(item)">编辑</Button>
                <Button  size="small" @click="fnDelete(item.id)">删除</Button>
            </Col>
        </Row>
        <Modal
            width="600"
            v-model="modal1"
            title="二级分类名称"
            @on-ok="ok"
            >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
                <FormItem  label="分类名称" prop="">
                    <Input v-model="formValidate.categoryName" placeholder="请填写分类名称"></Input>
                </FormItem>
                <FormItem label="图片地址" prop="" style="position:absolute; left:-9999px;">
                    <Input v-model="formValidate.img" placeholder=""></Input>
                </FormItem>
                <FormItem label="图标" v-if="testCode">
                    <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
                </FormItem>
                <FormItem  label="状态">
                    <iSwitch size="large" v-model="switch1" @on-change="changeSwitch1">
                        <span slot="open">ON</span>
                        <span slot="close">OFF</span>
                    </iSwitch>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    export default {
        props: {
            row: Object
        },
        data () {
            return {
                list:[],// 接口返回的数据
                modal1: false, // 控制模态框
                categoryId: '', // 分类id
                formValidate: {
                    categoryName: '',// 分类名称
                    categoryLogo:'',//图片地址
                    pid: 0,//父类id
                    id: '', // 分类id
                },
                ruleValidate: {
                },
                switch1: false,
                uploadConfig: {
                    num:1
                },
                uploadList:[],//图片列表
                defaultList: [],
                testCode: false,
            }
        },
        mounted: function(){
            this.getData();
        },
        methods: {
            /* 获取二级分类列表 */
            getData: function(){
                console.log(this.row);
                console.log('~~~~~~~~~~~~~~')
                let vm = this;
                let pid = vm.row.id;
                let start = 1;//从第几个开始
                let size = 1000;//每页条数
                let url = vm.common.path2+"productCategory/front/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    pid: pid,
                    storeId: this.row.storeId
                }
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then(function(res){
                    let oData = res.data.data
                    console.log(oData.list);
                    vm.list = oData.list;
                }).catch(function(err){
                    console.log(err);
                })
            },
            /* 删除一个子级分类 */
            fnDelete: function(id){
                let vm = this;
                let url = vm.common.path2 + "productCategory/deleteById/" + id;
                vm.$http.delete(
                    url
                ).then(function(res){
                    vm.$Message.success('删除成功');
                    vm.getData();
                }).catch(function(err){
                    vm.$Message.error(err);
                })
            },
            /* 点击编辑的回调函数 */
            fnDoSome: function(item){
                let vm = this;
                vm.formValidate.categoryName = item.categoryName; // 分类名称
                vm.formValidate.id = item.id; // 分类id
                vm.formValidate.pid = item.pid; // 父类id
                vm.switch1 = item.isEnabled; // 开关
                // 封面图以及轮播图的处理
                if(!!!item.categoryLogo){

                }else{
                    vm.formValidate.categoryLogo = item.categoryLogo;//封面图
                    vm.defaultList = [
                        {
                            'url':item.categoryLogo
                        }
                    ]
                }
                vm.testCode = true;
                vm.uploadList = vm.defaultList;
                vm.modal1 = true;
            },
            /* 模态框的确定回调函数 */
            ok () {
                let vm = this;
                let ajaxData = {
                    categoryName: vm.formValidate.categoryName, // 分类名称
                    categoryLogo: vm.uploadList.length>0?vm.uploadList[0].url:"",//封面图
                    pid: vm.formValidate.pid,// 父类id
                    id:vm.formValidate.id,
                    isEnabled: !!!vm.switch1?0:1,//开启状态
                }
                let url = vm.common.path + "productCategory/edit"
                vm.$http.put(
                    url,
                    ajaxData,
                ).then(function(res){
                    let oData = res.data
                    vm.$Message.success('成功');
                    vm.getData();
                    vm.testCode = false;
                }).catch(function(err){
                    vm.$Message.success(err);
                })
            },
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
                console.log(vm.uploadList);
            },
             // 开关控制
            changeSwitch1 (status) {
                console.log(this.switch1);
            }
        },
        components:{
            MyUpload
        }
    };
</script>
<style scoped>
.ivu-table-expanded-cell{
    padding:0px!important;
}
.expand-row{
    height:40px;
    line-height:40px; 
    border-bottom:1px dotted #ccc;
}
</style>