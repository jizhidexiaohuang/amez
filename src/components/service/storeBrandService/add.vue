<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" style="padding-bottom: 20px;">
            <FormItem label="服务分类" prop="type">
                <Select v-model="formValidate.type" placeholder="选择服务分类">
                    <Option :value="item.id" v-for="item in serviceList" :key="item.id">{{ item.categoryName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务所属品牌" prop="brandId" v-if="!!isShow">
                <Select v-model="formValidate.brandId" placeholder="选择服务所属品牌">
                    <Option :value="item.id" v-for="item in brandList" :key="item.id">{{ item.brandName }}</Option>
                </Select>
            </FormItem>
            
            <FormItem label="服务名称" prop="serverName">
                <Input v-model="formValidate.serverName" placeholder="请填写服务名称"></Input>
            </FormItem>

            <FormItem label="品牌标签" v-if="!!!storeId">
                <RadioGroup v-model="formValidate.label">
                    <Radio label="0">默认</Radio>
                    <Radio label="1">推荐</Radio>
                    <Radio label="2">新品</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem label="服务支持省份" prop="productCityList">
                <cityTable></cityTable>
                <Input style="position: absolute; left: 9999px;" v-model="formValidate.productCityList" placeholder="请填写服务名称"></Input>
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
            <FormItem label="上门费（元）" prop="homeFee" number='true' v-if="!!checkBoxCode">
                <InputNumber :min="0" v-model="formValidate.homeFee" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="正式美容师佣金（元）" number='true' prop="formalBeauticianCommission">
                <InputNumber :min="0" v-model="formValidate.formalBeauticianCommission" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="兼职美容师佣金（元）" number='true' prop="parttimeBeauticianCommission">
                <InputNumber :min="0" v-model="formValidate.parttimeBeauticianCommission" style="width: 100%;"></InputNumber>
            </FormItem>



            <FormItem label="到店服务员工" v-if="false">
                <storeTable></storeTable>
                <storeList></storeList>
                <!--<businessList></businessList>-->
            </FormItem>
            <FormItem label="上门服务员工" v-if="false">
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
            <FormItem label="轮播图" prop="uploadList">
                <MyUpload :defaultList="defaultList" v-on:listenUpload="getUploadList" :uploadConfig="uploadConfig"></MyUpload>
                <Input style="position:absolute; left: 9999px;" v-model="formValidate.uploadList" placeholder="请上传轮播图"></Input>
            </FormItem>
            <FormItem label="主图">
                <img v-if="formValidate.coverImg" class='demo-img' :src="formValidate.coverImg">
            </FormItem>
            <FormItem label="注意事项" prop="serverAttention">
                <Input v-model="formValidate.serverAttention" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写注意事项"></Input>
            </FormItem>
            <FormItem label="服务总时长（分）" prop="serverNeedTime">
                <InputNumber :min="0" v-model="formValidate.serverNeedTime" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="功效" prop="serverEffect" v-if="false">
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
            <FormItem label="服务详情（图片最大1M）" prop="serverIntroduce">
                <editor id="editor_id" height="700px" width="100%;" :content="formValidate.serverIntroduce"
                    :uploadJson="path"
                    :loadStyleMode="false"
                    @on-content-change="onContentChange"
                    v-model="formValidate.serverIntroduce"
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
    import storeList from './storeList.vue'
    import homeTable from './homeTable.vue'
    import homeList from './homeList.vue'

    export default {
        data () {
            return {
                formValidate: {
                    label: '0', // 品牌标签
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
                    serverNeedTime: 0,//服务总时长
                    serverEffect: [],//功效
                    formalWorker: "",//正式员工提成
                    ParTtimeWorker: "",//兼职员工服务提成
                    auditStatus: '1',// 审核状态 0 待审核 1已审核 2不同过
                    serverEffect1: [], // 服务方式
                    isSupportHome:0, // 是否支持上门 1支持 0不支持
                    isSupportStore:0, // 是否支持到店 1支持 0不支持
                    parttimeBeauticianCommission: 0, // 兼职美容师佣金
                    formalBeauticianCommission: 0, // 正式美容师佣金
                    productCityList: '',
                    uploadList: '', // 轮播图
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
                    uploadList: [
                        {required: true, message: ' ', pattern: /.+/, trigger: 'change'}
                    ],
                    productCityList: [
                        {required: true, message: '请填写服务支持省份', pattern: /.+/, trigger: 'change'}
                    ],
                    serverEffect1: [
                        {required: true, message: '请选择预约方式', pattern: /.+/, trigger: 'change'}
                    ],
                    originalPrice: [
                        {required: true, message: '请填写市场价', pattern: /.+/, trigger: 'change'}
                    ],
                    salePrice: [
                        {required: true, message: '请填写服务销售价', pattern: /.+/, trigger: 'change'}
                    ],
                    formalBeauticianCommission: [
                        {required: true, message: '请填写正式美容师佣金', pattern: /.+/, trigger: 'change'}
                    ],
                    parttimeBeauticianCommission: [
                        {required: true, message: '请填写兼职美容师佣金', pattern: /.+/, trigger: 'change'}
                    ],
                    serverAttention: [
                        {required: true, message: '请填写注意事项', pattern: /.+/, trigger: 'change'}
                    ],
                    serverNeedTime: [
                        {required: true, message: '请填写服务总时长', pattern: /.+/, trigger: 'change'}
                    ],
                    serverIntroduce: [
                        {required: true, message: '请填写服务详情', pattern: /.+/, trigger: 'change'}
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
                uploadList:[],//图片列表
                // path:"http://172.16.20.151:8009/system/api/file/uploadForKindeditor"
                path: this.common.path2 + "system/api/file/uploadForKindeditor",
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
                uploadConfig:{
                    num:6
                },
                storeId:"",// 店铺id
                isShow: true,
                checkBoxCode: false,
                storeCheckBoxCode: false,
                btnCode: false,
            }
        },
        props: ["sendChild"],
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                vm.formValidate.productCityList = !!vm.$store.getters.cityList.length?'存在':'';
                vm.formValidate.uploadList = !!vm.uploadList.length?'存在':'';

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
                            homeFee: !!vm.formValidate.homeFee?+vm.formValidate.homeFee*100:"", // 上门费
                            formalBeauticianCommission: !!vm.formValidate.formalBeauticianCommission?+vm.formValidate.formalBeauticianCommission*100:'', // 正式美容师佣金
                            parttimeBeauticianCommission: !!vm.formValidate.parttimeBeauticianCommission?+vm.formValidate.parttimeBeauticianCommission*100:'', // 兼职美容师佣金
                            coverImg: vm.uploadList.length>0?vm.uploadList[0].url:"",//封面图
                            serverAttention: vm.formValidate.serverAttention, // 注意事项
                            serverNeedTime: vm.formValidate.serverNeedTime, // 服务总时长
                            serverEffect: JSON.stringify(vm.formValidate.serverEffect), // 功效
                            serverIntroduce: vm.formValidate.serverIntroduce, // 商品介绍
                            isBrand: true,// 服务分类
                            auditStatus: vm.formValidate.auditStatus, // 审核状态，0待审核，1通过，2不通过
                            brandId: vm.formValidate.brandId, // 服务所属品牌
                            isPlatform: false,
                            saleStatus: 0,
                        }
                        if(!!!vm.storeId){
                            ajaxData.product.label = vm.formValidate.label;
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
                            obj.beauticianNickName = storeList[i].beauticianNickName;
                            obj.beauticianHeadImgUrl = storeList[i].beauticianHeadImgUrl;
                            obj.serverType = 0;
                            obj.memberId = storeList[i].memberId;
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
                            obj.memberId = homeList[j].memberId;
                            ajaxData.homeProductBeauticianRefList.push(obj);
                        }
                        /* 商品-美容师-关联集合（招募） recruitProductBeauticianRefList */
                        ajaxData.recruitProductBeauticianRefList = [];
                        let url = vm.common.path2+"product/add/brand";
                        vm.btnCode = true;
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
                            vm.btnCode = false;
                            vm.$Message.success('成功');
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
                let url = vm.common.path2 + "storeChainBrand/front/findByPage?pageSize=1000";
                vm.$http.post(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                    /* {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    } */
                ).then(function(res){
                    let oData = res.data.data.list;
                    vm.brandList = oData
                }).catch(function(err){
                })
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
                    vm.checkBoxCode = false;
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

