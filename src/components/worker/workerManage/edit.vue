<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="员工姓名" prop="beauticianName">
                <Input v-model="formValidate.beauticianName" placeholder="请填写员工姓名"></Input>
            </FormItem>
            <FormItem  label="员工昵称" prop="beauticianNickName">
                <Input v-model="formValidate.beauticianNickName" placeholder="请填写员工姓名"></Input>
            </FormItem>
            <FormItem label="员工照片">
                <MyUpload v-if="imgCtrl" :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
            </FormItem>
            <FormItem  label="工牌号" prop="workCardNo">
                <Input v-model="formValidate.workCardNo" placeholder="请填写工牌号"></Input>
            </FormItem>
            <FormItem  label="注册手机" prop="mobile">
                <Input v-model="formValidate.mobile" placeholder="请填写注册手机"></Input>
            </FormItem>
            <FormItem label="员工类型" prop="position">
                <RadioGroup v-model="formValidate.position">
                    <Radio label="1">店长</Radio>
                    <Radio label="2">正式员工</Radio>
                    <Radio label="3">兼职员工</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="出生年月">
                <Row>
                    <Col span="11">
                        <FormItem prop="birthday">
                            <DatePicker type="date" v-model="formValidate.birthday"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="入职时间">
                <Row>
                    <Col span="11">
                        <FormItem prop="joinTime">
                            <DatePicker type="date" v-model="formValidate.joinTime"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem  label="从业经验" prop="experience">
                <Input v-model="formValidate.experience" placeholder=""></Input>
            </FormItem>
            <FormItem label="员工住址" prop="">
                <Row>
                    <Col span="20">
                        <CityLinkage v-if="cityCtrl" :cityConfig="cityConfig" v-on:listenCity="getCity"></CityLinkage>
                    </Col>
                </Row>
            </FormItem>
            <FormItem  label="详细地址" prop="address">
                <Input v-model="formValidate.address" placeholder=""></Input>
            </FormItem>
            <FormItem label="员工状态" prop="beauticianStatus">
                <RadioGroup v-model="formValidate.beauticianStatus">
                    <Radio label="0">离职</Radio>
                    <Radio label="1">在职</Radio>
                    <Radio label="2">休息</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="所属门店" prop="store">
                <Select v-model="formValidate.store">
                    <Option :value="item.value" v-for='(item ,index) in formValidate.storeList' :key="index">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="员工等级" prop="workerGrade">
                <Select v-model="formValidate.workerGrade">
                    <Option :value="item.value" v-for='(item ,index) in formValidate.workerGradeList' :key="index">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    import CityLinkage from '../../common/city.vue'
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
                imgCtrl:false,
                province:'',//城市级联的值
                city:'',//城市级联的值
                area:'',//城市级联的值
                provinceId:'',//城市级联的Id
                cityId:'',//城市级联的Id
                areaId:'',//城市级联的Id
                formValidate: {
                    beauticianName:"",//员工名称
                    beauticianNickName:"",//员工昵称
                    workCardNo:"",//员工编号
                    mobile:"",//注册手机
                    position:"1",//员工类型
                    beauticianStatus:"0",//员工状态
                    birthday:'',//出生年月
                    joinTime:'',//入职时间
                    storeId:'', //店铺id
                    storeList:[
                        {
                            value:'',
                            label:'请选择所属店铺'
                        },{
                            value:0,
                            label:'美业一店'
                        },{
                            value:1,
                            label:'美业二店'
                        }
                    ],
                    workerGrade:'', //员工等级
                    workerGradeList:[
                        {
                            value:'',
                            label:'请选择等级'
                        },{
                            value:1,
                            label:'初级美容师'
                        },{
                            value:2,
                            label:'中级美容师'
                        },{
                            value:3,
                            label:'高级美容师'
                        },{
                            value:4,
                            label:'资深美容师'
                        }
                    ],
                    address:'',// 详细地址
                },
                ruleValidate: {
                },
                defaultList: [], //默认列表
                uploadList:[],//图片列表
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                switch1: false,
                uploadConfig: {
                    num:1
                }
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加品牌服务
                        let ajaxData = {
                            id:vm.sendChild.id, //id
                            beauticianName: vm.formValidate.beauticianName, // 员工姓名
                            beauticianNickName: vm.formValidate.beauticianNickName, // 员工昵称
                            headImgUrl: vm.uploadList.length>0?vm.uploadList[0].url:"", // 员工头像
                            workCardNo: vm.formValidate.workCardNo, // 员工编号
                            phone:vm.formValidate.mobile, //注册手机
                            beauticianType:vm.formValidate.position, //员工类型
                            birthDate:vm.formValidate.birthday, //出生年月
                            entryDate:vm.formValidate.joinTime, //入职时间
                            years:vm.formValidate.experience, //从业经验
                            provinceName:vm.province,
                            provinceId:vm.provinceId,
                            cityName:vm.city,
                            cityId:vm.cityId,
                            areaName:vm.area,
                            areaId:vm.areaId,
                            address:vm.formValidate.address, //详细地址
                            beauticianStatus:vm.formValidate.beauticianStatus, //员工状态
                            beauticianLevel:vm.formValidate.workerGrade, //员工等级
                            storeId:vm.formValidate.storeId //店铺id
                        }
                        console.log(ajaxData)
                        let url = vm.common.path+"storeBeautician/insert";
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
                    } else {
                        this.$Message.error('提交失败!');
                    }
                })
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
                console.log(vm.uploadList);
            },
            // 开关控制
            changeSwitch1 (status) {
                this.$Message.info('开关状态：' + status);
                console.log(this.switch1);
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
                this.provinceId = data[0].value
                this.city = data[1].label
                this.cityId = data[1].value
                this.area = data[2].label
                this.areaId = data[2].value
            },
            getDataById(id){
                let vm = this;
                let url = this.common.path2 +'storeBeautician/queryById/'+id
                vm.$http.get(url).then(res=>{
                    console.log(res.data.data)
                    let oData = res.data.data;
                    vm.formValidate.beauticianName = oData.beauticianName;
                    vm.formValidate.beauticianNickName = oData.beauticianNickName;
                    vm.defaultList.push({
                        url:oData.headImgUrl
                    }); //员工头像
                    vm.imgCtrl = true;
                    vm.formValidate.workCardNo = oData.workCardNo;
                    vm.formValidate.mobile = oData.phone;
                    vm.formValidate.position = oData.beauticianType;
                    vm.formValidate.birthday = oData.birthDate;
                    vm.formValidate.joinTime = oData.entryDate;
                    vm.formValidate.experience = oData.years;
                    vm.formValidate.address = oData.address;
                    vm.formValidate.beauticianStatus = oData.beauticianStatus;
                    vm.formValidate.workerGrade = oData.beauticianLevel;
                    vm.cityConfig.cityList.push({
                        value:oData.provinceId,
                        label:oData.provinceName
                    },{
                        value:oData.cityId,
                        label:oData.cityName
                    },{
                        value:oData.areaId,
                        label:oData.areaName
                    });
                    vm.cityCtrl = true;
                })
            }
        },
        beforeMount:function(){
            this.getDataById(this.sendChild.id)
        },
        mounted: function(){
        },
        components:{
            MyUpload,
            CityLinkage
        },
        props:['sendChild']
    }
</script>
<style scoped>
</style>


