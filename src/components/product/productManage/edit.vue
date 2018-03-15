<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <Spin fix v-if="spinShow"></Spin>
            <FormItem label="产品分类" prop="type">
                <Select v-model="formValidate.type" placeholder="选择产品分类">
                    <Option :value="item.id" v-for="item in serviceList" :key="item.id">{{ item.categoryName }}</Option>
                </Select>
            </FormItem>
            
            <FormItem label="产品名称" prop="physicalName">
                <Input v-model="formValidate.physicalName" placeholder="请填写产品名称"></Input>
            </FormItem>

            <FormItem label="产品编码" prop="physicalCode">
                <Input v-model="formValidate.physicalCode" placeholder="请填写产品编码"></Input>
            </FormItem>

            <FormItem label="产品图片" v-if="testCode">
                <MyUpload :defaultList="defaultList" v-on:listenUpload="getUploadList" :uploadConfig="uploadConfig"></MyUpload>
            </FormItem>

            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
            </FormItem>

            <FormItem label="产品价格" prop="salePrice" number='true'>
                <Input v-model="formValidate.salePrice" placeholder="请填写产品价格，单位元"></Input>
            </FormItem>


        
            <FormItem label="单位">
                <Select v-model="formValidate.unit" placeholder="选择产品单位">
                    <Option :value="item" v-for="item in bookTypeList" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>

            <FormItem label="库存数量" prop="inventory">
                <Input v-model="formValidate.inventory" placeholder="请填写库存数量"></Input>
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
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
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
                bookTypeList:['件','个','支','盒','片','套','瓶','箱','罐'],
                formValidate: {
                    physicalName: '', // 产品名称
                    physicalCode: '', // 产品编码
                    physicalImg: '', // 产品图片
                    salePrice: '', // 产品价格
                    unit: '', // 产品单位
                    inventory: '', // 库存数量
                    deliveryPlace: '', // 发货地
                    physicalDetail: '', // 产品详情
                    coverImg: '', // 封面图

                },
                ruleValidate: {
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
                        console.log(ajaxData);
                        let url = vm.common.path2+"productPhysical/edit";
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
                            console.log(oData);
                            /* vm.table.recordsTotal = oData.data.total;
                            vm.table.tableData1 = res.data.data.list;
                            vm.table.loading = false; */
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
                console.log(vm.uploadList);
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
                    console.log(err);
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
                console.log(data);
                let vm = this;
                // physicalName: '', // 产品名称
                // physicalCode: '', // 产品编码
                // physicalImg: '', // 产品图片
                // salePrice: '', // 产品价格
                // unit: '', // 产品单位
                // inventory: '', // 库存数量
                // deliveryPlace: '', // 发货地
                // physicalDetail: '', // 产品详情
                // coverImg: '', // 封面图

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
                vm.formValidate.inventory = data.inventory;
                // 发货地
                vm.formValidate.deliveryPlace = data.deliveryPlace;
                // 产品详情
                vm.formValidate.physicalDetail = data.physicalDetail;
                // 封面图
                vm.formValidate.coverImg = data.coverImg;
            }
          
        },
        mounted: function(){
            let vm = this;
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

