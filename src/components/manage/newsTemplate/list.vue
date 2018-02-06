<template>
    <div>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 新增 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"></AddPage>
        <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'"  class="testWrap" :sendChild="sendChild" v-on:returnList="changePageType"/>
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
                    <Col span="3" offset="16" v-if="!!operators.add">
                        <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">新增模板</Button>
                    </Col>
                </Row>
                <Table
                    :loading="table.loading" 
                    :data="table.tableData1" 
                    :columns="table.tableColumns" 
                    border
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
    import MyUpload from '../../common/upload.vue'
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    export default {
        data () {
            return {
                operators: {
                    add: false, // 新增
                    edit: false, // 编辑
                    delete: false, // 删除
                    see: false, // 查看
                    refresh: false, // 刷新
                    updown: false, // 上下架
                    examine: false, // 审核
                    openclose: false, // 开启关闭
                    frozen: false, // 冻结激活
                    storeGrade: false, // 新增店铺等级
                    storeRules: false, // 新增规则
                    orderInfo: false, // 订单详情
                    backInfo: false, // 退款详情
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
                            title: '短信名称',
                            key: 'smsName',
                        },
                        {
                            title: '短信编码',
                            key: 'smsCode',
                            render: (h,params) => {
                                const row = params.row;
                                return !!row.smsCode?row.smsCode:"无"
                            }
                        },
                        {   
                            title: '短信类型',
                            key: 'smsType',
                            render: (h,params) => {
                                const row = params.row;
                                const color = !!!row.smsType ? 'red' : row.smsType == 0 ? 'yellow': row.smsType == 1 ? 'green': row.smsType == 2?'blue':'white';
                                const text = !!!row.smsType ? '无' : row.smsType == 0 ? '验证码': row.smsType == 1?'短信通知': row.smsType == 2? '短信推广': '';
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text);
                            }
                        },
                        {
                            title: '更新时间',
                            key: 'updateTime',
                            render: (h,params) => {
                                const row = params.row;
                                return this.common.formatDate(row.updateTime);
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 210,
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
                                            this.sendChild.id = row.id;
                                            this.changePageType('edit');
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
                                            this.fnDeleteItem(row.id);
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
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',//子页面类型
                 /* 传递给子组件的数据 */
                sendChild:{
                    id: "", // 编辑选项的id
                },
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
                let url = vm.common.path2+"baseSmsTemplates/selectListByConditions?pageNo="+start+"&pageSize="+size;
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
                    title: '删除短信模板',
                    content: '确定要删除此短信模板吗？',
                    onOk: function(){
                        let url = vm.common.path2+"baseSmsTemplates/"+id;
                        this.$http.delete(
                            url
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
            /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData();
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
            this.fnGetOperators();
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            MyUpload,
            AddPage,
            EditPage,
        }
    }
</script>
<style scoped>
</style>