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
                <Col span="12">
                    <Form :label-width="90">
                        <Tree :data="treeList" @on-select-change="fnDoSome"  style="margin-left:30px; margin-bottom:20px;"></Tree>
                        <FormItem style="margin-left:5px;" v-if="false">
                            <Button type="primary" @click="handleSubmit()">提交</Button>
                        </FormItem>        
                    </Form>
                </Col>
                <Col span="12" style="min-height: 200px;">
                    <Spin fix v-if="spinShow"></Spin>
                    <Table class="editTable" :columns="columns" :data="menuList" v-if="show"></Table>
                    <!--
                    <Form style="padding-left: 10px;">
                        <FormItem label="编辑">
                            <i-switch v-model="formItem.edit" size="large">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem>
                        <FormItem label="新增">
                            <i-switch v-model="formItem.add" size="large">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem>
                        <FormItem label="导出">
                            <i-switch v-model="formItem.daochu" size="large">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem>
                    </Form>
                    -->
                </Col>
                <div class="example-split"></div>
            </Row>
            
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                treeList:[],
                allMenu:[],
                spinShow: false,//加载开关
                allList:[],//所有权限
                mineList:[],//该角色拥有的权限
                resourcesIds:"",//权限id数组
                allMenus: [],//所有菜单
                formItem:{
                    edit: false, // 编辑
                    daochu: false, // 导出
                    add: false, // 新增
                },
                columns:[
                    {
                        title: '按钮名称',
                        key: 'name'
                    },
                    {
                        title: '描述',
                        key: 'age'
                    },
                    {
                        title: '操作',
                        key: 'address',
                        width: 180,
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    props: {
                                        type: 'primary',
                                        value: params.row.code === 1
                                    },
                                    on: {
                                        'on-change': (code) => {
                                            const row = params.row;
                                            this.changeData(row.index,code);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                menuList: [],
                btnType:0,// 0是新增，1是编辑
                menuId: '',// 菜单id
                operId: '',// 按钮id
                show: false, // 控制按钮表格是否显示
            }
        },
        methods: {
            // 提交
            handleSubmit () {
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
                // 0.判断是一级还是二级菜单
                /* 一级或者重复点 */
                if(data.length == 0||data[0].parentId == 0){
                    vm.menuList = [];
                    vm.spinShow = false;
                    vm.show = false;
                }else{
                    vm.show = true;
                    console.log(data);
                    /* 二级 */
                    // 1.显示对应的按钮列表
                    let arrs = [];
                    vm.menuId = data[0].menuId;
                    arrs = vm.fnBaseList(data[0].title);
                    /* arrs.push({
                        name: '新增',
                        age: '新增操作',
                        code: 0,
                        index:0,
                        operCode:'add'
                    });
                    arrs.push({
                        name: '编辑',
                        age: '编辑操作',
                        code: 0,
                        index:1,
                        operCode:'edit'
                    }); */
                    if(data[0].title == '门店审核'){
                        arrs.push({
                            name: '品牌审核',
                            age: '编辑操作',
                            code: 0,
                            index:arrs.length,
                            operCode: 'examine'
                        })
                    }
                    // 2.判断是新增还是编辑
                    let url = vm.common.path2+"baseOperators/selectListByConditions?pageSize=10";
                    let ajaxData = {
                        menuId: data[0].menuId
                        // menuId: 1
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
                        if(oData.list.length>0){
                            /* 是编辑 */
                            vm.btnType = 1;
                            vm.operId = oData.list[0].operId;
                            if(oData.list[0].operCode!=null){
                                let operCodeList = oData.list[0].operCode.split(",");
                                if(operCodeList.length>0){
                                    vm.changeTableList(operCodeList,arrs);
                                }
                            }
                        }else{
                            vm.spinShow = false;
                            vm.menuList = arrs;
                            /* 是新增 */
                            vm.btnType = 0;
                        }
                    }).catch(function(err){
                    })
                    // 3. 如果是编辑，则要改变已存在的按钮列表操作
                }
            },
            // 切换开关的回调函数
            changeData (index,code) {
                let vm = this;
                let operCode = [];
                // 修改数据
                vm.menuList[index].code = !!!code?0:1;
                vm.menuList.forEach(function(item,index){
                    if(item.code == 1){
                        operCode.push(item.operCode);
                    }
                })
                // 判断是新增还是编辑
                let url = "";
                let ajaxData = {};
                if(vm.btnType == 0){
                    /* 新增 */
                    url = vm.common.path2+"baseOperators/insert";
                    ajaxData = {
                        menuId: vm.menuId,
                        operCode: operCode.join(), // 操作码
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
                        console.log(res);
                        vm.btnType = 1;

                        // 获取按钮id
                        let url1 = vm.common.path2+"baseOperators/selectListByConditions?pageSize=10";
                        let ajaxData1 = {
                            menuId: vm.menuId
                        }
                        vm.$http.post(
                            url1,
                            JSON.stringify(ajaxData1),
                            {
                                headers:{
                                    'Content-type':'application/json;charset=UTF-8'
                                }
                            }
                        ).then(function(res){
                            let oData = res.data.data;
                            vm.operId = oData.list[0].operId;
                        })

                    }).catch(function(err){
                        console.log(err);
                    })
                }else if(vm.btnType == 1){
                    /* 编辑 */
                    url = vm.common.path2+"baseOperators/update";
                    ajaxData = {
                        menuId: vm.menuId,
                        operCode: operCode.join(), // 操作码
                        operId: vm.operId
                    }
                    vm.$http.put(   
                        url,
                        ajaxData
                    ).then(function(res){
                        console.log(res);
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                // 接口
            },
            // 基础的表格数据
            fnBaseList (type) {
                let arrs = [];
                arrs.push({
                    name: '新增',
                    age: '新增操作',
                    code: 0,
                    index:0,
                    operCode:'add'
                });
                arrs.push({
                    name: '编辑',
                    age: '编辑操作',
                    code: 0,
                    index:1,
                    operCode:'edit'
                });
                switch(type){
                    case "品牌服务":
                        arrs.push({
                            name: '审核',
                            age: '深恶黑操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'examine'
                        });
                        return arrs;
                    break;
                    default:
                        return arrs;
                }
            }, 
            /* 如果是编辑，则去修改table */
            changeTableList (list,oldArrs) {
                let vm = this;
                for(let i = 0;i<oldArrs.length;i++){
                    for(var j = 0;j<list.length;j++){
                        if(oldArrs[i].operCode == list[j]){
                            oldArrs[i].code= 1 ;
                        }
                    }
                }
                vm.menuList = oldArrs;
                vm.spinShow = false;
            }
        },
        mounted: function(){
            let vm = this;
            vm.fnGetAllMenu();
        },
        components:{
        }
    }
</script>
<style scoped>
.example-split{
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    border: 1px dashed #eee;
}
.ivu-form-item{
    margin-bottom: 10px;
}
.editTable{
    margin: 5px 10px 5px 10px;
}
</style>

