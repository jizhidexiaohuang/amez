<template>
  <div class="addPage">
        <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <h2>新增会员卡</h2>
            <FormItem label="会员卡名称" prop="cardName">
                <Col span="5">
                    <Input v-model="formValidate.cardName" placeholder="请输入会员卡名称"></Input>
                </Col>
            </FormItem>
            <FormItem label="发行方式" prop="issuingUnit">
                <Col span="6">
                <Select v-model="formValidate.issuingUnit" label-in-value style="width:100px;">
                    <Option value="0" disabled>平台</Option>
                    <Option value="1">品牌</Option>
                </Select>
                <Select v-model="formValidate.brandId" label-in-value @on-change="getBrandName" style="width:100px;">
                    <Option :value="item.id" v-for='(item ,index) in brandList' :key="index">{{item.brandName}}</Option>
                </Select>
                </Col>
            </FormItem>
            <FormItem label="会员卡折扣比率" prop="discount">
                <Col span="5">
                    <Input v-model="formValidate.discount" placeholder="请输入门店电话"></Input>              
                </Col>
                <Col span="5">（输入89，即表示下单可打89折）</Col>
            </FormItem>
            <FormItem label="会员卡面值" prop="cardValue">
                <Col span="5">
                    <Input v-model="formValidate.cardValue" placeholder="请输入会员卡面值"></Input>              
                </Col>
                <Col span="2">元</Col>
            </FormItem>
            <FormItem label="发行数量" prop="cardTotal">
                <Col span="5">
                    <Input v-model="formValidate.cardTotal" placeholder="请输入发行数量"></Input>              
                </Col>
            </FormItem>
            <FormItem label="上传卡面样式">
                <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
            </FormItem>
            <FormItem label="是否支持充值" prop="isRecharge">
                <RadioGroup v-model="formValidate.isRecharge">
                    <Radio label="0">是</Radio>
                    <Radio label="1">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="使用范围">
                <businessTable></businessTable>
                <businessList></businessList>
            </FormItem>
            <FormItem label="服务项目">
                <serviceTable></serviceTable>
                <serviceList :discount="discount"></serviceList>
            </FormItem>
            <FormItem label="有效期" prop="termOfValidity">
                <RadioGroup v-model="formValidate.termOfValidity">
                    <Radio label="0">永久有效</Radio>
                    <Radio label="1">有效期</Radio>
                    <Radio label="2">有效天数</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="有效期" prop="expiryDate" v-if="formValidate.termOfValidity==1">
                <DatePicker v-model="formValidate.expiryDate" format="yyyy/MM/dd" type="daterange" placement="top-start" placeholder="请选择日期" style="width:316px;"></DatePicker>
            </FormItem>
            <FormItem label="有效天数" prop="expiryDay" v-if="formValidate.termOfValidity==2">
                <Col span="5">
                    <Input v-model="formValidate.expiryDay" placeholder="请输入有效天数"></Input>  
                </Col>
                <Col span="2">天（从购买时开始）</Col>
            </FormItem>
            <FormItem label="卡面预览" prop="">
                <div class="memberCard">
                    <img :src="src" alt="">
                    <div class="brand" v-if="formValidate.brandName">{{formValidate.brandName}}·会员卡（下单享{{formValidate.discount}}折）</div>
                    <div class="quota" v-if="formValidate.cardValue">￥{{formValidate.cardValue}} （全国通用）</div>
                    <div class="periodOfValidity">有效期 {{getPeriod}}</div>
                </div>
            </FormItem>
            <FormItem label="用卡说明" prop="cardExplain">
                <Col span="5">
                    <Input v-model="formValidate.cardExplain" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="输入该卡的介绍，使用须知等"></Input>
                </Col>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem>
        </Form>
  </div>
