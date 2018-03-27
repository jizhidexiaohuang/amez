<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140" style="padding-bottom: 20px;">
            <Spin fix v-if="spinShow"></Spin>
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

            <FormItem label="市场价（元）" prop="originalPrice" number='true'>
                <InputNumber :min="0" v-model="formValidate.originalPrice" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="服务销售价（元）" prop="salePrice" number='true'>
                <InputNumber :min="0" v-model="formValidate.salePrice" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="预约方式" prop="serverEffect1">
                <CheckboxGroup v-model="formValidate.serverEffect1" @on-change="checkBoxChange">
                    <Checkbox label="store">到店服务</Checkbox>
                    <Checkbox label="home">上门服务</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="上门费（元）" prop="homeFee" number='true'  v-if="!!checkBoxCode">
                <InputNumber :min="0" v-model="formValidate.homeFee" style="width: 100%;"></InputNumber>
            </FormItem>

            <FormItem label="正式美容师佣金（元）" number='true'>
                <InputNumber :min="0" v-model="formValidate.formalBeauticianCommission" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="兼职美容师佣金（元）" number='true'>
                <InputNumber :min="0" v-model="formValidate.parttimeBeauticianCommission" style="width: 100%;"></InputNumber>
            </FormItem>

            <FormItem label="到店服务员工" v-if="!!storeId">
                <storeTable></storeTable>
                <storeList></storeList>
                <!--<businessList></businessList>-->
            </FormItem>
            <FormItem label="上门服务员工" v-if="!!storeId">
                <homeTable></homeTable>
                <homeList></homeList>
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
            <FormItem label="轮播图" v-if="testCode">
                <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
            </FormItem>
            <FormItem label="主图">
                <img v-if="formValidate.coverImg" class='demo-img' :src="formValidate.coverImg">
            </FormItem>
            <FormItem label="注意事项" prop="serverAttention">
                <Input v-model="formValidate.serverAttention" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写注意事项"></Input>
            </FormItem>
            <FormItem label="服务总时长（分）" prop="serverNeedTime">
                <Input v-model="formValidate.serverNeedTime" placeholder="请填写服务总时长"></Input>
            </FormItem>
            <FormItem label="功效" prop="serverEffect" v-if="false">
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
            <FormItem>
                <Button :disabled="!!btnCode" type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
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
                btnCode: false,
                formValidate: {
                    type: '',//服务分类
                    brandId: '',//服务所属品牌
                    serverName: '',//服务名称
                    originalPrice: 0,//市场价
                    salePrice: 0,//服务销售价
                    homeFee: 0,//上门费
                    commissionType: '1',//平台佣金类型
                    commission: '',//佣金价格
                    coverImg:'',//图片地址
                    serverIntroduce: '',//服务详情
                    serverAttention: '',//注意事项
                    serverNeedTime: '',//服务总时长
                    serverEffect: [],//功效
                    formalWorker: "",//正式员工提成
                    ParTtimeWorker: "",//兼职员工服务提成
                    auditStatus:"1",//审核结果
                    serverEffect1: [], // 服务方式
                    isSupportHome:0, // 是否支持上门 1支持 0不支持
                    isSupportStore:0, // 是否支持到店 1支持 0不支持
                    formalBeauticianCommission: 0, // 正式美容师佣金
                    parttimeBeauticianCommission: 0, // 兼职美容师佣金
                },
                ruleValidate: {
                    type: [
                        {required: true, message: '请选择服务分类', pattern: /.+/, trigger: 'change'}
                    ],
                    brandId: [
                        {required: true, message: '请选择品牌分类', pattern: /.+/, trigger: 'change'}
                    ],
                    serverName: [
                        {required: true, message: '请填写服务名称', pattern: /.+/, trigger: 'change'}
                    ],
                    serverEffect1: [
                        {required: true, message: '请选择预约方式', pattern: /.+/, trigger: 'change'}
                    ],
                    storeName: [
                        {required: true, message: '请选择门店', pattern: /.+/, trigger: 'change'}
                    ],

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
                    num:6
                },
                uploadList:[],//图片列表
                // path:"http://172.16.20.151:8009/system/api/file/uploadForKindeditor"
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                testCode: false,
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
                spinShow: false,// 加载开关
                isShow:true,
                storeId:'',// 店铺id
                checkBoxCode: false,
                storeCheckBoxCode: false,
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
                            homeFee: !!vm.formValidate.homeFee?+vm.formValidate.homeFee*100:0, // 上门费
                            formalBeauticianCommission: !!vm.formValidate.formalBeauticianCommission?+vm.formValidate.formalBeauticianCommission*100:0, // 正式美容师佣金
                            parttimeBeauticianCommission: !!vm.formValidate.parttimeBeauticianCommission?+vm.formValidate.parttimeBeauticianCommission*100:0, // 兼职美容师佣金
                            coverImg: vm.uploadList.length>0?vm.uploadList[0].url:"",//封面图
                            serverAttention: vm.formValidate.serverAttention, // 注意事项
                            serverNeedTime: vm.formValidate.serverNeedTime, // 服务总时长
                            serverEffect: JSON.stringify(vm.formValidate.serverEffect), // 功效
                            serverIntroduce: vm.formValidate.serverIntroduce, // 商品介绍
                            isBrand: true,// 服务分类
                            auditStatus: vm.formValidate.auditStatus, // 审核状态，0待审核，1通过，2不通过
                            brandId: vm.formValidate.brandId, // 服务所属品牌
                            id:vm.sendChild.itemId,
                            isPlatform: false,
                        }
                        /* 是否支持到店 isSupportStore */
                        ajaxData.product.isSupportStore = 0;
                        vm.formValidate.serverEffect1.forEach(function(item,index){
                            if(item == 'store'){
                                ajaxData.product.isSupportStore = 1;
                            }
                        })
                        /* 是否支持上门 isSupportHome */
                        ajaxData.product.isSupportHome = 0;
                        vm.formValidate.serverEffect1.forEach(function(item,index){
                            if(item == 'home'){
                                ajaxData.product.isSupportHome = 1;
                            }
                        })
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
                        /* 商品城市集合 */
                        ajaxData.productCityList = vm.$store.getters.cityList;

                        /*  商品-美容师-关联集合（到店） storeProductBeauticianRefList*/
                        ajaxData.storeProductBeauticianRefList = [];
                        var storeList = vm.$store.getters.storeList;
                        for(var i = 0;i<storeList.length;i++){
                            var obj = {};
                            obj.beauticianId = storeList[i].id;
                            obj.beauticianNickname = storeList[i].beauticianNickname;
                            obj.beauticianHeadImgUrl = storeList[i].headImgUrl;
                            obj.serverType = 0;
                            ajaxData.storeProductBeauticianRefList.push(obj);
                        }
                        /* 商品-美容师-关联集合（上门） homeProductBeauticianRefList */
                        ajaxData.homeProductBeauticianRefList = [];
                        var homeList = vm.$store.getters.tohomeList;
                        for(var j = 0;j<homeList.length;j++){
                            var obj = {};
                            obj.beauticianId = homeList[j].id;
                            obj.beauticianNickName = homeList[j].beauticianNickName;
                            obj.beauticianHeadImgUrl = homeList[j].headImgUrl;
                            obj.serverType = 1;
                            ajaxData.homeProductBeauticianRefList.push(obj);
                        }
                        /* 商品-美容师-关联集合（招募） recruitProductBeauticianRefList */
                        ajaxData.recruitProductBeauticianRefList = [];

                        let url = vm.common.path2 + "product/modify/brand"
                        vm.btnCode = true;
                        vm.$http.post(
                            url,
                            ajaxData,
                        ).then(function(res){
                            let oData = res.data
                            vm.$emit('returnList', 'list'); 
                            vm.$Message.success('成功');
                            vm.btnCode = false;
                        }).catch(function(err){
                            vm.$Message.error('提交失败!');
                            vm.btnCode = false;
                        })
                    } else {
                        vm.$Message.error('提交失败!');
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
                if(data.length>0){
                    vm.formValidate.coverImg = data[0].url;
                }else{
                    vm.formValidate.coverImg = '';
                }
                vm.uploadList = data;
            },
            // 服务分类接口数据
            fnGetProductCategory () {
                let vm = this;
                let url = vm.common.path2 + "productCategory/front/findByPage?pageSize=1000";
                let ajaxData = {
                    pid:0,
                }
                vm.$http.post(
                    url,
                    ajaxData,
                ).then(function(res){
                    let oData = res.data.data.list;
                    vm.serviceList = oData;
                }).catch(function(err){
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
                    }
                    homeArrs.push(obj);
                });
                vm.$store.commit('TOHOME_LIST',homeArrs);

                // 是否支持上门
                if(data.product.isSupportHome == 1){
                    vm.formValidate.serverEffect1.push('home');
                    vm.checkBoxCode = true;
                }
                // 是否支持到店
                if(data.product.isSupportStore == 1){
                    vm.formValidate.serverEffect1.push('store');
                    vm.storeCheckBoxCode = true;
                }



                vm.formValidate.type = !!!data.productCategoryRef?"":data.productCategoryRef.categoryId;// 服务分类
                vm.formValidate.brandId = data.product.brandId; // 服务所属品牌
                vm.formValidate.serverName = data.product.serverName; // 服务名称
                vm.formValidate.originalPrice = +data.product.originalPrice/100; // 市场价
                vm.formValidate.salePrice = +data.product.salePrice/100; // 服务销售价


                vm.formValidate.homeFee = !!data.product.homeFee?+data.product.homeFee/100:0;// 上门费
                vm.formValidate.formalBeauticianCommission = !!data.product.formalBeauticianCommission?+data.product.formalBeauticianCommission/100:0;// 正式美容师佣金
                vm.formValidate.parttimeBeauticianCommission = !!data.product.parttimeBeauticianCommission?+data.product.parttimeBeauticianCommission/100:0;// 兼职美容师佣金



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
            },
             // 多选框变化
            checkBoxChange (list) {
                let vm = this;
                if(list.length>0){
                    vm.checkBoxCode = false;
                    vm.storeCheckBoxCode = false;
                    list.forEach((item,index)=>{
                        if(item == 'home'){
                            vm.checkBoxCode = true;
                        }
                        if(item == 'store'){
                            vm.storeCheckBoxCode = true;
                        }
                    })
                }else{
                    vm.storeCheckBoxCode = false;
                }
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
.demo-img{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
</style>

