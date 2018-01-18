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
                exist:false
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
                        if(vm.exist){
                            this.province = vm.cityConfig.cityList[0].value
                            this.cityArr.splice(num,1,{value:vm.cityConfig.cityList[0].value,label:vm.cityConfig.cityList[0].label})
                        }else{
                            if(vm.flag){
                                this.cityArr = []
                            }else{
                                vm.cityArr.splice(num,1,{value:oData[0].regionId,label:oData[0].regionName})
                            }
                        }
                    }
                    if(num==1){
                        // 市
                        let oData = res.data.data.list
                        vm.cityList = oData;
                        if(vm.exist){
                            vm.city = vm.cityConfig.cityList[1].value
                            vm.cityArr.splice(num,1,{value:vm.cityConfig.cityList[1].value,label:vm.cityConfig.cityList[1].label})
                        }else{
                            vm.city = oData[0].regionId
                            vm.cityArr.splice(num,1,{value:oData[0].regionId,label:oData[0].regionName})
                        }
                    }
                    if(num==2){
                        // 区
                        let oData = res.data.data.list
                        vm.districtList = oData;
                        if(vm.exist){
                            vm.district = vm.cityConfig.cityList[2].value
                            vm.cityArr.splice(num,1,{value:vm.cityConfig.cityList[2].value,label:vm.cityConfig.cityList[2].label})
                            vm.exist = false;
                            vm.cityConfig.cityList = []
                        }else{
                            vm.district = oData[0].regionId
                            vm.cityArr.splice(num,1,{value:oData[0].regionId,label:oData[0].regionName})
                        }
                    }
                })
            },
            //省市区筛选
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
                        let oData = res.data.data.list;
                        oData.unshift({regionId:'',regionName:'全部'});
                        vm.provinceList = oData
                        if(vm.flag){
                            this.cityArr = []
                        }else{
                            vm.cityArr.splice(num,1,{value:oData[0].regionId,label:oData[0].regionName})
                        }
                    }
                    if(num==1){
                        // 市
                        let oData = res.data.data.list
                        oData.unshift({regionId:'',regionName:'全部'});
                        vm.cityList = oData;
                        this.district = ''
                        this.districtList = []
                    }
                    if(num==2){
                        // 区
                        let oData = res.data.data.list
                        oData.unshift({regionId:'',regionName:'全部'});
                        vm.districtList = oData;
                    }
                })
            },
            //select改变的事件
            getValue(value,type){
                console.log(value)
                console.log(type)
                if(this.cityConfig.type=='linkage'){
                    this.provinceAndCity(value.value,type)
                    if(value.label!=""){
                        this.cityArr.splice(type-1,1,value)
                    }
                    console.log(this.cityArr)
                    if(this.cityArr.length==3){
                        this.$emit('listenCity',this.cityArr)
                    }
                }else{
                    if(value.value==''&&type==1){
                        this.city = ''
                        this.cityList = []
                        this.district = ''
                        this.districtList = []
                    }else if(value.value==''&&type==2){
                        this.district = ''
                        this.districtList = []
                    }
                    this.cityArr.splice(type-1,1,value)
                    this.provinceAndCitySelect(value.value,type)
                    console.log(this.cityArr)
                    this.$emit('listenCity',this.cityArr)
                }
            },
            //清除选中项
            clearCity(){
                this.provinceList = []
                this.cityList = []
                this.districtList = []
            },
        },
        beforeMount:function(){
           console.log(this.cityConfig.cityList)
           if(this.cityConfig.cityList){
               if(this.cityConfig.cityList[0].value){
                    this.exist = true;
                    this.provinceAndCity(1,0);
                } 
           }
        },
        beforeCreated:function(){
            
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

