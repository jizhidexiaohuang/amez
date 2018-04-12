<template>
    <div class="infoPage">
        <h3>会员卡详情</h3>
        <div class="cardPreview">
            <h4>会员卡卡面</h4>
            <div class="memberCard">
                <img :src="src" alt="">
                <div class="brand">{{formValidate.cardName}}（下单享{{(formValidate.discount/10+'').replace('.','')}}折）</div>
                <div class="quota">￥{{formValidate.cardValue}}{{formValidate.issueType?'（限本店使用）':'（'+businessId.length+'家门店可用）'}}</div>
                <div class="periodOfValidity">有效期{{getPeriod}}</div>
            </div>
            <p>{{isRecharge}}充值</p>
            <p>卡项说明：{{formValidate.cardExplain}}</p>
            <div class="businessTable" v-if="!formValidate.issueType">
                <h4>适用门店</h4>
                <businessList></businessList>
            </div>
            <div class="serviceTable">
                <h4>适用服务</h4>
                <serviceList :discount="formValidate.discount"></serviceList>
            </div>
            <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
        </div>
    </div>
</template>
<script>
    import businessList from './businessList.vue'
    import serviceList from './serviceList.vue'
    export default {
        data () {
            return {
                businessId:[],
                serviceId:[],
                src:'../../../static/images/membercard.png',
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
                }
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
            isRecharge:function(){
                let str;
                if(this.formValidate.isRecharge=='1'){
                    str = '不支持'
                }else{
                    str = '支持'
                }
                return str;
            }
        },
        methods:{
            getData(id){
                let vm = this;
                let url = this.common.path2+'memberCard/queryCardDetails/'+id;
                this.$http.get(url).then(res=>{
                    console.log(res)
                    let oData = res.data.data;
                    vm.formValidate.cardName = oData.memberCard.cardName;//会员卡名称
                    vm.formValidate.issuingUnit = oData.memberCard.issueType?'1':'0'; //平台
                    vm.formValidate.brandId = oData.memberCard.brandId-0; //品牌id
                    vm.formValidate.brandName = oData.memberCard.brandName; //品牌名字
                    vm.formValidate.discount = oData.memberCard.discount; //折扣
                    vm.formValidate.cardValue = oData.memberCard.balance/100; //面值
                    vm.formValidate.cardTotal = oData.memberCard.issueNum; //发行数量
                    vm.formValidate.issueType = oData.memberCard.issueType; //发行方
                    vm.formValidate.imgUrl = oData.memberCard.stylePattern; //卡面样式
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
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val);
            },
        },
        mounted:function(){
            this.getData(this.infoId)
        },
        props:['infoId'],
        components:{
            businessList,
            serviceList
        },
        watch:{

        }
    }
    
</script>
<style lang="scss" scoped>
    .infoPage{
        padding:0 20px;
        h3{
            padding-bottom:6px;
            border-bottom:1px dashed #e2e2e2;
        }
        .cardPreview{
            margin-top:8px;
            h4{
                margin-bottom:5px;
            }
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
                    top:5px;
                }
                .quota{
                    position: absolute;
                    left: 8px;
                    top:25px;
                }
                .periodOfValidity{
                    position: absolute;
                    left:8px;
                    bottom:8px;
                }
            }
        }
    }
</style>

