<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="模板名称" prop="">
                <Input v-model="formValidate.templateName" placeholder="请填写模板名称"></Input>
            </FormItem>
            <FormItem label="计价方式" prop="">
                <RadioGroup v-model="formValidate.priceType">
                    <Radio label="0">按件数</Radio>
                    <Radio label="1">按重量</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem label="运送方式" prop="" style="margin-bottom: 0px;">
                快递（未指定的城市将采用默认运费）
            </FormItem>
            <FormItem label="" style="margin-bottom: 0px;">
                <div class="typeBox">
                    <!-- 默认设置 -->
                    <div style="border-bottom: 1px solid #dddee1; padding: 7px 10px 7px 10px;">
                            <span>默认运费</span>
                            <InputNumber :min="0" v-model="formValidate.firstNum"></InputNumber>
                            <span>件内</span>
                            <Input v-model="formValidate.firstPrice" style="width: 78px;"></Input>
                            <span>元，</span>
                            <span style="margin-left: 20px;">每增加</span>
                            <InputNumber :min="0" v-model="formValidate.nextNum"></InputNumber>
                            <span>件，</span>
                            <span>增加运费</span>
                            <Input v-model="formValidate.nextPrice" style="width: 78px;"></Input>
                            <span>元</span>
                    </div>
                    <!-- 头部 -->
                    <Row style="padding: 7px 10px 7px 10px; border-bottom: 1px solid #dddee1; color: #000; font-size: 14px;">
                        <Col span="6">运送到</Col>
                        <Col span="4">首件数（件）</Col>
                        <Col span="4">首费（元）</Col>
                        <Col span="4">续件数（件）</Col>
                        <Col span="4">续费（元）</Col>
                        <Col span="2">操作</Col>
                    </Row>
                    <!-- 指定城市运费配置 -->
                    <Row v-for="(item,index) in formValidate.lists" style="border-bottom: 1px solid #dddee1; padding: 7px 10px 7px 10px;">
                        <Col span="6">
                            <Row>
                                <Col span="16">
                                    <span v-for="(aItem,aIndex) in item.lists">
                                        {{ aItem.regionName }}
                                        <span v-if="aIndex != item.lists.length-1">、</span>
                                    </span>
                                </Col>
                                <Col span="3" offset="1">
                                    <Button @click.native="fnCityEdit('edit',item)">编辑</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col span="4">
                            <InputNumber :min="0" v-model="item.firstNum=0"></InputNumber>
                        </Col>
                        <Col span="4">
                            <Input v-model="item.firstPrice" style="width: 78px;"></Input>
                        </Col>
                        <Col span="4">
                            <InputNumber :min="0" v-model="item.nextNum=0"></InputNumber>
                            
                        </Col>
                        <Col span="4">
                            <Input v-model="item.nextPrice" style="width: 78px;"></Input>
                        </Col>
                        <Col span="2">
                            <Button type="error" @click.native="fnDelete(index,item)">删除</Button>
                        </Col>
                    </Row>
                </div>
            </FormItem>
            <FormItem label="">
                <a @click="fnCityEdit('add')">为指定城市设置运费</a>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem> 
        </Form>
        <Modal
            v-model="modalCode"
            title="城市列表"
            width="900"
            @on-ok="ok"
            @on-cancel="cancel">
            <div class="modalBox">
                <Row>
                    <Col span="12" style="border-right: 1px solid #ccc; min-height: 320px;">
                        <div style="text-align: center; padding:0px 0px 10px 0px; font-size: 14px;">剩余城市</div>
                        <div v-if="!!!showSpareList.length" style="font-size: 14px;">空空如也~</div>
                        <Row v-if="!!showSpareList.length">
                            <Col span="8" v-for="(item,index) in showSpareList" :key="item.regionId">
                                <Tag @click.native="selectItem(index,item)">
                                    {{ item.regionName }}
                                </Tag>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12">
                        <div style="text-align: center; padding:0px 0px 10px 0px; font-size: 14px;">已选城市</div>
                        <div v-if="!!!mineList.length" style="padding-left: 20px; font-size: 14px;">空空如也~</div>
                        <Row v-if="!!mineList.length" style="padding-left: 20px;">
                            <Col span="8" v-for="(item,index) in mineList">
                                <Tag closable @on-close="handleClose(index,item)">{{ item.regionName }}</Tag>
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
                formValidate: {
                    templateName: '', // 模板名称
                    priceType: '0', // 计费方式
                    firstNum: 0, // 首件数
                    firstPrice: '', // 首件价格
                    nextNum: 0, // 续件数
                    nextPrice: '', // 续件价格
                    lists:[
                        /* {
                            lists:[
                                {
                                    'cityId':0,
                                    'cityName':'北京'
                                }
                            ]
                        } */
                    ]
                },
                ruleValidate: {
                },
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                modalCode: false,
                allList:[], // 省份列表
                spareList: [], // 剩下的省份列表
                alreadyList: [], // 已经选择的列表
                selectList: [], // 正在选择的城市
                hisSpareList: [], // 历史记住剩下的省份列表
                hisSelectList: [], // 历史记住正在选择的省份列表



                showSpareList: [1], // 更新剩下省份界面用的数据
                hideSpareList: [], // 真正用来记录剩下省份的数据
                mineList: [], // 已经选择的省份
                openType:'', // 打开模态框的类型，分新增和编辑
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                console.log(vm.formValidate.lists);
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        debugger
                        // console.log(vm.formValidate.lists)
                        
                        //添加品牌服务
                        console.log(1)
                        let ajaxData = {
                        }
                        console.log(ajaxData);
                        let url = vm.common.path2+"baseSmsTemplates/insert";
                        return false;
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
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            // 新添加一个运送方式而要做的城市分配
            fnCityEdit (type,arrs) {
                let vm = this;
                vm.openType = type;
                vm.hisSpareList = vm.spareList;
                console.log(vm.hisSpareList);
                if(type == 'add'){
                    vm.selectList = [];
                    vm.hisSelectList = [];
                };
                if(type == 'edit'){
                    vm.selectList = arrs.lists;
                    vm.hisSelectList = arrs.lists;
                }

                /* 新的内容 */

                // 为显示的数据赋值
                vm.showSpareList = vm.hideSpareList;
                // 对已经选择的省份数据进行初始化
                if(type == 'add'){
                    vm.mineList = [];
                }else{
                    vm.mineList = arrs.lists;
                }
                console.log('~~~~~~~~~~~~~');
                console.log(vm.mineList);
                vm.modalCode = true;
            },
            // 获取全国省份数据
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
                    console.log(oData);
                    vm.allList = oData;
                    vm.fnGetSpareList();
                }).catch((err)=>{
                    console.log(err);
                })
            },
            // 剩下没有配置的城市
            fnGetSpareList () {
                let vm = this;
                vm.spareList = vm.allList;
                vm.hideSpareList = vm.allList;
            },
            // 模态框的回调函数
            ok () {
                let vm = this;
                let arrs = vm.mineList;
                let obj = {};
                obj.lists = [];
                for(var i = 0;i<arrs.length;i++){
                    obj.lists.push({
                        regionName: arrs[i].regionName,
                        regionId: arrs[i].regionId
                    })
                }
                vm.formValidate.lists.push(obj);
                console.log(111111111);
                console.log(vm.formValidate.lists);
                // 更新还剩省份的数据
                vm.hideSpareList = vm.showSpareList;


                /* 新的内容 */
                /* debugger
                console.log(vm.mineList);
                // 更新还剩省份的数据
                vm.hideSpareList = vm.showSpareList;
                // 添加一个已经选择的运费规则
                var arrs = vm.mineList;
                var obj = {};
                obj.lists = [];
                for(var i = 0;arrs.length;i++){
                    obj.lists.push({
                        regionName: arrs[i].regionName,
                        regionId: arrs[i].regionId
                    })
                }
                vm.formValidate.lists.push(obj); */
            },
            // 模态框的取消回调函数
            cancel () {
                let vm = this;
                // 数组的合并
                // vm.spareList = vm.spareList.concat(vm.selectList);
                vm.spareList = vm.hisSpareList;
                vm.selectList = vm.hisSelectList;
            },
            // 取消当前选择的城市
            handleClose (index,data) {
                let vm = this;
                /* 新的内容 */
                // 修改已经选择的省份  因为编辑的时候，拿到的mineList是自己造的数据，或者编辑的时候是自己造的数据，所以不能当前的判断元素是否相等
                // 而是应该判断元素的regionId是否相等
                vm.mineList = vm.fnRepeatArrs(vm.mineList,data);
                console.log('----------------------');
                console.log(vm.mineList)
                console.log(vm.showSpareList);
                console.log(vm.hideSpareList);
                debugger
                if(vm.openType == 'add'){
                    if(!!!vm.mineList.length){
                        vm.showSpareList = vm.hideSpareList;
                    }else{
                        vm.showSpareList = vm.hideSpareList;
                        for(var i = 0;i<vm.mineList.length;i++){
                            vm.showSpareList = vm.fnRepeatArrs(vm.showSpareList,vm.mineList[i]);
                        }
                    }
                }else if(vm.openType == 'edit'){
                    // showSpareList的变化  等于当前真实剩下的加上被删除的
                    var arrs1 = vm.hideSpareList;
                    arrs1.push(data);
                    // 和所有allList省份进行过滤一下，主要是为了顺序显示省份
                    var newArrs = [];
                    for(var i = 0;i<vm.allList.length;i++){
                        for(var j = 0;j<arrs1.length;j++){
                            if(vm.allList[i].regionId == arrs1[j].regionId){
                                newArrs.push(vm.allList[i]);
                            }
                        }
                    }
                    vm.showSpareList = newArrs;
                }
            },
            // 点击城市的某一项的时候的回调函数
            selectItem (index,item) {
                let vm = this;
                



                /* 新的内容 */
                if(vm.openType == 'add'){
                    // 已经选择的省份
                    vm.mineList.push(item);
                    // 显示界面剩余可见的省份
                    vm.showSpareList = vm.fnRepeatArrs(vm.showSpareList,item);
                }else if(vm.openType == 'edit'){
                    // console.log(item);
                    // console.log(vm.mineList);
                    // console.log(vm.showSpareList);
                    vm.mineList.push(item);
                    vm.showSpareList = vm.fnRepeatArrs(vm.showSpareList,item);
                }
                console.log(vm.mineList);
                console.log(vm.hideSpareList);
                
            },
            // 删除一个城市设置选型
            fnDelete (index,arrs) {
                let vm = this;
                /* 新的内容 */
                // 删除之后，需要把被删除的省份添加到剩余省份hideSpareList里边去，但是需要再和所有省份的数据进行过滤一下，所以arrs只是暂时用的
                var arrs1 = vm.hideSpareList.concat(arrs.lists);
                console.log('~~~~~~~~~~~~~~')
                console.log(arrs1);
                console.log(vm.allList);
                // 所有省和arrs的过滤
                var newArrs = [];
                for(var i = 0;i<vm.allList.length;i++){
                    for(var j = 0;j<arrs1.length;j++){
                        if(vm.allList[i].regionId == arrs1[j].regionId){
                            newArrs.push(vm.allList[i]);
                        }
                    }
                }
                vm.hideSpareList = newArrs;
                // 修改要提交ajax的数据
                vm.formValidate.lists = vm.fnFilterArrs(vm.formValidate.lists,index);
            },
            // 过滤数组，去掉索引值为n的选项
            fnFilterArrs (arrs,index) {
                var oldArrs = arrs;
                var newArrs = [];
                for(var i = 0;i<oldArrs.length;i++){
                    if(i!=index){
                        newArrs.push(oldArrs[i]);
                    }
                }
                return newArrs;
            },
            // 数组去重
            fnRepeatArrs (arrs,item) {
                var oldArrs = arrs;
                var newArrs = [];
                for(var i = 0;i<oldArrs.length;i++){
                    /* if(oldArrs[i]!=item){
                        newArrs.push(oldArrs[i]);
                    } */
                    if(oldArrs[i].regionId != item.regionId){
                        newArrs.push(oldArrs[i]);
                    }
                }
                return newArrs;
            },
        },
        mounted: function(){
            let vm = this;
            vm.fnGetCityData(); // 获取全国数据
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

