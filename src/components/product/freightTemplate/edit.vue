<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Form class="boxStyle" ref="freightTemplate" :model="freightTemplate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="模板名称" prop="">
                <Input v-model="freightTemplate.templateName" placeholder="请填写模板名称"></Input>
            </FormItem>
            <FormItem  label="模板代码" prop="">
                <Input v-model="freightTemplate.templateCode" placeholder="请填写模板代码"></Input>
            </FormItem>
            <FormItem label="计价方式" prop="">
                <RadioGroup v-model="freightTemplate.pricingMethod" @on-change="fnRadioChange">
                    <Radio label="1">按件数</Radio>
                    <Radio label="2">按重量</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="运送方式" prop="" style="margin-bottom: 0px;">
                快递（未指定的省份将采用默认运费）
            </FormItem>
            <FormItem label="" style="margin-bottom: 0px;">
                <div class="typeBox">
                    <!-- 默认设置 -->
                    <div style="border-bottom: 1px solid #dddee1; padding: 7px 10px 7px 10px;">
                            <span>默认运费</span>
                            <InputNumber :min="1" v-model="defaultEdit.firstNumber"></InputNumber>
                            <span v-if="freightTemplate.pricingMethod == 1">件内</span>
                            <span v-if="freightTemplate.pricingMethod == 2">kg内</span>
                            <InputNumber :min="0" v-model="defaultEdit.firstPrice" style="width: 78px;"></InputNumber>
                            <span style="margin-left: 20px;">元，每增加</span>
                            <InputNumber :min="1" v-model="defaultEdit.continuedNumber"></InputNumber>
                            <span v-if="freightTemplate.pricingMethod == 1">件，增加运费</span>
                            <span v-if="freightTemplate.pricingMethod == 2">kg，增加运费</span>
                            <InputNumber :min="0" v-model="defaultEdit.continuedPrice" style="width: 78px;"></InputNumber>
                            <span>元</span>
                    </div>
                    <!-- 头部 -->
                    <Row style="padding: 7px 10px 7px 10px; border-bottom: 1px solid #dddee1; color: #000; font-size: 14px;">
                        <Col span="6">运送到</Col>
                        <Col span="4" v-if="freightTemplate.pricingMethod == 1">首件数（件）</Col>
                        <Col span="4" v-if="freightTemplate.pricingMethod == 2">首重（kg）</Col>
                        <Col span="4">首费（元）</Col>
                        <Col span="4" v-if="freightTemplate.pricingMethod == 1">续件数（件）</Col>
                        <Col span="4" v-if="freightTemplate.pricingMethod == 2">续重（kg）</Col>
                        <Col span="4">续费（元）</Col>
                        <Col span="2">操作</Col>
                    </Row>
                    <!-- 指定城市运费配置 -->
                    <Row v-for="(item,index) in cityList" style="border-bottom: 1px solid #dddee1; padding: 7px 10px 7px 10px;">
                        <!-- 已选省份的显示 -->
                        <Col span="6">
                            <Row>
                                <Col span="16" v-if="!!item.cityName">
                                    <span v-for="(name,_index) in item.cityName.split(',')">
                                        {{ name }}
                                        <span v-if="_index != item.cityName.split(',').length-1">、</span>
                                    </span>
                                </Col>
                                <Col span="3" offset="1">
                                    <Button @click.native="fnEditCityItem(index,item.cityName)">编辑</Button>
                                </Col>
                            </Row>
                        </Col>
                        <!-- 首件数 -->
                        <Col span="4">
                            <InputNumber :min="1" v-model="item.firstNumber"></InputNumber>
                        </Col>
                        <!-- 首件价格 -->
                        <Col span="4">
                            <InputNumber :min="0" v-model="item.firstPrice" style="width: 78px;"></InputNumber>
                        </Col>
                        <!-- 续件数 -->
                        <Col span="4">
                            <InputNumber :min="1" v-model="item.continuedNumber"></InputNumber>
                        </Col>
                        <!-- 续件价格 -->
                        <Col span="4">
                            <InputNumber :min="0" v-model="item.continuedPrice" style="width: 78px;"></InputNumber>
                        </Col>
                        <Col span="2">
                            <Button type="error" @click.native="fnDeleteRule(index)">删除</Button>
                        </Col>
                    </Row>
                </div>
            </FormItem>




            <FormItem label="">
                <a @click="fnAddCitys">为指定省份设置运费</a>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('freightTemplate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem> 
        </Form>
        <Modal
            v-model="modalCode"
            title="城市列表"
            width="900"
            @on-ok="ok">
            <div class="modalBox">
                <Row>
                    <Col span="12" style="border-right: 1px solid #ccc; min-height: 320px;">
                        <div style="text-align: center; padding:0px 0px 10px 0px; font-size: 14px;">剩余省份</div>
                        <div v-if="!!!showSpareList.length" style="font-size: 14px;">空空如也~</div>
                        <Row v-if="!!showSpareList.length">
                            <Col span="8" v-for="(item,index) in showSpareList" :key="item.regionId">
                                <Tag @click.native="selectCity(item,index)">
                                    {{ item.regionName }}
                                </Tag>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12">
                        <div style="text-align: center; padding:0px 0px 10px 0px; font-size: 14px;">已选省份</div>
                        <div v-if="!!!mineList.length" style="padding-left: 20px; font-size: 14px;">空空如也~</div>
                        <Row v-if="!!mineList.length" style="padding-left: 20px;">
                            <Col span="8" v-for="(item,index) in mineList">
                                <Tag closable @on-close="deleteCity(item,index)">{{ item.regionName }}</Tag>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                freightTemplate: {
                    templateName: '', // 模板名称
                    pricingMethod: '1', // 计费方式
                    templateCode: '', // 模板代码
                    transportMethod: '1', // 运送方式
                },
                cityList: [], // 配置的省份列表
                allList:[], // 省份列表
                /* 默认方式的配置 */
                defaultEdit: {
                    'firstNumber': 1, // 首件数
                    'firstPrice': 0, // 首件价格
                    'continuedNumber': 1, // 续件数
                    'continuedPrice': 0, // 续件价格
                    'isDefault': 1, // 是否默认 1默认 0 非默认
                },
                index: 0, // 当前配置的省份规则索引值
                ruleValidate: {
                },
                modalCode: false,
                showSpareList: [1], // 更新剩下省份界面用的数据
                mineList: [], // 已经选择的省份
                cityIds:[], // 用来保存省份下所有的城市Id
                cityNum:0, // 用来判断是否循环省份结束
                spinShow: false, 
            }
        },
        props: ["sendChild"],
        methods: {
            /* ===============计价方式变化======== */ 
            fnRadioChange (val) {
                let vm = this;
                let _d = vm.defaultEdit;
                vm.cityList = []; // 让省份配置列表清空
                /* 初始化默认配置项的数据 */
                _d.firstNumber = 1;
                _d.firstPrice = 0;
                _d.continuedNumber = 1;
                _d.continuedPrice = 0;
            },
            /* ===============提交验证============= */ 
            handleSubmit (name) {
                let vm = this;
                let ajaxData = {};
                let url = vm.common.path2+"freightTemplate/modify";
                let _f = vm.freightTemplate; // 运费模板
                let _d = vm.defaultEdit; // 默认配置
                /* 运费模板 */
                ajaxData.freightTemplate = {
                    'templateName':     _f.templateName,    // 模板名称
                    'templateCode':     _f.templateCode,    // 模板代码
                    'transportMethod':  _f.transportMethod, // 运送方式
                    'pricingMethod':    _f.pricingMethod,   // 计价方式
                    'id':               vm.sendChild.id,    // id
                }
                /* 运费模板城市集合 */
                ajaxData.cityList = [];
                // 默认项
                ajaxData.cityList.push({
                    'firstNumber':      _d.firstNumber,
                    'firstPrice':       +_d.firstPrice*100,
                    'continuedNumber':  _d.continuedNumber,
                    'continuedPrice':   +_d.continuedPrice*100,
                    'isDefault':        _d.isDefault
                });
                // 城市项
                !!vm.cityList.length&&vm.cityList.forEach((item,index)=>{
                    ajaxData.cityList.push(item);
                })
                vm.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then(function(res){
                    vm.$emit('returnList', 'list'); 
                    vm.$Message.success('成功');
                }).catch(function(err){
                    vm.$Message.success(err);
                })
            },
            /* =================返回============= */ 
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            /* =================获取全国省份数据=============== */ 
            fnGetCityData () {
                let vm = this;
                let url = vm.common.path2+"baseRegions/selectListByConditions?pageSize=10000";
                let ajaxData = {
                    parentId: 1
                }
                vm.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers:{
                            'Content-type':'application/json;charset=UTF-8'
                        }
                    }
                ).then((res)=>{
                    let oData = res.data.data.list;
                    vm.allList = oData;
                }).catch((err)=>{
                })
            },
            /* =================新增省份的运送规则配置================= */
            fnAddCitys () {
                let vm = this;
                // vm.cityList 数组
                let obj = {
                    'cityId': '', // 城市id
                    'cityName': '', // 城市名称
                    'firstNumber': 1, // 首件数
                    'firstPrice': 0, // 首件价格
                    'continuedNumber': 1, // 续件数
                    'continuedPrice': 0, // 续件价格
                    'isDefault': 0, // 非默认配置
                }
                vm.cityList.push(obj);
            },
            /* ==================编辑省份=========================== */
            fnEditCityItem (index,cityName) {
                let vm = this;
                vm.index = index;
                // 分配两部分的数据，未选，已选
                let noList = []; // 未选
                let isList = []; // 已选
                let allIsList = []; // 所有规则已经选了的数据
                let allList = vm.allList; // 所有省份
                let thisCityName = []; // 当前选的
                // 获得该规则已经选择的省份id
                if(!!cityName){
                    thisCityName = cityName.split(',');
                }
                // 获得未选的数据
                if(vm.cityList.length == 1&&!!!vm.cityList[0].cityName){
                    // 现在只新增了一个规则，并且该规则还没有分配省份
                    noList = allList;
                    isList = [];
                }else{
                    // 规则至少有一个，而且至少一个规则分配了省份
                    // 获取所有规则已经分配的省份
                    for(var i = 0;i<vm.cityList.length;i++){
                        for(var j = 0;j<vm.cityList[i].cityName.split(',').length;j++){
                            allIsList.push(vm.cityList[i].cityName.split(',')[j]);
                        }
                    }
                    // 获取还剩什么省份没有分配
                    noList = vm.fnRemoveArrFromArrs(allList,allIsList);
                    isList = vm.fnGetArrFromArrs(allList,thisCityName);
                }
                vm.showSpareList = noList;
                vm.mineList = isList;
                vm.modalCode = true;
            },  
            /* =============数组去重，arg1为原始数组，arg2为要被删除的数据================ */ 
            fnRemoveArrFromArrs (arrs1,arrs2) {
                // 状态值  true 则加 false 则不加
                let list = [];
                for(var i = 0;i<arrs1.length;i++){
                    var _switch = true;
                    for(var j = 0;j<arrs2.length;j++){
                        if(arrs1[i].regionName == arrs2[j]){
                            _switch = false;
                        }
                        if(j == arrs2.length -1&&!!_switch){
                            list.push(arrs1[i]);
                        }
                    }
                }
                return list;
            },    
            /* =============数组去重，arg1为原始数组，arg2为要被删除的数据================ */ 
            fnGetArrFromArrs (arrs1,arrs2) {
                // 状态值  true 则加 false 则不加
                let list = [];
                for(var i = 0;i<arrs2.length;i++){
                    for(var j = 0;j<arrs1.length;j++){
                        if(arrs2[i] == arrs1[j].regionName){
                            list.push(arrs1[j]);
                        }
                    }
                }
                return list;
            },   
            /* =============删除指数组定位置的元素，然后返回新的数组=================== */
            fnDeleteItemFromArrs (arrs,index) {
                let list = [];
                arrs.forEach((item,i) => {
                    if(i != index){
                        list.push(item);
                    }
                })
                return list;
            },
            /* ==============点击省份的回调函数==================== */
            selectCity (item,index) {
                let vm = this;
                // 左侧未选择的变化
                vm.showSpareList = vm.fnDeleteItemFromArrs(vm.showSpareList,index);
                // 右侧已选择的变化
                vm.mineList.push(item);
            },  
            /* ==============取消当前选择省份的回调函数======================= */
            deleteCity (item,index) {
                let vm = this;
                // 右侧已选择的变化
                vm.mineList = vm.fnDeleteItemFromArrs(vm.mineList,index);
                // 左侧已选择的变化
                vm.showSpareList.push(item);
            },
            /* ===============模态框的回调函数========================== */
            ok () {
                let vm = this;
                vm.cityIds = []; // 用来保存省份下所有城市的regionId
                vm.cityNum = 0;
                let timer = null;
                let index = vm.index;
                let cityId = [];
                let cityName = [];
                vm.spinShow = true;
                vm.mineList.forEach((item,index) => {
                    cityName.push(item.regionName);
                    vm.fnGetCityId(item.regionId);

                }); 
                vm.cityList[index].cityName = cityName.join(',');
                timer = window.setInterval(function(){
                    if(vm.cityNum == vm.mineList.length){
                        vm.cityList[vm.index].cityId = vm.cityIds.join(',');
                    }
                    vm.spinShow = false;
                    window.clearInterval(timer);
                },200)
            },
            /* ==================删除一个省份的规则配置================== */
            fnDeleteRule (index) {
                let vm = this;
                vm.cityList = vm.fnDeleteItemFromArrs(vm.cityList,index);
            },
            /* ==================获取城市的id========= */
            fnGetCityId (parentId) {
                let vm = this; 
                let url = vm.common.path2+"baseRegions/selectListByConditions?pageSize=10000";
                let ajaxData = {
                    parentId: parentId
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
                    list.forEach((item,index) =>{
                        vm.cityIds.push(item.regionId);
                    })
                    vm.cityNum = vm.cityNum + 1;
                }).catch(function(err){
                })
            },
            /* ========================获取详情======================= */
            fnQueryById () {
                let vm = this;
                let id = vm.sendChild.id;
                let url = vm.common.path2 + "freightTemplate/detail/"+id;
                vm.$http.get(
                    url
                ).then(function(res){
                    let oData = res.data.data;
                    vm.fnInitQuery(oData);
                }).catch(function(err){
                })

            },
            /* =======================模板信息的遍历========================== */
            fnInitQuery (data) {
                let vm = this;
                let _f = vm.freightTemplate;
                let _d = vm.defaultEdit;
                /* 运费模板 */  
                _f.templateName = data.freightTemplate.templateName; // 模板名称
                _f.templateCode = data.freightTemplate.templateCode; // 模板代码
                _f.pricingMethod = data.freightTemplate.pricingMethod; // 计价方式
                /* 运费模板城市集合 */
                // 默认项
                _d.firstNumber = data.freightTemplateCityList[0].firstNumber; // 首件数
                _d.firstPrice = +data.freightTemplateCityList[0].firstPrice/100; // 首件价格
                _d.continuedNumber = data.freightTemplateCityList[0].continuedNumber; // 首件价格
                _d.continuedPrice = +data.freightTemplateCityList[0].continuedPrice/100; // 首件价格
                _d.isDefault = data.freightTemplateCityList[0].isDefault; // 首件价格
                // 城市项
                if(data.freightTemplateCityList.length > 1){
                    data.freightTemplateCityList.forEach((item,index) => {
                        if(index != 0){
                            vm.cityList.push(item);
                        }
                    })
                }
            }
        },
        mounted: function(){
            let vm = this;
            vm.fnGetCityData(); // 获取全国数据
            vm.fnQueryById(); // 获取模板详情
        },
        components:{
        }
    }
</script>
<style scoped>
.typeBox{
    border-top: 1px solid #dddee1;
    border-left: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
    border-radius: 5px;
}
.modalBox{
    width: 100%;
    min-height: 300px;
    padding: 10px;
}
</style>

