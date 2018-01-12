<template>
<div>
  <Col span="2" v-if="cityConfig.title">{{cityConfig.title}}</Col>
    <Col span="22">
        <Select label-in-value not-found-text v-model="province" style="width:100px" @on-change="v=>{ getValue(v,1)}">
            <Option v-for="item in provinceList" :value="item.regionId" :key="item.regionId">{{ item.regionName }}</Option>
        </Select>
        <Select label-in-value not-found-text v-model="city" style="width:100px"  @on-change="v=>{ getValue(v,2)}">
            <Option v-for="item in cityList" :value="item.regionId" :key="item.regionId">{{ item.regionName }}</Option>
        </Select>
        <Select label-in-value not-found-text v-model="district" style="width:100px" @on-change="v=>{ getValue(v,3)}">
            <Option v-for="item in districtList" :value="item.regionId" :key="item.regionId">{{ item.regionName }}</Option>
        </Select>
    </Col>
</div>
</template>
<script>
    import common from '../../base.js'
    export default {
        data(){
            return {
                cityArr:[],
                province:'',
                city:'',
                district:'',
                provinceList:[],
                cityList:[],
                districtList:[],
                flag:false,
            }
        },
        props: ["cityConfig"],
        methods: {
            //省市区联动
            provinceAndCity(parentId,num){
                if(!parentId){
                    return false;
                }
                let vm = this;
                let url = common.path2+'baseRegions/selectListByConditions?pageNo=1&pageSize=1000';
                let ajaxData = {
                    "parentId": parentId
                }
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    if(num==0){
                        // 省
                        let oData = res.data.data.list
                        vm.provinceList = oData;
                        if(vm.flag){
                            this.cityArr = []
                        }else{
                            vm.cityArr.splice(num,1,{value:oData[0].regionId,label:oData[0].regionName})
                        }
                    }
                    if(num==1){
                        // 市
                        let oData = res.data.data.list
                        vm.cityList = oData;
                        vm.city = oData[0].regionId
                        vm.cityArr.splice(num,1,{value:oData[0].regionId,label:oData[0].regionName})
                    }
                    if(num==2){
                        // 区
                        let oData = res.data.data.list
                        vm.districtList = oData;
                        vm.district = oData[0].regionId
                        vm.cityArr.splice(num,1,{value:oData[0].regionId,label:oData[0].regionName})
                    }
                })
            },
            provinceAndCitySelect(parentId,num){
                if(!parentId){
                    return false;
                }
                let vm = this;
                let url = common.path2+'baseRegions/selectListByConditions?pageNo=1&pageSize=1000';
                let ajaxData = {
                    "parentId": parentId
                }
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    if(num==0){
                        // 省
                        let oData = res.data.data.list
                        vm.provinceList = oData;
                        if(vm.flag){
                            this.cityArr = []
                        }else{
                            vm.cityArr.splice(num,1,{value:oData[0].regionId,label:oData[0].regionName})
                        }
                    }
                    if(num==1){
                        // 市
                        let oData = res.data.data.list
                        vm.cityList = oData;
                        this.district = ''
                        this.districtList = []
                    }
                    if(num==2){
                        // 区
                        let oData = res.data.data.list
                        vm.districtList = oData;
                    }
                })
            },
            getValue(value,type){
                console.log(value)
                console.log(type)
                if(this.cityConfig.type=='linkage'){
                    this.provinceAndCity(value.value,type)
                    if(value.label!=""){
                        this.cityArr.splice(type-1,1,value)
                    }
                    console.log(this.cityArr)
                    if(type==3){
                        this.$emit('listenCity',this.cityArr)
                    }
                }else{
                    this.cityArr.splice(type-1,1,value)
                    this.provinceAndCitySelect(value.value,type)
                    console.log(this.cityArr)
                    this.$emit('listenCity',this.cityArr)
                }
            },
            clearCity(){
                this.provinceList = []
                this.cityList = []
                this.districtList = []
            }
        },
        beforeMount:function(){
            
        },
        mounted: function(){
           let vm = this
           this.$nextTick(function(){
               if(vm.cityConfig.type=='linkage'){
                   vm.provinceAndCity(1,0);
               }else{
                   vm.provinceAndCitySelect(1,0)
               }
            });
        },
        watch: {
            cityConfig:{
                deep: true,
                handler(val){
                    if(val.key){
                        this.clearCity()
                        this.provinceAndCity(1,0);
                        this.cityArr = []
                        this.flag = true;
                        this.$emit('ievent',false);
                    }
                }
            }
        }
    };
</script>
<style lang="scss" scoped>

</style>

