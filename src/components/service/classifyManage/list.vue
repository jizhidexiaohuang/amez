<template>
    <div>
        <!-- 模态框 -->
        <Modal
            v-model="modal.mineModal"
            title="新增一级分类"
            :loading="modal.loading"
            @on-ok="fnAsyncOK">
            <Spin fix v-if="modal.spinShow"></Spin>
            <Form class="" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
                <FormItem  label="分类名称" prop="roleName">
                    <Input v-model="formValidate.roleName" placeholder="请填写分类名称"></Input>
                </FormItem>
                <FormItem  label="图标">
                    <MyUpload :defaultList="defaultList" v-on:listenUpload="getUploadList"></MyUpload>
                </FormItem>
                <FormItem  label="状态">
                    <iSwitch size="large" v-model="switch1" @on-change="changeSwitch1">
                        <span slot="open">ON</span>
                        <span slot="close">OFF</span>
                    </iSwitch>
                </FormItem>
            </Form>
        </Modal>
         <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'"  class="testWrap" :sendChild="sendChild" v-on:returnList="changePageType"/>
        <!-- 新增 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"></AddPage>
        <!-- 新增2级 -->
        <AddPageChild v-if="pageType == 'addChild'" :twoChild="twoChild" class="testWrap" v-on:returnList="changePageType"></AddPageChild>
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
		                <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    </Col>
                    <Col span="3" offset="16" v-show="true">
                        <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">新增分类</Button>
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
    import AddPage from './add.vue'
    import AddPageChild from './addChild.vue'
    import MyUpload from '../../common/upload.vue'
    import EditChildPage from './editChild.vue'
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
                            title: '分类名称',
                            key: 'categoryName',
                        },
                        {
                            title: '商品数量',
                            key: 'categoryName',
                            render: (h,params) => {
                                return parseInt(Math.random()*100)
                            }
                        },
                        {   
                            title: '状态',
                            key: 'isEnabled',
                            render: (h,params) => {
                                const row = params.row;
                                const color = !!!row.isEnabled ? 'red' : 'blue';
                                const text = !!!row.isEnabled ? '关闭' : '开启';
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text);
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 210,
                            // align: 'center',
                            // fixed: 'right',
                            render: (h, params) => {
                                return h('div', [
                                     h('Button', {
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
                                                this.twoChild.categoryParentId = row.id;
                                                this.changePageType('addChild');
                                            }
                                        }
                                    }, '添加子分类'), 
                                    h('Button', {
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
                                                this.sendChild.id = row.id;
                                                this.changePageType('edit');
                                                // this.fnShowMoadl(this.roleId);

                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                let row = params.row;
                                                this.fnDeleteItem(row.id);
                                            }
                                        }
                                    }, '删除')
                                ]);
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
                switch1: false,// 一级分类开关
                defaultList: [],
                uploadList: [],//图片
                 /* 传递给子组件的数据 */
                sendChild:{
                    id: "", // 编辑选项的id
                },
                /* 传递给二级分类的数据 */
                twoChild:{
                    categoryParentId:"",//父类id
                    id:"",//类目id
                }
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
                let url = vm.common.path+"productCategory/front/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    categoryParentId: 0
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
                    title: '删除分类',
                    content: '确定要删除此分类吗？',
                    onOk: function(){
                        let url = vm.common.path+"productCategory/deleteById/"+id;
                        this.$http.delete(
                            url
                        ).then(function(res){
                            console.log(res);
                            let oData = res.data;
                            console.log(oData);
                            if(oData.code == 200){
                                setTimeout(function(){
                                    vm.$Message.success('删除成功');
                                },500)
                                /* // 解决删除第(10n+1)个时，页数没有往后跳一页
                                let total = vm.table.recordsTotal;
                                console.log(total);
                                if(total>10&&total%10 == 1){
                                    vm.table.pageNun = vm.table.pageNun - 1;
                                } */
                                vm.getData();
                            }else{
                                vm.$Message.error(oData.message);
                            }
                        }).catch(function(err){
                            console.log(err);
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
                console.log(id);
                let vm = this;
                let name = 'formValidate';
                console.log(1);
                // 初始化
                vm.$refs[name].resetFields();
                // 判断是新增还是编辑
                if(!!id){
                    // 编辑
                    let url = vm.common.path + "baseRoles/"+id;
                    vm.$http.get(
                        url
                    ).then(function(res){
                        let oData = res.data.data;
                        console.log(oData);
                        // 初始化页面
                        vm.formValidate.roleName = oData.roleName;
                        vm.formValidate.roleCode = oData.roleCode;
                        vm.modal.spinShow = false;
                        console.log(res);
                    }).catch(function(err){
                        console.log(err);
                        vm.modal.spinShow = false;
                    })
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
                            let url = vm.common.path + "/baseRoles/update";
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
                                console.log(res);
                                vm.$Message.success(oData.message);
                                vm.modal.mineModal = false;
                                vm.getData();
                            }).catch(function(err){
                                console.log(err);
                                vm.$Message.success(err);
                                vm.modal.mineModal = false;
                            })
                        }else{
                            let ajaxData = {
                                roleName:vm.formValidate.roleName,
                                roleCode:vm.formValidate.roleCode
                            }
                            let url = vm.common.path+"/baseRoles/insert";
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
                                vm.$Message.success(oData.message);
                                vm.modal.mineModal = false;
                                vm.getData();
                            }).catch(function(err){
                                console.log(err);
                                vm.$Message.success(err);
                                vm.modal.mineModal = false;
                            })
                        }
                    } else {
                        this.$Message.error('提交失败!');
                        vm.modal.loading = true;
                    }
                })
            },
            /* 获取所有菜单 */
            fnGetAllMenu () {
                let vm = this;
                let url = vm.common.path + "/system/api/baseMenu/findList?pageSize=1000";
                vm.$http.post(
                    url,
                ).then(function(res){
                    console.log(res);
                    vm.allMenus = res.data.data.list;
                    console.log(vm.allMenus);
                }).catch(function(err){
                    console.log(err);
                })
            },
            /* 一级菜单的变化 */
            changeSwitch1 (status) {
                this.$Message.info('开关状态：' + status);
            },
            /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
            fnExistTabList () {
                let vm = this;
                if(!!vm.activatedType){
                    let arrs = [];
                    let type = vm.$store.getters.tabTrue;
                    if(!!!type){
                        vm.table.tableData1 = [];//为了处理进来的时候看到之前缓存的页面
                        vm.table.loading = true;//进一步模拟第一次进来时的页面效果
                        vm.pageType = 'list'//显示列表页，放在这里是给上边的处理留点时间，也就是初始化放在这段代码上边
                        
                        vm.getData('init');//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
                console.log(vm.uploadList);
            },
        },
        mounted: function(){
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
            EditPage,
            MyUpload,
            AddPage,
            AddPageChild
        }
    }
</script>
<style scoped>
</style>