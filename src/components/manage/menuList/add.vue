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
        props: ["firstMenusNum"],
        data () {
            return {
                btnCode: false,
                formValidate: {
                    menuName: '',// 分类名称
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
                            sortNo: +vm.firstMenusNum+1, // 排序号
                            parentId: 0, // 父类id
                        }
                        let url = vm.common.path2+"baseMenus/insert";
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
                            vm.$emit('returnList', 'list'); 
                            vm.$Message.success('成功');
                            vm.btnCode = false;
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
        },
        mounted: function(){
        },
        components:{
            MyUpload
        }
    }
</script>
<style scoped>
</style>

