<template>
    <div>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="fnBackformAdd"/>
        <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'" class="testWrap" :editId="editId" v-on:returnList="fnBackformAdd"></EditPage>
        <!-- 详情容器 -->
        <InfoPage v-if="pageType == 'info'" class="testWrap" :infoId="infoId" v-on:returnList="fnBackformAdd"></InfoPage>
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
            <Form :model="cd" inline v-show="false">
                        <FormItem style="margin-bottom:10px;">
                            状态
                            <Select v-model="storeStatus" style="width:80px">
                                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem style="margin-bottom:10px;">
                            开店时间
                            <DatePicker v-model="cd.time" type="date" placeholder="请选择评价时间" style="width:200px;"></DatePicker>
                        </FormItem>
                        <FormItem style="margin-bottom:10px;">
                           <Input v-model="value">
                            <Select v-model="selectType" slot="prepend" style="width: 80px">
                                <Option value="门店名称">门店名称</Option>
                                <Option value="注册手机">注册手机</Option>
                            </Select>
                          </Input>
                        </FormItem>
                        <FormItem style="margin-bottom:10px; width:250px;">
                            <Row>
                                <Col span="4">地区</Col>
                                <Col span="20">
                                    <Input v-model="area" placeholder="全部（省-市-区）"></Input>
                                </Col>
                            </Row>
                        </FormItem>
            </Form>
            <Row style="margin-bottom:10px;">
                <Col span="10">
                    <Button v-if="operators.add" style="float:left;margin-right:10px;" @click.native="changePageType('add')" type="success" icon="android-add">新建通知公告</Button>
                    <Button style="float:left;" @click.native="changePageType('list')" type="primary" icon="android-add" v-show="false">成长规则设置</Button>
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
    import InfoPage from './info.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                operators:{},
                value:'',
                editId:'',//编辑id
                infoId:'',//查看详情Id
                selectType:'门店名称',
                storeStatus:'', //店铺状态下拉框
                area:'', //地区
                statusList:[
                    {
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'已冻结'
                    },{
                        value:'2',
                        label:'已关闭'
                    },
                ],
                cd:{
                    time:[],//评论时间范围
                    operType:"1"//评论类型、不用重置
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
                        title: '通告内容',
                        key: 'noticeContent',
                    },
                    {
                        title: '状态',
                        key: 'noticeStatus',
                        render:(h,params)=>{
                            return h('div',params.row.noticeStatus?'已停止':'公告中')
                        }
                    },
                    {
                        title: '公告时间',
                        key: 'noticeStartTime',
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.noticeStartTime),
                                h('div',params.row.noticeEndTime)
                            ])
                        }
                    },
                    {
                        title: '发布时间',
                        key: 'publishTime',
                        render:(h,params)=>{
                            return h('div',params.row.publishTime?this.common.formatDate(params.row.publishTime):'')
                        }
                    },
                    {
                        title: '客户端',
                        key: 'usedType',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.usedType=='0'){
                                str = '美容邦客户端'
                            }else if(params.row.usedType=='1'){
                                str = '美容邦门店端'
                            }else if(params.row.usedType=='2'){
                                str = '美容邦邦女郎端'
                            }
                            return h('div',str);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 220,
                        render: (h, params) => {
                            let arr =[];
                            let openCloseButton = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.openOrClose(params.row.id,params.row.noticeStatus);
                                    }
                                }
                            }, params.row.noticeStatus=='1'?'开始':'停止');
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
                                        this.editId = params.row.id;
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
                                        this.removeNotice(params.row.id);
                                    }
                                }
                            }, '删除');
                            if(this.operators.edit){
                                arr.push(editButton)
                            }
                            if(this.operators.delete){
                                arr.push(deleteButton)
                            }
                            if(this.operators.openclose){
                                arr.push(openCloseButton)
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
                    size: 10
                }
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
            getData () {
                let vm = this;
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path2+"notificationNotices/selectListByConditions?pageNo="+start+'&pageSize='+size;
                let ajaxData = {
                    
                }
                vm.table.loading = true;
                this.$http.post(
                    url,
                    // ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = oData.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
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
                this.changePageType(type);
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
            removeNotice(id){
              let vm = this
              let url = common.path2+'notificationNotices/'+id;
              this.$http.delete(url).then(res=>{
                  if(res.status==200){
                      this.$Message.success('删除成功！')
                      vm.getData()
                  }
              });
            },
            openOrClose(id,status){
              let vm = this
              let url = common.path2+'notificationNotices/update';
              let noticeStatus = status=='1'?'0':'1';
              let ajaxData = {
                  id:id,
                  noticeStatus:noticeStatus
              }
              this.$http.put(
                  url,
                  JSON.stringify(ajaxData),
                  {
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    },
                  }
                  ).then(res=>{
                  if(res.status==200){
                      vm.getData()
                  }
              });
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
            InfoPage
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
