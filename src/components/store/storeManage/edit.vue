<template>
  <div class="addPage testWrap">
    <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <h2>编辑门店基本资料</h2>    
        <Row>
            <Col span="12">
                <FormItem label="门店名称" prop="storeName">
                    <Input v-model="formValidate.storeName"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="开店时间">
                    <Row type="flex" justify="start">
                        <Col span="11">
                            <FormItem prop="date">
                                <DatePicker type="date" v-model="formValidate.date" disabled></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="门店电话" prop="storeTel">
                    <Input v-model="formValidate.storeTel"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="营业时间" prop="storeTime">
                    <Input v-model="formValidate.storeTime"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="老板姓名" prop="sellerAccount">
                    <Input v-model="formValidate.sellerAccount"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="老板账号" prop="bossPhone">
                    <Input v-model="formValidate.bossPhone" disabled></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="店长姓名" prop="storeManagerAccount">
                    <Input v-model="formValidate.storeManagerAccount"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="店长账号" prop="sellerPhone">
                    <Input v-model="formValidate.sellerPhone" disabled></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="所属品牌" prop="branchId">
                    <Select v-model="formValidate.branchId" label-in-value @on-change="getBranchName">
                        <Option :value="item.id" v-for='(item ,index) in branchList' :key="index">{{item.brandName}}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12"></Col>
        </Row>     
        <FormItem label="主营特色项目" prop="mainProject" v-if="showProject">
            <CheckboxGroup v-model="formValidate.mainProject" @on-change="getMainProject">
                <Checkbox v-for='(item,index) in projectList' :key="index" :label="item.label" :value="item.label" :disabled="item.disabled">{{item.label}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="" prop="">
            <Row type="flex" justify="start">
                <Col span="8"><Input v-model="project" class="addProject"></Input></Col>
                <Button type="primary" class="addBtn" @click="addProject">新增</Button>
                <Button type="ghost" @click="resetProject">取消</Button>
            </Row>
        </FormItem>
        <FormItem label="是否属于老店" prop="oldStore">
            <Row type="flex" justify="start">
                <Col span="12">
                        <RadioGroup v-model="oldStore" @on-change="disabled = !disabled">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                    <span>(连续经营超过5年)</span>
                </Col>
                <Col span="2">实际经营年限</Col>
                <Col span="2">
                    <InputNumber :max="100" :min="5" v-model="formValidate.managerYear" :disabled="disabled"></InputNumber>
                </Col>
                <Col span="1" class="textAlign">年</Col>
            </Row>
        </FormItem>
        <FormItem label="是否属于精选门店" prop="selectStore">
            <Row type="flex" justify="start">
                <Col span="12">
                    <RadioGroup v-model="formValidate.selectStore">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="店铺地址" prop="">
            <Row type="flex" justify="start">
                <Col span="20">
                    <CityLinkage v-if="cityCtrl" :cityConfig="cityConfig" v-on:listenCity="getCity"></CityLinkage>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="店铺详细地址" prop="storeAddress">
            <Row type="flex" justify="start">
                <Col span="8">
                    <AutoComplete
                    v-model="formValidate.storeAddress"
                    :data="positionList"
                    @on-search="handleSearch"
                    @on-select="selectKeyWords"
                    placeholder="具体地点关键字"
                    style="width:300px"></AutoComplete>
                </Col>
                <Col span="4"><Button type="primary" @click="orientate">定位</Button></Col>
            </Row>
        </FormItem>
        <FormItem label="" prop="">
            <Row type="flex" justify="start">
                <Col span="22">
                    <div id="map" style="height:300px;"></div>
                </Col>
            </Row>
        </FormItem>
        <Row>
            <Col span="12">
                <FormItem label="店铺面积" prop="storeArea">
                    <Input v-model="formValidate.storeArea" placeholder="请输入店铺面积"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="员工数" prop="beauticianTotal">
                    <Input v-model="formValidate.beauticianTotal" placeholder="请输入店铺员工数量"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="附加服务" prop="additionalServices">
                    <CheckboxGroup v-model="formValidate.additionalServices" @on-change="getSomeThing">
                        <Checkbox v-for='(item,index) in additionalServicesList' :key="index" :label="item.name" :value="item.image">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Col>
            <Col span="12"></Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="店铺介绍" prop="description" >
                    <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 6,maxRows: 10}" placeholder="店铺介绍（200字以内）"></Input>
                </FormItem>
            </Col>
            <Col span="12"></Col>
        </Row>
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
                <Upload :action="path2" :on-success="uploadFile">
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
            </FormItem>
        </div>
        <h3>认证照片</h3>
        <Row>
            <Col span="24">
                <FormItem label="营业执照" prop="businessLicense">
                    <MyUpload v-if="license" :defaultList="defaultListLicense" :uploadConfig="uploadConfigLicense" v-on:listenUpload="v=>{getUploadList(v,'license')}"></MyUpload>
                    <span>(三证合一只上传营业执照，非三证合一请分别上传营业执照，组织机构代码证，税务登记证)</span>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="身份证正面照" prop="idcardPositivePhoto">
                    <MyUpload v-if="formValidate.idcardPositivePhoto" :defaultList="defaultList[0]" :uploadConfig="uploadConfig" v-on:listenUpload="v=>{getUploadList(v,'idcardPositivePhoto')}"></MyUpload>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="身份证反面照" prop="idcardNegativePhoto">
                    <MyUpload v-if="formValidate.idcardNegativePhoto" :defaultList="defaultList[1]" :uploadConfig="uploadConfig" v-on:listenUpload="v=>{getUploadList(v,'idcardNegativePhoto')}"></MyUpload>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="身份证手持照" prop="idcardHandheldPhoto">
                    <MyUpload v-if="formValidate.idcardHandheldPhoto" :defaultList="defaultList[2]" :uploadConfig="uploadConfig" v-on:listenUpload="v=>{getUploadList(v,'idcardHandheldPhoto')}"></MyUpload>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="门头照" prop="storeDoorPhoto">
                    <MyUpload v-if="formValidate.storeDoorPhoto" :defaultList="defaultList[3]" :uploadConfig="uploadConfig" v-on:listenUpload="v=>{getUploadList(v,'storeDoorPhoto')}"></MyUpload>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="收银台" prop="storeCashierPhoto">
                    <MyUpload v-if="formValidate.storeCashierPhoto" :defaultList="defaultList[4]" :uploadConfig="uploadConfig" v-on:listenUpload="v=>{getUploadList(v,'storeCashierPhoto')}"></MyUpload>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="店内照" prop="storeInPhoto">
                    <MyUpload v-if="formValidate.storeInPhoto" :defaultList="defaultList[5]" :uploadConfig="uploadConfig" v-on:listenUpload="v=>{getUploadList(v,'storeInPhoto')}"></MyUpload>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="店铺荣誉" prop="">
                    <!-- <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadStoreHonor">
                        <Button v-if="!storeHonorPhoto" type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                        <img v-if="storeHonorPhoto" :src="storeHonorPhoto" alt="">
                    </Upload> -->
                    <MyUpload v-if="honorCtrl" :defaultList="defaultListHonor" :uploadConfig="uploadConfigHonor" v-on:listenUpload="v=>{getUploadList(v,'honor')}"></MyUpload>
                    <span>(店铺相关的荣誉证书，获奖证书，最多上传6张)</span>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="上传合同" prop="contract">
                    <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadFile">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
            </Col>
        </Row>
        <h3>商户信息</h3>
        <Row>
            <Col span="12">
                <FormItem label="公司名称" prop="companyName">
                    <Input v-model="formValidate.companyName"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="营业执照号码" prop="businessLicenseNumber">
                    <Input v-model="formValidate.businessLicenseNumber"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="法人姓名" prop="LegalPersonName">
                    <Input v-model="formValidate.LegalPersonName"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="身份证号码" prop="IdCardNum">
                    <Input v-model="formValidate.IdCardNum"></Input>
                </FormItem>
            </Col>
        </Row>
        <h3>企业收款账号</h3>
        <Row>
            <Col span="12">
                <FormItem label="开户银行" prop="eraBank">
                    <Input v-model="formValidate.eraBank"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="开户地区" prop="eraArea">
                    <Input v-model="formValidate.eraArea"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="支行名称" prop="eraBankBranch">
                    <Input v-model="formValidate.eraBankBranch"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="公司名称" prop="eraCompanyName">
                    <Input v-model="formValidate.eraCompanyName"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="银行卡号" prop="eraBankCardNumber">
                    <Input v-model="formValidate.eraBankCardNumber"></Input>
                </FormItem>
            </Col>
            <Col span="12"></Col>
        </Row>
        <h3>商户个人收款账号</h3>
        <Row>
            <Col span="12">
                 <FormItem label="开户银行" prop="AccountOpeningBank">
                    <Input v-model="formValidate.AccountOpeningBank"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="开户地区" prop="OpeningArea">
                    <Input v-model="formValidate.OpeningArea"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="支行名称" prop="bankBranch">
                    <Input v-model="formValidate.bankBranch"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="开户名称" prop="accountName">
                    <Input v-model="formValidate.accountName"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="银行卡号" prop="BankCardNumber">
                    <Input v-model="formValidate.BankCardNumber"></Input>
                </FormItem>
            </Col>
            <Col span="12"></Col>
        </Row>
        <h3>保证金缴纳</h3>
        <Row>
            <Col span="12">
                <FormItem label="保证金缴纳状态" prop="marginPaymentStatus">
                    <Select style="width:160px" v-model="formValidate.marginPaymentStatus">
                        <Option value="true">已缴纳</Option>
                        <Option value="false">未缴纳</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="缴纳金额" prop="premiumReceived">
                    <Col span="8"><Input v-model="formValidate.premiumReceived"></Input></Col>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <FormItem>
                    <Button type="primary" :disabled="btnCtrl" @click="handleSubmit('formValidate')" style="margin:0px 8px;">保存</Button>
                    <Button v-if="false" type="ghost" @click="handleReset('formValidate')" style="margin:0px 8px;">重置</Button>
                    <Button type="ghost" @click.native="returnHome('list')">返回</Button>    
                </FormItem>
            </Col>
        </Row>
    </Form>
  </div>
