<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="一级菜单名称" prop="menuName">
                <Input v-model="formValidate.menuName" placeholder="请填写一级菜单名称"></Input>
            </FormItem>
            <FormItem  label="菜单logo图标" prop="menuLogo">
                <Input v-model="formValidate.menuLogo" placeholder="请填写菜单logo图标"></Input>
            </FormItem>
            <FormItem v-if="false"  label="菜单请求地址" prop="menuUrl">
                <Input v-model="formValidate.menuUrl" placeholder="请填写菜单请求地址"></Input>
            </FormItem>
            <FormItem  label="菜单排序" prop="sortNo">
                <Input v-model="formValidate.sortNo" placeholder="请填写菜单请求地址"></Input>
            </FormItem>
            <FormItem>
                <Button :disabled="!!btnCode" type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    export default {
        props: ["sendChild"],
        data () {
            return {
                btnCode: false,
                formValidate: {
                    menuName: '',
                    menuLogo: '',
                    menuUrl: '',
                    sortNo: '',
                },
                ruleValidate: {
                    menuName: [
                        {required: true, message: '请填写菜单名称', pattern: /.+/, trigger: 'change'}
                    ],
                    menuLogo: [
                        {required: true, message: '请填写菜单logo', pattern: /.+/, trigger: 'change'}
                    ],
                },
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                table:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                },
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加品牌服务
                        let ajaxData = {
                            menuName: vm.formValidate.menuName, // 菜单名称
                            menuLogo: vm.formValidate.menuLogo, // logo
                            menuUrl: vm.formValidate.menuUrl, // 地址
                            sortNo: vm.formValidate.sortNo, // 排序号
                            parentId: 0, // 父类id
                            menuId: vm.sendChild.id,
                        }
                        let url = vm.common.path2+"baseMenus/update";
                        vm.btnCode = true;
                        vm.$http.put(
                            url,
                            ajaxData,
                        ).then(function(res){
                            vm.$emit('returnList', 'list'); 
                            vm.btnCode = false;
                            vm.$Message.success('成功');
                        }).catch(function(err){
                            this.$Message.error('提交失败!');
                            vm.btnCode = false;
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
            // 获取菜单信息
            fnQueryById () {
                let vm = this;
                let id = vm.sendChild.id;
                let url = vm.common.path2 + "baseMenus/"+id;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data.data;
                    vm.fnInitQuery(oData);
                }).catch(function(err){
                })
            },
            // 菜单的信息遍历出来
            fnInitQuery (data) {
                let vm = this;
                vm.formValidate.menuName = data.menuName;
                vm.formValidate.menuLogo = data.menuLogo;
                vm.formValidate.menuUrl = data.menuUrl;
                vm.formValidate.sortNo = data.sortNo;
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

