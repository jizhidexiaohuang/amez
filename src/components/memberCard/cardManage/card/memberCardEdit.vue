<template>
  <div class="addPage">
        <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <h2>编辑会员卡</h2>
            <FormItem label="会员卡名称" prop="cardName">
                <Col span="6">
                    <Input v-model="formValidate.cardName" placeholder="请输入会员卡名称"></Input>
                </Col>
            </FormItem>
            <FormItem label="会员卡所属品牌" prop="brandId" v-show="!storeShow">
                <Col span="6">
                <Select v-model="formValidate.issuingUnit" label-in-value style="width:100px;" v-if="false">
                    <Option value="0" disabled>平台</Option>
                    <Option value="1">品牌</Option>
                </Select>
                <Select v-model="formValidate.brandId" label-in-value @on-change="getBrandName" style="width:200px;">
                    <Option :value="item.id" v-for='(item ,index) in brandList' :key="index">{{item.brandName}}</Option>
                </Select>
                </Col>
            </FormItem>
            <FormItem label="发行数量" prop="cardTotal" v-if="false">
                <Col span="6">
                    <Input v-model="formValidate.cardTotal" placeholder="请输入发行数量"></Input>              
                </Col>
            </FormItem>
            <FormItem label="使用范围" v-show="!storeShow">
                <businessTable :brandId="brandId"></businessTable>
                <businessList></businessList>
            </FormItem>
            <FormItem label="服务项目" v-show="storeShow">
                <serviceTable :storeId="storeId"></serviceTable>
                <serviceList :discount="discount"></serviceList>
            </FormItem>
            <FormItem label="会员卡面值" prop="cardValue">
                <Col span="2">
                    <InputNumber :max="100000000" :min="1" v-model="formValidate.cardValue"></InputNumber>
                    <!-- <Input v-model="formValidate.cardValue" placeholder="请输入会员卡面值"></Input>               -->
                </Col>
                <Col span="2">元</Col>
            </FormItem>
            <FormItem label="会员卡折扣比率" prop="discount">
                <Col span="2">
                    <InputNumber :max="99" :min="30" v-model="formValidate.discount"></InputNumber>
                    <!-- <Input v-model="formValidate.discount" placeholder="请输入门店电话"></Input>               -->
                </Col>
                <Col span="5">（输入89，即表示下单可打89折）</Col>
            </FormItem>
            <FormItem label="选择卡面模版">
                <MyUpload v-if="false" :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
                <CardTpl v-on:listenImg="getImgSrc" :radioCtrl="radioCtrl"></CardTpl>
            </FormItem>
            <FormItem label="是否支持充值" prop="isRecharge">
                <RadioGroup v-model="formValidate.isRecharge">
                    <Radio label="0">是</Radio>
                    <Radio label="1">否</Radio>
                </RadioGroup>
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
                <Col span="4">天（从购买时开始）</Col>
            </FormItem>
            <FormItem label="卡面预览" prop="">
                <div class="memberCard">
                    <img :src="src" alt="">
                    <div class="brand" v-if="formValidate.cardName">{{formValidate.cardName}}（下单享{{formValidate.discount}}折）</div>
                    <div class="quota" v-if="formValidate.cardValue">￥{{formValidate.cardValue}} （{{storeRange}}）</div>
                    <div class="periodOfValidity">有效期 {{getPeriod}}</div>
                </div>
            </FormItem>
            <FormItem label="用卡说明" prop="cardExplain">
                <Col span="7">
                    <Input v-model="formValidate.cardExplain" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="输入该卡的介绍，使用须知等"></Input>
                </Col>
            </FormItem>
            <FormItem>
                <Button type="primary" :disabled="btnCtrl" @click="handleSubmit('formValidate')">提交</Button>
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
    import CardTpl from './cardTpl.vue'
    export default {
        data() {
            return {
                btnCtrl:false,
                storeRange:'',
                businessId:[],
                serviceId:[],
                imgCtrl:false,
                radioCtrl:'',
                discount:'',
                brandId:'',
                tempBrandId:'',
                storeId:'',
                storeShow:false,
                issueType:0,
                src:'../../../static/images/membercard.png',
                brandList:[], //渲染所属品牌下拉框数组
                formValidate:{
                   cardName:'',
                   cardValue:1,
                   discount:100,
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
        props:['editId'],
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
                if(data.label){
                    this.formValidate.brandId = data.value;
                    this.formValidate.brandName = data.label;
                    this.brandId = data.value;
                    if(data.value!=this.tempBrandId){
                        this.$store.commit('BUSINESS_ID',[]);
                        this.tempBrandId = ''
                    }
                }
            },
            getImgSrc(val){
                this.src = val;
                this.formValidate.imgUrl = val;
                this.radioCtrl = val;
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
                            memberCard:{
                                id:this.editId,
                                cardName:this.formValidate.cardName,
                                balance:this.formValidate.cardValue-0,
                                discount:this.formValidate.discount-0,
                                brandId:this.formValidate.brandId,
                                brandName:this.formValidate.brandName,
                                issueType:this.issueType,
                                issueNum:this.formValidate.cardTotal-0,
                                stylePattern:this.formValidate.imgUrl,
                                supportRecharge:this.formValidate.isRecharge=='0'?false:true,
                                remark:this.formValidate.cardExplain,
                                effectiveType:this.formValidate.termOfValidity, //有效期类型
                                useStartTime:start,
                                expiredTime:end,
                                effectiveDay:effectiveDay    //有效天数
                            },
                            useAbleProductList:this.formValidate.useAbleProductList, //使用服务
                            useAbleStoreList:this.formValidate.useAbleStoreList,//使用商家范围
                        }
                        console.log(JSON.stringify(ajaxData))
                        let url = this.common.path2+'memberCard/editMemberCardInfo';
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
                            if(res.data.code==200){
                                vm.handReturn('list');
                                this.$Message.success('修改成功!');
                                vm.btnCtrl = false;
                            }
                        }).catch(err=>{
                            this.$Message.error('修改失败!');
                            vm.btnCtrl = false;
                        })
                    } else {
                        this.$Message.error('修改失败!');
                    }
                })
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            getData(id){
                let vm = this;
                let url = this.common.path2+'memberCard/queryCardDetails/'+id;
                this.$http.get(url).then(res=>{
                    console.log(res)
                    let oData = res.data.data;
                    vm.formValidate.cardName = oData.memberCard.cardName;//会员卡名称
                    vm.formValidate.issuingUnit = oData.memberCard.issueType?'1':'0'; //平台
                    if(oData.memberCard.issueType){
                        this.storeShow = true;
                        this.issueType = 1;//店铺
                        this.storeRange = '限本店适用';
                        this.storeId = oData.useAbleStoreIds[0];
                    }else{
                        this.storeShow = false;
                        this.issueType = 0;//平台
                        this.storeRange = oData.useAbleStoreIds.length+'家门店可用';
                    }
                    vm.formValidate.brandId = oData.memberCard.brandId-0; //品牌id
                    vm.brandId = oData.memberCard.brandId-0;
                    vm.tempBrandId = oData.memberCard.brandId-0;
                    vm.formValidate.brandName = oData.memberCard.brandName; //品牌名字
                    vm.formValidate.discount = oData.memberCard.discount; //折扣
                    vm.formValidate.cardValue = oData.memberCard.balance; //面值
                    vm.formValidate.cardTotal = oData.memberCard.issueNum; //发行数量
                    vm.defaultList.push({
                        url:oData.memberCard.stylePattern
                    }); //卡面样式
                    vm.imgCtrl = true;
                    vm.formValidate.imgUrl = oData.memberCard.stylePattern; //卡面样式
                    vm.radioCtrl = oData.memberCard.stylePattern; //卡面样式
                    vm.src = oData.memberCard.stylePattern;
                    vm.formValidate.isRecharge = oData.memberCard.supportRecharge?'1':'0'; //支持充值
                    vm.formValidate.termOfValidity = oData.memberCard.effectiveType; //有效期类型
                    if(oData.memberCard.effectiveType=='1'){
                        vm.formValidate.expiryDate[0] = this.common.simpleFormatDate(oData.memberCard.useStartTime,1);
                        vm.formValidate.expiryDate[1] = this.common.simpleFormatDate(oData.memberCard.expiredTime,1);
                    }else if(oData.memberCard.effectiveType=='2'){
                        vm.formValidate.expiryDay = oData.memberCard.effectiveDay; //有效天数
                    }
                    vm.formValidate.cardExplain = oData.memberCard.remark; //备注
                    vm.$store.commit('BUSINESS_ID',oData.useAbleStoreIds);
                    vm.$store.commit('SERVICE_ID',oData.useProductList);
                    vm.businessId = oData.useAbleStoreIds;
                    vm.serviceId = oData.useProductList;
                })
            }
        },
        watch:{
            getBusinessId:{
                deep:true,
                handler(val){
                    console.log(val)
                    this.formValidate.useAbleStoreList = val;
                    if(this.issueType==0){
                        this.storeRange = val.length+'家门店可用';
                    }
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
            this.getData(this.editId)
        },
        components:{
            MyUpload,
            businessTable,
            businessList,
            serviceTable,
            serviceList,
            CardTpl
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