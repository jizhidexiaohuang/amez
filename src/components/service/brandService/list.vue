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
        <!-- 模态框 店长上架 -->
        <Modal
            v-model="server.mineModal"
            title="上架服务"
            :loading="server.loading"
            @on-ok="fnAsyncOK2">
            确定上架？
        </Modal>
        <!-- 审核 模态框 -->
        <Modal
            v-model="audit.mineModal"
            title="审核门店自营服务"
            :loading="audit.loading"
            @on-ok="fnAsyncOK1">
            <Form>
                <FormItem label="审核状态">
                    <RadioGroup v-model="audit.auditStatus">
                        <Radio label="1">通过</Radio>
                        <Radio label="2">不通过</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="审核原因">
                    <Input v-model="audit.auditReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入审核原因"></Input>
                </FormItem>
            </Form>
        </Modal>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'" :sendChild="sendChild"  class="testWrap" v-on:returnList="changePageType"/>
        <!-- 编辑容器 -->
        <EditPage v-if="pageType == 'edit'" :sendChild="sendChild" class="testWrap" v-on:returnList="changePageType"/>
        <!-- 上架容器 -->
        <OnSalePage v-if="pageType == 'onSale'" :sendChild="sendChild" class="testWrap" v-on:returnList="changePageType"/>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Form :model="cd" inline>
                    <FormItem style="margin-bottom:10px;">
                        状态
                        <Select v-model="cd.saleStatus" style="width:200px">
                            <Option value="">全部</Option>
                            <Option value="0">仓库中</Option>
                            <Option value="1">销售中</Option>
                        </Select>
                    </FormItem>

                    <FormItem style="margin-bottom:10px;">
                        审核状态
                        <Select v-model="cd.auditStatus" style="width:200px">
                            <Option value="">全部</Option>
                            <Option value="0">待审核</Option>
                            <Option value="1">通过</Option>
                            <Option value="2">不通过</Option>
                        </Select>
                    </FormItem>



                    <FormItem style="margin-bottom:10px;" v-if="false">
                        发布时间
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
                                <Option value="serverName">服务名称</Option>
                                <Option value="storeName">店铺名称</Option>
                                <Option value="phone">注册手机</Option>
                            </Select>
                        </Input>
                    </Col>
                    <Col span="5">
                        <Button v-if="!!operators.see" style="margin-left:5px;" @click.native="getData('see')" type="primary" icon="ios-search">查询</Button>
		                <Button v-if="!!operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    </Col>
                    <Col span="3" offset="11" v-if="!!operators.add&&!!storeId">
                        <Button style="float:right;" @click.native="changePageType('add')" type="success" icon="android-add">发布服务</Button>
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
    import AddPage from './add.vue'
    import EditPage from './edit.vue'
    import OnSalePage from './onSale.vue'
    export default {
        data () {
            return {
                mainStoreName:'', //店铺名称
                isAdmin: '', // 是否店长
                operators: {},
                modal:{
                    mineModal: false,
                    loading: true,
                    type: '0',
                    info: '确定要上架？',
                    id:"",
                    storeId:"",//店铺id
                },
                server:{
                    loading: true,
                    mineModal: false,
                },
                audit:{
                    mineModal: false,
                    loading: true,
                    auditStatus: '0', // 审核状态
                    auditReason: '', // 审核原因
                    id: '' 
                },
                cd:{
                    time:[],//评论时间范围
                    saleStatus:"",//上下架状态
                    auditStatus:"",//上下架状态
                    inputval:'',//选择的值
                    inputType:'serverName',//input类型
                    isBrand:false,// 门店自营还是产品
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
                    buyerColumns: [
                        /* {
                            type: 'index',
                            width: 80,
                            align: 'center',
                            title: '序号'
                        }, */
                        {
                            title: '服务名称',
                            key: 'serverName',
                        },
                        {
                            title: '价格',
                            key: 'salePrice',
                            width: 100,
                            render: (h,params) => {
                                const row = params.row;
                                return +row.salePrice/100
                            }
                        },
                        {   
                            title: '服务方式',
                            key: 'isSupportHome',
                            width: 120,
                            render: (h,params) => {
                                const row = params.row;
                                let text = '';
                                if(!!row.isSupportHome&&!!!row.isSupportStore){
                                    text = '上门';
                                }else if(!!row.isSupportStore&&!!!row.isSupportHome){
                                    text = '到店';
                                }else if(!!row.isSupportStore&&!!row.isSupportHome){
                                    text = '到店和上门';
                                }else{
                                    text = '无';
                                }
                                return text;
                            }
                        },
                        {
                            title: '上门费用',
                            key: 'homeFee',
                            width: 100,
                            render: (h,params) => {
                                const row = params.row;
                                return !!row.homeFee?+row.homeFee/100:"0"
                            }
                        },
                        {
                            title: '服务门店',
                            key: 'storeName',
                            render: (h,params) => {
                                const row = params.row;
                                let str = '';
                                str = !!row.storeName?row.storeName: this.mainStoreName;
                                return str;
                            }
                        },
                        {
                            title: '状态',
                            key: 'saleStatus',
                            width: 100,
                            render: (h,params) => {
                                const row = params.row;
                                const color = row.saleStatus === 0 ? 'red' : 'blue';
                                const text = row.saleStatus === 0 ? '仓库中' : '销售中';
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
                            title: '审核结果',
                            key: 'auditStatus',
                            width: 100,
                            render: (h,params) => {
                                const row = params.row;
                                const color = row.auditStatus === 0 ? 'blue' : row.auditStatus === 1 ? 'green':'red';
                                const text = row.auditStatus === 0 ? '待审核' : row.auditStatus === 1 ? '通过':'未通过';
                                /* return h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, text); */
                                return text;
                            }
                        },
                        /* {
                            title: '发布时间',
                            key: 'createTime',
                            render: (h,params) =>{
                                const row = params.row
                                return this.common.baseFormatDate(row.createTime)
                            }
                        }, */
                        {
                            title: '操作',
                            key: 'action',
                            width: 280,
                            render: (h, params) => {
                                let arrs = [];
                                const row = params.row;
                                const color = row.saleStatus === 0 ? 'success' : 'warning';
                                const text = row.saleStatus === 0 ? '管理员上架' : '管理员下架';
                                const text1 = row.saleStatus  === 0 ? '店长上架': '店长下架';

                                let obj1 = h('Button', {
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
                                            this.sendChild.storeId = row.storeId;
                                            this.changePageType('edit');
                                        }
                                    }
                                }, '编辑')
                                if(!!this.operators.edit){
                                    arrs.push(obj1);
                                }
                                /* 管理员上下架 */
                                let obj2 = h('Button', {
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
                                if(!!this.operators.adminUpdown&&row.auditStatus!=0){
                                    if(!!!this.storeId){
                                        arrs.push(obj2);
                                    }
                                }
                                /* 门店上下架 */
                                let obj3 = h('Button', {
                                    props: {
                                        type: color,
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let row = params.row;
                                            this.fnOffShelves(row.id,row.storeId);
                                            if(row.saleStatus  == 0){
                                                // 商品上架
                                                this.sendChild.itemId = row.id;
                                                // this.changePageType('onSale');
                                                this.server.mineModal = true;
                                                this.fnOnShelves(row.id);

                                            }else if(row.saleStatus  == 1){
                                                // 商品下架
                                                this.fnOffShelves(row.id,row.storeId);
                                            }
                                        }
                                    }
                                }, text1)
                                if(!!this.operators.adminUpdown&&row.auditStatus!=0){
                                    if(!!this.storeId){
                                        arrs.push(obj3);
                                    }
                                }
                                /* 审核 */
                                let obj6 = h('Button', {
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
                                            this.audit.id = row.id;
                                            this.audit.auditStatus = row.auditStatus;
                                            this.audit.auditReason = !!row.auditReason?row.auditReason:'';
                                            this.fnShowModal1();
                                            // this.fnDeleteItem(params.row.id);
                                        }
                                    }
                                }, '审核')
                                if(row.auditStatus == 0&&!!!this.storeId&&!!this.operators.examine){
                                    arrs.push(obj6);
                                }  
                                let obj4 = h('Button', {
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
                                }, '删除')
                                if(!!this.operators.delete){
                                    arrs.push(obj4);
                                }
                                return h('div', arrs);
                            }
                        }
                    ],
                    //品牌服务表头
                    sellerColumns: [],
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',//子页面类型
                /* 传递给子组件的数据 */
                sendChild:{
                    serviceList:"", // 产品分类
                    brandList:"", // 服务分类
                    itemId: "", // 编辑选项的id
                    isBrand: false,// 服务分类
                },
                storeId:'',//店铺id
                brandId: '', // 品牌id
                formValidate:{
                    homeFee:'',
                    productId:'',
                    storeId:'',
                }
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
                vm.cd.isBrand = false
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.time = [];//评价时间
                vm.cd.saleStatus = "";// 状态
                vm.cd.auditStatus = "";// 状态
                vm.cd.inputType = "serverName";// 输入框类型
                vm.cd.inputval = "";// 输入框的值
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                if(!!init&&init=='see'){
                    vm.table.pageNun = 1;
                }
                /* 买家和卖家的表头不一样 */
                if(!!!vm.cd.isBrand){
                    vm.table.tableColumns = vm.table.buyerColumns;
                    vm.cd.isBrand = false;
                }else{
                    vm.table.tableColumns = vm.table.sellerColumns;
                    vm.cd.isBrand = true;
                }
                let start = vm.table.pageNun;//从第几页开始
                let size = vm.table.size;//每页条数
                ///product/front/findByPage
                let url = vm.common.path2+"product/findByPageForStore?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    isBrand: false,
                    isPlatform: false,
                }
                if(!!vm.storeId){
                    ajaxData.storeId = vm.storeId;
                }
                if(!!vm.cd.saleStatus){
                    ajaxData.saleStatus = vm.cd.saleStatus;
                }

                if(!!vm.cd.auditStatus){
                    ajaxData.auditStatus = vm.cd.auditStatus;
                }

                if(!!vm.cd.inputval){
                    ajaxData[vm.cd.inputType] = vm.cd.inputval
                }



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
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = res.data.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
            /* 删除一条列表 */
            fnDeleteItem (id) {
                let vm = this;
                this.$Modal.confirm({
                    title: '删除产品',
                    content: '确定要删除此产品吗？',
                    onOk: function(){
                        let url = vm.common.path2+"product/deleteById/"+id;
                        this.$http.delete(
                            url,
                        ).then(function(res){
                            if(res.data.code == 200){
                                setTimeout(function(){
                                    vm.$Message.success('删除成功');
                                },500)
                                // 解决删除第(10n+1)个时，页数没有往后跳一页
                                let total = vm.table.recordsTotal;
                                if(total>10&&total%10 == 1){
                                    vm.table.pageNun = vm.table.pageNun - 1;
                                }
                                // 再次刷新表格
                                vm.getData();
                            }else{
                                vm.$Message.error(res.data.message);
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
            changePageType (type) {
                this.pageType = type;
                if(type == "list"){
                    this.table.pageSize = this.table.size;
                    this.getData();
                }
                if(type == "add" || type == "onSale"){
                    this.$store.commit('STORE_LIST',[]);
                    this.$store.commit('RECRUIT_LIST',[]);
                    this.$store.commit('TOHOME_LIST',[]);
                }
            },
            /* 模态框 */
            fnShowModal () {
                let vm = this;
                if(vm.modal.type == 0){
                    //下架状态中
                    vm.modal.info = "确定要上架？"
                }else{
                    vm.modal.info = "确定要下架？"
                }
                vm.modal.mineModal = true;
            },
            fnShowModal1 () {
                let vm = this;
                vm.audit.mineModal = true;
            },
            /* 审核的模态框点击确定事件 */
            fnAsyncOK1 () {
                let vm = this;
                let id = vm.audit.id;
                let auditStatus = vm.audit.auditStatus;
                let ajaxData = {
                    "auditReason": vm.audit.auditReason
                }
                let url = vm.common.path2 + "product/modify/auditStatus/"+id+"/"+auditStatus+"?auditReason="+vm.audit.auditReason;
                vm.$http.put(
                    url,
                    ajaxData,
                ).then(function(res){
                    vm.getData();
                    vm.audit.loading = true;
                    vm.audit.mineModal = false;
                }).catch(function(err){
                })
            },
            /* 模态框的点击确定事件 */
            fnAsyncOK () {
                let vm = this;
                let id = vm.modal.id;
                let type = vm.modal.type;
                (function(){
                    let saleStatus = type == 0?1:0;
                    // let url = vm.common.path2 + "product/modify/saleStatus/self/"+id+"/"+saleStatus;
                    let url = type == 0?vm.common.path2 + "product/onSale/"+id:vm.common.path2 + "product/offShelves/"+id
                    vm.$http.get(
                        url,
                    ).then(function(res){
                        vm.getData();
                        vm.modal.loading = true;
                        vm.modal.mineModal = false;
                    }).catch(function(err){
                        vm.getData();
                    })
                })()
            },
            /* 店长下架 */
            //product/store/offShelves
            fnOffShelves (productId,storeId) {
                let vm = this;
                let url = vm.common.path2 + "product/store/offShelves";
                let ajaxData = {
                    'productId':productId,
                    'storeId':storeId
                }
                vm.$http.post(
                    url,
                    ajaxData
                ).then((res)=>{
                    vm.modal.loading = true;
                    vm.getData();
                }).catch((err)=>{
                    vm.getData();
                })
            },
            /* 店长上架 */
            fnOnShelves (id) {
                let vm = this;
                let url = vm.common.path2 + "product/detail/"+id;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data.data;
                    vm.fnInitQuery(oData);
                }).catch(function(err){
                })
            },
            /* 上架需要用到的信息 */
            fnInitQuery (data) {
                let vm = this;
                vm.formValidate.homeFee = !!data.product.homeFee?+data.product.homeFee/100:'';// 上门费
                vm.formValidate.productId = data.id;
                vm.formValidate.storeId = vm.storeId;
                // 上门服务员工 homeProductBeauticianRefList
                let homeList = data.homeProductBeauticianRefList;
                let homeArrs = [];
                homeList.forEach(function(item,index){
                    var obj = {
                        'id' : +item.beauticianId,
                        'beauticianNickName': item.beauticianNickName,
                        'headImgUrl': item.beauticianHeadImgUrl,
                        'memberId': item.memberId,
                    }
                    homeArrs.push(obj);
                });
                vm.$store.commit('TOHOME_LIST',homeArrs);
                // 到店服务员工 storeProductBeauticianRefList
                let storeList = data.storeProductBeauticianRefList;
                let storeArrs = [];
                storeList.forEach(function(item,index){
                    var obj = {
                        'id' : +item.beauticianId,
                        'beauticianNickName': item.beauticianNickName,
                        'headImgUrl': item.beauticianHeadImgUrl,
                        'memberId': item.memberId,
                    }
                    storeArrs.push(obj);
                });
                vm.$store.commit('STORE_LIST',storeArrs);
                // 招募员工 recruitProductBeauticianRefList
                let recruitList = data.recruitProductBeauticianRefList;
                let recruitArrs = [];
                recruitList.forEach(function(item,index){
                    var obj = {
                        'id' : +item.beauticianId,
                        'beauticianNickName': item.beauticianNickName,
                        'headImgUrl': item.beauticianHeadImgUrl,
                        'memberId': item.memberId,
                    }
                    recruitArrs.push(obj);
                });
                vm.$store.commit('RECRUIT_LIST',recruitArrs);
            },
            /* 确定上架 */
            fnAsyncOK2 () {
                let vm = this;
                let url = vm.common.path2 + "product/store/onSale"
                //添加品牌服务 
                let ajaxData = {};
                /* 店铺名称 */
                ajaxData.storeName = vm.mainStoreName;
                /* 上门费 */ 
                ajaxData.homeFee = !!vm.formValidate.homeFee?+vm.formValidate.homeFee*100:"";
                /* 商品id */
                ajaxData.productId = vm.sendChild.itemId;
                /* 店铺id */
                ajaxData.storeId = vm.storeId;
                /* 商品-美容师-关联集合（上门） homeProductBeauticianRefList */
                ajaxData.homeProductBeauticianRefList = [];
                var homeList = vm.$store.getters.tohomeList;
                for(var j = 0;j<homeList.length;j++){
                    var obj = {};
                    obj.beauticianId = homeList[j].id;
                    obj.beauticianNickName = homeList[j].beauticianNickName;
                    obj.beauticianHeadImgUrl = homeList[j].headImgUrl;
                    obj.serverType = 1;
                    obj.memberId = homeList[j].memberId;
                    ajaxData.homeProductBeauticianRefList.push(obj);
                }
                /*  商品-美容师-关联集合（到店） storeProductBeauticianRefList*/
                ajaxData.storeProductBeauticianRefList = [];
                var storeList = vm.$store.getters.storeList;
                for(var i = 0;i<storeList.length;i++){
                    var obj = {};
                    obj.beauticianId = storeList[i].id;
                    obj.beauticianNickName = storeList[i].beauticianNickName;
                    obj.beauticianHeadImgUrl = storeList[i].headImgUrl;
                    obj.serverType = 0;
                    obj.memberId = storeList[i].memberId;
                    ajaxData.storeProductBeauticianRefList.push(obj);
                }
                /* 商品-美容师-关联集合（招募） recruitProductBeauticianRefList */
                ajaxData.recruitProductBeauticianRefList = [];
                var recruitList = vm.$store.getters.recruitList;
                for(var b = 0;b<recruitList.length;b++){
                    var obj = {};
                    obj.beauticianId = recruitList[b].id;
                    obj.beauticianNickName = recruitList[b].beauticianNickName;
                    obj.beauticianHeadImgUrl = recruitList[b].headImgUrl;
                    obj.memberId = recruitList[b].memberId;
                    ajaxData.recruitProductBeauticianRefList.push(obj);
                }
                /* ajax提交 */
                vm.$http.post(
                    url,
                    ajaxData,
                ).then(function(res){
                    let oData = res.data
                    vm.getData();
                    vm.$Message.success('成功');
                }).catch(function(err){
                    vm.$Message.success('失败');
                    vm.getData();
                })
                vm.server.loading = true;
                vm.server.mineModal = false;
            },
            // 服务分类接口数据
            fnGetProductCategory () {
                let vm = this;
                let url = vm.common.path2 + "productCategory/front/findByPage?pageSize=1000";
                let ajaxData = {
                    categoryParentId:0,
                }
                vm.$http.post(
                    url,
                    ajaxData,
                ).then(function(res){
                    let oData = res.data.data.list;
                    vm.sendChild.serviceList = oData;
                }).catch(function(err){
                })
            },
            // 服务所属品牌接口数据
            fnGetStoreChainBrand () {
                let vm = this;
                let url = vm.common.path2 + "storeChainBrand/front/findByPage?pageSize=1000";
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
                        
                        vm.getData('init');//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
        },
        mounted: function(){
            let store = JSON.parse(window.localStorage.getItem("userInfo")).store;
            let vm = this;
            // storeId 用来区分门店还是管理员
            if(store!=null){
                vm.storeId = store.id;
                vm.mainStoreName = store.storeName;
            }
            this._u.operatorsEdit(this); // 控制页面按钮的显示
            this.fnGetProductCategory();
            this.fnGetStoreChainBrand();
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList();
        },
        components:{
            AddPage,
            EditPage,
            OnSalePage
        }
    }
</script>
<style scoped>

</style>