<template>
    <div>
        <!-- 新增 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"></AddPage>
        <!-- 查看 -->
        <InfoPage v-if="pageType == 'info'" :infoId="infoId"  class="testWrap" v-on:returnList="changePageType"></InfoPage>
        <!-- 审核 -->
        <ExaminePage v-if="pageType == 'examine'" :examineId="examineId"  class="testWrap" v-on:returnList="changePageType"></ExaminePage>
        <!-- 编辑 -->
        <EditPage v-if="pageType == 'edit'" :editId="editId"  class="testWrap" v-on:returnList="changePageType"></EditPage>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Form :model="cd" inline>
                    <Button v-if="operators.add" style="float:left;margin-right:5px;" @click.native="changePageType('add')" type="success" icon="android-add">新增员工</Button>
                    <FormItem style="margin-bottom:10px;">
                        审核状态
                        <Select v-model="cd.auditStatus" style="width:100px">
                            <Option v-for="item in auditStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        员工类型
                        <Select v-model="cd.beauticianType" style="width:100px">
                            <Option v-for="item in beauticianTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        员工状态
                        <Select v-model="cd.beauticianStatus" style="width:100px">
                            <Option v-for="item in beauticianStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        <Input v-model="cd.inputVal">
                        <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                            <Option value="beauticianName">员工姓名</Option>
                            <Option value="storeName">店铺名称</Option>
                            <Option value="phone">注册手机</Option>
                        </Select>
                        </Input>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        <Button v-if="operators.see" style="margin-left:5px;" @click.native="getData('see')" type="primary" icon="ios-search">查询</Button>
                        <Button v-if="operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
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
    import MyUpload from '../../common/upload.vue'
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    import InfoPage from './info.vue'
    import ExaminePage from './examine.vue'
    export default {
        data () {
            return {
                operators:{},
                examineId:'', //审核的id
                infoId:'', //查看的id
                storeId:'',
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
                    inputVal: '', //选择的值
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
                            type: 'index',
                            width: 50,
                            align: 'center'
                        },
                        {
                            title: '员工信息',
                            width:140,
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
                            title: '注册手机',
                            key: 'phone',
                            width:120
                        },
                        {
                            title: '性别',
                            key: 'sex',
                            width:70,
                            render: (h,params) => {
                                const row = params.row;
                                const color = row.sex == 1 ? 'blue' : 'red';
                                const text = row.sex == 1 ? '男' : '女';
                                // return h('Tag', {
                                //     props: {
                                //         type: 'border',
                                //         color: color
                                //     }
                                // }, text);
                                return h('div',text)
                            }
                        },
                        {
                            title: '员工类型',
                            key: 'beauticianType',
                            width:90,
                            render:(h,params)=>{
                                let str = '';
                                if(params.row.beauticianType==0){
                                    str = '老板'
                                }else if(params.row.beauticianType==1){
                                    str = '店长'
                                }else if(params.row.beauticianType==2){
                                    str = '正式员工'
                                }else if(params.row.beauticianType==3){
                                    str = '兼职员工'
                                }
                                return str;
                            }
                        },
                        {
                            title: '员工状态',
                            key: 'beauticianStatus',
                            width:70,
                            render:(h,params)=>{
                                let str = '';
                                if(params.row.beauticianStatus==0){
                                    str = '离职'
                                }else if(params.row.beauticianStatus==1){
                                    str = '在职'
                                }else if(params.row.beauticianStatus==2){
                                    str = '休息'
                                }
                                return str;
                            }
                        },
                        {
                            title: '所属门店',
                            key: 'storeName',
                            width:120
                        },
                        {
                            title: '创建时间',
                            key: 'createTime',
                            width:150,
                            render: (h,params) => {
                                const row = params.row;
                                const time = this.common.formatDate(row.createTime);
                                return time
                            }
                        },
                        {   
                            title: '审核状态',
                            key: 'auditStatus',
                            width:110,
                            render: (h,params) => {
                                const auditStatus = params.row.auditStatus;
                                let color = '';
                                let text = '';
                                switch (auditStatus){
                                    case 0:color = 'yellow';text = '待审核';break;
                                    case 1:color = 'green';text = '审核通过';break;
                                    case 2:color = 'red';text = '不通过';break;
                                }
                                // return h('Tag', {
                                //     props: {
                                //         type: 'border',
                                //         color: color,
                                //         size:'small'
                                //     }
                                // }, text);
                                return h('div',text)
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            render: (h, params) => {
                                let arr = [];
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
                                            let row = params.row;
                                            this.editId = row.id;
                                            this.changePageType('edit');
                                        }
                                    }
                                }, '编辑');
                                let infoButton = h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let row = params.row;
                                            this.infoId = row.id;
                                            this.changePageType('info');
                                        }
                                    }
                                }, '查看');
                                let examineButton = h('Button', {
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
                                            this.examineId = row.id;
                                            this.changePageType('examine');
                                        }
                                    }
                                }, '审核');
                                if(params.row.auditStatus==0){
                                    if(this.operators.examine){
                                        arr.push(examineButton)
                                    }
                                    return h('div', arr);
                                }else if(params.row.auditStatus==1){
                                    if(this.operators.edit){
                                        arr.push(editButton)
                                    }
                                    if(this.operators.info){
                                        arr.push(infoButton)
                                    }
                                    return h('div', arr);
                                }else if(params.row.auditStatus==2){
                                    if(this.operators.info){
                                        arr.push(infoButton)
                                    }
                                    return h('div', arr);
                                }
                            }
                        }
                    ],
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',//子页面类型
                uploadList: [],//图片
                 /* 传递给子组件的数据 */
                editId: "", // 编辑选项的id
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
                vm.cd.selectType = "beauticianName";// 输入框类型
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
                if(!!init&&init=='see'){
                    start = 1;
                }
                let url = vm.common.path2+"storeBeautician/front/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {}
                if(this.storeId){
                    ajaxData.storeId = this.storeId;
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
                    this.getData('see');
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
            if(JSON.parse(window.localStorage.getItem('userInfo')).store){
                this.storeId = JSON.parse(window.localStorage.getItem('userInfo')).store.id;
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