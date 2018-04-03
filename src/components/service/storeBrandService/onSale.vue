<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <Spin fix v-if="spinShow"></Spin>
            <FormItem label="上门费" v-if="!!isSupportHome">
                <Input v-model="formValidate.homeFee" placeholder="请填写上门费，单位元"></Input>
            </FormItem>
            <div v-if="!!isSupportStore" class="ivu-form" style="margin-bottom: 20px;">
                <div class="ivu-form-item-label" style="width: 160px; float:left; text-align:right;">
                    <span style="color:#ed3f14; font-size:12px; font-family: 'SimSun'; margin-right:4px;">*</span>到店服务员工
                </div>
                <div style="margin-left:160px;">
                    <storeTable></storeTable>
                    <storeList></storeList>
                </div>
            </div>
            <div v-if="!!isSupportHome" class="ivu-form" style="margin-bottom: 20px;">
                <div class="ivu-form-item-label" style="width: 160px; float:left; text-align:right;">
                    <span style="color:#ed3f14; font-size:12px; font-family: 'SimSun'; margin-right:4px;">*</span>上门服务员工
                </div>
                <div style="margin-left:160px;">
                    <homeTable></homeTable>
                    <homeList></homeList>
                </div>
            </div>
            <div v-if="false">
                <FormItem label="服务分类" prop="type">
                    <Select disabled v-model="formValidate.type" placeholder="选择服务分类">
                        <Option :value="item.id" v-for="item in serviceList" :key="item.id">{{ item.categoryName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="服务所属品牌" prop="brandId">
                    <Select disabled v-model="formValidate.brandId" placeholder="选择服务所属品牌">
                        <Option :value="item.id" v-for="item in brandList" :key="item.id">{{ item.brandName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="服务名称" prop="serverName">
                    <Input v-model="formValidate.serverName" placeholder="请填写服务名称"></Input>
                </FormItem>
                <FormItem label="服务支持城市">
                    <cityTable></cityTable>
                </FormItem>
                <FormItem label="市场价" prop="originalPrice" number='true'>
                    <Input v-model="formValidate.originalPrice" placeholder="请填写市场价，单位元"></Input>
                </FormItem>
                <FormItem label="服务销售价" prop="salePrice" number='true'>
                    <Input v-model="formValidate.salePrice" placeholder="请填写服务销售价，单位元"></Input>
                </FormItem>
                <FormItem label="预约方式">
                    <CheckboxGroup v-model="formValidate.serverEffect1">
                        <Checkbox label="store">到店服务</Checkbox>
                        <Checkbox label="home">上门服务</Checkbox>
                    </CheckboxGroup>
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
                <FormItem label="服务详情" prop="serverIntroduce">
                    <editor id="editor_id" height="700px" width="100%;" :content="formValidate.serverIntroduce"
                        :uploadJson="path"
                        :loadStyleMode="false"
                        @on-content-change="onContentChange"
                        v-model="formValidate.serverIntroduce"
                        type="post"
                    ></editor>
                </FormItem>
            </div>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button  v-if="false" type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    import cityTable from './cityTable.vue'

    import storeTable from './storeTable.vue'
    import homeTable from './homeTable.vue'
    import storeList from './storeList.vue'
    import homeList from './homeList.vue'
    export default {
        data () {
            return {
                isSupportHome: '',
                isSupportStore: '',
                formValidate: {
                    type: '',//服务分类
                    brandId: '',//服务所属品牌
                    serverName: '',//服务名称
                    originalPrice: '',//市场价
                    salePrice: '',//服务销售价
                    homeFee: '',//上门费
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
                    serverEffect1: [], // 服务方式
                    isSupportHome:0, // 是否支持上门 1支持 0不支持
                    isSupportStore:0, // 是否支持到店 1支持 0不支持
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
                uploadConfig:{
                    num:5
                },
                uploadList:[],//图片列表
                // path:"http://172.16.20.151:8009/system/api/file/uploadForKindeditor"
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                testCode: false,
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
                spinShow: false,// 加载开关
                isShow:true,
                storeId: '', // 店铺id
            }
        },
        props: ["sendChild"],
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;

                // 到店服务员工
                if(!!!vm.$store.getters.storeList.length){
                    if(!!vm.isSupportStore){
                        vm.$Message.error('请选择到店服务员工!');
                        return false;
                    }
                }
                // 上门服务员工
                if(!!!vm.$store.getters.tohomeList.length){
                    if(!!vm.isSupportHome){
                        vm.$Message.error('请选择上门服务员工!');
                        return false;
                    }
                }


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
                vm.$http.post(
                    url,
                    ajaxData,
                ).then(function(res){
                    let oData = res.data
                    vm.$emit('returnList', 'list'); 
                    vm.$Message.success('成功');
                }).catch(function(err){
                    vm.$Message.success(err);
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
                    vm.brandList = oData
                }).catch(function(err){
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

                // 服务支持城市
                let cityList = data.productCityList;
                vm.$store.commit('CITY_LIST',cityList);

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
                vm.isSupportHome = data.product.isSupportHome;
                vm.isSupportStore = data.product.isSupportStore;
                // 是否支持上门
                if(data.product.isSupportHome == 1){
                    vm.formValidate.serverEffect1.push('home');
                }
                // 是否支持到店
                if(data.product.isSupportStore == 1){
                    vm.formValidate.serverEffect1.push('store');
                }


                



                vm.formValidate.type = !!!data.productCategoryRef?"":data.productCategoryRef.categoryId;// 服务分类
                vm.formValidate.brandId = data.product.brandId; // 服务所属品牌
                vm.formValidate.serverName = data.product.serverName; // 服务名称
                vm.formValidate.originalPrice = +data.product.originalPrice/100; // 市场价
                vm.formValidate.salePrice = +data.product.salePrice/100; // 服务销售价


                vm.formValidate.homeFee = +data.product.homeFee/100;// 上门费
                vm.formValidate.coverImg = data.product.coverImg;//封面图
                vm.formValidate.serverAttention = data.product.serverAttention; // 注意事项
                vm.formValidate.serverNeedTime = data.product.serverNeedTime; // 服务总时长
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
            }
        },
        mounted: function(){
            let vm = this;
            let store = JSON.parse(window.localStorage.getItem("userInfo")).store;
            if(store!=null){
                vm.storeId = store.id;
            }
            if(!!vm.sendChild.brandId){
                vm.isShow = false;
                vm.formValidate.brandId = vm.sendChild.brandId;
            }
            this.fnGetProductCategory();
            this.fnGetStoreChainBrand();
            this.fnQueryById();
        },
        components:{
            MyUpload,
            cityTable,
            storeTable,
            homeTable,
            storeList,
            homeList
        }
    }
</script>
<style scoped>
</style>

