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
                    <Row style="border-bottom: 1px solid #dddee1; padding: 7px 10px 7px 10px;">
                        <Col span="6">
                            
                            <Row>
                                <Col span="16">
                                    <span>北京</span>
                                    <span>天津</span>
                                    <span>河北省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                    <span>山西省</span>
                                </Col>
                                <Col span="3" offset="1">
                                    <Button>编辑</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col span="4">
                            <InputNumber :min="0" v-model="formValidate.firstNum"></InputNumber>
                        </Col>
                        <Col span="4">
                            <Input v-model="formValidate.firstPrice" style="width: 78px;"></Input>
                        </Col>
                        <Col span="4">
                            <InputNumber :min="0" v-model="formValidate.firstNum"></InputNumber>
                            
                        </Col>
                        <Col span="4">
                            <Input v-model="formValidate.firstPrice" style="width: 78px;"></Input>
                        </Col>
                        <Col span="2">
                            <Button type="error">删除</Button>
                        </Col>
                    </Row>
                </div>
            </FormItem>
            <FormItem label="">
                <a @click="fnCityEdit">为指定城市设置运费</a>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem> 
        </Form>
        <Modal
            v-model="modalCode"
            title="城市列表"
            width="700"
            @on-ok="ok"
            @on-cancel="cancel">
            <div class="modalBox">
                <Row>
                    <Col span="14" style="border-right: 1px solid #ccc;">
                        <div style="text-align: center; padding:10px 0px; font-size: 14px;">剩余城市</div>
                        <Row>
                            <Col span="8" v-for="(item,index) in spareList" :key="item.regionId">
                                <Tag checkable color="blue">
                                    {{ item.regionName }}
                                </Tag>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="10">
                        <div style="text-align: center; padding:10px 0px; font-size: 14px;">已选城市</div>
                        <Row style="padding-left: 20px;">
                            <Col span="12">
                                <Tag v-if="show" closable @on-close="handleClose">广西</Tag>
                            </Col>
                            <Col span="12">
                                <Tag v-if="show" closable @on-close="handleClose">广西</Tag>
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
                    items: [
                        {
                            firstNum: 1, // 首件数
                            firstPrice: '', // 首件价格
                            nextNum: '', // 续件数
                            nextPrice: '', // 续件价格
                        }
                    ]
                },
                ruleValidate: {
                },
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                modalCode: false,
                show: true,
                allList:[], // 省份列表
                spareList: [], // 剩下的省份列表
                alreadyList: [], // 已经选择的列表
            }
        },
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {

                        return false;
                        //添加品牌服务
                        console.log(1)
                        let ajaxData = {
                        }
                        console.log(ajaxData);
                        let url = vm.common.path2+"baseSmsTemplates/insert";
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
            fnCityEdit () {
                let vm = this;
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
            },
            // 模态框的回调函数
            ok () {
            },
            // 模态框的取消回调函数
            cancel () {
            },
            handleClose () {
                this.show = false;
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
    border: 1px solid #dddee1;
    min-height: 200px;
    border-radius: 5px;
}
.modalBox{
    width: 100%;
    min-height: 300px;
    padding: 10px;
}
</style>

