<style scoped>
    .expand-row{
    }
</style>
<template>
    <div>
        <Row class="expand-row" v-for="item in list" :key="item.id">
            <Col span="7">
                <span style="padding-left: 20px;" class="expand-value">{{ item.menuName }}</span>
            </Col>
            <Col span="7">
                <span style="padding-left: 20px;" class="expand-value">{{ item.menuUrl }}</span>
            </Col>
            <Col span="6">
                <Button  size="small" @click="fnDoSome(item)">编辑</Button>
                <Button  size="small" @click="fnDelete(item.menuId)">删除</Button>
            </Col>
        </Row>
        <Modal
            width="600"
            v-model="modal1"
            title="二级菜单名称"
            @on-ok="ok"
            >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
                <FormItem  label="二级菜单名称" prop="menuName">
                    <Input v-model="formValidate.menuName" placeholder="请填写二级菜单名称"></Input>
                </FormItem>
                <FormItem  label="菜单logo图标" prop="menuLogo">
                    <Input v-model="formValidate.menuLogo" placeholder="请填写菜单logo图标"></Input>
                </FormItem>
                <FormItem label="菜单请求地址" prop="menuUrl">
                    <Input v-model="formValidate.menuUrl" placeholder="请填写菜单请求地址"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
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
                    menuName: '',
                    menuLogo: '',
                    menuUrl: '',
                    menuId: '',
                    parentId: '',
                },
                ruleValidate: {
                },
                uploadConfig: {
                    num:1
                },
                defaultList: [],
            }
        },
        mounted: function(){
            this.getData();
        },
        methods: {
            /* 获取二级分类列表 */
            getData: function(){
                let vm = this;
                let parentId = vm.row.menuId;
                let start = 1;//从第几个开始
                let size = 1000;//每页条数
                let url = vm.common.path2+"baseMenus/selectListByConditions?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    parentId: parentId,
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
                    vm.list = oData.list;
                }).catch(function(err){
                })
            },
            /* 删除一个子级分类 */
            fnDelete: function(id){
                let vm = this;
                let url = vm.common.path2 + "baseMenus/" + id;
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
                vm.formValidate.menuName = item.menuName; 
                vm.formValidate.menuLogo = item.menuLogo; 
                vm.formValidate.menuUrl = item.menuUrl; 
                vm.formValidate.menuId = item.menuId; 
                vm.formValidate.parentId = item.parentId; 
                vm.modal1 = true;
            },
            /* 模态框的确定回调函数 */
            ok () {
                let vm = this;
                let ajaxData = {
                    menuName: vm.formValidate.menuName,
                    menuLogo: vm.formValidate.menuLogo, 
                    menuUrl: vm.formValidate.menuUrl, 
                    menuId: vm.formValidate.menuId,
                    parentId: vm.formValidate.parentId,
                }
                let url = vm.common.path + "baseMenus/update"
                vm.$http.put(
                    url,
                    ajaxData,
                ).then(function(res){
                    let oData = res.data
                    vm.$Message.success('成功');
                    vm.getData();
                }).catch(function(err){
                    vm.$Message.success(err);
                })
            },
        },
        components:{
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