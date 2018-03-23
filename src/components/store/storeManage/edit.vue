<template>
  <div class="addPage boxStyle">
    <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
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
                <Upload action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadFile">
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
            </FormItem>
        </div>
        <h3>认证照片</h3>
        <Row>
            <Col span="24">
                <FormItem label="营业执照" prop="businessLicense">
                    <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadLicense">
                        <Button v-if="!formValidate.businessLicense" type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                        <img v-if="formValidate.businessLicense" :src="formValidate.businessLicense" alt="">
                        <span>(三证合一只上传营业执照，非三证合一请分别上传营业执照，组织机构代码证，税务登记证)</span>
                    </Upload>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="身份证正面照" prop="idcardPositivePhoto">
                    <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadPositivePhoto">
                        <Button v-if="!formValidate.idcardPositivePhoto" type="ghost" icon="ios-cloud-upload-outline">正面照</Button>
                        <img v-if="formValidate.idcardPositivePhoto" :src="formValidate.idcardPositivePhoto" alt="">
                    </Upload>
                    <span v-if="formValidate.idcardPositivePhoto">正面照</span>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="身份证反面照" prop="idcardNegativePhoto">
                    <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadNegativePhoto">
                        <Button v-if="!formValidate.idcardNegativePhoto" type="ghost" icon="ios-cloud-upload-outline">反面照</Button>
                        <img v-if="formValidate.idcardNegativePhoto" :src="formValidate.idcardNegativePhoto" alt="">
                    </Upload>
                    <span v-if="formValidate.idcardNegativePhoto">反面照</span>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="身份证手持照" prop="idcardHandheldPhoto">
                    <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadHandheldPhoto">
                        <Button v-if="!formValidate.idcardHandheldPhoto" type="ghost" icon="ios-cloud-upload-outline">手持照</Button>
                        <img v-if="formValidate.idcardHandheldPhoto" :src="formValidate.idcardHandheldPhoto" alt="">
                    </Upload>
                    <span v-if="formValidate.idcardHandheldPhoto">手持照</span>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="门头照" prop="storeDoorPhoto">
                    <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadDoorPhoto">
                        <Button v-if="!formValidate.storeDoorPhoto" type="ghost" icon="ios-cloud-upload-outline">门头照</Button>
                        <img v-if="formValidate.storeDoorPhoto" :src="formValidate.storeDoorPhoto" alt="">
                    </Upload>
                    <span v-if="formValidate.storeDoorPhoto">门头照</span>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="收银台" prop="storeCashierPhoto">
                    <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadCashierPhoto">
                        <Button v-if="!formValidate.storeCashierPhoto" type="ghost" icon="ios-cloud-upload-outline">收银台</Button>
                        <img v-if="formValidate.storeCashierPhoto" :src="formValidate.storeCashierPhoto" alt="">
                    </Upload>
                    <span v-if="formValidate.storeCashierPhoto">收银台</span>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="店内照" prop="storeInPhoto">
                    <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadInPhoto">
                        <Button v-if="!formValidate.storeInPhoto" type="ghost" icon="ios-cloud-upload-outline">店内照</Button>
                        <img v-if="formValidate.storeInPhoto" :src="formValidate.storeInPhoto" alt="">
                    </Upload>
                    <span v-if="formValidate.storeInPhoto">店内照</span>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="店铺荣誉" prop="">
                    <Upload :show-upload-list="false" action="http://120.79.42.13:8080/system/api/file/uploadFile" :on-success="uploadStoreHonor">
                        <Button v-if="!storeHonorPhoto" type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                        <img v-if="storeHonorPhoto" :src="storeHonorPhoto" alt="">
                    </Upload>
                    <span>(店铺相关的荣誉证书，获奖证书)</span>
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
                    <Button type="primary" @click="handleSubmit('formValidate')" style="margin:0px 8px;">保存</Button>
                    <Button v-if="false" type="ghost" @click="handleReset('formValidate')" style="margin:0px 8px;">重置</Button>
                    <Button type="success" @click.native="returnHome('list')">返回</Button>    
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
    // import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                cityConfig:{
                    key:false,
                    title:'',
                    type:'linkage',
                    cityList:[],
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
                additionalServicesObj:[],
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
                        { required: true, message: '请填写缴费金额', pattern:/.+/, trigger: 'blur' }
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
                    ],
                    contract:[
                        { required: true, message: '请上传合同', pattern:/.+/, trigger: 'blur' }
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
                                scId:this.oldStore,//老店
                                manageYear:this.formValidate.managerYear,//实际经营年限
                                storeLabel:this.storeLabel,//店铺标签(五年老店)
                                specialProject:this.projectStr,//特色项目
                                storeCompanyName:this.formValidate.companyName,//公司名称
                                storeBanner:this.storeDoorPhoto,//横幅图
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
                            if(res.status==200){
                                this.$Message.success(res.data.message);
                                this.returnHome('list')
                            }else{
                                this.$Message.error(res.data.message);
                            }
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
                this.contract = res.data
            },
            //上传营业执照
            uploadLicense(res){
                this.businessLicense = res.data
            },
            //上传店铺荣誉
            uploadStoreHonor(res){
                this.storeHonorPhoto = res.data
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
                    this.oldStore = store.scId; //是否是老店
                    if(store.scId==0){
                        this.disabled = true;
                    }else{
                        this.disabled = false;
                    }  //控制年限的可用
                    this.mapData.longitude = store.storeLongitude; //经度
                    this.mapData.latitude = store.storeLatitude; //纬度
                    this.mapInit(this.mapData.longitude,this.mapData.latitude); //重新初始化地图
                    this.formValidate.storeAddress = store.storeAddress;  //店铺地址
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
                    this.cityCtrl = true
                    this.formValidate.beauticianTotal = store.beauticianTotal;
                    this.formValidate.description = store.description;
                    //------------扩展表----------------------------------------
                    this.extendId = storeExtend.id;
                    this.formValidate.companyName = storeExtend.companyName; //公司名称
                    this.formValidate.businessLicense = storeExtend.businessLicense;  //营业执照(暂时用横幅代替营业执照)
                    this.formValidate.idcardPositivePhoto = storeExtend.idcardPositivePhoto;//正面照
                    this.formValidate.idcardNegativePhoto = storeExtend.idcardNegativePhoto;//正面照
                    this.formValidate.idcardHandheldPhoto = storeExtend.idcardHandheldPhoto;//手持照
                    this.formValidate.storeDoorPhoto = storeExtend.storeDoorPhoto;//门头照
                    this.formValidate.storeCashierPhoto = storeExtend.storeCashierPhoto;//收银照
                    this.formValidate.storeInPhoto = storeExtend.storeInPhoto;//店内照
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
                    JSON.parse(storeExtend.otherService).forEach((item,index)=>{
                        this.formValidate.additionalServices.push(item.name)
                    })
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
           CityLinkage
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
