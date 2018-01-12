<template>
  <div class="addPage">
    
    <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <Row>

          <Col span="12" class="boxStyle">
            <h2>新增门店基本资料</h2>          
            <div class="box">
                <FormItem label="门店名称" prop="storeName">
                    <Input v-model="formValidate.storeName"></Input>
                </FormItem>
                <FormItem label="门店电话" prop="storeTel">
                    <Input v-model="formValidate.storeTel"></Input>
                </FormItem>
                <FormItem label="营业时间">
                    <Row>
                        <Col span="11">
                            <FormItem prop="storeTime">
                                <!-- <DatePicker type="date" v-model="formValidate.storeTime"></DatePicker> -->
                                <TimePicker format="HH:mm" :value="formValidate.storeTime" type="timerange" placement="bottom-end"></TimePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="老板姓名" prop="sellerAccount">
                    <Input v-model="formValidate.sellerAccount"></Input>
                </FormItem>
                <FormItem label="老板账号" prop="bossPhone">
                    <Input v-model="formValidate.bossPhone"></Input>
                </FormItem>
                <FormItem label="店长姓名" prop="storeManagerAccount">
                    <Input v-model="formValidate.storeManagerAccount"></Input>
                </FormItem>
                <FormItem label="店长账号" prop="sellerPhone">
                    <Input v-model="formValidate.sellerPhone"></Input>
                </FormItem>
                <FormItem label="所属品牌" prop="branch">
                    <Select v-model="formValidate.branch">
                        <Option :value="item.id" v-for='(item ,index) in branchList' :key="index">{{item.brandName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="主营特色项目" prop="mainProject">
                    <CheckboxGroup v-model="formValidate.mainProject">
                        <Checkbox v-for='(item,index) in projectList' :key="index" :label="item" :value="item">{{item}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="" prop="">
                    <Row>
                        <Col span="8"><Input v-model="project" class="addProject"></Input></Col>
                        <Button type="primary" class="addBtn" @click="addProject">新增</Button>
                        <Button type="ghost" @click="resetProject">取消</Button>
                    </Row>
                </FormItem>
                <FormItem label="是否属于老店" prop="oldStore">
                    <Row>
                        <Col span="8">
                             <RadioGroup v-model="oldStore" @on-change="disabled = !disabled">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </RadioGroup>
                        </Col>
                        <Col span="3">实际经营年限</Col>
                        <Col span="3">
                            <InputNumber :max="10" :min="1" v-model="managerYear" :disabled="disabled"></InputNumber>
                        </Col>
                        <Col span="1" class="textAlign">年</Col>
                    </Row>
                </FormItem>
                <FormItem label="店铺地址" prop="">
                    <Row>
                        <Col span="20">
                            <!-- <v-distpicker :placeholders="placeholders" @selected="onSelected"></v-distpicker> -->
                            <CityLinkage :cityConfig="cityConfig" v-on:listenCity="getCity"></CityLinkage>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="店铺地址" prop="">
                    <Row>
                        <Col span="12">
                            <AutoComplete
                            v-model="seat"
                            :data="positionList"
                            @on-search="handleSearch"
                            @on-select="selectKeyWords"
                            placeholder="具体地点关键字"
                            style="width:200px"></AutoComplete>
                        </Col>
                        <Col span="4"><Button type="primary" @click="orientate">定位</Button></Col>
                    </Row>
                </FormItem>
                <FormItem label="" prop="">
                    <Row>
                        <Col span="20">
                            <div id="map" style="height:276px;"></div>
                        </Col>
                    </Row>
                </FormItem>
                <div class="box">
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                        <Button type="ghost" @click="handleReset('formValidate')" style="margin:0px 8px;">重置</Button>
                        <Button type="success" @click.native="returnHome('list')">返回</Button>    
                    </FormItem>
                </div>
            </div>
          </Col>  

          <Col span="12" class="boxStyle">
            <div class="box" v-show="false">
                <h3>门店等级</h3>
                <FormItem label="七星门店" prop="sevenStarStore">
                    <RadioGroup v-model="sevenStarStore">
                        <Radio label="1">是（限华苑会所，星源艾美）</Radio>
                        <Radio label="2">否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="艾美合伙人" prop="amPartner">
                    <RadioGroup v-model="amPartner">
                        <Radio label="1">是</Radio>
                        <Radio label="2">否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="百万合伙人" prop="millionPartner">
                    <RadioGroup v-model="millionPartner">
                        <Radio label="1">是</Radio>
                        <Radio label="2">否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="皇冠店长" prop="crownManager">
                    <RadioGroup v-model="crownManager">
                        <Radio label="1">是</Radio>
                        <Radio label="2">否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="上传合同">
                    <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadFile">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
            </div>
            <div class="box">
                <h3>认证照片</h3>
                <FormItem label="营业执照" prop="">
                    <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadLicense">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </FormItem>
                <FormItem label="身份证照片" prop="">
                    <Row>
                        <Col span="6">
                            <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadPositivePhoto">
                                <Button type="ghost" icon="ios-cloud-upload-outline">正面照</Button>
                            </Upload>
                        </Col>
                        <Col span="6">
                            <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadNegativePhoto">
                                <Button type="ghost" icon="ios-cloud-upload-outline">反面照</Button>
                            </Upload>
                        </Col>
                        <Col span="6">
                            <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadHandheldPhoto">
                                <Button type="ghost" icon="ios-cloud-upload-outline">手持照</Button>
                            </Upload>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="门店照片" prop="">
                    <Row>
                        <Col span="6">
                            <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadDoorPhoto">
                                <Button type="ghost" icon="ios-cloud-upload-outline">门头照</Button>
                            </Upload>
                        </Col>
                        <Col span="6">
                            <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadCashierPhoto">
                                <Button type="ghost" icon="ios-cloud-upload-outline">收银台</Button>
                            </Upload>
                        </Col>
                        <Col span="6">
                            <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadInPhoto">
                                <Button type="ghost" icon="ios-cloud-upload-outline">店内照</Button>
                            </Upload>
                        </Col>
                    </Row>  
                </FormItem>
                <FormItem label="上传合同">
                    <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadFile">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
            </div>
            <div class="box">
                <h3>商户信息</h3>
                <FormItem label="公司名称" prop="companyName">
                    <Input v-model="formValidate.companyName"></Input>
                </FormItem>
                <FormItem label="营业执照号码" prop="BusinessLicenseNumber">
                    <Input v-model="formValidate.BusinessLicenseNumber"></Input>
                </FormItem>
                <FormItem label="法人姓名" prop="LegalPersonName">
                    <Input v-model="formValidate.LegalPersonName"></Input>
                </FormItem>
                <FormItem label="身份证号码" prop="IdCardNum">
                    <Input v-model="formValidate.IdCardNum"></Input>
                </FormItem>
            </div>
            <div class="box">
                <h3>企业收款账号</h3>
                <FormItem label="开户银行" prop="eraBank">
                    <Input v-model="formValidate.eraBank"></Input>
                </FormItem>
                <FormItem label="开户地区" prop="eraArea">
                    <Input v-model="formValidate.eraArea"></Input>
                </FormItem>
                <FormItem label="支行名称" prop="eraBankBranch">
                    <Input v-model="formValidate.eraBankBranch"></Input>
                </FormItem>
                <FormItem label="公司名称" prop="eraCompanyName">
                    <Input v-model="formValidate.eraCompanyName"></Input>
                </FormItem>
                <FormItem label="银行卡号" prop="eraBankCardNumber">
                    <Input v-model="formValidate.eraBankCardNumber"></Input>
                </FormItem>
            </div>
            <div class="box">
                <h3>商户个人收款账号</h3>
                <FormItem label="开户银行" prop="AccountOpeningBank">
                    <Input v-model="formValidate.AccountOpeningBank"></Input>
                </FormItem>
                <FormItem label="开户地区" prop="OpeningArea">
                    <Input v-model="formValidate.OpeningArea"></Input>
                </FormItem>
                <FormItem label="支行名称" prop="bankBranch">
                    <Input v-model="formValidate.bankBranch"></Input>
                </FormItem>
                <FormItem label="开户名称" prop="accountName">
                    <Input v-model="formValidate.accountName"></Input>
                </FormItem>
                <FormItem label="银行卡号" prop="BankCardNumber">
                    <Input v-model="formValidate.BankCardNumber"></Input>
                </FormItem>
            </div>
            <div class="box">
                <h3>保证金缴纳</h3>
                <FormItem label="保证金缴纳状态" prop="">
                    <Select style="width:80px" v-model="marginPaymentStatus">
                        <!-- <Option v-for="item in storeStatus" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
                        <Option value="true">已缴纳</Option>
                        <Option value="false">未缴纳</Option>
                    </Select>
                </FormItem>
                <FormItem label="缴纳金额" prop="premiumReceived">
                <Col span="4"><Input v-model="formValidate.premiumReceived"></Input></Col>
                </FormItem>
            </div>
          </Col> 
        </Row>
    </Form>
  </div>
</template>
<script>
    import common from '../../../base.js'
    import VDistpicker from 'v-distpicker'
    import CityLinkage from '../../common/city.vue'
    // import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                cityConfig:{
                    key:false,
                    title:'',
                    type:'linkage'
                },
                branchList:[], //渲染所属品牌下拉框数组
                placeholders: {
                    province: '------- 省 --------',
                    city: '--- 市 ---',
                    area: '--- 区 ---',
                },//省市区的占位符
                province:'',//城市级联的值
                city:'',//城市级联的值
                erea:'',//城市级联的值
                seat:"",//输入框中具体的地址
                positionList:[], //将要展示的列表中的定位的值
                mapData:{  //地图数据
                longitude:116.404,
                latitude:39.915
                },
                projectList:['抗衰','面部','spa'],//主营特色项目
                projectStr:'',//特色项目
                project:'',  //增加主营项目的value
                sevenStarStore:'1', //七星门店
                amPartner:'1',    //艾美合伙人
                millionPartner:'1', //百万合伙人
                crownManager:'1',  //皇冠店长
                oldStore:'1',     //老店
                managerYear:1,   //经营年限
                disabled:false,  //实际经营年限控制变量
                storeLabel:'',//店铺标签(店铺标签)
                branchName:'',//品牌名称
                contract:'',//合同
                businessLicense:'',//营业执照
                idcardPositivePhoto:'',//正面照
                idcardNegativePhoto:'',//反面照
                idcardHandheldPhoto:'',//手持照
                storeDoorPhoto:'',//店门照
                storeCashierPhoto:'',//收银台照
                storeInPhoto:'',//店内照
                marginPaymentStatus:'',//缴纳状态
                //formValidate对象
                formValidate: {
                    storeName: '',   //店名
                    storeTel:'', //门店电话
                    storeTime:['09:00','18:30'], //营业时间
                    date: '',    //开店日期
                    sellerAccount:'',  //老板姓名
                    bossPhone:'',//老板账号
                    storeManagerAccount:'',//店长姓名
                    sellerPhone:'',//店长账号
                    branch:'',             //品牌
                    mainProject:[],   //主营特色项目
                    companyName:'',//公司名称
                    BusinessLicenseNumber:"",//营业执照号码
                    LegalPersonName:'',//法人姓名
                    IdCardNum:'',//身份证号码
                    AccountOpeningBank:'',//开户银行
                    OpeningArea:'',//开户地区
                    bankBranch:'',//支行名称
                    accountName:'',//开户名称
                    BankCardNumber:'',//银行卡号
                    eraBank:'',//企业--开户银行
                    eraArea:'',//企业--开户地区
                    eraBankBranch:'',//企业--支行名称
                    eraCompanyName:'',//企业--公司名称
                    eraBankCardNumber:'',//企业--银行卡号
                    premiumReceived:'',//缴纳金额
                },
                ruleValidate: {
                    
                }
            }
        },
        methods: {
            handleSubmit (name) {
                // this.$refs[name].validate((valid) => {
                //     if (valid) {
                //         this.$Message.success('Success!');
                //     } else {
                //         this.$Message.error('Fail!');
                //     }
                // })
                //处理所属品牌
                if(this.formValidate.branch==1){
                    this.branchName = '韵美'
                }else if(this.formValidate.branch==2){
                    this.branchName = '面子'
                }else if(this.formValidate.branch==3){
                    this.branchName = '金斯露'
                }
                //处理几年老店
                if(this.oldStore=='1'){
                    this.storeLabel = this.managerYear + '年老店'
                }else{
                    this.storeLabel = ''
                }
                //处理特色项目
                let str = ' ';
                let arr = this.formValidate.mainProject
                for(var i=0;i<arr.length;i++){
                    str = str + arr[i]+' | '
                }
                console.log(str)
                str = str.substr(0,str.length - 2)
                this.projectStr = str
                let ajaxData = {
                    store:{
                        storeAddress:this.seat, //店铺详细地址
                        areaInfo:this.province+' '+this.city+' '+this.area, //省市区
                        storeLatitude:this.mapData.latitude, //纬度
                        storeLongitude:this.mapData.longitude, //经度
                        storeName:this.formValidate.storeName, //店铺名称
                        storeTel:this.formValidate.storeTel, //店铺电话
                        bossName:this.formValidate.sellerAccount,//老板姓名
                        bossPhone:this.formValidate.bossPhone,//老板账号
                        sellerName:this.formValidate.storeManagerAccount,//店长姓名
                        sellerPhone:this.formValidate.sellerPhone,//店长账号
                        brandName:this.branchName,//品牌名
                        brandId:this.formValidate.branch, //品牌Id
                        scId:this.oldStore,//老店
                        manageYear:this.managerYear,//实际经营年限
                        storeLabel:this.storeLabel,//店铺标签(五年老店)
                        specialProject:this.projectStr,//特色项目
                        storeCompanyName:this.formValidate.companyName,//公司名称
                        storeBanner:this.storeDoorPhoto, //门头照
                    },
                    storeExtend:{
                        companyName:this.formValidate.companyName,//公司名称
                        businessLicenseUmber:this.formValidate.BusinessLicenseNumber,//营业执照号码
                        legalPersonName:this.formValidate.LegalPersonName,//法人姓名
                        legalPersonIdcard:this.formValidate.IdCardNum,//身份证号码
                        praBank:this.formValidate.AccountOpeningBank,//商户--开户银行
                        praArea:this.formValidate.OpeningArea,//商户--开户地区
                        praBankBranch:this.formValidate.bankBranch,//商户--开户支行
                        praAccountName:this.formValidate.accountName,//商户--开户名称
                        praBankCardNumber:this.formValidate.BankCardNumber,//商户--银行卡号
                        eraBank:this.formValidate.eraBank,//企业--开户银行
                        eraArea:this.formValidate.eraArea,//企业--开户地区
                        eraBankBranch:this.formValidate.eraBankBranch,//企业--开户支行
                        eraCompanyName:this.formValidate.eraCompanyName,//企业--公司名称
                        eraBankCardNumber:this.formValidate.eraBankCardNumber,//企业--银行卡号

                        paymentAmount:this.formValidate.premiumReceived,//缴纳金额
                        marginPaymentStatus:this.marginPaymentStatus,//保证金缴纳状态
                        businessLicense:this.businessLicense,//营业执照
                        idcardPositivePhoto:this.idcardPositivePhoto,//正面照
                        idcardNegativePhoto:this.idcardNegativePhoto,//反面照
                        idcardHandheldPhoto:this.idcardHandheldPhoto,//手持照
                        storeDoorPhoto:this.storeDoorPhoto,//店门照
                        storeCashierPhoto:this.storeCashierPhoto,//收银照
                        storeInPhoto:this.storeInPhoto,//店内照
                        contract:this.contract,//合同        
                    }
                }
                console.log(ajaxData)
                let url = common.path + 'store/add'
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    console.log(res)
                    if(res.status==200){
                        this.$Message.success('Success!');
                        this.returnHome('list')
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            //添加新的特色项目
            addProject(){
                if(this.project!=''){
                    this.projectList.push(this.project);
                    this.project = ''
                }else{
                    this.$Message.error('请输入特色项目');
                }          
            },
            //取消添加特色项目
            resetProject(){
                this.project = ''
            },
            //省市联动选择的值
            onSelected(data) {
                this.province = data.province.value
                this.city = data.city.value
                this.area = data.area.value
            },
            getCity(data){
                console.log(data)
                // this.cd.cityArr = data
                this.province = data[0].label
                this.city = data[1].label
                this.area = data[2].label
            },
            //定位按钮
            orientate(){
                console.log(this.seat+this.city)
                let url = common.path + 'store/queryBaiduMapLocation/'+this.seat+'&'+this.city;
                this.$http.get(url).then(res=>{
                    console.log(res)
                    this.mapData.latitude = res.data[0].location.lat;
                    this.mapData.longitude = res.data[0].location.lng;
                    console.log(this.mapData.latitude+'--'+this.mapData.longitude)
                    //重新初始化地图
                   this.mapInit(this.mapData.longitude,this.mapData.latitude)
                }).catch(err=>{
                    console.log(err)
                })
            },
            //初始化地图
            mapInit(longitude,latitude){
                var map = new BMap.Map("map");
                var point = new BMap.Point(longitude,latitude);
                map.centerAndZoom(point, 16);
                var marker = new BMap.Marker(point);// 创建标注
                map.addOverlay(marker);
            },
            //输入关键字联想
            handleSearch (value) {
                let url = common.path + 'store/queryBaiduMapLocation/'+value+'&'+this.city;
                this.$http.get(url).then(res=>{
                    let storeList = [];
                    res.data.forEach(item=>{
                        storeList.push(item.name)
                    })
                    console.log(storeList)
                    this.positionList = !value ? [] : storeList;
                }).catch(err=>{
                    console.log(err)
                })
            },
            selectKeyWords (value) {
                console.log(value)
            },
            //返回按钮
            returnHome (type) {
                this.$emit("returnList",type);
            },
            //上传文件成功的回调
            uploadFile(res){
                this.contract = res.data
            },
            //上传营业执照
            uploadLicense(res){
                this.businessLicense = res.data
            },
            //上传正面照
            uploadPositivePhoto(res){
                this.idcardPositivePhoto = res.data
            },
            //上传反面照
            uploadNegativePhoto(res){
                this.idcardNegativePhoto = res.data
            },
            //上传手持照
            uploadHandheldPhoto(res){
                this.idcardHandheldPhoto = res.data
            },
            //上传门头照
            uploadDoorPhoto(res){
                this.storeDoorPhoto = res.data
            },
            //上传收银台照
            uploadCashierPhoto(res){
                this.storeCashierPhoto = res.data
            },
            //上传店内照
            uploadInPhoto(res){
                this.storeInPhoto = res.data
            },
            //获取连锁品牌
            getBranch(){
                let url = common.path+"storeChainBrand/front/findByPage";
                let ajaxData = {
                    pageNo:1,
                    pageSize:1000
                }
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    let data = res.data.data.list;
                    this.branchList = data;
                    console.log(data)
                })
            }
        },
        beforeMount: function () {
            this.getBranch()
        },
        watch: {
           
        },
        mounted: function(){
            //初始化地图
　　　　　　this.mapInit(this.mapData.longitude,this.mapData.latitude);
        },
        activated: function(){
            
        },
        components:{
           VDistpicker,
           CityLinkage
        //    MyUpload
        }
    }
</script>
<style lang="scss" scoped>
    .addPage{
        height: auto;
        h2{
            padding-bottom:10px;
            padding-left:20px;
        }
        h3{
            padding-left:20px;
        }
        .addProject {
            padding-right:10px;
        }
        .addBtn{
            margin-right:5px;
        }
        .ereaDetail{
            margin-left:10px;
            padding-right:20px;
        }
    }
    .boxStyle{
        // padding:10px 5px 10px 5px; 
        border-color: #e9eaec; 
        // .box{
        //     background:#fff;
        //     // padding: 5px;
        //     border-radius: 5px;
        // }
        // .box:hover{
        //     box-shadow: 0px 0px 5px rgba(0,0,0,0.2);
        // }
    }
    .boxStyle:nht-of-type(2){
        border-left:6px solid #dddee1;
       
    }
    .marginRight{
        margin-right:10px;
    }
   
    .ivu-form .ivu-form-item-label{
        width:120px!important;
    }
    .ivu-form .ivu-form-item-label{
        margin-left:120px!important;
    }
    .textAlign{
        text-align: center;
    }
</style>
