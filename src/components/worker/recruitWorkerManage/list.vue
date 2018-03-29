<template>
    <div>
        <!-- 新增 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"></AddPage>
        <!-- 查看 -->
        <InfoPage v-if="pageType == 'info'" :infoId="infoId"  class="testWrap" v-on:returnList="changePageType"></InfoPage>
        <!-- 审核 -->
        <ExaminePage v-if="pageType == 'examine'" :examineId="examineId"  class="testWrap" v-on:returnList="changePageType"></ExaminePage>
        <!-- 编辑 -->
        <EditPage v-if="pageType == 'edit'" :sendChild="sendChild"  class="testWrap" v-on:returnList="changePageType"></EditPage>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Form :model="cd" inline>
                    <Button v-if="false" style="float:left;margin-right:5px;" @click.native="changePageType('add')" type="success" icon="android-add">新增员工</Button>
                    <FormItem style="margin-bottom:10px;">
                        审核状态
                        <Select v-model="cd.authStatus" style="width:100px">
                            <Option v-for="item in authStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        同意状态
                        <Select v-model="cd.agreeStatus" style="width:100px">
                            <Option v-for="item in agreeStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        服务类型
                        <Select v-model="cd.serverType" style="width:100px">
                            <Option v-for="item in serverTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        <Input v-model="cd.inputVal">
                        <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                            <Option value="beauticianNickName">美容师昵称</Option>
                            <Option value="serverName">商品名称</Option>
                            <Option value="storeName">店铺名称</Option>
                        </Select>
                        </Input>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                        <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    </FormItem>
                </Form>
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
        <!-- 审核 模态框 -->
        <Modal
            v-model="audit.mineModal"
            title="审核招募美容师"
            :loading="audit.loading"
            @on-ok="fnAsyncOK1">
            <Form>
                <FormItem label="审核状态">
                    <RadioGroup v-model="audit.authStatus">
                        <Radio label="1">通过</Radio>
                        <Radio label="2">不通过</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="审核原因">
                    <Input v-model="audit.authReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入审核原因"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    import InfoPage from './info.vue'
    import ExaminePage from './examine.vue'
    export default {
        data () {
            return {
                audit:{
                    mineModal: false,
                    loading: true,
                    authStatus: '1', // 审核状态
                    authReason: '', // 审核原因
                    id: '' 
                },
                storeId: '', // 店铺id
                examineId:'', //审核的id
                infoId:'', //查看的id
                authStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'待审核'
                    },
                    {
                        value:'1',
                        label:'通过'
                    },
                    {
                        value:'2',
                        label:'不通过'
                    },
                ],
                agreeStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'待处理'
                    },
                    {
                        value:'1',
                        label:'已同意'
                    },
                    {
                        value:'2',
                        label:'已拒绝'
                    },
                ],
                serverTypeList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'到店'
                    },
                    {
                        value:'1',
                        label:'上门'
                    },
                ],
                cd: {
                    authStatus:'', //审核状态
                    agreeStatus: '', // 同意状态
                    serverType: '', // 服务类型
                    beauticianType:'', //员工类型
                    beauticianStatus:'', //员工状态
                    inputVal: '', //选择的值
                    selectType:'beauticianNickName',//input类型
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
                            type: 'index',
                            width: 50,
                            align: 'center'
                        },
                        {
                            title: '员工信息',
                            key: 'beauticianNickName',
                            render:(h,params)=>{
                                return h('div',[
                                    h('img',{
                                        attrs:{src:params.row.beauticianHeadImgUrl},
                                        style:{
                                            width:'32px',
                                            height:'32px',
                                            borderRadius:'50%',
                                            marginRight:'8px',
                                            marginTop:'5px',
                                            marginBottom:'5px',
                                            verticalAlign:'middle'
                                        }
                                    }),
                                    h('span',params.row.beauticianNickName)
                                ])
                            }
                        },
                        {
                            title: '服务名称',
                            key: 'serverName',
                        },
                        {
                            title: '所属门店',
                            key: 'storeName',
                        },
                        {
                            title: '服务耗时（分）',
                            key: 'serverNeedTime',
                        },
                        {
                            title: '服务类型',
                            key: 'serverType',
                            render:(h,params)=>{
                                const row = params.row;
                                let text = row.serverType == 0? '到店': '上门';
                                return text;
                            }
                        },
                        {
                            title: '审核状态',
                            key: 'authStatus',
                            render:(h,params)=>{
                                const row = params.row;
                                let text = row.authStatus == 0? '待审核': row.authStatus == 1? '通过': '不通过';
                                return text;
                            }
                        },
                        {
                            title: '同意状态',
                            key: 'agreeStatus',
                            render:(h,params)=>{
                                const row = params.row;
                                let text = row.agreeStatus == 0? '待处理': row.agreeStatus == 1? '已同意': '已拒绝';
                                return text;
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 160,
                            render: (h, params) => {
                                const row = params.row;
                                let arrs = [];
                                /* 审核 */
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
                                            console.log(row);
                                            // this.examineId = row.id;
                                            // this.changePageType('examine');
                                            this.audit.id = row.id;
                                            this.audit.authStatus = row.authStatus;
                                            this.audit.auditReason = row.authReason;
                                            this.fnShowModal1();
                                        }
                                    }
                                }, '审核');
                                /* 查看 */
                                let obj2 = h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let row = params.row;
                                            this.infoId = row.id;
                                            this.changePageType('info');
                                        }
                                    }
                                }, '查看')
                                if(row.authStatus == 0){
                                    // 待审核
                                    arrs.push(obj1);
                                }
                                arrs.push(obj2);
                                return h('div', arrs);
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
            /* 审核 */
            fnShowModal1 () {
                let vm = this;
                vm.audit.mineModal = true;
            },
            /* 审核的模态框点击确定事件 */
            fnAsyncOK1 () {
                let vm = this;
                let id = vm.audit.id;
                let authStatus = vm.audit.authStatus;
                let ajaxData = {
                    "authReason": vm.audit.authReason,
                    "id": id,
                    "authStatus": authStatus,
                }
                // let url = vm.common.path2 + "productBeauticianRef/auth/"+id+"/"+auditStatus+"?auditReason="+vm.audit.auditReason;
                let url = vm.common.path2 + "productBeauticianRef/auth";
                vm.$http.put(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then(function(res){
                    vm.getData();
                    vm.audit.loading = true;
                    vm.audit.mineModal = false;
                }).catch(function(err){
                })
            },
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
                vm.cd.authStatus = "";
                vm.cd.agreeStatus = "";
                vm.cd.serverType = "";
                vm.cd.selectType = "beauticianNickName";// 输入框类型
                vm.cd.inputVal = "";// 输入框的值
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = vm.common.path2+"productBeauticianRef/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                   
                }
                if(!!vm.storeId){
                    ajaxData.storeId = vm.storeId;
                }
                if(vm.cd.authStatus){
                    ajaxData.authStatus = vm.cd.authStatus
                }
                if(vm.cd.agreeStatus){
                    ajaxData.agreeStatus = vm.cd.agreeStatus
                }
                if(vm.cd.serverType){
                    ajaxData.serverType = vm.cd.serverType
                }
                if(!!vm.cd.inputVal){
                    ajaxData[vm.cd.selectType] = vm.cd.inputVal;
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
            let store = JSON.parse(window.localStorage.getItem("userInfo")).store;
            let vm = this;
            if(store!=null){
                vm.storeId = store.id;
            }
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
            InfoPage,
            ExaminePage
        }
    }
</script>
<style scoped>
</style>