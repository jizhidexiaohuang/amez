<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem label="产品分类" prop="type">
                <Select v-model="formValidate.type" placeholder="选择产品分类">
                    <Option :value="item.id" v-for="item in serviceList" :key="item.id">{{ item.categoryName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="产品名称" prop="physicalName">
                <Input v-model="formValidate.physicalName" placeholder="请填写产品名称"></Input>
            </FormItem>
            <FormItem label="产品编码">
                <Input v-model="formValidate.physicalCode" placeholder="请填写产品编码"></Input>
            </FormItem>
            <div class="ivu-form" style="margin-bottom: 20px;">
                <div class="ivu-form-item-label" style="width: 120px; float:left; text-align:right;">
                    <span style="color:#ed3f14; font-size:12px; font-family: 'SimSun'; margin-right:4px;">*</span>产品图片
                </div>
                <div style="margin-left:120px;">
                    <MyUpload :defaultList="defaultList" v-on:listenUpload="v=>{getUploadList(v,'physicalImg')}" :uploadConfig="uploadConfig"></MyUpload>
                </div>
            </div>
            <div class="ivu-form" style="margin-bottom: 20px;">
                <div class="ivu-form-item-label" style="width: 120px; float:left; text-align:right;">
                    <span style="color:#ed3f14; font-size:12px; font-family: 'SimSun'; margin-right:4px;">*</span>封面图
                </div>
                <div style="margin-left:120px;">
                    <MyUpload :defaultList="defaultList" v-on:listenUpload="v=>{getUploadList(v,'coverImg')}" :uploadConfig="uploadConfig1"></MyUpload>
                </div>
            </div>
            <FormItem label="产品价格（元）" prop="salePrice" number='true'>
                <InputNumber :min="0" v-model="formValidate.salePrice" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="单位" prop="unit">
                <Select v-model="formValidate.unit" placeholder="选择产品单位">
                    <Option :value="item" v-for="item in bookTypeList" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>
            <FormItem label="库存总数" prop="inventoryTotal">
                <InputNumber :min="0" v-model="formValidate.inventoryTotal" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="库存可消耗数" prop="inventoryConsumable">
                <InputNumber :min="0" v-model="formValidate.inventoryConsumable" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="发货地" prop="deliveryPlace">
                <Input v-model="formValidate.deliveryPlace" placeholder="请填写发货地"></Input>
            </FormItem>
            <FormItem label="邮费类型" prop="postageType">
                <RadioGroup v-model="formValidate.postageType">
                    <Radio label="1">买家承担</Radio>
                    <Radio label="2">卖家包邮</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="运费模板" prop="templateId" v-if="formValidate.postageType == 1">
                <Select v-model="formValidate.templateId" placeholder="选择运费模板">
                    <Option :value="item.id" v-for="(item,index) in tplList" :key="item.id">{{ item.templateName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="销量" prop="saleVolume" v-if="false">
                <InputNumber :min="0" v-model="formValidate.saleVolume" style="width: 100%;"></InputNumber>
            </FormItem>
            
            
            
            
            <FormItem label="重量（KG）" prop="weight">
                <InputNumber :min="0" v-model="formValidate.weight" style="width: 100%;"></InputNumber>
            </FormItem>
            
            
            <FormItem label="库存订单预约数" prop="inventoryOrderReservation" v-if="false">
                <InputNumber :min="0" v-model="formValidate.inventoryOrderReservation" style="width: 100%;"></InputNumber>
            </FormItem>
            
            <FormItem label="预警开关" prop="inventoryWarningSwitch" v-if="false">
                <iSwitch size="large" v-model="switch1" @on-change="switchChange">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </iSwitch>
            </FormItem>
            <FormItem label="库存预警数" prop="inventoryWarning" v-if="false">
                <InputNumber :min="0" v-model="formValidate.inventoryWarning" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="产品详情" prop="physicalDetail">
                <editor id="editor_id" height="700px" width="100%;" :content="formValidate.physicalDetail"
                    :uploadJson="path"
                    :loadStyleMode="false"
                    @on-content-change="onContentChange"
                    v-model="formValidate.physicalDetail"
                ></editor>
            </FormItem>
            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
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
    export default {
        data () {
            return {
                switch1: false,
                btnCode: false,
                tplList: [], // 模板列表
                bookTypeList:['件','个','支','盒','片','套','瓶','箱','罐'],
                formValidate: {
                    coverImg: '', // 封面图
                    deliveryPlace: '', // 发货地
                    inventoryConsumable: 0, // 库存可消耗数
                    inventoryOrderReservation: 0, // 库存订单预约数
                    inventoryTotal: 0, // 库存总数
                    inventoryWarning: 0, // 库存预警数
                    inventoryWarningSwitch: 0, // 预警开关 1开 0关
                    physicalCode: '', // 产品编码
                    physicalDetail: '', // 产品详情
                    physicalImg: '', // 产品图片
                    physicalName: '', // 产品名称
                    postageType: '1', // 邮费类型
                    salePrice: 0, // 产品价格
                    saleVolume: 0, // 销量
                    templateId: '', // 模板id
                    unit: '', // 产品单位
                    weight: 0, // 重量/KG
                    type: '', // 产品分类
                },
                ruleValidate: {
                    type: [
                        {required: true, message: '请选择产品分类', pattern: /.+/, trigger: 'change'}
                    ],
                    salePrice: [
                        {required: true, message: '请输入产品价格', pattern: /.+/, trigger: 'change'}
                    ],
                    inventoryConsumable: [
                        {required: true, message: '请输入库存可消耗数', pattern: /.+/, trigger: 'change'}
                    ],
                    inventoryOrderReservation: [
                        {required: true, message: '请输入库存订单预约数', pattern: /.+/, trigger: 'change'}
                    ],
                    inventoryTotal: [
                        {required: true, message: '请输入库存总数', pattern: /.+/, trigger: 'change'}
                    ],
                    inventoryWarning: [
                        {required: true, message: '请输入库存预警数', pattern: /.+/, trigger: 'change'}
                    ],
                    templateId: [
                        {required: true, message: '请选择运费模板', pattern: /.+/, trigger: 'change'}
                    ],
                    physicalDetail: [
                        {required: true, message: '请输入产品详情', pattern: /.+/, trigger: 'change'}
                    ],
                    weight: [
                        {required: true, message: '请输入重量', pattern: /.+/, trigger: 'change'}
                    ],
                    saleVolume: [
                        {required: true, message: '请输入产品销量', pattern: /.+/, trigger: 'change'}
                    ],
                    physicalName: [
                        {required: true, message: '请填写产品名称', pattern: /.+/, trigger: 'change'}
                    ],
                    physicalCode: [
                        {required: true, message: '请填写产品编码', pattern: /.+/, trigger: 'change'}
                    ],
                    unit: [
                        {required: true, message: '请选择产品单位', pattern: /.+/, trigger: 'change'}
                    ],
                    deliveryPlace: [
                        {required: true, message: '请填写发货地', pattern: /.+/, trigger: 'change'}
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
                uploadConfig1:{
                    num:1
                },
            }
        },
        props: ["sendChild"],
        methods: {
            switchChange (status) {
                this.inventoryWarningSwitch = !!status?1:0;
                console.log(this.inventoryWarningSwitch)
            },
            // 获取分类详情
            getCategoryInfo (id) {
                let vm = this;
                let list = vm.serviceList;
                console.log(list);
                let val = '';
                list.forEach((item,index) => {
                    if(item.id == id){
                        val = item;
                    }
                });
                console.log(val);
                let obj = {
                    categoryId: val.id, // id
                    categoryCode: val.categoryCode, // 编码
                    categoryName: val.categoryName, // 分类名称
                }
                return obj;
            },
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                // 产品图片
                if(!!!vm.uploadList.length){
                    vm.$Message.error('请上传产品图片!');
                    return false;
                }
                // 主图
                if(!!!vm.formValidate.coverImg){
                    vm.$Message.error('请上传封面图!');
                    return false;
                }

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        /* 产品提交的数据 */
                        let ajaxData = {};
                        /* 产品分类 */
                        ajaxData.productPhysicalCategoryRef = vm.getCategoryInfo(vm.formValidate.type);
                        /* 产品 */
                        ajaxData.productPhysical = {
                            coverImg: vm.formValidate.coverImg, // 封面图
                            deliveryPlace: vm.formValidate.deliveryPlace, // 发货地
                            inventoryConsumable: vm.formValidate.inventoryConsumable, // 库存可消耗数
                            inventoryOrderReservation: vm.formValidate.inventoryOrderReservation, // 库存订单预约数
                            inventoryTotal: vm.formValidate.inventoryTotal, // 库存总数
                            inventoryWarning: vm.formValidate.inventoryWarning, // 库存预警数
                            inventoryWarningSwitch: vm.formValidate.inventoryWarningSwitch, // 库存预警开关
                            physicalCode: vm.formValidate.physicalCode, // 产品编码
                            physicalDetail: vm.formValidate.physicalDetail, // 产品详情
                            physicalName: vm.formValidate.physicalName, // 产品名称
                            postageType: vm.formValidate.postageType, // 邮费类型
                            salePrice: !!vm.formValidate.salePrice?+vm.formValidate.salePrice*100:'', // 销售价
                            saleVolume: vm.formValidate.saleVolume, // 销量
                            templateId: vm.formValidate.templateId, // 模板id
                            unit: vm.formValidate.unit, // 单位
                            weight: vm.formValidate.weight, // 重量
                        }
                        /* 产品图片 */ 
                        let arrs = [];
                        if(vm.uploadList.length > 0){
                            vm.uploadList.forEach(function(item,index){
                                arrs.push(item.url);
                            })
                        }
                        ajaxData.productPhysical.physicalImg =  !!!arrs?"":arrs.join();
                        console.log(ajaxData);
                        let url = vm.common.path2+"productPhysical/add";
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
                this.formValidate.physicalDetail = "";
                this.$refs[name].resetFields();
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            // 富文本
            onContentChange (val) {
                this.formValidate.physicalDetail = val
            },
            // 获取图片列表
            getUploadList (data,type) {
                let vm = this;
                if(type == 'physicalImg'){
                    vm.uploadList = data;
                }else if(type == 'coverImg'){
                    vm.formValidate.coverImg = data[0].url;
                }
            },
            // 服务分类接口数据
            fnGetProductCategory () {
                let vm = this;
                let url = vm.common.path2 + "productCategory/front/findByPage?pageSize=1000";
                let ajaxData = {
                    categoryParentId:0,
                }
                vm.$http.post(
                    url,
                    ajaxData,
                ).then(function(res){
                    let oData = res.data.data.list;
                    vm.serviceList = oData;
                    console.log(vm.serviceList);
                }).catch(function(err){
                })
            },
            // 获取运费模板列表
            fnGetTplList () {
                let vm = this;
                let url = vm.common.path2+"freightTemplate/findByPageForDefault?pageSize=1000";
                this.$http.post(
                    url,
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then(function(res){
                    let oData = res.data
                    vm.tplList = res.data.data.list;
                }).catch(function(err){
                })
            },
          
        },
        mounted: function(){
            let vm = this;
            this.fnGetTplList();
            this.fnGetProductCategory();
        },
        components:{
            MyUpload,
        }
    }
</script>
<style scoped>
</style>

