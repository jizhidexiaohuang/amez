<template>
    <div>
        <!-- 模态框 -->
        <Modal
            v-model="modal.mineModal"
            title="增加角色"
            :loading="modal.loading"
            @on-ok="fnAsyncOK">
            <Spin fix v-if="modal.spinShow"></Spin>
            <Form class="" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
                <FormItem  label="角色名称" prop="roleName">
                    <Input v-model="formValidate.roleName" placeholder="请填写角色名称"></Input>
                </FormItem>
                <FormItem  label="角色描述" prop="roleCode">
                    <Input v-model="formValidate.roleCode" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写角色描述"></Input>
                </FormItem>
            </Form>
        </Modal>
         <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'"  class="testWrap" :roleId="roleId" :allMenus="allMenus" v-on:returnList="changePageType"/>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Form :model="cd" inline v-if="false">
                    <FormItem style="margin-bottom:10px;">
                        评价时间
                        <DatePicker v-model="cd.time" type="date" placeholder="请选择评价时间" style="width:200px;"></DatePicker>
                    </FormItem>
                </Form>
                <Row style="margin-bottom:10px;">
                    <Col span="5">
                        <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search" v-if="false">查询</Button>
		                <Button v-if="!!operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    </Col>
                    <Col span="3" offset="16" v-show="true">
                        <Button v-if="!!operators.add" style="float:right;" @click.native="fnShowMoadl(undefined)" type="success" icon="android-add">新增角色</Button>
                    </Col>
                </Row>
                <Table
                    :loading="table.loading" 
                    :data="table.tableData1" 
                    :columns="table.tableColumns" 
                    @on-select="fnSelect"
                    @on-select-all="fnSelectAll"
                ></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page 
                            :total="table.recordsTotal" 
                            :current="table.pageNun"
                            :page-size="table.pageSize"
                            show-sizer 
                            @on-change="changePage"
                            @on-page-size-change="changeSize"
                        ></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import expandRow from './table-expand.vue'
    import EditPage from './edit.vue'
    export default {
        data () {
            return {
                operators: {},
                formValidate: {
                    roleName: '',//角色名称
                    roleCode: '',//角色描述
                },
                ruleValidate: {
                    roleName: [
                        {required: true, message: '请填写角色名称', pattern: /.+/, trigger: 'change'}
                    ],
                },
                // 模态框
                modal:{
                    mineModal: false,
                    loading: true,
                    spinShow: true,//加载开关
                },
                cd:{
                },
                table:{
                    pageSize:10,//每页显示的数量
                    recordsTotal:0,//总数量
                    pageNun:1,//索引
                    loading: false,//加载状态
                    size: 10,//长度 
                    tableData1: [],//数据
                    //table头
                    tableColumns: [
                        {
                            type: 'expand',
                            width: 50,
                            render: (h, params) => {
                                return h(expandRow, {
                                    props: {
                                        row: params.row
                                    }
                                })
                            }
                        },
                        {
                            title: '角色名称',
                            key: 'roleName',
                        },
                        {   
                            title: '上次登录时间',
                            key: 'orderId',
                            render: (h,params) => {
                                let row = params.row;
                                return this.common.formatDate(row.createTime);
                            }
                        },
                        {   
                            title: '登录次数',
                            key: 'orderId',
                            render: (h,params) => {
                                return parseInt(Math.random()*100)
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 200,
                            // align: 'center',
                            // fixed: 'right',
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
                                            this.roleId = row.roleId;
                                            this.changePageType('edit');
                                        }
                                    }
                                }, '权限配置');
                                let obj2 = h('Button', {
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
                                            this.roleId = row.roleId;
                                            // this.changePageType('edit');
                                            this.fnShowMoadl(this.roleId);
                                        }
                                    }
                                }, '编辑');
                                let obj3 = h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let row = params.row;
                                            this.fnDeleteItem(row.roleId);
                                        }
                                    }
                                }, '删除');
                                if(!!this.operators.power){
                                    arrs.push(obj1);
                                }
                                if(!!this.operators.edit){
                                    arrs.push(obj2);
                                }
                                if(!!this.operators.delete){
                                    arrs.push(obj3);
                                }
                                return h('div',arrs);
                            }
                        }
                    ],
                    //卖家表头
                    sellerColumns: [
                        {
                            title: '商家名称',
                            key: 'parentBeauticianName',
                        },
                        {
                            title: '评价时间',
                            key: 'payTime',
                            render: (h,params) =>{
                                return "2017/12/16 12:16"
                                //return h('div', this.formatDate(params.time));
                            }
                        },
                        {
                            title: '订单编号',
                            key: 'orderId',
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 180,
                            // align: 'center',
                            // fixed: 'right',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                // this.test(params.index)
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }
                    ],
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',//子页面类型
                roleId:"",//角色ID
                allMenus:[],//所有菜单
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
            },
            /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.size = 10;//页数
                vm.table.pageNun = 1;//索引
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                // let url = common.path2+"orderComment/front/findByPage?pageNo="+start+"&pageSize="+size;
                let url = vm.common.path2+"baseRoles/selectListByConditions?pageNo="+start+"&pageSize="+size;
                // let url = common.path2+"system/api/baseRole/findList";
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                }
                vm.table.loading = true;
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then(function(res){
                    let oData = res.data
                    vm.table.recordsTotal = res.data.data.total;

                    vm.table.tableData1 = res.data.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
            /* 删除一条列表 */
            fnDeleteItem (id) {
                let vm = this;
                this.$Modal.confirm({
                    title: '删除角色',
                    content: '确定要删除此角色吗？',
                    onOk: function(){
                        let url = vm.common.path2+"baseRoles/"+id;
                        let ajaxData = {
                            id:id
                        }
                        this.$http.delete(
                            url,
                            JSON.stringify(ajaxData)
                        ).then(function(res){
                            let oData = res.data;
                            if(oData.code == 200){
                                setTimeout(function(){
                                    vm.$Message.success('删除成功');
                                },500)
                                vm.getData();
                            }else{
                                vm.$Message.error(oData.message);
                            }
                        }).catch(function(err){
                            vm.$Message.error(err);
                        })
                    }
                })
            },
            /* 查看详情 */
            show (index) {
                this.$Modal.info({
                    title: '老师活动详情',
                    content: `老师名称：${this.table.tableData1[index].teacherName}<br>老师类型：${this.table.tableData1[index].typeName}<br>活动类型：${this.table.tableData1[index].typeName}`
                })
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
            },
            /* 全选时的回调函数 */
            fnSelectAll (selection) {
            },
            /* 控制当前显示页面的类型 */
            changePageType (type) {
                // this.getData();
                this.pageType = type;
                if(type == "list"){
                    this.table.pageSize = this.table.size;
                    this.getData();
                }
            },
            /* 模态框的控制 */
            fnShowMoadl (id) {
                let vm = this;
                let name = 'formValidate';
                // 初始化
                vm.$refs[name].resetFields();
                // 判断是新增还是编辑
                if(!!id){
                    // 编辑
                    let url = vm.common.path2 + "baseRoles/"+id;
                    vm.$http.get(
                        url
                    ).then(function(res){
                        let oData = res.data.data;
                        // 初始化页面
                        vm.formValidate.roleName = oData.roleName;
                        vm.formValidate.roleCode = oData.roleCode;
                        vm.modal.spinShow = false;
                    }).catch(function(err){
                        vm.modal.spinShow = false;
                    })
                }else{
                    vm.roleId = id;
                }
                vm.modal.mineModal = true;
                vm.modal.spinShow = false;
            },
            /* 模态框的确认事件 */
            fnAsyncOK () {
                let vm = this;
                let name = 'formValidate';
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加角色
                        if(!!vm.roleId){
                            let url = vm.common.path2 + "/baseRoles/update";
                            let ajaxData = {
                                roleName:vm.formValidate.roleName,
                                roleCode:vm.formValidate.roleCode,
                                roleId:vm.roleId
                            }
                            vm.$http.put(
                                url,
                                JSON.stringify(ajaxData),
                                {
                                    headers:{
                                        'Content-type':'application/json;charset=UTF-8'
                                    }
                                }
                            ).then(function(res){
                                let oData = res.data
                                vm.$Message.success(oData.message);
                                vm.modal.mineModal = false;
                                vm.getData();
                            }).catch(function(err){
                                vm.$Message.success(err);
                                vm.modal.mineModal = false;
                            })
                        }else{
                            let ajaxData = {
                                roleName:vm.formValidate.roleName,
                                roleCode:vm.formValidate.roleCode
                            }
                            let url = vm.common.path2+"/baseRoles/insert";
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
                                vm.$Message.success(oData.message);
                                vm.modal.mineModal = false;
                                vm.getData();
                            }).catch(function(err){
                                vm.$Message.success(err);
                                vm.modal.mineModal = false;
                            })
                        }
                    } else {
                        this.$Message.error('提交失败!');
                        vm.modal.loading = false;
                    }
                })
            },
            /* 获取所有菜单 */
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
                }).catch(function(err){
                })
            },
            /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
            fnExistTabList () {
                let vm = this;
                if(!!vm.activatedType){
                    let arrs = [];
                    let type = vm.$store.getters.tabTrue;
                    if(!!!type){
                        /* 重新初始化页面的代码 */
                        vm.table.tableData1 = [];//为了处理进来的时候看到之前缓存的页面
                        vm.table.loading = true;//进一步模拟第一次进来时的页面效果
                        vm.pageType = 'list'//显示列表页，放在这里是给上边的处理留点时间，也就是初始化放在这段代码上边
                        
                        vm.getData('init');//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
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
            },
            /*=================== 菜单权限配置 end ===========================*/
        },
        mounted: function(){
            this.fnGetOperators();
            this.getData();
            // 获取所有菜单。之所以放在这里，是为了减少编辑页面的在同步获取数据的过程中产生的不好体验
            this.fnGetAllMenu();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            expandRow,
            EditPage
        }
    }
</script>
<style scoped>
</style>