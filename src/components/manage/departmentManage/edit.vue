<template>
    <div style="position:relative;">
        <Spin fix v-if="spinShow"></Spin>
        <div class="boxStyle" style="padding-bottom:0px; margin-bottom:5px;">
            <Alert type="error">
                操作提示
                <br/>
                该页面展示所有功能权限。
                <br/>
                打钩即是分配权限，请谨慎操作。
            </Alert>  
        </div>
        <div class="boxStyle">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
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
        props:["roleId","allMenus"],
        data () {
            return {
                formValidate: {
                },
                ruleValidate: {
                },
                // path:"http://172.16.20.151:8009/system/api/file/uploadForKindeditor"
                path:this.common.path21+"system/api/file/uploadForKindeditor",
                treeList:[],
                allMenu:[],
                spinShow: false,//加载开关
                allList:[],//所有权限
                mineList:[],//该角色拥有的权限
                resourcesIds:"",//权限id数组
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                // 分配权限
                let ajaxData = {
                    roleId:vm.roleId,
                    resourcesIds:vm.resourcesIds
                }
                console.log(ajaxData);
                // let url = vm.common.path2+"system/api/baseRoleResources/distributionBaseRoleResources?roleId="+vm.roleId+"&resourcesIds="+vm.resourcesIds;
                let url = vm.common.path2+"baseRoleResources/distributionBaseRoleResources?roleId="+vm.roleId+"&resourcesIds="+vm.resourcesIds;
                vm.$http.get(
                    url
                    // JSON.stringify(ajaxData),
                    // vm.qs.stringify(ajaxData),
                    // ajaxData,
                    /* {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            'Accept': 'application/json'
                        }
                    } */
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.$emit('returnList', 'list'); 
                    vm.$Message.success(oData.message);
                }).catch(function(err){
                    vm.$Message.success(err);
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
                        'menuId':1,
                        'menuName':'首页',
                        'parentId':0
                    },
                    {
                        'menuId':2,
                        'menuName':'门店管理',
                        'parentId':0
                    },
                    {
                        'menuId':3,
                        'menuName':'权限管理',
                        'parentId':0
                    },
                    {
                        'menuId':4,
                        'menuName':'门店审核',
                        'parentId':2
                    },
                    {
                        'menuId':5,
                        'menuName':'门店管理',
                        'parentId':2
                    },
                    {
                        'menuId':6,
                        'menuName':'店铺等级',
                        'parentId':2
                    },
                    {
                        'menuId':7,
                        'menuName':'连锁品牌管理',
                        'parentId':2
                    },
                    {
                        'menuId':8,
                        'menuName':'用户管理',
                        'parentId':3
                    },
                    {
                        'menuId':9,
                        'menuName':'部门管理',
                        'parentId':3
                    },
                    {
                        'menuId':10,
                        'menuName':'操作管理',
                        'parentId':3
                    },
                ];
                return arrs;
            },
            // 接口返回的已经被分配的权限
            fnGetMineMenu () {
                let arrs = [
                    {
                        'menuId':10,
                        'menuName':'权限管理',
                        'parentId':0
                    },
                    {
                        'menuId':22,
                        'menuName':'用户管理',
                        'parentId':10
                    },
                    {
                        'menuId':23,
                        'menuName':'角色管理',
                        'parentId':10
                    }
                ];
                let mineArrs = [];
                arrs.forEach(function(item,i){
                    if(item.parentId!=0){
                        mineArrs.push(item);
                    }
                })

                return mineArrs;
            },
            // 生成最终的树
            fnGetTree () {
                let vm = this;
                // let allArrs = vm.fnGetAllMenu();
                let allArrs = vm.allList;
                // let mineArrs = vm.fnGetMineMenu();
                let mineArrs = vm.mineList;
                let firstArrs = []; // 一级菜单 
                // 已经分配的菜单非一级
                // 获取一级菜单
                allArrs.forEach(function(item,i){
                    if(item.parentId == 0){
                        firstArrs.push(item);
                    }
                })
                // 生成所有的树
                let treeArrs = []; // 树的所有状态
                for(let b = 0;b<firstArrs.length;b++){
                    let _parent = {};
                    _parent.title = firstArrs[b].menuName;
                    _parent.menuId = firstArrs[b].menuId;
                    _parent.parentId = firstArrs[b].parentId;
                    let testArrs = [];
                    for(let j = 0;j<allArrs.length;j++){
                        if(allArrs[j].parentId == firstArrs[b].menuId){
                            let obj = {};
                            obj.menuId = allArrs[j].menuId;
                            obj.title = allArrs[j].menuName;
                            obj.parentId = allArrs[j].parentId;
                            for(let c = 0;c<mineArrs.length;c++){
                                if(allArrs[j].menuId == mineArrs[c].menuId){
                                    obj.checked = true;
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
            // 获取树勾选的权限数据
            fnCheckMenuList (data) {
                let vm = this;
                let arrs = [];
                data.forEach(function(item,i){
                    arrs.push(item.menuId);
                    if(item.parentId != 0&&arrs.indexOf(item.parentId) == -1){
                        arrs.push(item.parentId);
                    }
                })
                vm.resourcesIds = arrs.join();
            },
            // 获取角色数据
            fnGetData () {
                let vm = this;
                let id = vm.roleId;
                /* let url = vm.common.path2 + "system/api/baseRoleResources/"+id;
                vm.$http.get(
                    url
                ).then(function(res){
                    console.log(res);
                    let oData = res.data;
                    vm.spinShow = false;
                    // 该角色拥有的权限
                    vm.mineList = !!!res.data?[]:res.data.data.list;
                    // 生成最终的树
                    vm.treeList = vm.fnGetTree();
                }).catch(function(err){
                    vm.spinShow = false;
                }) */



                let url = vm.common.path2 + "baseRoleResources/selectListByConditions?pageSize=999&roleId="+id;
                let ajaxData = {
                    roleId: id,
                    pageSize: 1000
                }
                vm.$http.post(
                    url,
                    // vm.qs.stringify(ajaxData),
                    ajaxData
                ).then(function(res){
                    console.log(res);
                    let oData = res.data;
                    vm.spinShow = false;
                    // 该角色拥有的权限
                    vm.mineList = !!!res.data?[]:res.data.data.list;
                    console.log(vm.mineList);
                    // 设置提交时的默认值
                    if(vm.mineList.length>0){
                        let arrs = [];
                        vm.mineList.forEach(function(item,i){
                            arrs.push(item.menuId);
                        })
                        vm.resourcesIds = arrs.join();
                    }
                    // 生成最终的树
                    vm.treeList = vm.fnGetTree();
                }).catch(function(err){
                    vm.spinShow = false;
                })
            }
        },
        mounted: function(){
            let vm = this;
            vm.allList = vm.allMenus;
            console.log(vm.allList);
            // 获取角色数据
            vm.fnGetData();
        },
        components:{
            MyUpload
        }
    }
</script>
<style scoped>
</style>

