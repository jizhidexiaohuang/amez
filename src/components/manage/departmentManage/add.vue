<template>
    <div>
        <div class="boxStyle" style="padding-bottom:0px; margin-bottom:5px;">
            <Alert type="error">
                操作提示
                <br/>
                该页面展示所有功能权限。
                <br/>
                打钩即是分配权限，请谨慎操作。
                <br/>
                标识“*”的选项为必填项，其余为选填项
            </Alert>  
        </div>
        <div class="boxStyle">
            <Form class="" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
                <FormItem style="width:500px;" label="角色名称" prop="roleName">
                    <Input v-model="formValidate.roleName" placeholder="请填写角色名称"></Input>
                </FormItem>
                <FormItem style="width:500px;" label="角色描述" prop="roleCode">
                    <Input v-model="formValidate.roleCode" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写角色描述"></Input>
                </FormItem>
                <Tree @on-check-change="fnCheckMenuList" :data="treeList" show-checkbox multiple style="margin-left:30px; margin-bottom:20px;"></Tree>
                <FormItem style="margin-left:5px;">
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
                </FormItem>        
            </Form>
        </div>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                formValidate: {
                    roleName: '',//角色名称
                    roleCode: '',//角色描述
                },
                ruleValidate: {
                    teacherName: [
                        { required: true, message: '老师姓名不能为空', trigger: 'blur' }
                    ],
                    activityType: [
                        { required: true, message: '请选择活动类型', trigger: 'change' }
                    ],
                    teacherType: [
                        { required: true, message: '请选择老师类型', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '请选择展示类型', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请填写服务详情', trigger: 'blur' },
                        { type: 'string', min: 20, message: '不少于20字', trigger: 'blur' }
                    ],
                    
                },
                // path:"http://172.16.20.151:8009/system/api/file/uploadForKindeditor"
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                treeList:[
                    /* {
                        title: '首页',
                        children: []
                    },
                    {
                        title: '门店管理',
                        children: [
                            {
                                title: '门店审核',
                            },
                            {
                                title: '门店管理'
                            },
                            {
                                title: '店铺等级'
                            },
                            {
                                title: '连锁品牌管理'
                            }
                        ]
                    },
                    {
                        title: '权限管理',
                        children: [
                            {
                                title: '用户管理',
                                checked: true
                            },
                            {
                                title: '角色管理'
                            },
                            {
                                title: '操作管理'
                            }
                        ]
                    } */
                ],
                allMenu:[],
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加角色
                        let ajaxData = {
                            roleName:vm.formValidate.roleName,
                            roleCode:vm.formValidate.roleCode
                        }
                        let url = vm.common.path+"system/api/baseRole/";
                        vm.$http.post(
                            url,
                            JSON.stringify(ajaxData),
                            {
                                headers:{
                                    'Content-type':'application/json;charset=UTF-8'
                                }
                            }
                        ).then(function(res){
                            let oData = res.data
                            console.log(res);
                            vm.$emit('returnList', 'list'); 
                            vm.$Message.success(oData.message);
                        }).catch(function(err){
                            console.log(err);
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
            // 获取所有菜单
            fnGetAllMenu () {
                // 返回的所有菜单
                let arrs = [
                    {
                        'id':1,
                        'name':'首页',
                        'pid':0
                    },
                    {
                        'id':2,
                        'name':'门店管理',
                        'pid':0
                    },
                    {
                        'id':3,
                        'name':'权限管理',
                        'pid':0
                    },
                    {
                        'id':4,
                        'name':'门店审核',
                        'pid':2
                    },
                    {
                        'id':5,
                        'name':'门店管理',
                        'pid':2
                    },
                    {
                        'id':6,
                        'name':'店铺等级',
                        'pid':2
                    },
                    {
                        'id':7,
                        'name':'连锁品牌管理',
                        'pid':2
                    },
                    {
                        'id':8,
                        'name':'用户管理',
                        'pid':3
                    },
                    {
                        'id':9,
                        'name':'角色管理',
                        'pid':3
                    },
                    {
                        'id':10,
                        'name':'操作管理',
                        'pid':3
                    },
                ];
                return arrs;
            },
            // 获取已经分配权限的菜单
            fnGetMineMenu () {
                /* let arrs = [
                    {
                        'id':3,
                        'name':'权限管理',
                        'pid':0
                    },
                    {
                        'id':8,
                        'name':'用户管理',
                        'pid':3
                    },
                    {
                        'id':9,
                        'name':'角色管理',
                        'pid':3
                    }
                ];
                let mineArrs = [];
                arrs.forEach(function(item,i){
                    if(item.pid!=0){
                        mineArrs.push(item);
                    }
                }) */

                return [];
            },
            // 生成最终的树
            fnGetTree () {
                let vm = this;
                let allArrs = vm.fnGetAllMenu();
                let mineArrs = vm.fnGetMineMenu();
                let firstArrs = []; // 一级菜单 
                // 已经分配的菜单非一级
                // 获取一级菜单
                allArrs.forEach(function(item,i){
                    if(item.pid == 0){
                        firstArrs.push(item);
                    }
                })
                // 生成所有的树
                let treeArrs = []; // 树的所有状态
                for(let b = 0;b<firstArrs.length;b++){
                    let _parent = {};
                    _parent.title = firstArrs[b].name;
                    _parent.id = firstArrs[b].id;
                    _parent.pid = firstArrs[b].pid;
                    let testArrs = [];
                    for(let j = 0;j<allArrs.length;j++){
                        if(allArrs[j].pid == firstArrs[b].id){
                            let obj = {};
                            obj.id = allArrs[j].id;
                            obj.title = allArrs[j].name;
                            obj.pid = allArrs[j].pid;
                            if(mineArrs.length>0){
                                for(let c = 0;c<mineArrs.length;c++){
                                    if(allArrs[j].id == mineArrs[c].id){
                                        obj.checked = true;
                                    }
                                }
                            }
                            testArrs.push(obj);
                        }
                    }
                    _parent.children = testArrs;
                    treeArrs.push(_parent);
                }
                return treeArrs;
            },
            // 获取数据
            fnCheckMenuList (data) {
            }
        },
        mounted: function(){
            this.treeList = this.fnGetTree();
        },
        components:{
            MyUpload,
        }
    }
</script>
<style scoped>
</style>

