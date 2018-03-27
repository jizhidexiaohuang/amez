<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <Spin fix v-if="spinShow"></Spin>
            <FormItem label="产品分类" prop="type">
                <Select v-model="formValidate.type" placeholder="选择产品分类">
                    <Option :value="item.id" v-for="item in serviceList" :key="item.id">{{ item.categoryName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="运费模板" prop="templateId">
                <Select v-model="formValidate.templateId" placeholder="选择运费模板">
                    <Option :value="item.id" v-for="(item,index) in tplList" :key="item.id">{{ item.templateName }}</Option>
                </Select>
            </FormItem>
            
            <FormItem label="产品名称" prop="physicalName">
                <Input v-model="formValidate.physicalName" placeholder="请填写产品名称"></Input>
            </FormItem>
            <div>
                <FormItem label="产品编码" prop="physicalCode">
                    <Input v-model="formValidate.physicalCode" placeholder="请填写产品编码"></Input>
                </FormItem>
            </div>

            <FormItem label="产品图片" v-if="testCode">
                <MyUpload :defaultList="defaultList" v-on:listenUpload="getUploadList" :uploadConfig="uploadConfig"></MyUpload>
            </FormItem>

            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
            </FormItem>

            <FormItem label="产品价格（元）" prop="salePrice" number='true'>
                <InputNumber :min="0" v-model="formValidate.salePrice" style="width: 100%;"></InputNumber>
            </FormItem>


        
            <FormItem label="单位" prop="unit">
                <Select v-model="formValidate.unit" placeholder="选择产品单位">
                    <Option :value="item" v-for="item in bookTypeList" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>

            <FormItem label="库存数量" prop="inventory">
                <InputNumber :min="0" v-model="formValidate.inventory" style="width: 100%;"></InputNumber>
            </FormItem>

            <FormItem label="发货地">
                <Input v-model="formValidate.deliveryPlace" placeholder="请填写发货地"></Input>
            </FormItem>

            <FormItem label="运输邮费" prop="serverName" v-if="false">
                <Input v-model="formValidate.serverName" placeholder="请填写运输邮费"></Input>
            </FormItem>

        
           
          
            <FormItem label="产品详情" prop="physicalDetail">
                <editor id="editor_id" height="700px" width="100%;" :content="formValidate.physicalDetail"
                    :uploadJson="path"
                    :loadStyleMode="false"
                    @on-content-change="onContentChange"
                    v-model="formValidate.physicalDetail"
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
    export default {
        data () {
            return {
                btnCode: false,
                tplList: [], // 模板列表
                bookTypeList:['件','个','支','盒','片','套','瓶','箱','罐'],
                formValidate: {
                    physicalName: '', // 产品名称
                    physicalCode: '', // 产品编码
                    physicalImg: '', // 产品图片
                    salePrice: 0, // 产品价格
                    unit: '', // 产品单位
                    inventory: 0, // 库存数量
                    deliveryPlace: '', // 发货地
                    physicalDetail: '', // 产品详情
                    coverImg: '', // 封面图
                    templateId: '', // 模板id
                },
                ruleValidate: {
                    type: [
                        {required: true, message: '请选择产品分类', pattern: /.+/, trigger: 'change'}
                    ],
                    templateId: [
                        {required: true, message: '请选择运费模板', pattern: /.+/, trigger: 'change'}
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
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
                uploadConfig:{
                    num:5
                },
                testCode: false,
                spinShow: false,// 加载开关
            }
        },
        props: ["sendChild"],
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        /* 产品提交的数据 */
                        let ajaxData = {};
                        /* 模板id */
                        ajaxData.templateId = vm.formValidate.templateId;
                        /* 产品名称 */
                        ajaxData.physicalName = vm.formValidate.physicalName;
                        /* 产品编码 */
                        ajaxData.physicalCode = vm.formValidate.physicalCode;
                        /* 产品图片 */ 
                        let arrs = [];
                        if(vm.uploadList.length > 0){
                            vm.uploadList.forEach(function(item,index){
                                arrs.push(item.url);
                            })
                        }
                        ajaxData.physicalImg =  !!!arrs?"":arrs.join();
                        /* 产品价格 */
                        ajaxData.salePrice = +vm.formValidate.salePrice*100;
                        /* 产品单位 */
                        ajaxData.unit = vm.formValidate.unit;
                        /* 库存数量 */
                        ajaxData.inventory = vm.formValidate.inventory;
                        /* 发货地 */
                        ajaxData.deliveryPlace = vm.formValidate.deliveryPlace;
                        /* 产品详情 */
                        ajaxData.physicalDetail = vm.formValidate.physicalDetail;
                        /* 封面图 */
                        ajaxData.coverImg = vm.uploadList.length>0?vm.uploadList[0].url:"",//封面图
                        /* 产品id */
                        ajaxData.id = vm.sendChild.itemId;
                        let url = vm.common.path2+"productPhysical/edit";
                        vm.btnCode = true;
                        vm.$http.put(
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
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
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
                }).catch(function(err){
                })
            },
            // 获取产品信息
            fnQueryById () {
                let vm = this;
                let id = vm.sendChild.itemId;
                let url = vm.common.path2 + "productPhysical/queryById/"+id;
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
            // 产品的信息遍历踹
            fnInitQuery (data) {
                let vm = this;
                // 模板id
                vm.formValidate.templateId = data.templateId;
                // 产品名称
                vm.formValidate.physicalName = data.physicalName;
                // 产品编码
                vm.formValidate.physicalCode = data.physicalCode;
                // 产品图片
                vm.defaultList = [];
                if(!!!data.coverImg){

                }else{
                    vm.formValidate.coverImg = data.coverImg;//封面图
                    if(!!data.physicalImg){
                        let arrs = data.physicalImg.split(",");
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
                // 产品价格
                vm.formValidate.salePrice = +data.salePrice/100;
                // 产品单位
                vm.formValidate.unit = data.unit;
                // 库存数量
                vm.formValidate.inventory = !!data.inventory?+data.inventory:0;
                // 发货地
                vm.formValidate.deliveryPlace = data.deliveryPlace;
                // 产品详情
                vm.formValidate.physicalDetail = data.physicalDetail;
                // 封面图
                vm.formValidate.coverImg = data.coverImg;
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
            this.fnQueryById();
        },
        components:{
            MyUpload,
        }
    }
</script>
<style scoped>
</style>

