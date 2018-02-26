<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <Spin fix v-if="spinShow"></Spin>
            <FormItem label="服务分类" prop="type">
                <Select v-model="formValidate.type" placeholder="选择服务分类">
                    <Option :value="item.id" v-for="item in serviceList" :key="item.id">{{ item.categoryName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务所属品牌" prop="brandId" v-if="false">
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
            <FormItem label="轮播图" v-if="testCode">
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
            <FormItem label="审核结果" v-if="false">
                <RadioGroup v-model="formValidate.auditStatus">
                    <Radio label="0">待审核</Radio>
                    <Radio label="1">通过</Radio>
                    <Radio label="2">不通过</Radio>
                </RadioGroup>
            </FormItem>
            <!-- 店铺选择  只有管理员可以看到 -->
            <FormItem label="所属门店" prop="storeName" style="width:500px;" v-if="loginName=='admin'">
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
                    auditStatus:"",//审核结果
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
                uploadList:[],//图片列表 用来保存图片上传之后的数据
                // path:"http://172.16.20.151:8009/system/api/file/uploadForKindeditor"
                path:this.common.path2+"system/api/file/uploadForKindeditor",
                testCode: false,
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
                spinShow: false,// 加载开关
                storeId:'',//店铺id
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
                            serverBookType: vm.formValidate.serverBookType, // 销量
                            visitPrice: vm.formValidate.serverBookType == 2?+vm.formValidate.visitPrice*100:"", // 上门费
                            coverImg: vm.uploadList.length>0?vm.uploadList[0].url:"",//封面图
                            serverAttention: vm.formValidate.serverAttention, // 注意事项
                            serverNeedTime: vm.formValidate.serverNeedTime, // 服务总时长
                            serverEffect: JSON.stringify(vm.formValidate.serverEffect), // 功效
                            serverIntroduce: vm.formValidate.serverIntroduce, // 商品介绍
                            isBrand: vm.sendChild.isBrand,// 服务分类
                            auditStatus: vm.formValidate.auditStatus, // 审核状态，0待审核，1通过，2不通过
                            // brandId: vm.formValidate.brandId, // 服务所属品牌
                            id:vm.sendChild.itemId
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
                        console.log(ajaxData);
                        let url = vm.common.path2 + "product/modify"
                        vm.$http.put(
                            url,
                            ajaxData,
                        ).then(function(res){
                            let oData = res.data
                            console.log(oData);
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
                vm.$http.post(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
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
                vm.$http.post(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                ).then(function(res){
                    let oData = res.data.data.list;
                    vm.brandList = oData
                }).catch(function(err){
                    console.log(err);
                })
            },
            // 获取产品信息
            fnQueryById () {
                let vm = this;
                let id = vm.sendChild.itemId;
                let url = vm.common.path2 + "product/detail/"+id;
                vm.spinShow = true;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data.data;
                    vm.fnInitQuery(oData);
                    vm.spinShow = false;
                }).catch(function(err){
                    vm.spinShow = false;
                })
            },
            // 产品的信息遍历出来
            fnInitQuery (data) {
                let vm = this;
                vm.formValidate.type = !!!data.productCategoryRef?"":data.productCategoryRef.categoryId;// 服务分类
                // vm.formValidate.brandId = data.product.brandId; // 服务所属品牌
                vm.formValidate.serverName = data.product.serverName; // 服务名称
                vm.formValidate.originalPrice = +data.product.originalPrice/100; // 市场价
                vm.formValidate.salePrice = +data.product.salePrice/100; // 服务销售价
                vm.formValidate.serverBookType = data.product.serverBookType;// 预约方式 1上门 2到店
                vm.formValidate.visitPrice = +data.product.visitPrice/100;// 上门费
                vm.formValidate.coverImg = data.product.coverImg;//封面图
                vm.formValidate.serverAttention = data.product.serverAttention; // 注意事项
                vm.formValidate.serverNeedTime = data.product.serverNeedTime; // 服务总时长
                // serverEffect: JSON.stringify(vm.formValidate.serverEffect), // 功效
                if(vm.loginName == 'admin'&&!!data.product.storeId){
                    vm.formValidate.storeName = data.product.storeId
                }
                if(!!!data.product.serverEffect){
                    vm.formValidate.serverEffect = [];
                }else{
                vm.formValidate.serverEffect = JSON.parse(data.product.serverEffect);
                }
                vm.formValidate.serverIntroduce = data.product.serverIntroduce // 服务详情

                // 审核结果
                vm.formValidate.auditStatus = data.product.auditStatus;
                // 封面图以及轮播图的处理
                vm.defaultList = [];
                if(!!!data.product.coverImg){

                }else{
                    vm.formValidate.coverImg = data.product.coverImg;//封面图
                    if(!!data.productImg&&!!data.productImg.url){
                        let arrs = data.productImg.url.split(",");
                        let obj = {};
                        arrs.forEach(function(item,index){
                            obj = {
                                'url': item
                            }
                            vm.defaultList.push(obj);
                        })
                    }
                }
                vm.testCode = true;
                vm.uploadList = vm.defaultList;
            },
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
            vm.loginName = user.user.loginName;
            this.getData()
            this.serviceList = this.sendChild.serviceList;
            // this.brandList = this.sendChild.brandList;
            this.fnGetProductCategory();
            // this.fnGetStoreChainBrand();
            this.fnQueryById();
        },
        components:{
            MyUpload
        }
    }
</script>
<style scoped>
</style>

