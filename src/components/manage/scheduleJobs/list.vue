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
                        <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">新增定时任务</Button>
                    </Col>
                </Row>
                <Table
                    :loading="table.loading" 
                    :data="table.tableData1" 
                    :columns="table.tableColumns" 
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
                operators: {},
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
                            title: '定时任务名称',
                            key: 'jobName',
                        },
                        {
                            title: '表达式',
                            key: 'cronExpression',
                        },
                        {
                            title: '完整类名称',
                            key: 'jobClass',
                            width: 240,
                        },
                        {   
                            title: '是否启用',
                            key: 'isEnable',
                            width: 120,
                            render: (h,params) => {
                                const row = params.row;
                                const color = !!row.isEnable == 1? 'green': 'red';
                                const text = !!row.isEnable == 1? '启用': '禁用';
                                /* return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text); */
                                return text;
                            }
                        },
                        {   
                            title: '并发运行',
                            key: 'isConcurrent',
                            width: 120,
                            render: (h,params) => {
                                const row = params.row;
                                const color = !!row.isConcurrent == 1? 'green': 'red';
                                const text = !!row.isConcurrent == 1? '可以': '不可以';
                                /* return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text); */
                                return text;
                            }
                        },
                        {   
                            title: '运行状态',
                            key: 'jobState',
                            width: 120,
                            render: (h,params) => {
                                const row = params.row;
                                const color = !!row.isConcurrent == 1? 'green': 'red';
                                const text = !!row.isConcurrent == 1? '正常运行': '运行异常';
                                /* return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text); */
                                return text;
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 350,
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
                                    style: {
                                        marginRight: '5px'
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
                                /* 启动任务 */
                                let obj3 =  h('Button', {
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
                                            this.fnJobManage(row.id,'start');
                                        }
                                    }
                                }, '启动任务');
                                arrs.push(obj3);


                                /* 停止任务 */
                                let obj4=  h('Button', {
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
                                            this.fnJobManage(row.id,'end');
                                        }
                                    }
                                }, '停止任务');
                                arrs.push(obj4);

                                /* 执行任务 */
                                let obj5 =  h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let row = params.row;
                                            this.fnJobManage(row.id,'run');
                                        }
                                    }
                                }, '执行任务');
                                arrs.push(obj5);

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
                let url = vm.common.path2+"scheduleJob/selectListByConditions?pageNo="+start+"&pageSize="+size;
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
                    title: '删除定时任务',
                    content: '确定要删除此定时任务吗？',
                    onOk: function(){
                        let url = vm.common.path2+"scheduleJob/deleteById?id="+id;
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
            /* 启动和停止任务 */
            fnJobManage (id,type) {
                let vm = this;
                let text = type == 'start'?'启动任务':type == 'end'?'停止任务':'执行任务';
                let url = '';
                if(type == 'start'){
                    url = vm.common.path2 + "scheduleJob/resumeJob?id="+id;
                }else if(type == 'end'){
                    url = vm.common.path2 + "scheduleJob/pauseJob?id="+id;
                }else if(type == 'run'){
                    url = vm.common.path2 + "scheduleJob/runJobNow?id="+id;
                }
                this.$Modal.confirm({
                    title: text,
                    content: '确定要'+text+'吗？',
                    onOk: function(){
                        this.$http.get(
                            url
                        ).then(function(res){
                            vm.$Message.success('成功');
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