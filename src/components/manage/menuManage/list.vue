<template>
    <div style="position:relative;">
        <div class="boxStyle" style="padding-bottom:0px; margin-bottom:5px;">
            <Alert type="error">
                操作提示
                <br/>
                点击树形菜单可展开功能区域
                <br/>
            </Alert>  
        </div>
        <div class="boxStyle" style="padding-top: 0px; padding-bottom: 0px;">
            <Row>
                <Col span="6">
                    <Form :label-width="90">
                        <Tree :data="treeList" @on-select-change="fnDoSome"  style="margin-left:30px; margin-bottom:20px;"></Tree>
                    </Form>
                </Col>
                <Col span="18" style="min-height: 200px;" v-if="show">
                    <div v-if="!!operators.add" style="overflow:hidden; padding: 10px 10px 10px 10px;">
                        <Button type="primary" @click="handleSubmit('add')" style="float:right;">新增按钮</Button>
                    </div>
                    <div style="position: relative;">
                        <Spin fix v-if="spinShow"></Spin>
                        <Table border class="editTable" :columns="columns" :data="menuList"></Table>
                    </div>
                </Col>
            </Row>
            
        </div>
        <!-- 模态框 -->
        <Modal
            v-model="modal.mineModal"
            title="增加按钮"
            :loading="modal.loading"
            @on-ok="fnAsyncOK">
            <Form class="" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
                <FormItem  label="按钮名称" prop="btnName">
                    <Input v-model="formValidate.btnName" placeholder="请填写按钮名称"></Input>
                </FormItem>
                <FormItem  label="按钮编码" prop="operCode">
                    <Input v-model="formValidate.operCode" placeholder="请填写按钮编码"></Input>
                </FormItem>
                <FormItem  label="功能描述" prop="btnDesc">
                    <Input v-model="formValidate.btnDesc" placeholder="请填写功能描述"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                operators: {},
                treeList:[],
                spinShow: false,//加载开关
                allList:[],//所有权限
                mineList:[],//该角色拥有的权限
                allMenus: [],//所有菜单
                columns:[
                    {
                        title: '按钮名称',
                        key: 'btnName',
                        width: 200,
                    },
                    {
                        title: '按钮编码',
                        key: 'operCode',
                        width: 200,
                    },
                    {
                        title: '描述',
                        key: 'btnDesc'
                    },
                    {
                        title: '操作',
                        key: '',
                        width: 130,
                        render: (h, params) => {
                            let arrs = [];
                            let obj1 = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        let row = params.row;
                                        this.btnId = row.id;
                                        this.handleSubmit('edit');
                                    }
                                }
                            }, '编辑');
                            if(!!this.operators.edit){
                                arrs.push(obj1);
                            }
                            let obj2 = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        let row = params.row;
                                        this.delete(row.id);
                                    }
                                }
                            }, '删除');
                            if(!!this.operators.delete){
                                arrs.push(obj2);
                            }
                            return h('div', arrs);
                        }
                    }
                ],
                menuList: [],
                menuId: '',// 菜单id
                show: false, // 控制按钮表格是否显示
                // 模态框
                modal:{
                    mineModal: false,
                    loading: true,
                },
                formValidate: {
                    btnName: '',
                    operCode: '',
                    btnDesc: '',
                    btnCode: 0,
                    btnIndex: '',
                },
                ruleValidate: {
                },
                btnId: '', // 按钮id
                modalType: '', // 模态框类型
            }
        },
        methods: {
            // 提交
            handleSubmit (type) {
                let vm = this;
                vm.modalType = type;
                let url = vm.common.path2 + "baseBtnMenus/"+vm.btnId;
                if(type == 'add'){
                    vm.formValidate.btnName = '';
                    vm.formValidate.operCode = '';
                    vm.formValidate.btnDesc = '';
                }else{
                    vm.$http.get(
                        url
                    ).then(function(res){
                        let oData = res.data.data;
                        vm.formValidate.btnName = oData.btnName;
                        vm.formValidate.operCode = oData.operCode;
                        vm.formValidate.btnDesc = oData.btnDesc;
                    }).catch(function(err){
                    })
                }
                vm.modal.mineModal = true;
            },
            // 生成最终的树
            fnGetTree () {
                let vm = this;
                let allArrs = vm.allList;
                let mineArrs = vm.mineList;
                let firstArrs = []; // 一级菜单 
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
            // 获取所有节点数据
            fnGetAllMenu () {
                let vm = this;
                let url = vm.common.path2 + "/baseMenus/selectListByConditions?pageSize=999";
                vm.$http.post(
                    url,
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then(function(res){
                    vm.allMenus = res.data.data.list;
                    vm.allList = vm.allMenus;
                    vm.treeList = vm.fnGetTree();
                }).catch(function(err){
                })
            },
            // 点击树节点的回调函数
            fnDoSome (data) {
                let vm = this;
                vm.spinShow = true;// 出现加载条
                if(data.length == 0||data[0].parentId == 0){
                    vm.menuList = [];
                    vm.spinShow = false;
                    vm.show = false;
                }else{
                    vm.menuId = data[0].menuId;
                    vm.fnBaseList();
                }
            },
            // 基础的表格数据
            fnBaseList () {
                let vm = this;
                let url = vm.common.path2 + "baseBtnMenus/selectListByConditions?pageSize=1000";
                let ajaxData = {
                    'btnIndex': vm.menuId
                }
                vm.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then((res)=>{
                    vm.spinShow = false;
                    let oData= res.data.data.list;
                    vm.menuList = oData;
                    vm.show = true;

                }).catch((err)=>{
                })
            }, 
            // 模态框的回调函数
            fnAsyncOK () {
                let vm = this;
                if(vm.modalType == 'add'){
                    let url = vm.common.path2 + "baseBtnMenus/insert";
                    let ajaxData = {
                        'btnName': vm.formValidate.btnName,
                        'operCode': vm.formValidate.operCode,
                        'btnDesc': vm.formValidate.btnDesc,
                        'btnCode': 0,
                        'btnIndex': vm.menuId
                    }
                    vm.$http.post(
                        url,
                        JSON.stringify(ajaxData),
                        {
                            headers:{
                                'Content-type':'application/json;charset=UTF-8'
                            }
                        }
                    ).then(function(res){
                        vm.$Message.success(res.data.message);
                        vm.fnBaseList();
                        vm.modal.mineModal = false;
                    }).catch(function(err){
                        vm.$Message.success(err);
                    })
                }else if('edit'){
                    let url = vm.common.path2 + 'baseBtnMenus/update';
                    let ajaxData = {
                        'btnName': vm.formValidate.btnName,
                        'operCode': vm.formValidate.operCode,
                        'btnDesc': vm.formValidate.btnDesc,
                        'btnCode': 0,
                        'btnIndex': vm.menuId,
                        'id': vm.btnId
                    }
                    vm.$http.put(
                        url,
                        ajaxData,
                    ).then(function(res){
                        let oData = res.data
                        vm.$Message.success(oData.message);
                        vm.fnBaseList();
                        vm.modal.mineModal = false;
                    }).catch(function(err){
                        vm.$Message.success(err);
                    })
                }
            },
            // 删除按钮
            delete (id) {
                let vm = this;
                this.$Modal.confirm({
                    title: '删除按钮',
                    content: '确定要删除此按钮吗？',
                    onOk: function(){
                        let url = vm.common.path2+"baseBtnMenus/"+id;
                        this.$http.delete(
                            url
                        ).then(function(res){
                            let oData = res.data;
                            if(oData.code == 200){
                                vm.$Message.success(oData.message);
                                vm.fnBaseList();
                            }else{
                                vm.$Message.error(oData.message);
                            }
                        }).catch(function(err){
                            vm.$Message.error(err);
                        })
                    }
                })
            },
            /*===================== 菜单权限配置 start ====================*/
            /* 获取该菜单拥有的权限 */
            fnGetOperators () {
                let vm = this;
                function fnGetDatas (id,vm) {
                    let list = [];
                    let menuArrs = []; // 相同menuId的数组
                    let strArrs = []; // 权限数组 ["add","edit"]
                    /* 菜单对应的权限组 */
                    if(!!JSON.parse(window.localStorage.getItem("userInfo")).operator.list){
                        list = JSON.parse(window.localStorage.getItem("userInfo")).operator.list;
                    }
                    /* 每个用户有可能被分配了多个角色，所以需要合并相同menuId的权限组 */
                    for(var c = 0;c<list.length;c++){
                        if(list[c].menuId == id){
                            menuArrs.push(list[c]);
                        }
                    }

                    for(var j = 0;j<menuArrs.length;j++){
                        if(!!menuArrs[j].operCode){
                            vm.fnChangeOperators(menuArrs[j].operCode.split(","));
                        }
                    }
                }
                /* 得到所有的菜单 */
                let arrs = JSON.parse(window.localStorage.getItem("userInfo")).menu;
                for(var i = 0;i<arrs.length;i++){
                    if(!!arrs[i].hasChildList){
                        for(var j = 0;j<arrs[i].childList.length;j++){
                            if(arrs[i].childList[j].href == this.$route.path){
                                fnGetDatas(arrs[i].childList[j].menuId,vm)
                            }
                        }
                    }else{
                        if(arrs[i].href == this.$route.path){
                            fnGetDatas(arrs[i].menuId,vm)
                        }
                    }
                }
            },
            /* 权限的遍历 */
            fnChangeOperators (arrs) {
                // operators{}是开关对象
                let vm = this;
                arrs.forEach(function(item,index){
                    vm.operators[item] = true;
                })
            }
            /*=================== 菜单权限配置 end ===========================*/
        },
        mounted: function(){
            let vm = this;
            vm.fnGetOperators();
            vm.fnGetAllMenu();
        },
    }
</script>
<style scoped>
.ivu-form-item{
    margin-bottom: 10px;
}
.editTable{
    margin: 5px 10px 5px 10px;
}
</style>