</template>
<script>
    import MyUpload from '../../../common/upload.vue'
    import businessTable from './businessTable.vue'
    import businessList from './businessList.vue'
    import serviceTable from './serviceTable.vue'
    import serviceList from './serviceList.vue'
    export default {
        data() {
            return {
                discount:'',
                src:'../../../static/images/membercard.png',
                brandList:[], //渲染所属品牌下拉框数组
                formValidate:{
                   cardName:'',
                   cardValue:'',
                   discount:'',
                   issuingUnit:'1',
                   brandId:'',
                   brandName:'',
                   cardTotal:'',
                   isRecharge:'0',
                   termOfValidity:'0', //有效期类型
                   expiryDate:[],  //有效期
                   expiryDay:'',   //天数
                   cardExplain:'',
                   useAbleStoreList:[],//使用商家的集合
                   useAbleProductList:[],//使用服务的集合
                   imgUrl:''
                },
                ruleValidate:{

                },
                defaultList:[],
                uploadConfig: {
                    num:1
                },
            }
        },
        computed:{
            getPeriod:function(){
                let str = '';
                if(this.formValidate.termOfValidity==1){
                    console.log(this.formValidate.expiryDate)
                    if(this.formValidate.expiryDate[0]!=null&&this.formValidate.expiryDate[1]!=null){
                        let start = this.common.simpleFormatDate(this.formValidate.expiryDate[0],2);
                        let end = this.common.simpleFormatDate(this.formValidate.expiryDate[1],2);
                        str = start+'-'+end;
                    }
                }else if(this.formValidate.termOfValidity==2){
                    str = this.formValidate.expiryDay+'天';
                }else{
                    str = '永久'
                }
                return str;
            },
            getBusinessId(){
                return this.$store.getters.businessId;
            },
            getServiceId(){
                return this.$store.getters.serviceId;
            }
        },
        methods:{
            // 获取品牌名
            getBrandName(data){
                console.log(data)
                this.formValidate.brandId = data.value;
                this.formValidate.brandName = data.label;
            },
            //获取连锁品牌
            getBrand(){
                let url = this.common.path2+"storeChainBrand/front/findByPage";
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
                    this.brandList = data;
                    console.log(data)
                })
            },
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
                if(data.length!=0){
                    vm.formValidate.imgUrl = vm.uploadList[0].url;
                    vm.src = vm.uploadList[0].url
                }else{
                    vm.src = '../../../static/images/membercard.png'
                }
                console.log(vm.uploadList);
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    let vm = this;
                    let start;
                    let end;
                    let effectiveDay;
                    if (valid) {
                        if(this.formValidate.termOfValidity=='0'){
                            start = null;
                            end = null;
                            effectiveDay = null;
                        }else if(this.formValidate.termOfValidity=='1'&&this.formValidate.expiryDate[0]&&this.formValidate.expiryDate[1]){
                            start = this.common.formatDate(this.formValidate.expiryDate[0])
                            end = this.common.formatDate(this.formValidate.expiryDate[1])
                            effectiveDay = null;
                        }else if(this.formValidate.termOfValidity=='2'&&this.formValidate.expiryDay){
                            start = null;
                            end = null;
                            effectiveDay = this.formValidate.expiryDay-0;
                        }
                        let ajaxData = {
                            memberCardName:this.formValidate.cardName,
                            balance:this.formValidate.cardValue-0,
                            discount:this.formValidate.discount-0,
                            brandId:this.formValidate.brandId,
                            brandName:this.formValidate.brandName,
                            issueType:this.formValidate.issuingUnit=='0'?false:true,
                            issueNum:this.formValidate.cardTotal-0,
                            stylePattern:this.formValidate.imgUrl,
                            supportRecharge:this.formValidate.isRecharge=='0'?false:true,
                            useAbleStoreList:this.formValidate.useAbleStoreList,//使用商家范围
                            useAbleProductList:this.formValidate.useAbleProductList, //使用服务
                            remark:this.formValidate.cardExplain,
                            effectiveType:this.formValidate.termOfValidity, //有效期类型
                            useStartTime:start,
                            expiredTime:end,
                            effectiveDay:effectiveDay    //有效天数
                        }
                        console.log(JSON.stringify(ajaxData))
                        let url = this.common.path2+'memberCard/releaseMemberCard';
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
                            if(res.data.code==200){
                                vm.handReturn('list');
                                this.$Message.success('添加成功!');
                            }
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
        },
        watch:{
            getBusinessId:{
                deep:true,
                handler(val){
                    console.log(val)
                    this.formValidate.useAbleStoreList = val;
                }
            },
            getServiceId:{
                deep:true,
                handler(val){
                    console.log(val)
                    this.formValidate.useAbleProductList = val;
                }
            },
            formValidate:{
                deep:true,
                handler(val){
                    if(val.discount){
                        this.discount = val.discount;
                    }
                }
            }
        },
        beforeMount: function () {
            this.getBrand()
        },
        components:{
            MyUpload,
            businessTable,
            businessList,
            serviceTable,
            serviceList,
        }
    }
</script>
<style lang="scss" scoped>
    .memberCard{
        position: relative;
        color:white;
        font-size: 12px;
        img{
            width:250px;
            height: auto;
        }
        .brand{
            position: absolute;
            left:8px;
            top:0px;
        }
        .quota{
            position: absolute;
            left: 8px;
            top:20px;
        }
        .periodOfValidity{
            position: absolute;
            left:8px;
            bottom:8px;
        }
    }
</style>

