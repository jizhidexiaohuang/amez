<template>
  <div class="testWrap">
      <div class="addPage boxStyle">
        <h2>新增店铺等级</h2>
        <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 80%;">
            <FormItem style="margin-bottom:0px;">
                <Row>
                    <Col span="3" style="text-align:center;">店铺等级</Col>
                    <Col span="3" style="text-align:center;">成长值范围</Col>
                    <Col span="3" style="text-align:center;">排序</Col>
                    <Col span="3" style="text-align:center;">等级图标</Col>
                </Row>
            </FormItem>
            <FormItem
                    v-for="(item, index) in formDynamic.items"
                    v-if="item.status"
                    :key="index"
                    :prop="'items.' + index + '.value'"
                    >
                <Row>
                    <Col span="3" style="padding:10px 10px 0;">
                        <Input type="text" v-model="item.gradeName"></Input>
                    </Col>
                    <Col span="3" style="padding-top:10px;">
                        <Row>
                            <Col span="10"><Input type="text" v-model="item.startValue"></Input></Col>
                            <Col span="2">---</Col>
                            <Col span="10"><Input type="text" v-model="item.endValue"></Input></Col>
                        </Row>
                    </Col>
                    <Col span="3" style="text-align:center;padding-top:10px;">
                        <InputNumber :max="10" :min="1" v-model="item.sort"></InputNumber>
                    </Col>
                    <Col span="3" style="text-align:center;padding-top:10px;">
                        <MyUpload :defaultList="defaultList" v-on:listenUpload="getUploadList"></MyUpload>
                    </Col>
                    <Col span="2" offset="1">
                        <Button type="error" @click="handleRemove(index)">删除</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="3">
                        <Button type="success" long @click="handleAdd" icon="plus-round">增加店铺等级</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formDynamic')">保存</Button>
                <Button type="ghost" @click="handleReset('formDynamic')" style="margin:0px 8px">取消</Button>
                <Button type="success" @click.native="returnHome('list')">返回</Button>
            </FormItem>
        </Form>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                defaultList:[],//默认图片
                index: 1,
                ajaxArr:[],//提交的数据
                formDynamic: {
                    items: [
                        {
                            gradeName:'',//门店等级
                            startValue:'',//最小值
                            endValue:'',//最大值
                            sort:1,//排序
                            levelLogo:'',//图片上传地址
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
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        console.log(this.index)
                        let url = common.path+'storeLevel/add'
                        let ajaxData = {
                            storeLevelList:this.getAjaxData()
                        }
                        this.$http.post(
                            url,
                            ajaxData,
                            {
                                headers:{
                                    'Content-type':'application/json;charset=UTF-8'
                                }
                            }
                        ).then(res=>{
                            console.log(res)
                        })
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            //照片上传
            getUploadList(data){
                let vm = this;
                vm.formDynamic.items[this.index-1].levelLogo = data[0].response.data;
                console.log(data[0].response.data);
            },
            //取消
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            //增加一列
            handleAdd () {
                this.index++;
                this.formDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            //删除一列
            handleRemove (index) {
                this.formDynamic.items[index].status = 0;
                this.index--;
            },
            //获取提交数据
            getAjaxData(){
                for(var i=0;i<this.index;i++){
                    var temp = {
                        sort:this.formDynamic.items[i].sort||1,
                        levelName:this.formDynamic.items[i].gradeName||'注册会员',
                        levelLogo:this.formDynamic.items[i].levelLogo,
                        beginUpgradeValue:this.formDynamic.items[i].startValue||1,
                        endUpgradeValue:this.formDynamic.items[i].endValue||99
                    }
                    this.ajaxArr.push(temp)
                }
                console.log(this.ajaxArr)
                return this.ajaxArr
            }
        },
        components:{
            MyUpload
        }
    }
</script>
<style lang='scss' scoped>

</style>

