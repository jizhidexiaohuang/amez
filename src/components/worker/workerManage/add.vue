<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="员工姓名" prop="beauticianName">
                <Input v-model="formValidate.beauticianName" placeholder="请填写员工姓名"></Input>
            </FormItem>
            <FormItem  label="员工昵称" prop="beauticianNickName">
                <Input v-model="formValidate.beauticianNickName" placeholder="请填写员工姓名"></Input>
            </FormItem>
            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
            </FormItem>
            <FormItem label="员工照片">
                <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
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
                        <v-distpicker :placeholders="placeholders" @selected="onSelected"></v-distpicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem  label="详细地址" prop="address">
                <Input v-model="formValidate.address" placeholder=""></Input>
            </FormItem>
            <FormItem label="员工状态" prop="beauticianStatus">
                <RadioGroup v-model="formValidate.beauticianStatus">
                    <Radio label="0">在职</Radio>
                    <Radio label="1">离职</Radio>
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
    import VDistpicker from 'v-distpicker'
    export default {
        data () {
            return {
                placeholders: {
                    province: '------- 省 --------',
                    city: '--- 市 ---',
                    area: '--- 区 ---',
                },//省市区的占位符
                province:'',//城市级联的值
                city:'',//城市级联的值
                erea:'',//城市级联的值
                formValidate: {
                    beauticianName:"",//员工名称
                    beauticianNickName:"",//员工昵称
                    categoryLogo:"",//图片地址
                    workCardNo:"",//员工编号
                    position:"1",//员工类型
                    beauticianStatus:"0",//员工状态
                    birthday:'',//出生年月
                    joinTime:'',//入职时间
                    store:'',
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
                    workerGrade:'',
                    workerGradeList:[
                        {
                            value:'',
                            label:'请选择等级'
                        },{
                            value:0,
                            label:'初级'
                        },{
                            value:1,
                            label:'中级'
                        },{
                            value:2,
                            label:'高级'
                        }
                    ],
                    address:'',// 详细地址
                    area:'',// 省市县
                },
                ruleValidate: {
                },
                defaultList: [],
                uploadList:[],//图片列表
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
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
                        console.log(1)
                        let ajaxData = {
                            beauticianName: vm.formValidate.beauticianName, // 
                            beauticianNickName: vm.formValidate.beauticianNickName, // 
                            headImgUrl: vm.uploadList.length>0?vm.uploadList[0].url:"", // 
                            workCardNo: vm.formValidate.workCardNo, // 
                            position: vm.formValidate.position, // 
                            beauticianStatus: !!!vm.formValidate.beauticianStatus?true:false, // 
                        }
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
                        console.log(ajaxData);
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
        },
        mounted: function(){
        },
        components:{
            MyUpload,
            VDistpicker
        }
    }
</script>
<style scoped>
</style>

