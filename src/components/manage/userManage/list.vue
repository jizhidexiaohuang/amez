<template>
    <div>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'" class="testWrap" v-on:returnList="fnBackformAdd"/>
        <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'"  :message="editId" class="testWrap" v-on:returnList="fnBackformAdd"></EditPage>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
            <Row style="margin-bottom:10px;" v-show="false">
                <Col span="5">
                    <ButtonGroup>
                        <Button @click.native="changePageType('list')" type="primary" size="small" icon="ios-search">新增</Button>
                        <Button @click.native="refreshTable" type="warning" size="small" icon="refresh">刷新</Button>
                        <Button type="error" size="small" icon="android-delete">删除</Button>
                    </ButtonGroup>
                </Col>
                <Col span="3" offset="16">
                    <Input size="small" placeholder="please write text" icon="ios-search"></Input>
                </Col>
            </Row>
            <Form :model="cd" inline>
                <FormItem style="margin-bottom:10px;">
                    账号状态
                    <Select v-model="cd.accountStatus" style="width:100px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;" v-show="false">
                    开店时间
                    <DatePicker v-model="cd.time" type="date" placeholder="请选择评价时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;" v-show="false">
                    <Input v-model="value">
                    <Select v-model="selectType" slot="prepend" style="width: 80px">
                        <Option value="门店名称">门店名称</Option>
                        <Option value="注册手机">注册手机</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:300px;">
                    <Row>
                        <Col span="5">账号名称</Col>
                        <Col span="16">
                            <Input v-model="cd.accountName" placeholder="账号名称"></Input>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <Row style="margin-bottom:10px;">
                <Col span="5">
                    <Button v-if="operators.see" style="margin-left:5px;" @click.native="getData('see')" type="primary" icon="ios-search">查询</Button>
                    <Button v-if="operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                </Col>
                <Col span="3" offset="16">
                    <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">新增用户</Button>
                </Col>
            </Row>
            <Table
                :loading="table.loading" 
                :data="table.tableData1" 
                :columns="tableColumns1" 
                stripe
                @on-select="fnSelect"
                @on-select-all="fnSelectAll"
            ></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page 
                        :total="table.recordsTotal" 
                        :current="table.pageNun"
                        show-sizer 
                        @on-change="changePage"
                        @on-page-size-change="changeSize"
                    ></Page>
                </div>
            </div>
            </div>
        </div>
        <!--模态框-->
        <Modal
            v-model="modal"
            title="分配权限"
            @on-ok="ok"
            @on-cancel="cancel">
            <div v-if="modal">
                <Transfer
                    :data="data1"
                    :titles="titles"
                    :target-keys="targetKeys1"
                    :render-format="render1"
                    @on-change="handleChange1">
                </Transfer>
            </div>
            
        </Modal>
    </div>
