<template>
    <div>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="fnBackformAdd"/>
        <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'" class="testWrap" v-on:returnList="fnBackformAdd" :editId="editId"></EditPage>
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
                    状态
                    <Select v-model="cd.storeStatus" style="width:110px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    开店时间
                    <DatePicker v-model="cd.time" type="daterange" placement="bottom-start" placeholder="请选择开店时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputVal">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                        <Option value="storeName">门店名称</Option>
                        <Option value="bossPhone">老板注册手机</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:360px;" v-if="!!testCode">
                    <Row>
                        <CityLinkage :cityConfig="cityConfig" v-on:listenCity="getCity"></CityLinkage>
                    </Row>
                </FormItem>
            </Form>
            <Row style="margin-bottom:10px;">
                <Col span="5">
                    <Button v-if="!!operators.see" style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                    <Button v-if="!!operators.refresh" style="margin-left:5px;" @click.native="getData('init')" @click="ievent" type="warning" icon="refresh">刷新</Button>
                </Col>
                <Col span="3" offset="16">
                    <Button v-if="!!operators.add" style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">新增门店</Button>
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
    </div>
</template>
<script>
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    import CityLinkage from '../../common/city.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                operators:{},
                cityConfig:{
                    key:false,
                    title:'地区',
                    type:'select'
                },
                editId:0,//传给编辑页面的id
                statusList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'0',
                        label:'已关闭'
                    },{
                        value:'3',
                        label:'已冻结'
                    },{
                        value:'1',
                        label:'运营中'
                    },
                ],
                cd:{
                    time:[],//评论时间范围
                    operType:"1",//评论类型、不用重置
                    inputVal:'',
                    selectType:'storeName',
                    storeStatus:'', //店铺状态下拉框
                    cityArr:[]
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
                        title: '门店名称',
                        key: 'storeName',
                    },
                    {   
                        title: '老板姓名',
                        key: 'bossName'
                    },
                    {
                        title: '注册手机',
                        key: 'bossPhone'
                    },
                    {
                        title: '门店地址',
                        key: 'storeAddress',
                        width:180,
                        render:(h,params)=>{
                            return h('div',params.row.provinceName+params.row.cityName+params.row.storeAddress);
                        }
                    },
                    {
                        title: '申请时间',
                        key: 'createTime',
                        width:150,
                        render:(h,params)=>{
                            return h('div',common.formatDate(params.row.createTime))
                        }
                    },
                    {
                        title: '状态',
                        key: 'storeState',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.storeState==0){
                                str = '已关闭'
                            }else if(params.row.storeState==1){
                                str = '运营中'
                            }else if(params.row.storeState==2){
                                str = '待审核'
                            }else if(params.row.storeState==3){
                                str = '已冻结'
                            }
                            return str;
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
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
                                        this.editId = params.row.id
                                        this.changePageType('edit');
                                    }
                                }
                            }, '编辑');
                            let openButton = h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.openStore(params.row.id) 
                                    }
                                }
                            }, '开启');
                            let closeButton = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.closeStore(params.row.id)
                                    }
                                }
                            }, '关闭');
                            let thawButton = h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.openStore(params.row.id)
                                    }
                                }
                            }, '激活')
                            let frozenButton = h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.frozenStore(params.row.id)
                                    }
                                }
                            }, '冻结');
                            if(!!this.operators.edit){
                                arr.push(editButton)
                            }
                           if(params.row.storeState==0){
                               if(!!this.operators.openclose){
                                   arr.push(openButton)
                               }
                               return h('div', arr);
                           }else if(params.row.storeState==3){
                               if(!!this.operators.frozen){
                                   arr.push(thawButton)
                               }
                                return h('div', arr);
                           }else if(params.row.storeState==1){
                               if(!!this.operators.openclose){
                                   arr.push(closeButton)
                               }
                               if(!!this.operators.frozen){
                                   arr.push(frozenButton)
                               }
                                return h('div', arr);
                           }else if(params.row.storeState==2){
                                return h('div', arr);
                           }
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
                testCode: true,
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path2+"store/front/findByPage?pageNo="+start+'&pageSize='+size;
                let ajaxData = {
                    // pageNo:start,
                    // pageSize: size
                }
                if(vm.cd.storeStatus){
                    ajaxData.storeState = vm.cd.storeStatus //状态
                }
                if(vm.cd.time&&vm.cd.time[0]&&vm.cd.time[1]){
                    ajaxData.createTime = vm.cd.time //开店时间
                }
                if(vm.cd.inputVal){
                    ajaxData[vm.cd.selectType] = vm.cd.inputVal 
                }
                if(!!vm.cd.cityArr){
                    if(vm.cd.cityArr.length==1){
                        if(!!vm.cd.cityArr[0].value){
                            ajaxData.productId = vm.cd.cityArr[0].value
                        }
                    }else if(vm.cd.cityArr.length==2){
                        if(!!vm.cd.cityArr[0].value){
                            ajaxData.productId = vm.cd.cityArr[0].value
                        }
                        if(!!vm.cd.cityArr[1].value){
                            ajaxData.cityId = vm.cd.cityArr[1].value
                        }
                    }else if(vm.cd.cityArr.length==3){
                        for(var i=0;i<3;i++){
                            if(!!vm.cd.cityArr[i].value){
                                ajaxData.productId = vm.cd.cityArr[0].value
                                ajaxData.cityId = vm.cd.cityArr[1].value
                                ajaxData.areaId = vm.cd.cityArr[2].value
                            }
                        }
                    }
                }
                console.log(ajaxData)
                vm.table.loading = true;
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res.data.data);
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
                vm.cd.storeStatus = '';//
                vm.cd.time = '';//
                vm.cd.inputVal = "";// 
                vm.cd.selectType = 'storeName';
                vm.cityConfig.key = true;
                vm.cd.cityArr = []
            },
            ievent(data){
                this.cityConfig.key = data;
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
            fnBackformAdd () {
                this.changePageType("list");
                this.getData();
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
            //冻结店铺
            frozenStore(id){
                let vm = this;
                this.$Modal.confirm({
                    title:'冻结店铺',
                    content:'冻结后，该店铺将无法交易，确认冻结该店铺？',
                    onOk(){
                        let url = common.path2+'store/freeze/'+id;
                        this.$http.put(url).then(res=>{
                            if(res.status==200){
                                this.$Message.success('冻结成功！')
                                vm.getData()
                            }
                        })
                    }
                });
            },
            //开启店铺
            openStore(id){
                let vm = this
                this.$Modal.confirm({
                    title:'开启店铺',
                    content:'开启后，该店铺可以继续开展美容邦相关业务，确认开启该店铺？',
                    onOk(){
                        let url = common.path2+'store/open/'+id;
                        this.$http.put(url).then(res=>{
                            if(res.status==200){
                                this.$Message.success('开启成功！')
                                vm.getData()
                            }
                        })
                    }
                });
            },
            //关闭店铺
            closeStore(id){
                let vm = this
                this.$Modal.confirm({
                    title:'关闭店铺',
                    content:'关闭后，该店铺将无法开展美容邦相关业务，确认关闭该店铺？',
                    onOk(){
                        let url = common.path2+'store/close/'+id;
                        this.$http.put(url).then(res=>{
                            if(res.status==200){
                                this.$Message.success('关闭成功！')
                                vm.getData()
                            }
                        })
                    }
                });
            },
            getCity(data){
                console.log(data)
                this.cd.cityArr = data
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
            AddPage,
            EditPage,
            CityLinkage
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