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
        <div class="boxStyle" style="padding-top: 0px; padding-bottom: 0px;">
            <Row>
                <Col span="6">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
                        <Tree @on-check-change="fnCheckMenuList" @on-select-change="fnDoSome" :data="treeList" show-checkbox style="margin-left:30px; margin-bottom:20px;"></Tree>
                        <FormItem style="margin-left:5px;">
                            <Button :disabled="!!btnCode" type="primary" @click="handleSubmit('formValidate')">提交</Button>
                            <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
                        </FormItem>        
                    </Form>
                </Col>
                <Col span="18" style="min-height: 200px;">
                    <Table class="editTable" :columns="columns" :data="menuList" v-if="show"></Table>
                </Col>
                <div class="example-split" v-if="false"></div>
            </Row>
        </div>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    export default {
        props:["roleId","allMenus"],
        data () {
            return {
                btnCode: false,
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
                                            this.rowIndex = row.index;
                                            this.rowCode = code;
                                            this.changeData();
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                menuList: [],
                btnType:0,// 0是新增，1是编辑
                show: false, // 控制按钮表格是否显示
                menuId: '',// 菜单id
                operId: '',// 按钮id
                spinShow1: false,// 表格的加载开关
                selectData:'',// 树节点回调函数的返回值
                rowIndex:'',
                rowCode:'',
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
                vm.btnCode = true;
                let url = vm.common.path2+"baseRoleResources/distributionBaseRoleResources?roleId="+vm.roleId+"&resourcesIds="+vm.resourcesIds;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data
                    vm.$emit('returnList', 'list'); 
                    vm.btnCode = false;
                    vm.$Message.success(oData.message);
                }).catch(function(err){
                    this.$Message.error('提交失败!');
                    vm.btnCode = false;
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
                let url = vm.common.path2 + "baseRoleResources/selectListByConditions?pageSize=999&roleId="+id;
                let ajaxData = {
                    roleId: id,
                    pageSize: 1000
                }
                vm.$http.post(
                    url,
                    ajaxData
                ).then(function(res){
                    let oData = res.data;
                    vm.spinShow = false;
                    // 该角色拥有的权限
                    vm.mineList = !!!res.data?[]:res.data.data.list;
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
            },
            // 点击树节点的回调函数
            fnDoSome (data) {
                let vm = this;
                vm.selectData = data;
                vm.spinShow1 = true;// 出现加载条
                // 0.判断是一级还是二级菜单
                /* 一级或者重复点 */
                if(data.length == 0||data[0].parentId == 0){
                    vm.menuList = [];
                    vm.spinShow1 = false;
                    vm.show = false;
                }else{
                    vm.show = true;
                    /* 二级 */
                    // 1.显示对应的按钮列表
                    vm.menuId = data[0].menuId;
                    /* let arrs = [];
                    arrs = vm.fnBaseList(data[0].title);
                    if(data[0].title == '门店审核'){
                        arrs.push({
                            name: '品牌审核',
                            age: '编辑操作',
                            code: 0,
                            index:arrs.length,
                            operCode: 'examine'
                        })
                    } */
                    // 2.判断是新增还是编辑
                    // vm.fnAddOrEdit();
                    vm.fnTest();
                    return false;



                    let url = vm.common.path2+"baseOperators/selectListByConditions?pageSize=10";
                    let ajaxData = {
                        menuId: vm.menuId,
                        roleId: vm.roleId, // 角色id
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
                            vm.spinShow1 = false;
                            vm.menuList = arrs;
                            /* 是新增 */
                            vm.btnType = 0;
                        }
                    }).catch(function(err){
                    })
                }
            },
            // 判断是新增还是编辑
            fnAddOrEdit (fnCallback) {
                let vm = this;
                let arrs = [];
                arrs = vm.fnNewList(vm.selectData[0].title);
                let url = vm.common.path2+"baseOperators/selectListByConditions?pageSize=10";
                let ajaxData = {
                    menuId: vm.selectData[0].menuId,
                    roleId: vm.roleId, // 角色id
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
                        vm.spinShow1 = false;
                        vm.menuList = arrs;
                        /* 是新增 */
                        vm.btnType = 0;
                    }
                    if(!!fnCallback){
                        fnCallback(vm);
                    }

                }).catch(function(err){
                })
            },
            fnTest (fnCallback) {
                let vm = this;
                let url = vm.common.path2 + "baseBtnMenus/selectListByConditions?pageSize=1000";
                let ajaxData = {
                    'btnIndex': vm.selectData[0].menuId
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
                    let arrs = res.data.data.list;
                    let arrs1 = [];
                    arrs.forEach(function(item,index){
                        var obj = {
                            'name': item.btnName,
                            'age': item.btnDesc,
                            'code': 0,
                            'index': index,
                            'operCode': item.operCode
                        }
                        arrs1.push(obj);
                    })
                    vm.fnShowBtnList(fnCallback,arrs1);
                }).catch((err)=>{
                })
            },
            fnShowBtnList (fnCallback,arrs1) {
                let vm = this;
                let arrs = [];
                arrs = arrs1;
                let url = vm.common.path2+"baseOperators/selectListByConditions?pageSize=10";
                let ajaxData = {
                    menuId: vm.selectData[0].menuId,
                    roleId: vm.roleId, // 角色id
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
                        vm.spinShow1 = false;
                        vm.menuList = arrs;
                        /* 是新增 */
                        vm.btnType = 0;
                    }
                    if(!!fnCallback){
                        fnCallback(vm);
                    }

                }).catch(function(err){
                })
            },
            // 切换开关的回调函数
            changeData () {
                let vm = this;
                function fnCallback (vm){
                    let operCode = [];
                    // 修改数据
                    vm.menuList[vm.rowIndex].code = !!!vm.rowCode?0:1;
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
                            roleId: vm.roleId,// 角色id
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
                        })
                    }else if(vm.btnType == 1){
                        /* 编辑 */
                        url = vm.common.path2+"baseOperators/update";
                        ajaxData = {
                            menuId: vm.menuId,
                            operCode: operCode.join(), // 操作码
                            operId: vm.operId,
                        }
                        vm.$http.put(   
                            url,
                            ajaxData
                        ).then(function(res){
                        }).catch(function(err){
                        })
                    }
                }
                // this.fnAddOrEdit(fnCallback);
                this.fnTest(fnCallback);
            },
            // 基础的表格数据
            fnBaseList (type) {
                let arrs = [];
                if(type!="店铺等级"&&type!="连锁品牌管理"){
                    arrs.push({
                        name: '新增',
                        age: '新增操作',
                        code: 0,
                        index:0,
                        operCode:'add'
                    });
                }
                arrs.push({
                    name: '编辑',
                    age: '编辑操作',
                    code: 0,
                    index:1,
                    operCode:'edit'
                });
                arrs.push({
                    name: '删除',
                    age: '删除操作',
                    code: 0,
                    index:2,
                    operCode:'delete'
                })
                if(type!="退款订单客服介入"){
                    arrs.push({
                        name: '查看',
                        age: '查看操作',
                        code: 0,
                        index:3,
                        operCode:'see'
                    })
                }
                arrs.push({
                    name: '刷新',
                    age: '刷新操作',
                    code: 0,
                    index:4,
                    operCode:'refresh'
                })
                switch(type){
                    case "品牌服务":
                        arrs.push({
                            name: '审核',
                            age: '审核操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'examine'
                        });
                        arrs.push({
                            name: '上下架',
                            age: '上下架操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'updown'
                        });
                        return arrs;
                    break;
                    case "门店自营服务":
                        arrs.push({
                            name: '上下架',
                            age: '上下架操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'updown'
                        });
                        return arrs;
                    break;
                    case "门店管理":
                        arrs.push({
                            name: '开启关闭',
                            age: '开启关闭操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'openclose'
                        });
                        arrs.push({
                            name: '冻结激活',
                            age: '冻结激活操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'frozen'
                        });
                        return arrs;
                    break;
                    case "店铺等级":
                        arrs.push({
                            name: '新增店铺等级',
                            age: '新增店铺等级操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'storeGrade'
                        });
                        arrs.push({
                            name: '成长规则设置',
                            age: '成长规则设置操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'storeRules'
                        });
                        return arrs;
                    break;
                    case "连锁品牌管理":
                        arrs.push({
                            name: '新增连锁品牌',
                            age: '新增连锁品牌操作',
                            code: 0,
                            index:arrs.length,
                            operCode:'addBrand'
                        });
                        return arrs;
                    break;
                    case "退款订单客服介入":
                        arrs.push({
                            name: '订单详情',
                            age: '订单详情查看',
                            code: 0,
                            index:arrs.length,
                            operCode:'orderInfo'
                        });
                        arrs.push({
                            name: '退款详情',
                            age: '退款详情查看',
                            code: 0,
                            index:arrs.length,
                            operCode:'backInfo'
                        });
                        return arrs;
                    break;
                    default:
                        return arrs;
                }
            }, //[0,1,3,4,7,8];
            fnNewList (type) {
                let arrs = [];
                let newArr = new Array();
                newArr[0] = {
                    name: '新增',
                    age: '新增操作',
                    code: 0,
                    index:0,
                    operCode:'add'
                };
                newArr[1] = {
                    name: '编辑',
                    age: '编辑操作',
                    code: 0,
                    index:1,
                    operCode:'edit'
                };
                newArr[2] = {
                    name: '删除',
                    age: '删除操作',
                    code: 0,
                    index:2,
                    operCode:'delete'
                };
                newArr[3] = {
                    name: '查询',
                    age: '查询操作',
                    code: 0,
                    index:3,
                    operCode:'see'
                };
                newArr[4] = {
                    name: '刷新',
                    age: '刷新操作',
                    code: 0,
                    index:4,
                    operCode:'refresh'
                };
                newArr[5] = {
                    name: '审核',
                    age: '审核操作',
                    code: 0,
                    index:5,
                    operCode:'examine'
                };
                newArr[6] = {
                    name: '上下架',
                    age: '上下架操作',
                    code: 0,
                    index:6,
                    operCode:'updown'
                };
                newArr[7] = {
                    name: '开启关闭',
                    age: '开启关闭操作',
                    code: 0,
                    index:7,
                    operCode:'openclose'
                };
                newArr[8] = {
                    name: '冻结激活',
                    age: '冻结激活操作',
                    code: 0,
                    index:8,
                    operCode:'frozen'
                };
                newArr[9] = {
                    name: '新增店铺等级',
                    age: '新增店铺等级操作',
                    code: 0,
                    index:9,
                    operCode:'storeGrade'
                };
                newArr[10] = {
                    name: '成长规则设置',
                    age: '成长规则设置操作',
                    code: 0,
                    index:10,
                    operCode:'storeRules'
                };
                newArr[11] = {
                    name: '新增连锁品牌',
                    age: '新增连锁品牌操作',
                    code: 0,
                    index:11,
                    operCode:'addBrand'
                };
                newArr[12] = {
                    name: '订单详情',
                    age: '订单详情查看',
                    code: 0,
                    index:12,
                    operCode:'orderInfo'
                };
                newArr[13] = {
                    name: '退款详情',
                    age: '退款详情查看',
                    code: 0,
                    index:13,
                    operCode:'backInfo'
                };
                newArr[14] = {
                    name: '导出',
                    age: '导出操作',
                    code: 0,
                    index:14,
                    operCode:'export'
                };
                newArr[15] = {
                    name: '分配权限',
                    age: '分配权限',
                    code: 0,
                    index:15,
                    operCode:'power'
                };
                newArr[16] = {
                    name: '管理员上下架',
                    age: '管理员可操控的上下架',
                    code: 0,
                    index:16,
                    operCode:'adminUpdown'
                };
                newArr[17] = {
                    name: '店长上下架',
                    age: '店长可操控的上下架',
                    code: 0,
                    index:16,
                    operCode:'storeUpdown'
                };
                newArr[18] = {
                    name: '添加子级',
                    age: '添加子级',
                    code: 0,
                    index:17,
                    operCode:'addChild'
                };
                newArr[19] = {
                    name: '发货',
                    age: '产品发货',
                    code: 0,
                    index:18,
                    operCode:'sendGoods'
                };
                newArr[20] = {
                    name: '查看物流',
                    age: '查看物流',
                    code: 0,
                    index:19,
                    operCode:'seeWater'
                };
                newArr[21] = {
                    name: '详情',
                    age: '查看详情',
                    code: 0,
                    index:20,
                    operCode:'seeInfo'
                };
                newArr[22] = {
                    name: '确定',
                    age: '确定操作',
                    code: 0,
                    index:21,
                    operCode:'determine'
                };
                /* 
                0.新增  1.编辑  2.删除  3.查看  4.刷新  5.审核
                6.上下架  7.开启关闭  8.冻结激活  9.新增店铺等级  
                10.成长规则设置  11.新增连锁品牌  12.订单详情  13.退款详情  
                14.导出  15.分配权限  16.管理员上下架  17.店长上下架
                18.添加子级  19.发货  20.查看物流  21.详情
                22.确定
                */
                switch (type) {
                    case "首页装修":
                        var iArrs = [22];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "门店审核":
                        var iArrs = [1,3,4];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "门店管理":
                        var iArrs = [0,1,3,4,7,8];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "店铺等级":
                        var iArrs = [9,10];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "连锁品牌管理":
                        var iArrs = [0,1,3];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "门店自营服务":
                        var iArrs = [0,1,2,3,4,5,16,17];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "品牌服务":
                        var iArrs = [0,3,4,5,1,16,2,17];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "平台自营服务":
                        var iArrs = [0,3,4,5,1,16,2,17];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "产品管理":
                        var iArrs = [0,3,4,1,2];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "运费模板":
                        var iArrs = [0,1,2,4];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "分类管理":
                        var iArrs = [0,4,1,2,18];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "服务订单":
                        var iArrs = [3,4,12,14];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "退款订单客服介入":
                        var iArrs = [3,4,12,13,14];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "评论管理":
                        var iArrs = [0,2,3,4];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "产品订单":
                        var iArrs = [3,4,21,20,19];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "员工管理":
                        var iArrs = [0,1,2,3,4];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "交易流水":
                        var iArrs = [3,4,14];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "用户管理":
                        var iArrs = [0,3,4,15,1,2];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "角色管理":
                        var iArrs = [4,0,15,1,2];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "操作日志":
                        var iArrs = [3,4];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "短信模板":
                        var iArrs = [4,0,1,2];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "菜单列表管理":
                        var iArrs = [4,0,18,1,2];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "定时任务表":
                        var iArrs = [4,0,1,2];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    case "版本管理":
                        var iArrs = [4,0,1,2];
                        return fnBackItem(iArrs,newArr,arrs);
                    break;
                    default:
                        return arrs;
                }
                /*
                0.新增  1.编辑  2.删除  3.查看  4.刷新  5.审核  6.上下架  7.开启关闭  8.冻结激活  9.新增店铺等级  10.成长规则设置  11.新增连锁品牌  12.订单详情  13.退款详情  14.导出  15.分配权限
                */
                function fnBackItem (iArrs,newArr,arrs) {
                    for(var i = 0;i<iArrs.length;i++){
                        newArr[iArrs[i]].index = i;
                        arrs.push(newArr[iArrs[i]]);
                    }
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
            vm.allList = vm.allMenus;
            // 获取角色数据
            vm.fnGetData();
        },
        components:{
            MyUpload
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
.editTable{
    margin: 5px 10px 5px 10px;
}
</style>