</template>
<script>
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                operators:{},
                modal:false,//控制模态框
                data1: [], //穿梭框数据
                userId:0, //用户id
                targetKeys1: [],//目标列表
                roleIds:'',//分配的权限的字符串
                editId:'',//传到子组件的值
                value:'',
                selectType:'门店名称',
                statusList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'0',
                        label:'启用'
                    },{
                        value:'1',
                        label:'关闭'
                    },
                ],
                cd:{
                    time:'',//评论时间范围
                    operType:"1",//评论类型、不用重置
                    accountName:'',//账号名称
                    accountStatus:'', //账号状态
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
                tableColumns1: [
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '账号名称',
                        key: 'loginName',
                    },
                    {   
                        title: '用户组',
                        key: 'userType'
                    },
                    {
                        title: '账号状态',
                        key: 'isDisabled',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.isDisabled=='0'){
                                str = '开启'
                            }else{
                                str = '关闭'
                            }
                            return str;
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 260,
                        render: (h, params) => {
                            let arr = [];
                            let powerButton = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        // this.targetKeys1 = []
                                        this.userId = params.row.userId;
                                        this.relation(params.row.userId)
                                    }
                                }
                            }, '分配权限');
                            let editButton = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.editId = params.row.userId;
                                        this.changePageType('edit');
                                    }
                                }
                            }, '编辑');
                            let deleteButton = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.removeUser(params.row.userId)
                                    }
                                }
                            }, '删除');
                            if(this.operators.power){
                                arr.push(powerButton)
                            }
                            if(this.operators.edit){
                                arr.push(editButton)
                            }
                            if(this.operators.delete){
                                arr.push(deleteButton)
                            }
                            return h('div', arr);
                        }
                    }
                ],
                table:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                },
                titles:['分配角色','已分配角色'] //穿梭框的标题
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                if(!!init&&init=='see'){
                    start = 1;
                }
                let url = common.path2+"baseUsers/selectListByConditions?pageNo="+start+'&pageSize='+size;
                vm.table.loading = true;
                let ajaxData = {
                    pageNo:start,
                    pageSize:size
                }
                if(vm.cd.accountStatus){
                    ajaxData.isDisabled = vm.cd.accountStatus //状态
                }
                if(vm.cd.accountName){
                    ajaxData.loginName = vm.cd.accountName //开店时间
                }
                console.log(ajaxData)
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = res.data.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            }, 
            /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.accountName = '';//       
                vm.cd.accountStatus = '';//
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
                console.log(row);
                console.log(selection);
            },
            /* 全选时的回调函数 */
            fnSelectAll (selection) {
                console.log(selection);
            },
            fnBackformAdd (type) {
                let vm = this;
                vm.changePageType(type);
                vm.getData();
            },
            changePageType (type) {
                this.pageType = type;
            },
            /* 刷新 */
            refreshTable () {
                var vm = this;
                vm.table.pageNun = 1;
                vm.table.size = 10;
                vm.getData();
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
                        vm.getData();//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
            //删除按钮
            removeUser(id){
                // console.log(params)
                let vm = this
                this.$Modal.confirm({
                    title:'删除',
                    content:'删除后将不能恢复，确认删除这项吗？',
                    onOk(){
                        let url = common.path2+'baseUsers/'+id;
                        this.$http.delete(url).then(res=>{
                            if(res.status==200){
                                this.$Message.success('删除成功！')
                                vm.getData()
                            }
                        })
                    }
                });
            },
            //获取关联信息
            relation(id){
                let vm = this;
                 vm.table.loading = true;
                let url = common.path2+'baseUserRoles/findBaseUserRoles/'+id;
                this.$http.get(
                    url
                ).then(res=>{
                    let data = res.data.data
                    let leftArr = []
                    let rightArr = []
                    let rightKey = []
                    for(var i=0;i<data.all.length;i++){
                        leftArr.push({
                            label:data.all[i].roleName,
                            key:data.all[i].roleId.toString()
                        })
                    }
                    for(var i=0;i<data.used.length;i++){
                        rightArr.push({
                            label:data.used[i].roleName,
                            key:data.used[i].roleId.toString()
                        })
                    }
                    for(var i=0;i<data.used.length;i++){
                        rightKey.push(data.used[i].roleId.toString())
                    }
                    this.data1 = leftArr.concat(rightArr);
                    this.targetKeys1 = rightKey;
                    this.modal = true;
                    console.log(this.data1)
                    console.log(this.targetKeys1)
                     vm.table.loading = false;
                })
            },
            //模态框点击ok
            ok(){
                let url = common.path2+'baseUserRoles/distributionBaseUserRole?userId='+this.userId+'&roleIds='+this.roleIds
                this.$http.get(
                    url,
                ).then(res=>{
                    console.log(res)
                    if(res.status==200){
                        this.$Message.info('提交成功');
                    }
                    this.modal = false;
                })
            },
            //模态框点击取消
            cancel(){
                this.$Message.info('Clicked cancel');
                this.modal = false;
            },
            getMockData () {
                let mockData = [];
                for (let i = 1; i <= 20; i++) {
                    mockData.push({
                        key: i.toString(),
                        label: '用户管理' + i,
                    });
                }
                console.log(mockData)
                return mockData;
            },
            //获取所有角色
            getRoleData () {
                let url = common.path2+'baseRoles/selectListByConditions?pageNo=1&pageSize=1000';
                this.$http.post(
                    url,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    let roleArr = res.data.data.list
                    let tempArr = []
                    for(var i=0;i<roleArr.length;i++){
                        tempArr.push({
                            label:roleArr[i].roleName,
                            key:roleArr[i].roleId.toString()
                        })
                    }
                    console.log(tempArr)
                    this.data1 = tempArr
                })
            },
            //渲染列表
            render1 (item) {
                return item.label;
            },
            //穿梭框事件
            handleChange1 (newTargetKeys, direction, moveKeys) {
                console.log(newTargetKeys); //目的列表
                this.roleIds = newTargetKeys
                console.log(this.roleIds)
                console.log(direction);  //目标方向
                console.log(moveKeys);  //移动的数据
                this.targetKeys1 = newTargetKeys;
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
        beforeMount:function(){
            // this.getRoleData()
        },
        mounted: function(){
            this.fnGetOperators();
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            AddPage,
            EditPage,
        }
    }
</script>
<style scoped>
    .testWrap{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px; top:0px;
        z-index: 1;
        padding:5px 10px 10px 10px;
    }
    .fl{
        float: left; 
    }
    .fr{
        float: right;
    }
</style>