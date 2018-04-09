<template>
    <div>
        <div>
            <Button @click="fnOpenModal">添加省份</Button>
            <span>已选{{ show_city.length }}个省份</span>
            <Modal
                v-model="modal1"
                title="添加省份"
                width="950"
                @on-ok="ok">
                <Row>
                    <Col span="12" class="shengBox">
                        <Spin size="large" fix v-if="spinShow"></Spin>
                        <Row>
                            <Col span="8" class="itemProvince" v-for="(item,index) in provinceList" :key="item.regionId">
                                <a @click="selectProvince(item.regionId,index)" :class="provinceIndex == index?'p-active':''">{{ item.regionName }}</a>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12" class="cityBox">
                        <Spin size="large" fix v-if="spinShow1"></Spin>
                        <Row>
                            <Col span="8" class="itemCity" v-for="(item,index) in c_cityList" :key="item.regionId">
                                <a @click="selectCity(item)" :class="!!item.lkhType?'c_active':''">{{ item.regionName }}</a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal>
        </div>
        <div>
            <span v-for="(item,index) in show_city">
                {{ item.cityName }}
                <em v-if="index!= (show_city.length-1)">、</em>
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                modal1: false,
                provinceList: [], // 省份的数据
                cityList: [], // 城市的数据
                provinceIndex: 0, // 当前被点击的省份
                defaultList:[
                    /* {
                        'cityId': '120100',
                        'cityName': '天津市',
                    },
                    {
                        'cityId': '130200',
                        'cityName': '唐山市'
                    } */
                ], // 默认存在的城市数据
                provinceId:'',// 当前省份的Id
                selectCityList: [],
                spinShow: true,
                spinShow1: true,
            }
        },
        computed: {
            c_cityList: function () {
                let vm = this;
                var list = vm.cityList;
                var dList = vm.defaultList;
                for(var i = 0;i<dList.length;i++){
                    for(var j = 0;j<list.length;j++){
                        if(dList[i].cityId == list[j].regionId){
                            list[j].lkhType = true;
                        }
                    }
                }
                return list;
            },
            show_city: function () {
                return this.$store.getters.cityList;
            }
        },
        methods: {
            // 模态框的确定点击事件的回调函数
            ok () {
                let vm = this;
                this.$store.commit('CITY_LIST',vm.defaultList);
            },
            // 打开模态框
            fnOpenModal () {
                let vm = this;
                vm.provinceIndex = 0;
                vm.defaultList = vm.$store.getters.cityList;
                vm.fnGetProvince();
                vm.modal1 = true;
            },
            // 获取省份的数据
            fnGetProvince () {
                let vm = this; 
                let url = vm.common.path2+"baseRegions/selectListByConditions?pageSize=10000";
                let ajaxData = {
                    parentId: 1
                }
                vm.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    let list = res.data.data.list;
                    vm.provinceList = list;
                    vm.provinceId = list[0].regionId;
                    vm.spinShow = false;
                    vm.fnGetCity(list[0].regionId);
                }).catch(function(err){
                })
            },
            // 点击省份的回调函数
            selectProvince (parentId,index) {
                let vm = this;
                vm.provinceIndex = index;
                vm.provinceId = parentId;
                vm.fnGetCity(parentId);
            },
            // 获取城市的数据
            fnGetCity (parentId,code) {
                let vm = this; 
                let url = vm.common.path2+"baseRegions/selectListByConditions?pageSize=10000";
                let ajaxData = {
                    parentId: parentId
                }
                if(!!!code){
                    vm.spinShow1 = true;
                }
                vm.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    if(!!!code){
                        vm.spinShow1 = false;
                    }
                    let list = res.data.data.list;
                    vm.cityList = list;
                }).catch(function(err){
                })
            },
            // 点击城市的回调函数
            selectCity (item) {
                let vm = this;
                let dList = vm.defaultList;  
                var arrs = [];
                var nArrs = [];
                for(var i = 0;i<dList.length;i++){
                    arrs.push(dList[i].cityId);
                }
                var obj = {}
                // 如果第一次出现，则往里边添加，如果不是第一次出现，则删除
                var code = false;
                for(var j = 0;j<arrs.length;j++){
                    if(arrs[j]!=item.regionId){
                        nArrs.push(dList[j])
                    }else{
                        code = true;
                    }
                }
                if(!!!code){
                    obj.cityId = item.regionId;
                    obj.cityName = item.regionName;
                    nArrs.push(obj);
                }
                vm.defaultList = nArrs;
                vm.fnGetCity(vm.provinceId,true)
            },
        },
    }
</script>
<style scoped>
.shengBox{
    min-height: 300px;
    border-right: 1px dotted #ccc;
}
.cityBox{
    min-height: 300px;
}
.itemCity,.itemProvince{
    height: 30px; line-height: 30px;
    text-align: center;
}
.itemCity a{
    padding: 3px 10px 3px 10px;
    background: #ccc;
    border-radius: 5px;
    color: #fff;
}
.c_active{
    background: #57a3f3!important;
}
.itemProvince a{
    color: #333;
}
.p-active{
    color: red!important;
}
</style>