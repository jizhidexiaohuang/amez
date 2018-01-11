<template>
    <div>
        <!-- 模态框 -->
        <Modal
            v-model="modal.mineModal"
            title="修改状态"
            :loading="modal.loading"
            @on-ok="fnAsyncOK">
            {{ modal.info }}
        </Modal>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'" :sendChild="sendChild"  class="testWrap" v-on:returnList="changePageType"/>
        <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'" :sendChild="sendChild" class="testWrap" v-on:returnList="changePageType"/>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Tabs v-if="false" type="card" v-model="cd.isBrand" @click.native="getData('init')">
                    <TabPane label="门店自营服务" name="1"></TabPane>
                    <TabPane label="品牌服务" name="2"></TabPane>
                </Tabs>
                <Form :model="cd" inline>
                    <FormItem style="margin-bottom:10px;">
                        状态
                        <Select v-model="cd.saleStatus" style="width:200px">
                            <Option value="">全部</Option>
                            <Option value="0">下架</Option>
                            <Option value="1">上架</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;">
                        评价时间
                        <DatePicker v-model="cd.time" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请填写时间范围" style="width: 300px"></DatePicker>
                    </FormItem>
                    <FormItem style="margin-bottom:10px;" v-if="false">
                        发布时间
                        <DatePicker v-model="cd.time" type="date" placeholder="请选择发布时间" style="width:200px;"></DatePicker>
                    </FormItem>
                </Form>
                <Row style="margin-bottom:10px;">
                    <Col span="5">
                        <Input v-model="cd.inputval">
                            <Select v-model="cd.inputType" slot="prepend" style="width: 80px">
                                <Option value="serviceName">服务名称</Option>
                                <Option value="storeName">店铺名称</Option>
                                <Option value="phone">注册手机</Option>
                            </Select>
                        </Input>
                    </Col>
                    <Col span="5">
                        <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
		                <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    </Col>
                    <Col span="3" offset="11" v-if="!!!storeId">
                        <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">发布服务</Button>
                    </Col>
                </Row>
                <Table
                    :loading="table.loading" 
                    :data="table.tableData1" 
                    :columns="table.tableColumns" 
                    border
                    @on-select="fnSelect"
                    @on-select-all="fnSelectAll"
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
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    export default {
        data () {
            return {
                modal:{
                    mineModal: false,
                    loading: true,
                    type: '0',
                    info: '确定要上架？',
                    id:"",
                    storeId:"",//店铺id
                },
                cd:{
                    time:[],//评论时间范围
                    saleStatus:"",//上下架状态
                    inputval:'',//选择的值
                    inputType:'serviceName',//input类型
                    isBrand:'0',// 门店自营还是产品
                },
                table:{
                    recordsTotal:0,//总数量
                    pageNun:1,//索引
                    loading: false,//加载状态
                    size: 10,//长度 
                    tableData1: [],//数据
                    //table头
                    tableColumns: [
                        
                    ],
                    //门店自营服务表头
                    buyerColumns: [],
                    //品牌服务表头
                    sellerColumns: [
                        {
                            type: 'index',
                            width: 80,
                            align: 'center',
                            title: '序号'
                        },
                        {
                            title: '服务名称（e）',
                            key: 'serverName',
                        },
                        {
                            title: '价格',
                            key: 'salePrice',
                            render: (h,params) => {
                                const row = params.row;
                                return !!!row.salePrice?0:row.salePrice
                            }
                        },
                        {
                            title: '状态',
                            key: 'saleStatus',
                            render: (h,params) => {
                                const row = params.row;
                                const color = row.saleStatus === 0 ? 'red' : 'blue';
                                const text = row.saleStatus === 0 ? '下架' : '上架';
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text);
                            }
                        },
                        {
                            title: '审核结果',
                            key: 'auditStatus',
                            render: (h,params) => {
                                const row = params.row;
                                const color = row.auditStatus === 0 ? 'blue' : row.auditStatus === 1 ? 'green':'red';
                                const text = row.auditStatus === 0 ? '待审核' : row.auditStatus === 1 ? '通过':'未通过';
                                return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text);
                            }
                        },
                        {
                            title: '累计销量',
                            key: 'saleVolume',
                        },
                        {
                            title: '发布时间',
                            key: 'createTime',
                            render: (h,params) =>{
                                const row = params.row
                                return this.common.baseFormatDate(row.createTime)
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 180,
                            // align: 'center',
                            // fixed: 'right',
                            render: (h, params) => {
                                const row = params.row;
                                const color = row.saleStatus === 0 ? 'success' : 'warning';
                                const text = row.saleStatus === 0 ? '上架' : '下架';
                                let arrs = [
                                    h('Button', {
                                        props: {
                                            type: color,
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                // this.fnDeleteItem(params.row.id);
                                                let row = params.row;
                                                this.modal.id = row.id;
                                                this.modal.type = row.saleStatus;
                                                this.modal.storeId = row.storeId;
                                                this.fnShowModal();
                                            }
                                        }
                                    }, text)
                                ]
                                let obj1 = h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.fnDeleteItem(params.row.id);
                                        }
                                    }
                                }, '删除');
                                let obj = h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px',
                                        },
                                        on: {
                                            click: () => {
                                                let row = params.row;
                                                this.sendChild.itemId = row.id;
                                                this.changePageType('edit');
                                            }
                                        }
                                    }, '编辑');
                                if(!!!this.storeId){
                                    arrs.unshift(obj);
                                    arrs.push(obj1);
                                }
                                return h('div',arrs);
                            }
                        }
                    ],
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',//子页面类型
                /* 传递给子组件的数据 */
                sendChild:{
                    serviceList:"", // 产品分类
                    brandList:"", // 服务分类
                    itemId: "", // 编辑选项的id
                    isBrand: 0,// 服务分类
                },
                // 店铺ID
                storeId:""
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
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.time = [];//评价时间
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
                /* 买家和卖家的表头不一样 */
                if(vm.cd.isBrand == "1"){
                    vm.table.tableColumns = vm.table.buyerColumns;
                    vm.cd.isBrand = "1";
                }else{
                    vm.table.tableColumns = vm.table.sellerColumns;
                    vm.cd.isBrand = "0";
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = vm.common.path2+"product/front/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    saleStatus: vm.cd.saleStatus,
                    isBrand: vm.cd.isBrand
                }
                if(!!vm.storeId){
                    ajaxData.storeId = vm.storeId
                }
                ajaxData[vm.cd.inputType] = vm.cd.inputval
                vm.table.loading = true;
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = res.data.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                    console.log(err);
                })
            },
            /* 删除一条列表 */
            fnDeleteItem (id) {
                let vm = this;
                console.log(id);
                this.$Modal.confirm({
                    title: '删除产品',
                    content: '确定要删除此产品吗？',
                    onOk: function(){
                        let url = vm.common.path2+"product/deleteById/"+id;
                        this.$http.delete(
                            url,
                        ).then(function(res){
                            console.log(res.data);
                            if(res.data.code == 200){
                                setTimeout(function(){
                                    vm.$Message.success('删除成功');
                                },500)
                                // 解决删除第(10n+1)个时，页数没有往后跳一页
                                let total = vm.table.recordsTotal;
                                console.log(total);
                                if(total>10&&total%10 == 1){
                                    vm.table.pageNun = vm.table.pageNun - 1;
                                }
                                vm.getData();
                            }else{
                                vm.$Message.error(res.data.message);
                            }
                        }).catch(function(err){
                            console.log(err);
                            vm.$Message.error(err);
                        })
                    }
                })
            },
            /* 查看详情 */
            show (index) {
                this.$Modal.info({
                    title: '老师活动详情',
                    content: `老师名称：${this.table.tableData1[index].teacherName}<br>老师类型：${this.table.tableData1[index].typeName}<br>活动类型：${this.table.tableData1[index].typeName}`
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
            changePageType (type) {
                this.pageType = type;
                if(type == "list"){
                    this.table.pageSize = this.table.size;
                    this.getData();
                }
            },
            /* 模态框 */
            fnShowModal () {
                let vm = this;
                console.log(vm.modal.type);
                if(vm.modal.type == 0){
                    //下架状态中
                    vm.modal.info = "确定要上架？"
                }else{
                    vm.modal.info = "确定要下架？"
                }
                vm.modal.mineModal = true;
            },
            /* 模态框的点击确定事件 */
            fnAsyncOK () {
                let vm = this;
                let id = vm.modal.id;
                let type = vm.modal.type;
                
                
                (function(){
                    let saleStatus = type == 0?1:0;
                    let url = vm.common.path2 + "product/modify/saleStatus/brand/"+id+"/"+saleStatus;
                    vm.$http.put(
                        url,
                    ).then(function(res){
                        console.log(res);
                        vm.getData();
                        vm.modal.loading = true;
                        vm.modal.mineModal = false;
                    }).catch(function(err){
                        console.log(err);
                        vm.getData();
                    })
                })()
                

                return false;
                if(!!!vm.storeId){
                    /* 平台管理员上下架 */
                    let url = vm.common.path2 + "products/update";
                    let ajaxData = {
                        saleStatus : type == 0?1:0,
                        // productId: id,
                        id: id,
                        isEnabled: 0,
                    }
                    console.log(ajaxData);
                    vm.$http.put(
                        url,
                        ajaxData,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    ).then(function(res){
                        console.log(res);
                        vm.getData();
                        vm.modal.loading = true;
                        vm.modal.mineModal = false;
                    }).catch(function(err){
                        console.log(err);
                        vm.getData();
                    })
                }else{
                    /* 店长上下架 */
                    let url = vm.common.path2 + "productStoreRefs/updateProductStoreRef"
                    let ajaxData = {
                        saleStatus : type == 0?1:0,
                        id: id,
                        // productId: id,
                        isEnabled: 0,
                        storeId: vm.storeId
                    }
                    vm.$http.post(
                        url,
                        ajaxData
                    ).then(function(res){
                        console.log(res);
                        vm.getData();
                        vm.modal.loading = true;
                        vm.modal.mineModal = false;
                    }).catch(function(err){
                        console.log(err);
                        vm.getData();
                    })
                }
            },
            // 服务分类接口数据
            fnGetProductCategory () {
                let vm = this;
                let ajaxData = {
                    categoryParentId:0,
                }
                let url = vm.common.path2 + "productCategory/front/findByPage?pageSize=1000";
                vm.$http.post(
                    url,
                    ajaxData,
                ).then(function(res){
                    let oData = res.data.data.list;
                    vm.sendChild.serviceList = oData;
                    console.log(vm.sendChild);
                }).catch(function(err){
                    console.log(err);
                })
            },
            // 服务所属品牌接口数据
            fnGetStoreChainBrand () {
                let vm = this;
                let _url = "http://120.79.42.13:8080/";
                // let url = vm.common.path2 + "storeChainBrand/front/findByPage?pageSize=1000";
                let url = _url + "storeChainBrand/front/findByPage?pageSize=1000";
                vm.$http.post(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                ).then(function(res){
                    let oData = res.data.data.list;
                    vm.sendChild.brandList = oData
                }).catch(function(err){
                    console.log(err);
                })
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
                        
                        vm.cd.isBrand = "0"
                        vm.getData('init');//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
        },
        mounted: function(){
            let vm = this;
            /* 模拟身份 */
            // vm.storeId = 4;// 店长
            vm.storeId = "";// 管理员
            this.fnGetProductCategory();
            this.fnGetStoreChainBrand();
            this.getData();
            console.log(this.common);
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            AddPage,
            EditPage
        }
    }
</script>
<style scoped>

</style>