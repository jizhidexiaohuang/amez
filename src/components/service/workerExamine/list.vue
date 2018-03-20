<template>
    <div>
        <!-- 编辑 -->
        <EditPage v-if="pageType == 'edit'" :sendChild="sendChild"  class="testWrap" v-on:returnList="changePageType"></EditPage>
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Form :model="cd" inline>
                    <FormItem style="margin-bottom:10px;">
                        审核状态
                        <Select v-model="cd.auditStatus" style="width:100px">
                            <Option v-for="item in auditStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;" v-if="false">
                        员工类型
                        <Select v-model="cd.beauticianType" style="width:100px">
                            <Option v-for="item in beauticianTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;" v-if="false">
                        员工状态
                        <Select v-model="cd.beauticianStatus" style="width:100px">
                            <Option v-for="item in beauticianStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;" v-if="false">
                        <Input v-model="cd.inputVal">
                        <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                            <Option value="beauticianName">员工姓名</Option>
                            <Option value="storeName">店铺名称</Option>
                            <Option value="phone">注册手机</Option>
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
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    import EditPage from './edit.vue'
    export default {
        data () {
            return {
                auditStatusList:[
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
                        label:'审核通过'
                    },
                    {
                        value:'2',
                        label:'不通过'
                    },
                ],
                beauticianTypeList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'2',
                        label:'正式员工'
                    },
                    {
                        value:'3',
                        label:'兼职员工'
                    },
                ],
                beauticianStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'1',
                        label:'在职'
                    },
                    {
                        value:'0',
                        label:'离职'
                    },
                ],
                cd: {
                    auditStatus:'', //审核状态
                    beauticianType:'', //员工类型
                    beauticianStatus:'', //员工状态
                    inputval: '', //选择的值
                    selectType:'beauticianName',//input类型
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
                            title: '招募员工信息',
                            width: 180,
                            key: 'beauticianName',
                            render:(h,params)=>{
                                return h('div',[
                                    h('img',{
                                        attrs:{src:params.row.headImgUrl},
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
                                    h('span',params.row.beauticianName)
                                ])
                            }
                        },
                        {
                            title: '服务信息',
                            key: 'phone',
                            render: (h,params) => {
                                return '服务名称'
                            } 
                        },
                        {
                            title: '服务时长',
                            key: 'sex',
                            render: (h,params) => {
                                return '60分钟'
                            }
                        },
                        {
                            title: '服务提成',
                            key: 'beauticianType',
                            render:(h,params)=>{
                                return '¥80.90'
                            }
                        },
                        {
                            title: '招募店铺',
                            key: 'beauticianStatus',
                            render:(h,params)=>{
                                return '美佳人美容会所'
                            }
                        },
                        {   
                            title: '审核状态',
                            key: 'auditStatus',
                            render: (h,params) => {
                                const auditStatus = params.row.auditStatus;
                                let color = '';
                                let text = '';
                                switch (auditStatus){
                                    case 0:color = 'yellow';text = '待审核';break;
                                    case 1:color = 'green';text = '审核通过';break;
                                    case 2:color = 'red';text = '不通过';break;
                                }
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color,
                                        size:'small'
                                    }
                                }, text);
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 180,
                            render: (h, params) => {
                                var obj1 = h('Button', {
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
                                }, '审核');
                                var obj2 = h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'warning'
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
                                }, '查看')


                                return h('div', [obj1,obj2]);
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
                vm.cd.auditStatus = "";// 审核状态
                vm.cd.beauticianType = "";// 员工类型
                vm.cd.beauticianStatus = "";// 员工状态
                vm.cd.inputType = "beauticianName";// 输入框类型
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
                let url = vm.common.path2+"storeBeautician/front/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                   
                }
                if(vm.cd.auditStatus){
                    ajaxData.auditStatus = vm.cd.auditStatus
                }
                if(vm.cd.beauticianType){
                    ajaxData.beauticianType = vm.cd.beauticianType
                }
                if(vm.cd.beauticianStatus){
                    ajaxData.beauticianStatus = vm.cd.beauticianStatus
                }
                if(!!vm.cd.inputVal){
                    ajaxData[vm.cd.inputType] = vm.cd.inputVal;
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
            EditPage
        }
    }
</script>
<style scoped>
</style>