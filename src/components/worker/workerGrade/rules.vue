<template>
  <div class="testWrap">
      <div class="addPage boxStyle">
        <h2>成长值设置</h2>
        <Form ref="formDynamic" :model="formDynamic" :label-width="20" style="width: 100%">
            <FormItem>
                <Row>
                    <Col span="2" style="text-align:center;">日接单频率</Col>
                    <Col span="2" style="text-align:center;">对应成长值</Col>
                    <Col span="2" style="text-align:center;">月接单总金额</Col>
                    <Col span="2" style="text-align:center;">对应成长值</Col>
                    <Col span="2" style="text-align:center;">回复评价次数</Col>
                    <Col span="2" style="text-align:center;">对应成长值</Col>
                    <Col span="2" style="text-align:center;">好评量</Col>
                    <Col span="2" style="text-align:center;">对应成长值</Col>
                    <Col span="2" style="text-align:center;">发帖量</Col>
                    <Col span="2" style="text-align:center;">对应成长值</Col>
                </Row>
            </FormItem>
            <FormItem
                    v-for="(item, index) in formDynamic.items"
                    v-if="item.status"
                    :key="index"
                    :prop="'items.' + index + '.value'"
                    >
                <Row>
                    <Col span="2" style="text-align:center;">
                        <Row>
                          <Col span="14"><InputNumber style="width:50px;" :min="1" v-model="item.condition1"></InputNumber></Col>
                          <Col span="10">笔以内</Col>
                        </Row>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <InputNumber :min="1" v-model="item.value1"></InputNumber>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <Row>
                          <Col span="12"><InputNumber style="width:50px;" :min="1" v-model="item.condition2"></InputNumber></Col>
                          <Col span="12">元以内</Col>
                        </Row>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <InputNumber :min="1" v-model="item.value2"></InputNumber>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <Row>
                          <Col span="12"><InputNumber style="width:50px;" :min="1" v-model="item.condition3"></InputNumber></Col>
                          <Col span="12">次以内</Col>
                        </Row>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <InputNumber :min="1" v-model="item.value3"></InputNumber>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <Row>
                          <Col span="12"><InputNumber style="width:50px;" :min="1" v-model="item.condition4"></InputNumber></Col>
                          <Col span="12">次以内</Col>
                        </Row>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <InputNumber :min="1" v-model="item.value4"></InputNumber>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <Row>
                          <Col span="12"><InputNumber style="width:50px;" :min="1" v-model="item.condition5"></InputNumber></Col>
                          <Col span="12">帖以内</Col>
                        </Row>
                    </Col>
                    <Col span="2" style="text-align:center;">
                        <InputNumber :min="1" v-model="item.value5"></InputNumber>
                    </Col>
                    <Col span="2" offset="1">
                        <Button type="error" @click="handleRemove(index)">删除</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="3">
                        <Button type="success" long @click="handleAdd" icon="plus-round">添加</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" :disabled="btnCtrl" @click="handleSubmit('formDynamic')" style="margin-right:8px">保存</Button>
                <Button v-if="false" type="ghost" @click="handleReset('formDynamic')" style="margin:0px 8px">取消</Button>
                <Button type="success" @click.native="returnHome('list')">返回</Button>
            </FormItem>
        </Form>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    export default {
        data () {
            return {
                btnCtrl:false,
                index: 1,
                rulesArr:[],
                itemsArr:[],
                formDynamic: {
                    items: [
                        {
                            condition1:1,
                            value1:1,
                            condition2:1,
                            value2:1,
                            condition3:1,
                            value3:1,
                            condition4:1,
                            value4:1,
                            condition5:1,
                            value5:1,
                            index: 1,
                            status: 1
                        }
                    ]
                }
            }
        },
        methods:{
          //返回
            returnHome(type){
                this.$emit('returnList',type)
            },
            //提交
            handleSubmit (name) {
                let url = common.path2+'storeBeauticianLevelUpgradeRule/addByBatch'
                let ruleList = this.getAjaxData()
                let ajaxData = {
                    ruleList:ruleList
                }
                console.log(ajaxData)
                this.btnCtrl = true;
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
                    if(res.status==200){
                    this.returnHome('list');
                    this.btnCtrl = false;
                    this.$Message.success('提交成功!');
                    }
                })
            },
            //取消
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            //增加一行
            handleAdd () {
                this.index++;
                this.formDynamic.items.push({
                    index: this.index,
                    status: 1
                });
            },
            getAjaxData(){
              console.log(this.index)
              for(var i=0;i<this.formDynamic.items.length;i++){
                let temp1 = {
                    sort:i+1,
                    levelUpgradeType:1,
                    levelUpgradeCondition:this.formDynamic.items[i].condition1||1,
                    levelUpgradeValue:this.formDynamic.items[i].value1||1,
                }
                let temp2 = {
                    sort:i+1,
                    levelUpgradeType:2,
                    levelUpgradeCondition:this.formDynamic.items[i].condition2||1,
                    levelUpgradeValue:this.formDynamic.items[i].value2||1,
                }
                let temp3 = {
                    sort:i+1,
                    levelUpgradeType:3,
                    levelUpgradeCondition:this.formDynamic.items[i].condition3||1,
                    levelUpgradeValue:this.formDynamic.items[i].value3||1,
                }
                let temp4 = {
                    sort:i+1,
                    levelUpgradeType:4,
                    levelUpgradeCondition:this.formDynamic.items[i].condition4||1,
                    levelUpgradeValue:this.formDynamic.items[i].value4||1,
                }
                let temp5 = {
                    sort:i+1,
                    levelUpgradeType:5,
                    levelUpgradeCondition:this.formDynamic.items[i].condition5||1,
                    levelUpgradeValue:this.formDynamic.items[i].value5||1,
                }
                this.rulesArr.push(temp1)
                this.rulesArr.push(temp2)
                this.rulesArr.push(temp3)
                this.rulesArr.push(temp4)
                this.rulesArr.push(temp5)
                console.log(JSON.stringify(this.rulesArr))
              }
              console.log(this.rulesArr)
              return this.rulesArr
            },
            //删除一行
            handleRemove (index) {
                this.formDynamic.items[index].status = 0;
                this.formDynamic.items.splice(index,1);
                this.index--;
            },
            //获取数据
            getData(){
              let url = common.path2+'storeBeauticianLevelUpgradeRule/findListByAll'
              this.$http.get(url).then(res=>{
                let data = res.data.data
                console.log(data)
                let leng = data.length/5
                console.log(leng)
                let list = data.sort(this.compare('sort'))

                this.formDynamic.items = []
                for(var i = 0;i<leng;i++){
                    var temp = []
                    for(var j=5*i;j<5*(i+1);j++){
                      temp.push(list[j])
                    }
                    temp.sort(this.compare('levelUpgradeType'))
                    console.log(temp)
                    this.formDynamic.items.push({
                      condition1:temp[0].levelUpgradeCondition,
                      value1:temp[0].levelUpgradeValue,
                      condition2:temp[1].levelUpgradeCondition,
                      value2:temp[1].levelUpgradeValue,
                      condition3:temp[2].levelUpgradeCondition,
                      value3:temp[2].levelUpgradeValue,
                      condition4:temp[3].levelUpgradeCondition,
                      value4:temp[3].levelUpgradeValue,
                      condition5:temp[4].levelUpgradeCondition,
                      value5:temp[4].levelUpgradeValue,
                      index: i+1,
                      status: 1
                    })
                    this.index = i+1
                }
              })
            },
            // 指定排序的比较函数
            compare(property){
              return function(obj1,obj2){
                  var value1 = obj1[property];
                  var value2 = obj2[property];
                  return value1 - value2; // 升序
              }
            }
        },
        beforeMount:function(){
         this.getData()
        },
    }
</script>
<style lang='scss' scoped>

</style>