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
                        <div v-if="!!!spareList.length" style="font-size: 14px;">空空如也~</div>
                        <Row v-if="!!spareList.length">
                            <Col span="8" v-for="(item,index) in spareList" :key="item.regionId">
                                <Tag @click.native="selectItem(index)">
                                    {{ item.regionName }}
                                </Tag>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12">
                        <div style="text-align: center; padding:0px 0px 10px 0px; font-size: 14px;">已选城市</div>
                        <div v-if="!!!selectList.length" style="padding-left: 20px; font-size: 14px;">空空如也~</div>
                        <Row v-if="!!selectList.length" style="padding-left: 20px;">
                            <Col span="8" v-for="(item,index) in selectList">
                                <Tag closable @on-close="handleClose(index)">{{ item.regionName }}</Tag>
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
                if(type == 'add'){
                    vm.selectList = [];
                    vm.modalCode = true;
                };
                if(type == 'edit'){
                    vm.selectList = arrs.lists;
                    vm.modalCode = true;
                }
                
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
            },
            // 模态框的回调函数
            ok () {
                let vm = this;
                let arrs = vm.selectList;
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
            },
            // 模态框的取消回调函数
            cancel () {
                let vm = this;
                // 数组的合并
                vm.spareList = vm.spareList.concat(vm.selectList);
            },
            // 取消当前选择的城市
            handleClose (index) {
                let vm = this;
                vm.spareList.push(vm.alreadyList[index]);
                var oldArrs = vm.alreadyList;
                var newArrs = [];
                for(var i = 0;i<oldArrs.length;i++){
                    if(i!=index){
                        newArrs.push(oldArrs[i]);
                    }
                }
                vm.alreadyList = newArrs;
            },
            // 点击城市的某一项的时候的回调函数
            selectItem (index) {
                let vm = this;
                /* 正在选择的城市 */
                vm.selectList.push(vm.spareList[index]);
                /* 已经选择的城市 */
                vm.alreadyList.push(vm.spareList[index]);
                console.log(vm.spareList[index]);
                console.log(vm.alreadyList);
                // 此时需要修改展示的面板，从剩下的数据里边删除掉被点中的那一项
                var oldArrs = vm.spareList;
                var newArrs = [];
                for(var i = 0;i<oldArrs.length;i++){
                    if(i!=index){
                        newArrs.push(oldArrs[i]);
                    }
                }              
                vm.spareList = newArrs; 


                

                
            },
            // 删除一个城市设置选型
            fnDelete (index,arrs) {
                let vm = this;
                console.log(arrs);
                vm.spareList = vm.spareList.concat(arrs.lists);
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
            }
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

