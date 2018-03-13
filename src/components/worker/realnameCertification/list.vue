<template>
    <div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Form :model="cd" inline>
                    <Button v-if="false" style="float:left;margin-right:5px;" @click.native="changePageType('add')" type="success" icon="android-add">新增员工</Button>
                    <FormItem style="margin-bottom:10px;margin-left:10px;">
                        认证状态
                        <Select v-model="cd.thirdAuthStatus" style="width:100px">
                            <Option v-for="item in thirdAuthStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem v-if="false" style="margin-bottom:10px;">
                        员工类型
                        <Select v-model="cd.beauticianType" style="width:100px">
                            <Option v-for="item in beauticianTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem v-if="false" style="margin-bottom:10px;">
                        员工状态
                        <Select v-model="cd.beauticianStatus" style="width:100px">
                            <Option v-for="item in beauticianStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        <Input v-model="cd.inputVal">
                        <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                            <Option value="realName">员工姓名</Option>
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
    export default {
        data () {
            return {
                examineId:'', //审核的id
                infoId:'', //查看的id
                thirdAuthStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'1',
                        label:'认证成功'
                    },
                    {
                        value:'2',
                        label:'认证失败'
                    }
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
                    thirdAuthStatus:'', //审核状态
                    beauticianType:'', //员工类型
                    beauticianStatus:'', //员工状态
                    inputVal: '', //选择的值
                    selectType:'realName',//input类型
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
                            width: 100,
                            align: 'center'
                        },
                        {
                            title: '员工信息',
                            width:140,
                            key: 'realName',
                            render:(h,params)=>{
                                if(params.row.phone&&params.row.phone.length==11){
                                    return h('div',[
                                        h('div',params.row.realName),
                                        h('div',params.row.phone.substring(0,3)+'****'+params.row.phone.substring(7,11))
                                    ])
                                }else{
                                    return h('div',[
                                        h('div',params.row.realName),
                                        h('div',params.row.phone)
                                    ])
                                }
                            }
                        },
                        {
                            title: '真实姓名',
                            key: 'realName',
                        },
                        {
                            title: '身份证号',
                            key: 'idCard',
                            render:(h,params)=>{
                                if(params.row.idCard){
                                    let leng = params.row.idCard.length;
                                    return h('div',[
                                        h('div',params.row.idCard.substring(0,6)+'*********'+params.row.idCard.substring(leng-4,leng-1))
                                    ])
                                }else{
                                    return h('div',[
                                        h('div',params.row.idCard)
                                    ])
                                }
                            }
                        },
                        {
                            title: '所属店铺',
                            key: 'storeName',
                        },
                        {
                            title: '认证时间',
                            key: 'auditTime',
                            render: (h,params) => {
                                const row = params.row;
                                const time = this.common.formatDate(row.auditTime);
                                return time
                            }
                        },
                        {   
                            title: '认证状态',
                            key: 'thirdAuthStatus',
                            width:120,
                            render: (h,params) => {
                                const thirdAuthStatus = params.row.thirdAuthStatus;
                                let color = '';
                                let text = '';
                                switch (thirdAuthStatus){
                                    case 0:color = 'yellow';text = '未认证';break;
                                    case 1:color = 'green';text = '认证成功';break;
                                    case 2:color = 'red';text = '认证失败';break;
                                }
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color,
                                        size:'small'
                                    }
                                }, text);
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
                vm.cd.thirdAuthStatus = "";// 审核状态
                vm.cd.beauticianType = "";// 员工类型
                vm.cd.beauticianStatus = "";// 员工状态
                vm.cd.selectType = "realName";// 输入框类型
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
                let url = vm.common.path2+"memberRealNameAuth/bg/findByPageForBg?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                   
                }
                if(vm.cd.thirdAuthStatus){
                    ajaxData.thirdAuthStatus = vm.cd.thirdAuthStatus
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
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            
        }
    }
</script>
<style scoped>
</style>