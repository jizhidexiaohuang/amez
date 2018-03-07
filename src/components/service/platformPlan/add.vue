<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem label="服务分类" prop="type">
                <Select v-model="formValidate.type" placeholder="选择服务分类">
                    <Option :value="item.id" v-for="item in serviceList" :key="item.id">{{ item.categoryName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务所属品牌" prop="brandId">
                <Select v-model="formValidate.brandId" placeholder="选择服务所属品牌">
                    <Option :value="item.id" v-for="item in brandList" :key="item.id">{{ item.brandName }}</Option>
                </Select>
            </FormItem>
            
            <FormItem label="服务名称" prop="serverName">
                <Input v-model="formValidate.serverName" placeholder="请填写服务名称"></Input>
            </FormItem>

            




            <FormItem label="市场价" prop="originalPrice" number='true'>
                <Input v-model="formValidate.originalPrice" placeholder="请填写市场价，单位元"></Input>
            </FormItem>
            <FormItem label="服务销售价" prop="salePrice" number='true'>
                <Input v-model="formValidate.salePrice" placeholder="请填写服务销售价，单位元"></Input>
            </FormItem>
            <FormItem label="预约方式">
                <RadioGroup v-model="formValidate.serverBookType">
                    <Radio label="1">到店服务</Radio>
                    <Radio label="2">上门服务</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="上门费" prop="visitPrice" number='true' v-if="formValidate.serverBookType == 2">
                <Input v-model="formValidate.visitPrice" placeholder="请填写上门费，单位元"></Input>
            </FormItem>

            <FormItem label="到店服务员工">
                <storeTable></storeTable>
                <storeList></storeList>
                <!--<businessList></businessList>-->
            </FormItem>
            <FormItem label="上门服务员工">
                <homeTable></homeTable>
                <homeList></homeList>
                <!--<businessList></businessList>-->
            </FormItem>

            <FormItem label="服务支持商家">
                <shopTable></shopTable>
                <shopList></shopList>
                <!--<businessList></businessList>-->
            </FormItem>
            <FormItem label="服务产品">
                <goodsTable></goodsTable>
                <goodsList></goodsList>
                <!--<businessList></businessList>-->
            </FormItem>
          



            <FormItem label="正式员工服务提成" prop="formalWorker" v-if="false">
                <Input v-model="formValidate.formalWorker" placeholder="请填写正式员工服务提成"></Input>
            </FormItem>
            <FormItem label="兼职员工服务提成" prop="ParTtimeWorker" v-if="false">
                <Input v-model="formValidate.ParTtimeWorker" placeholder="请填写兼职员工服务提成"></Input>
            </FormItem>

            <FormItem label="平台佣金类型" prop="commissionType" v-if="false">
                <RadioGroup v-model="formValidate.commissionType">
                    <Radio label="1">类目佣金</Radio>
                    <Radio label="2">自定义佣金</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="佣金价格" prop="commission" number='true' v-if="false">
                <Input v-model="formValidate.commission" placeholder="请填写佣金价格，单位元"></Input>
            </FormItem>
            <FormItem label="轮播图">
                <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
            </FormItem>
            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
            </FormItem>
            <FormItem label="注意事项" prop="serverAttention">
                <Input v-model="formValidate.serverAttention" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写注意事项"></Input>
            </FormItem>
            <FormItem label="服务总时长" prop="serverNeedTime">
                <Input v-model="formValidate.serverNeedTime" placeholder="请填写服务总时长"></Input>
            </FormItem>
            <FormItem label="功效" prop="serverEffect">
                <CheckboxGroup v-model="formValidate.serverEffect">
                    <Checkbox label="美白">美白</Checkbox>
                    <Checkbox label="补水">补水</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="审核" v-if="false">
                <RadioGroup v-model="formValidate.auditStatus">
                    <Radio label="0">待审核</Radio>
                    <Radio label="1">已审核</Radio>
                    <Radio label="2">不通过</Radio>
                </RadioGroup>
            </FormItem>
            <!-- 店铺选择  只有管理员可以看到 -->
            <FormItem label="所属门店" prop="storeName" style="width:500px;" v-if="false">
                <Input v-model="formValidate.storeName" placeholder="请选择所属门店" @click.native="selectStore"></Input>
                <div class="tableBox" v-show="tableCtrl">
                    <Table
                        :loading="table.loading" 
                        :data="table.tableData1" 
                        :columns="tableColumns1" 
                        stripe
                        border
                        size="small"
                        @on-select="fnSelect"
                        @on-select-all="fnSelectAll"
                        @on-current-change="fnHighlight"
                        :show-header="false"
                        :stripe="false"
                        highlight-row
                        height="150"
                    ></Table>
                    <div style="overflow: hidden;" class="pageBox">
                        <div style="float: right;">
                            <Page 
                                size="small"
                                :total="table.recordsTotal" 
                                :current="table.pageNun"
                                @on-change="changePage"
                                @on-page-size-change="changeSize"
                            ></Page>
                        </div>
                    </div>
                </div>
            </FormItem>
            <FormItem label="服务详情" prop="serverIntroduce">
                <editor id="editor_id" height="700px" width="100%;" :content="formValidate.serverIntroduce"
                    :uploadJson="path"
                    :loadStyleMode="false"
                    @on-content-change="onContentChange"
                    v-model="formValidate.serverIntroduce"
                ></editor>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem>
            
        </Form>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    import shopTable from './shopTable.vue'
    import goodsTable from './goodsTable.vue'
    import shopList from './shopList.vue'
    import goodsList from './goodsList.vue'

    import storeTable from './storeTable.vue'
    import storeList from './storeList.vue'
    import homeTable from './homeTable.vue'
    import homeList from './homeList.vue'




    export default {
        data () {
            return {
                table:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                },
                tableColumns1: [
                    {
                        title: '店铺名称',
                        key: 'storeName'
                    }
                ],
                formValidate: {
                    type: '',//服务分类
                    brandId: '',//服务所属品牌
                    serverBookType: "1",//预约方式
                    serverName: '',//服务名称
                    originalPrice: '',//市场价
                    salePrice: '',//服务销售价
                    visitPrice: '',//上门费
                    commissionType: '1',//平台佣金类型
                    commission: '',//佣金价格
                    coverImg:'',//图片地址
                    serverIntroduce: '',//服务详情
                    serverAttention: '',//注意事项
                    serverNeedTime: '',//服务总时长
                    serverEffect: [],//功效
                    formalWorker: "",//正式员工提成
                    ParTtimeWorker: "",//兼职员工服务提成
                    auditStatus: 0, // 审核状态，0待审核，1通过，2不通过
                    storeName: '',// 店铺名称
                    storeId: '',// 店铺ID
                },
                ruleValidate: {
                    teacherName: [
                        { required: true, message: '老师姓名不能为空', trigger: 'blur' }
                    ],
                    activityType: [
                        { required: true, message: '请选择活动类型', trigger: 'change' }
                    ],
                    teacherType: [
                        { required: true, message: '请选择老师类型', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请填写服务详情', trigger: 'blur' },
                        { type: 'string', min: 20, message: '不少于20字', trigger: 'blur' }
                    ],
                    
                },
                defaultList: [],
                uploadConfig: {
                    num:5
                },
                uploadList:[],//图片列表
                // path:"http://172.16.20.151:8009/system/api/file/uploadForKindeditor"
                path:this.common.path2+"system/api/file/uploadForKindeditor",
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
                storeId: '',//店铺id
                loginName:'', // 管理员身份
                tableCtrl:false,
            }
        },
        props: ["sendChild"],
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;

                
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加品牌服务
                        let ajaxData = {};
                        /* 商品 */
                        ajaxData.product = {
                            serverName: vm.formValidate.serverName, // 商品名称
                            originalPrice: +vm.formValidate.originalPrice*100, // 原价
                            salePrice: +vm.formValidate.salePrice*100, // 销售价
                            saleVolume: vm.formValidate.saleVolume, // 销量
                            // serverBookType: vm.formValidate.serverBookType, // 预约方式
                            isSupportHome: vm.formValidate.serverBookType == 2?1:0, // 是否支持上门
                            isSupportStore: vm.formValidate.serverBookType == 1?1:0, // 是否支持到店
                            visitPrice: vm.formValidate.serverBookType == 2?+vm.formValidate.visitPrice*100:"", // 上门费
                            coverImg: vm.uploadList.length>0?vm.uploadList[0].url:"",//封面图
                            serverAttention: vm.formValidate.serverAttention, // 注意事项
                            serverNeedTime: vm.formValidate.serverNeedTime, // 服务总时长
                            serverEffect: JSON.stringify(vm.formValidate.serverEffect), // 功效
                            serverIntroduce: vm.formValidate.serverIntroduce, // 商品介绍
                            isBrand: false,
                            auditStatus: vm.formValidate.auditStatus, // 审核状态，0待审核，1通过，2不通过
                            brandId: vm.formValidate.brandId, // 服务所属品牌
                            isPlatform: true,
                        }
                        /* 商品分类 */
                        ajaxData.productCategoryRef = {
                            categoryId:vm.formValidate.type, // 商品分类id
                        }
                        /* 商品轮播图 */
                        let arrs = [];
                        if(vm.uploadList.length > 0){
                            vm.uploadList.forEach(function(item,index){
                                arrs.push(item.url);
                            })
                        }
                        ajaxData.productImg = {
                            type:1, // 图片类型，1轮播图
                            url: !!!arrs?"":arrs.join() // 存储图片地址
                        }
                       
                        /*  商品-店铺-关联集合 productStoreRefList*/  
                        ajaxData.productStoreRefList = [];
                        var productStoreList = vm.$store.getters.serviceStoreList;
                        for(var i = 0;i<productStoreList.length;i++){
                            var obj = {};
                            obj.storeId = productStoreList[i];
                            ajaxData.productStoreRefList.push(obj);
                        }
                        /*  商品-产品-关联集合  productProductPhysicalRefList */ 
                        ajaxData.productProductPhysicalRefList = [];
                        var productPhysicalList = vm.$store.getters.productList;
                        for(var j = 0;j<productPhysicalList.length;j++){
                            var obj = {};
                            obj.productId = productPhysicalList[j];
                            ajaxData.productProductPhysicalRefList.push(obj);
                        }


                        /*  商品-美容师-关联集合（到店） storeProductBeauticianRefList*/
                        ajaxData.storeProductBeauticianRefList = [];
                        var storeList = vm.$store.getters.storeList;
                        for(var i = 0;i<storeList.length;i++){
                            var obj = {};
                            obj.beauticianId = storeList[i];
                            obj.serverType = 0;
                            ajaxData.storeProductBeauticianRefList.push(obj);
                        }
                        /* 商品-美容师-关联集合（上门） homeProductBeauticianRefList */
                        ajaxData.homeProductBeauticianRefList = [];
                        var homeList = vm.$store.getters.tohomeList;
                        for(var j = 0;j<homeList.length;j++){
                            var obj = {};
                            obj.beauticianId = homeList[j];
                            obj.serverType = 1;
                            ajaxData.homeProductBeauticianRefList.push(obj);
                        }

                         /* 商品-美容师-关联集合（招募） recruitProductBeauticianRefList */
                        ajaxData.recruitProductBeauticianRefList = [];


                        console.log(ajaxData.productStoreRefList);
                        console.log(ajaxData.productProductPhysicalRefList);
                        let url = vm.common.path2+"product/add/platformSelf";
                        vm.$http.post(
                            url,
                            JSON.stringify(ajaxData),
                            {
                                headers:{
                                    'Content-type':'application/json;charset=UTF-8'
                                }
                            }
                        ).then(function(res){
                            let oData = res.data
                            vm.$emit('returnList', 'list'); 
                            vm.$Message.success('成功');
                        }).catch(function(err){
                            console.log(err);
                            vm.$Message.success(err);
                        })
                        console.log(ajaxData);
                    } else {
                        this.$Message.error('提交失败!');
                    }
                })
            },
            // 重置
            handleReset (name) {
                this.formValidate.serverIntroduce = "";
                this.$refs[name].resetFields();
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            // 富文本
            onContentChange (val) {
                this.formValidate.serverIntroduce = val
            },
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
                console.log(vm.uploadList);
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
                    vm.serviceList = oData;
                }).catch(function(err){
                    console.log(err);
                })
            },
            // 服务所属品牌接口数据
            fnGetStoreChainBrand () {
                let vm = this;
                let _url = "http://120.79.42.13:8080/";
                let url = _url + "storeChainBrand/front/findByPage?pageSize=1000";
                // let url = vm.common.path22 + "storeChainBrand/front/findByPage?pageSize=1000";
                vm.$http.post(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data.data.list;
                    vm.brandList = oData
                }).catch(function(err){
                    console.log(err);
                })
            },
             /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
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
             /*表格选中高亮显示*/
            fnHighlight(currentRow,oldCurrentRow){
                this.formValidate.storeName = currentRow.storeName;
                this.formValidate.storeId = currentRow.id;
                this.storeId = currentRow.id;
                this.tableCtrl = false;
            },
            /* 数据获取 */
            getData () {
                let vm = this;
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = vm.common.path2+"store/front/findByPage?pageNo="+start+'&pageSize='+size;
                let ajaxData = {
                }
                vm.loading = true;
                vm.$http.post(
                    url,
                    // ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res.data);
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = oData.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
            // 点击所属门店输入框，显示或隐藏table
            selectStore(){
                if(this.tableCtrl){
                    this.tableCtrl = false;
                }else{
                    this.tableCtrl = true;
                }
            },
        },
        mounted: function(){
            let user = JSON.parse(window.localStorage.getItem("userInfo"));
            let vm = this;
            this.getData()
            vm.loginName = user.user.loginName;
            if(user.store!=null){
                vm.storeId = user.store.storeId;
            }
            this.fnGetProductCategory();
            this.fnGetStoreChainBrand();
        },
        components:{
            MyUpload,
            shopTable,
            goodsTable,
            shopList,
            goodsList,
            storeTable,
            homeTable,
            storeList,
            homeList
        }
    }
</script>
<style lang="scss" scoped>
.tableBox{
    width:380px;
    position: absolute;
    top:-185px;
    left: 0;
    z-index: 2;
    border-radius: 5px;
    .pageBox{
        background: #fff;
        border:1px solid #e9eaec;
        border-top:none;
        border-radius:0 0 5px 5px;
    }
}
</style>