</template>
<script>
    import common from '../../../base.js'
    import VDistpicker from 'v-distpicker'
    import CityLinkage from '../../common/city.vue'
    import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                path2:common.path2+'system/api/file/uploadFile',
                honorCtrl:false,
                license:false,
                btnCtrl:false,
                cityConfig:{
                    key:false,
                    title:'',
                    type:'linkage',
                    cityList:[],
                },
                defaultList:[
                    [],[],[],[],[],[]
                ],
                uploadConfig:{
                    num:1
                },
                defaultListHonor:[],
                uploadConfigHonor:{
                    num:6
                },
                defaultListLicense:[],
                uploadConfigLicense:{
                    num:3
                },
                cityCtrl:false, //控制子组件是否创建
                extendId:0,//扩展id
                branchList:[],//渲染品牌下拉框数组
                // storeBanner:false,//正面照的显示
                cityArr:[],//城市数组
                province:'',//城市级联的值
                city:'',//城市级联的值
                erea:'',//城市级联的值
                provinceId:'',//城市级联的Id
                cityId:'',//城市级联的Id
                ereaId:'',//城市级联的Id
                // seat:"",//输入框中具体的地址
                positionList:[], //将要展示的列表中的定位的值
                mapData:{  //地图数据
                longitude:116.404,
                latitude:39.915
                },
                projectList:[],//主营特色项目
                additionalServicesList:[
                    {
                        "image":"http://mrb.amez999.com/beautybondAdmin/image/shower.png|http://mrb.amez999.com/beautybondAdmin/image/showerDefault.png",
                        "name":"淋浴"
                    },{
                        "image":"http://mrb.amez999.com/beautybondAdmin/image/park.png|http://mrb.amez999.com/beautybondAdmin/image/parkDefault.png",
                        "name":"免费停车"
                    },{
                        "image":"http://mrb.amez999.com/beautybondAdmin/image/pet.png|http://mrb.amez999.com/beautybondAdmin/image/petDefault.png",
                        "name":"宠物照看"
                    },{
                        "image":"http://mrb.amez999.com/beautybondAdmin/image/tea.png|http://mrb.amez999.com/beautybondAdmin/image/teaDefault.png",
                        "name":"咖啡 / 茶"
                    }
                ],
                additionalServicesObj:'',
                showProject:false, //控制数组显示
                projectStr:'',//特色项目
                project:'',  //增加主营项目的value
                sevenStarStore:'1', //七星门店
                amPartner:'1',    //艾美合伙人
                millionPartner:'1', //百万合伙人
                crownManager:'1',  //皇冠店长
                oldStore:'1',     //老店
                disabled:false,  //实际经营年限控制变量
                storeLabel:'',//店铺标签(店铺标签)
                storeHonorPhoto:'', //店铺荣誉
                payStatus:true, //缴费状态布尔值
                //formValidate对象
                formValidate: {
                    selectStore:'0', //是否属于精选门店
                    storeName: '',   //店名
                    storeTel:'', //门店电话
                    storeTime:'', //营业时间
                    date: '',    //开店日期
                    sellerAccount:'',  //老板姓名
                    bossPhone:'',//老板账号
                    storeManagerAccount:'',//店长姓名
                    sellerPhone:'',//店长账号
                    branchId:'',  //品牌id
                    branchName:'',  //品牌名称
                    mainProject:[],   //主营特色项目
                    storeAddress:'', //店铺地址
                    managerYear:5,   //经营年限
                    additionalServices:[], //附加服务
                    storeArea:'', //店铺面积
                    beauticianTotal:'', //员工数量
                    description:'', //店铺简介
                    companyName:'',//公司名称
                    businessLicenseNumber:"",//营业执照号码
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
                    marginPaymentStatus:'',//缴纳状态
                    businessLicense:'',//营业执照
                    idcardPositivePhoto:'',//正面照
                    idcardNegativePhoto:'',//反面照
                    idcardHandheldPhoto:'',//手持照
                    storeDoorPhoto:'',//店门照
                    storeCashierPhoto:'',//收银台照
                    storeInPhoto:'',//店内照
                    contract:'',//合同
                },
                ruleValidate: {
                    storeName:[
                        { required: true, message: '请填写店铺名称', pattern:/.+/, trigger: 'blur' }
                    ],
                    storeTel:[
                        { required: true, message: '请填写正确的店内联系电话', pattern:/\d/, trigger: 'blur' }
                    ],
                    sellerAccount:[
                        { required: true, message: '请填写老板名称', pattern:/.+/, trigger: 'blur' }
                    ],
                    bossPhone:[
                        { required: true, message: '请填写正确的老板注册手机', pattern:/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, trigger: 'blur' }
                    ],
                    storeManagerAccount:[
                        { required: true, message: '请填写店长姓名', pattern:/.+/, trigger: 'blur' }
                    ],
                    sellerPhone:[
                        { required: true, message: '请填写正确的店长注册手机', pattern:/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, trigger: 'blur' }
                    ],
                    storeTime:[
                        { required: true, message: '请填写营业时间', pattern:/.+/, trigger: 'blur' }
                    ],
                    branchId:[
                        { required: true, message: '请填写店铺类型', pattern:/.+/, trigger: 'change' }
                    ],
                    mainProject:[
                        { required: true, message: '请设置店铺主营特色项目', pattern:/.+/, trigger: 'blur' }
                    ],
                    storeAddress:[
                        { required: true, message: '请填写店铺地址', pattern:/.+/, trigger: 'blur' }
                    ],
                    managerYear:[
                        { required: true, message: '请填写店铺实际经营年限', pattern:/.+/, trigger: 'blur' }
                    ],
                    storeArea:[
                        { required: true, message: '请填写店铺面积', pattern:/.+/, trigger: 'blur' }
                    ],
                    beauticianTotal:[
                        { required: true, message: '请填写店内员工人数', pattern:/.+/, trigger: 'blur' }
                    ],
                    description:[
                        { type: 'string', max: 200, message: '200字以内', trigger: 'blur' }
                    ],
                    companyName:[
                        { required: true, message: '请填写公司名称', pattern:/.+/, trigger: 'blur' }
                    ],
                    businessLicenseNumber:[
                        { required: true, message: '请正确填写营业执照号码', pattern:/\d/, trigger: 'blur' }
                    ],
                    LegalPersonName:[
                        { required: true, message: '请填写法人姓名', pattern:/.+/, trigger: 'blur' }
                    ],
                    IdCardNum:[
                        { required: true, message: '请填写正确的身份证号', pattern:/^([0-9]){7,18}(x|X)?$/, trigger: 'blur' }
                    ],
                    eraBank:[
                        { required: true, message: '请填写开户银行', pattern:/.+/, trigger: 'blur' }
                    ],
                    eraCompanyName:[
                        { required: true, message: '请填写企业开户名', pattern:/.+/, trigger: 'blur' }
                    ],
                    eraArea:[
                        { required: true, message: '请填写开户地区', pattern:/.+/, trigger: 'blur' }
                    ],
                    eraBankBranch:[
                        { required: true, message: '请填写支行名称', pattern:/.+/, trigger: 'blur' }
                    ],
                    eraBankCardNumber:[
                        { required: true, message: '请填写正确的银行卡号', pattern:/^([1-9]{1})(\d{14}|\d{18})$/, trigger: 'blur' }
                    ],
                    marginPaymentStatus:[
                        { required: true, message: '请设置保证金缴纳状态', pattern:/.+/, trigger: 'change' }
                    ],
                    premiumReceived:[
                        // { required: true, message: '请填写缴费金额', pattern:/.+/, trigger: 'blur' }
                    ],
                    businessLicense:[
                        { required: true, message: '请上传营业执照', pattern:/.+/, trigger: 'blur' }
                    ],
                    idcardPositivePhoto:[
                        { required: true, message: '请上传正面照', pattern:/.+/, trigger: 'blur' }
                    ],
                    idcardNegativePhoto:[
                        { required: true, message: '请上传反面照', pattern:/.+/, trigger: 'blur' }
                    ],
                    idcardHandheldPhoto:[
                        { required: true, message: '请上传手持照', pattern:/.+/, trigger: 'blur' }
                    ],
                    storeDoorPhoto:[
                        { required: true, message: '请上传门头照', pattern:/.+/, trigger: 'blur' }
                    ],
                    storeCashierPhoto:[
                        { required: true, message: '请上传收银台照', pattern:/.+/, trigger: 'blur' }
                    ],
                    storeInPhoto:[
                        { required: true, message: '请上传店内照', pattern:/.+/, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //处理几年老店
                        if(this.oldStore=='1'){
                            this.storeLabel = this.formValidate.managerYear + '年老店'
                        }else{
                            this.storeLabel = ''
                        }
                        //处理特色项目
                        let str = ' ';
                        let arr = this.formValidate.mainProject
                        for(var i=0;i<arr.length;i++){
                            str = str + arr[i]+' | '
                        }
                        str = str.substr(0,str.length - 2)
                        this.projectStr = str;
                        let ajaxData = {
                            store:{
                                id:this.editId, //编辑的id
                                storeAddress:this.formValidate.storeAddress, //店铺详细地址
                                provinceName:this.province,//省
                                cityName:this.city,//市
                                areaName:this.area,//区
                                productId:this.provinceId,//省
                                cityId:this.cityId,//市
                                areaId:this.areaId,//区
                                storeLatitude:this.mapData.latitude, //纬度
                                storeLongitude:this.mapData.longitude, //经度
                                storeName:this.formValidate.storeName, //店铺名称
                                storeTel:this.formValidate.storeTel, //店铺电话
                                storeTime:this.formValidate.storeTime, //营业时间
                                bossName:this.formValidate.sellerAccount,//老板姓名
                                // bossPhone:this.formValidate.bossPhone,//老板账号
                                sellerName:this.formValidate.storeManagerAccount,//店长姓名
                                // sellerPhone:this.formValidate.sellerPhone,//店长账号
                                brandName:this.formValidate.branchName,//品牌名
                                brandId:this.formValidate.branchId, //品牌Id
                                isOld:(this.oldStore=='1'?true:false),//老店
                                manageYear:this.formValidate.managerYear,//实际经营年限
                                isSelect:(this.formValidate.selectStore=='1'?true:false), //是否属于精选门店
                                storeLabel:this.storeLabel,//店铺标签(五年老店)
                                specialProject:this.projectStr,//特色项目
                                storeCompanyName:this.formValidate.companyName,//公司名称
                                storeBanner:this.formValidate.storeDoorPhoto,//横幅图
                                beauticianTotal:this.formValidate.beauticianTotal, //店铺员工数
                                description:this.formValidate.description, //店铺简介
                            },
                            storeExtend:{
                                id:this.extendId,
                                companyName:this.formValidate.companyName,//公司名称
                                businessLicenseNumber:this.formValidate.businessLicenseNumber,//营业执照号码
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

                                paymentAmount:(this.formValidate.premiumReceived-0),//缴纳金额
                                marginPaymentStatus:this.formValidate.marginPaymentStatus,//保证金缴纳状态 
                                businessLicense:this.formValidate.businessLicense,//营业执照
                                storeHonorPhoto:this.storeHonorPhoto, //店铺荣誉
                                idcardPositivePhoto:this.formValidate.idcardPositivePhoto,//正面照
                                idcardNegativePhoto:this.formValidate.idcardNegativePhoto,//反面照
                                idcardHandheldPhoto:this.formValidate.idcardHandheldPhoto,//手持照
                                storeDoorPhoto:this.formValidate.storeDoorPhoto,//店门照
                                storeCashierPhoto:this.formValidate.storeCashierPhoto,//收银照
                                storeInPhoto:this.formValidate.storeInPhoto,//店内照
                                contract:this.formValidate.contract,//合同  
                                storeArea:this.formValidate.storeArea, //店铺面积   
                                otherService:this.additionalServicesObj, //附加服务       
                            }
                        }
                        console.log(JSON.stringify(ajaxData))
                        let url = common.path2 + 'store/modify'
                        this.btnCtrl = true;
                        this.$http.put(
                            url,
                            JSON.stringify(ajaxData),
                            {
                                headers: {
                                    'Content-type': 'application/json;charset=UTF-8'
                                },
                            }
                        ).then(res=>{
                            console.log(res)
                            this.returnHome('list')
                            if(res.data.code){
                                this.$Message.success('保存成功！');
                            }else{
                                this.$Message.success(res.data.message);
                            }
                            this.btnCtrl = false;
                        }).catch(res=>{
                            this.btnCtrl = false;
                            console.log(res)
                            this.$Message.error('提交失败！');
                        })
                    } else {
                        this.$Message.error('信息不完整!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            // 获取品牌名
            getBranchName(data){
                console.log(data)
                this.formValidate.brandId = data.value;
                this.formValidate.brandName = data.label;
            },
            //添加新的特色项目
            addProject(){
                if(this.project!=''){
                    if(this.projectList.length>=3){
                        this.projectList.push({
                            disabled:true,
                            label:this.project
                        });
                        this.project = ''
                    }else{
                        this.projectList.push({
                            disabled:false,
                            label:this.project
                        });
                        this.project = ''
                    }
                }else{
                    this.$Message.error('请输入特色项目');
                }          
            },
            //取消添加特色项目
            resetProject(){
                this.project = ''
            },
            //添加主营项目
            getMainProject(data){
                console.log(data)
                if(data.length==3){
                    for(var i=0;i<this.projectList.length;i++){
                        for(var j=0;j<data.length;j++){
                            if(this.projectList[i].label==data[j]){
                                break;
                            }
                            if(this.projectList[i].label!=data[j]){
                                if(j==data.length-1){
                                    this.projectList[i].disabled = true;
                                }
                            }
                        }
                    }
                }else if(data.length<3){
                    for(var k=0;k<this.projectList.length;k++){
                        this.projectList[k].disabled = false;
                    }
                }
            },
            //附加服务
            getSomeThing(data){
                console.log(data)
                let temp = []
                for(var i=0;i<data.length;i++){
                    for(var j=0;j<this.additionalServicesList.length;j++){
                        if(data[i]==this.additionalServicesList[j].name){
                            temp.push(this.additionalServicesList[j])
                            break;
                        }
                    }
                }          
                this.additionalServicesObj = JSON.stringify(temp)                                                                                                
                console.log(this.additionalServicesObj)
            },
            //省市联动选择的值
            onSelected(data) {
                this.province = data.province.value
                this.city = data.city.value
                this.area = data.area.value
            },
            getCity(data){
                console.log(data)
                this.province = data[0].label
                this.city = data[1].label
                this.area = data[2].label
                this.provinceId = data[0].value
                this.cityId = data[1].value
                this.areaId = data[2].value
            },
            //定位按钮
            orientate(){
                console.log(this.formValidate.storeAddress+this.city)
                let url = common.path2 + 'store/findListByBaiduMapLocation/'+this.formValidate.storeAddress+'/'+this.city;
                this.$http.get(url).then(res=>{
                    console.log(res)
                    this.mapData.latitude = res.data.data[0].location.lat;
                    this.mapData.longitude = res.data.data[0].location.lng;
                    console.log(this.mapData.latitude+'--'+this.mapData.longitude)
                    //重新初始化地图
                   this.mapInit(this.mapData.longitude,this.mapData.latitude)
                }).catch(err=>{
                    console.log(err)
                })
                // let vm = this;
                // var map = new BMap.Map("map");          
                // // 创建地址解析器实例     
                // var myGeo = new BMap.Geocoder();      
                // // 将地址解析结果显示在地图上，并调整地图视野 
                // var address = this.city+this.area+this.formValidate.storeAddress;
                // myGeo.getPoint(address, function(point){      
                //     if (point) {      
                //         map.centerAndZoom(point, 16);      
                //         map.addOverlay(new BMap.Marker(point)); 
                //         console.log(point)
                //         vm.mapData.latitude = point.lat;
                //         vm.mapData.longitude = point.lng;
                //     }
                // }, 
                // this.city);
            },
            //初始化地图
            mapInit(longitude,latitude){
                var map = new BMap.Map("map");
                var point = new BMap.Point(longitude,latitude);
                map.centerAndZoom(point, 16);
                var marker = new BMap.Marker(point);// 创建标注
                map.addOverlay(marker);
                map.enableScrollWheelZoom();
            },
            //输入关键字联想
            handleSearch (value) {
                let url = common.path2 + 'store/findListByBaiduMapLocation/'+value+'/'+this.city;
                this.$http.get(url).then(res=>{
                    console.log(res)
                    let storeList = [];
                    res.data.data.forEach(item=>{
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
                this.formValidate.contract = res.data
            },
            //上传营业执照
            getUploadList(data,type){
                console.log(data)
                let tempArr = [];
                if(data.length!=0){
                    if(type=='honor'){
                        data.forEach((item,index)=>{
                            tempArr.push(data[index].url)
                            this.storeHonorPhoto = tempArr.join(',');
                        })
                    }else if(type=='license'){
                        for(var i=0;i<data.length;i++){
                            tempArr.push(data[i].url);
                            this.formValidate.businessLicense = tempArr.join(',');                         
                        }
                    }else if(type=='idcardPositivePhoto'){
                        this.formValidate.idcardPositivePhoto = data[0].url;
                    }else if(type=='idcardNegativePhoto'){
                        this.formValidate.idcardNegativePhoto = data[0].url;
                    }else if(type=='idcardHandheldPhoto'){
                        this.formValidate.idcardHandheldPhoto = data[0].url;
                    }else if(type=='storeDoorPhoto'){
                        this.formValidate.storeDoorPhoto = data[0].url;
                    }else if(type=='storeCashierPhoto'){
                        this.formValidate.storeCashierPhoto = data[0].url;
                    }else if(type=='storeInPhoto'){
                        this.formValidate.storeInPhoto = data[0].url;
                    }
                }
            },
            //获取数据
            getDataById(id){
                let url = common.path2+'store/detail/'+id;
                this.$http.get(url).then(res=>{
                    let store = res.data.data.store;
                    let storeExtend = res.data.data.storeExtend
                    console.log(store)
                    console.log(storeExtend)
                    this.formValidate.storeName = store.storeName; //门店名称
                    this.formValidate.date = store.createTime;  //开店时间
                    this.formValidate.storeTel = store.storeTel;  //开店时间
                    this.formValidate.storeTime = store.storeTime;  //开店时间
                    this.formValidate.sellerAccount = store.bossName;  //老板姓名
                    this.formValidate.bossPhone = store.bossPhone; //老板账号
                    this.formValidate.storeManagerAccount = store.sellerName; //店长姓名
                    this.formValidate.sellerPhone = store.sellerPhone;//店长账号
                    //多选框
                    this.formValidate.branchId = store.brandId; //所属品牌id
                    this.formValidate.branchName = store.branchName; //所属品牌
                    if(store.specialProject){
                        let tempArr = []
                        tempArr = store.specialProject.trim().split(' | '); //主营特色项目
                        for(var i=0;i<tempArr.length;i++){
                            this.projectList.push({
                                disabled:false,
                                label:tempArr[i]
                            })
                        }
                        this.formValidate.mainProject = store.specialProject.trim().split(' | '); //主营特色项目
                        this.showProject = true;
                        console.log(this.formValidate.mainProject)
                        console.log(this.projectList)
                    }

                    this.formValidate.managerYear = store.manageYear; //店铺经营年限
                    this.oldStore = store.isOld?'1':'0'; //是否是老店
                    this.formValidate.selectStore = store.isSelect?'1':'0'; //是否属于精选门店
                    if(store.isOld==0){
                        this.disabled = true;
                    }else{
                        this.disabled = false;
                    }  //控制年限的可用
                    this.mapData.longitude = store.storeLongitude; //经度
                    this.mapData.latitude = store.storeLatitude; //纬度
                    this.formValidate.storeAddress = store.storeAddress;  //店铺地址
                    // this.mapInit(this.mapData.longitude,this.mapData.latitude); //重新初始化地图
                    this.city = store.cityName;
                    //省市区
                    this.cityArr.push({
                        value:store.productId,
                        label:store.provinceName
                    },{
                        value:store.cityId,
                        label:store.cityName
                    },{
                        value:store.areaId,
                        label:store.areaName
                    })
                    this.cityConfig.cityList = this.cityArr;
                    this.cityCtrl = true;
                    this.orientate();
                    this.formValidate.beauticianTotal = store.beauticianTotal;
                    this.formValidate.description = store.description;
                    //------------扩展表----------------------------------------
                    this.extendId = storeExtend.id;
                    this.formValidate.companyName = storeExtend.companyName; //公司名称
                    this.formValidate.businessLicense = storeExtend.businessLicense;  //营业执照
                    storeExtend.businessLicense.split(',').forEach((item,index)=>{
                        this.defaultListLicense.push({
                            url:item
                        })
                    })
                    this.license = true;
                    this.storeHonorPhoto = storeExtend.storeHonorPhoto;  //店铺荣誉
                    storeExtend.storeHonorPhoto.split(',').forEach((item,index)=>{
                        this.defaultListHonor.push({
                            url:item
                        })
                    })
                    this.honorCtrl = true;
                    this.formValidate.idcardPositivePhoto = storeExtend.idcardPositivePhoto;//正面照
                    this.defaultList[0].push({
                        url:storeExtend.idcardPositivePhoto
                    })
                    this.formValidate.idcardNegativePhoto = storeExtend.idcardNegativePhoto;//反面照
                    this.defaultList[1].push({
                        url:storeExtend.idcardNegativePhoto
                    })
                    this.formValidate.idcardHandheldPhoto = storeExtend.idcardHandheldPhoto;//手持照
                    this.defaultList[2].push({
                        url:storeExtend.idcardHandheldPhoto
                    })
                    this.formValidate.storeDoorPhoto = storeExtend.storeDoorPhoto;//门头照
                    this.defaultList[3].push({
                        url:storeExtend.storeDoorPhoto
                    })
                    this.formValidate.storeCashierPhoto = storeExtend.storeCashierPhoto;//收银照
                    this.defaultList[4].push({
                        url:storeExtend.storeCashierPhoto
                    })
                    this.formValidate.storeInPhoto = storeExtend.storeInPhoto;//店内照
                    this.defaultList[5].push({
                        url:storeExtend.storeInPhoto
                    })
                    this.formValidate.contract = storeExtend.contract;//合同
                   
                    this.formValidate.businessLicenseNumber = storeExtend.businessLicenseNumber; //营业执照号码
                    this.formValidate.LegalPersonName = storeExtend.legalPersonName; //法人姓名
                    this.formValidate.IdCardNum = storeExtend.legalPersonIdcard; //身份证号码
                    this.formValidate.AccountOpeningBank = storeExtend.praBank; //开户银行
                    this.formValidate.OpeningArea = storeExtend.praArea; //开户地区
                    this.formValidate.bankBranch = storeExtend.praBankBranch; //支行名称
                    this.formValidate.accountName = storeExtend.praAccountName; //开户名称
                    this.formValidate.BankCardNumber = storeExtend.praBankCardNumber; //银行卡号
                    this.formValidate.eraBank = storeExtend.eraBank; //企业--开户银行
                    this.formValidate.eraArea = storeExtend.eraArea; //企业--开户地区
                    this.formValidate.eraBankBranch = storeExtend.eraBankBranch; //企业--支行名称
                    this.formValidate.eraCompanyName = storeExtend.eraCompanyName; //企业--公司名称
                    this.formValidate.eraBankCardNumber = storeExtend.eraBankCardNumber; //企业--银行卡号
                    this.formValidate.marginPaymentStatus = storeExtend.marginPaymentStatus?'true':'false'; //保证金缴纳状态
                    this.formValidate.premiumReceived = storeExtend.paymentAmount; //缴纳金额
                    this.formValidate.storeArea = storeExtend.storeArea //店铺面积
                    console.log(JSON.parse(storeExtend.otherService))
                    if(storeExtend.otherService){
                        JSON.parse(storeExtend.otherService).forEach((item,index)=>{
                            this.formValidate.additionalServices.push(item.name)
                        })
                    }
                    this.additionalServicesObj = storeExtend.otherService;
                })
            },
            //获取连锁品牌
            getBranch(){
                let url = common.path2+"storeChainBrand/front/findByPage";
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
            
        },
        watch: {
           
        },
        beforeMount:function(){
            this.getDataById(this.editId);
            this.getBranch();
        },
        mounted: function(){
            //初始化地图
            this.mapInit(this.mapData.longitude,this.mapData.latitude);
            // this.getDataById(this.editId)
        },
        activated: function(){
            
        },
        components:{
           VDistpicker,
           CityLinkage,
           MyUpload
        },
        props:['editId']
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
        border-color: #e9eaec; 
    }
    .boxStyle:nht-of-type(2){
        border-left:6px solid #dddee1;
    }
    .divBox{
        flex:1;
    }
    .divBox:nth-of-type(1){
        margin-right:5px;
    }
    .divBox:nth-of-type(2){
        margin-left:5px;
    }
    .ivu-row{
        display: flex;
        justify-content: space-between;
        height: auto;
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
    .ivu-upload{
        img{
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
    }
</style>
