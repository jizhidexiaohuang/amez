<template>
    <div>
        <!-- 新增 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"></AddPage>
        <!-- 编辑 -->
        <EditPage v-if="pageType == 'edit'" :sendChild="sendChild"  class="testWrap" v-on:returnList="changePageType"></EditPage>
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
                        <Input v-model="cd.inputval">
                            <Select v-model="cd.inputType" slot="prepend" style="width: 80px">
                                <Option value="beauticianName">员工姓名</Option>
                                <Option value="storeName">店铺名称</Option>
                                <Option value="phone">注册手机</Option>
                            </Select>
                        </Input>
                    </Col>
                    <Col span="5">
                        <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
		                <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    </Col>
                    <Col span="3" offset="11" v-show="true">
                        <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">新增员工</Button>
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
                cd: {
                    inputval: '', //选择的值
                    inputType:'beauticianName',//input类型
                },
                formValidate: {
                    roleName: '',//角色名称
                    roleCode: '',//角色描述
                },
                ruleValidate: {
                    teacherName: [
                        { required: true, message: '老师姓名不能为空', trigger: 'blur' }
                    ],
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
                            title: '员工名称',
                            key: 'beauticianName',
                        },
                        {
                            title: '工号',
                            key: 'workCardNo',
                        },
                        {
                            title: '注册账号',
                            key: 'phone',
                        },
                        {
                            title: '性别',
                            key: 'sex',
                            render: (h,params) => {
                                const row = params.row;
                                const color = row.sex == 1 ? 'red' : 'blue';
                                const text = row.sex == 1 ? '女' : '男';
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text);
                            }
                        },
                        {
                            title: '职位',
                            key: 'beauticianLevel',
                            render:(h,params)=>{
                                let str = ''
                                if(params.row.beauticianLevel==1){
                                    str = '初级美容师'
                                }else if(params.row.beauticianLevel==2){
                                    str = '中级美容师'
                                }else if(params.row.beauticianLevel==3){
                                    str = '高级美容师'
                                }else if(params.row.beauticianLevel==4){
                                    str = '资深美容师'
                                }
                                return str
                            }
                        },
                        {
                            title: '所属门店',
                            key: 'storeName',
                        },
                        {
                            title: '创建时间',
                            key: 'createTime',
                            render: (h,params) => {
                                const row = params.row;
                                const time = this.common.formatDate(row.createTime);
                                return time
                            }
                        },
                        {   
                            title: '收银权限',
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
                                                this.sendChild.id = row.id;
                                                this.changePageType('edit');
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
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',//子页面类型
                uploadList: [],//图片
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
                vm.cd.saleStatus = "";// 状态
                vm.cd.inputType = "serviceName";// 输入框类型
                vm.cd.inputval = "";// 输入框的值
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = vm.common.path2+"storeBeautician/front/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                   
                }
                if(!!vm.cd.inputval){
                    ajaxData[vm.cd.inputType] = vm.cd.inputval;
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
                    title: '删除美容师',
                    content: '确定要删除此美容师吗？',
                    onOk: function(){
                        let url = vm.common.path2+"storeBeautician/deleteById/"+id;
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
            /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            /* 控制当前显示页面的类型 */
            changePageType (type) {
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
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
                console.log(vm.uploadList);
            },
        },
        mounted: function(){
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            MyUpload,
            AddPage,
            EditPage
        }
    }
</script>
<style scoped>
</style>