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
                            <DatePicker type="date" v-model="formValidate.birthday" placeholder="请选择出生年月"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="入职时间">
                <Row>
                    <Col span="11">
                        <FormItem prop="joinTime">
                            <DatePicker type="date" v-model="formValidate.joinTime" placeholder="请选择入职时间"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem  label="从业经验" prop="experience">
                <Input v-model="formValidate.experience" placeholder="请填写从业时间"></Input>
            </FormItem>
            <FormItem label="员工住址" prop="">
                <Row>
                    <Col span="20">
                        <CityLinkage :cityConfig="cityConfig" v-on:listenCity="getCity"></CityLinkage>
                    </Col>
                </Row>
            </FormItem>
            <FormItem  label="详细地址" prop="address">
                <Input v-model="formValidate.address" placeholder="请填写详细地址"></Input>
            </FormItem>
            <FormItem label="员工状态" prop="beauticianStatus">
                <RadioGroup v-model="formValidate.beauticianStatus">
                    <Radio label="1">在职</Radio>
                    <Radio label="0">离职</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="所属门店" prop="storeName" style="width:500px;">
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
                    type:'linkage'
                },
                tableCtrl:false,
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
                    mobile:"", //注册手机
                    position:"1",//员工类型
                    beauticianStatus:"1",//员工状态
                    birthday:'',//出生年月
                    joinTime:'',//入职时间
                    experience:'', //从业经验
                    storeName:'', //店铺名称
                    storeId:'',//店铺id
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
                defaultList: [], //默认图片
                uploadList:[],//图片列表
                path:this.common.path2+"system/api/file/uploadForKindeditor",
                switch1: false,
                uploadConfig: {
                    num:1
                },
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
                ]
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
                            beauticianName: vm.formValidate.beauticianName, // 员工姓名
                            beauticianNickName: vm.formValidate.beauticianNickName, // 员工昵称
                            headImgUrl: vm.uploadList.length>0?vm.uploadList[0].url:"", // 员工头像
                            workCardNo: vm.formValidate.workCardNo, // 员工编号
                            phone:vm.formValidate.mobile, //注册手机
                            beauticianType:vm.formValidate.position, //员工类型
                            birthDate:vm.common.simpleFormatDate(vm.formValidate.birthday,1), //出生年月
                            entryDate:vm.common.simpleFormatDate(vm.formValidate.joinTime,1), //入职时间
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
                            storeId:vm.formValidate.storeId, //店铺id
                            storeName:vm.formValidate.storeName //店铺名称
                        }
                        console.log(JSON.stringify(ajaxData))
                        let url = vm.common.path2+"storeBeautician/add";
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
            // 点击所属门店输入框，显示或隐藏table
            selectStore(){
                if(this.tableCtrl){
                    this.tableCtrl = false;
                }else{
                    this.tableCtrl = true;
                }
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
            //省市联动选择的值
            getCity(data){
                console.log(data)
                this.province = data[0].label
                this.provinceId = data[0].value
                this.city = data[1].label
                this.cityId = data[1].value
                this.area = data[2].label
                this.areaId = data[2].value
            },
        },
        mounted: function(){
            this.getData()
        },
        components:{
            MyUpload,
            CityLinkage
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

