<template>
  <div class="testWrap">
      <div class="addPage boxStyle">
        <h2>新增店铺等级</h2>
        <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 80%;">
            <FormItem style="margin-bottom:0px;">
                <Row>
                    <Col span="3" style="text-align:center;">店铺等级</Col>
                    <Col span="5" style="text-align:center;">成长值范围</Col>
                    <Col span="3" style="text-align:center;">排序</Col>
                    <Col span="6" style="text-align:center;">等级图标</Col>
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
                    <Col span="5" style="padding-top:10px;">
                        <Row>
                            <Col span="10"><Input type="text" v-model="item.startValue"></Input></Col>
                            <Col span="2">---</Col>
                            <Col span="10"><Input type="text" v-model="item.endValue"></Input></Col>
                        </Row>
                    </Col>
                    <Col span="3" style="text-align:center;padding-top:10px;">
                        <InputNumber :max="100" :min="1" v-model="item.sort"></InputNumber>
                    </Col>
                    <Col span="6" style="text-align:center;padding-top:10px;">
                        <MyUpload v-if="logoCtrl" :defaultList="defaultList[index]" :uploadConfig="uploadConfig" v-on:listenUpload="v=>{getUploadList(v,index)}"></MyUpload>
                    </Col>
                    <Col span="2" offset="1">
                        <Button type="error" @click="handleRemove(index)">删除</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="4">
                        <Button type="success" long @click="handleAdd" icon="plus-round">增加店铺等级</Button>
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
    import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                btnCtrl:false,
                logoCtrl:false,
                defaultList:[],//默认图片
                index: 1,
                ajaxArr:[],//提交的数据
                logoIndex:0,
                formDynamic: {
                    items: [
                        {
                            gradeName:'',//门店等级
                            startValue:'',//最小值
                            endValue:'',//最大值
                            sort:1,//排序
                            levelLogo:'',//图片路径
                            index: 1,
                            status: 1
                        }
                    ]
                },
                uploadConfig:{
                    num:1
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
                        let url = common.path2+'storeLevel/addByBatch'
                        let ajaxData = {
                            storeLevelList:this.getAjaxData()
                        }
                        this.btnCtrl = true;
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
                            if(res.status==200){
                                this.$Message.success('提交成功!');
                                this.returnHome('list')
                                this.btnCtrl = false;
                            }
                        }).catch(err=>{
                            this.$Message.error('提交失败!');
                            this.btnCtrl = false;
                        })
                    } else {
                        this.$Message.error('出错!');
                    }
                })
            },
            //照片上传
            getUploadList(data,index){
                let vm = this;
                console.log(data)
                console.log(index)
                vm.formDynamic.items[index].status = 0
                if(data[0]){
                    vm.formDynamic.items[index].levelLogo = data[0].url;
                }
                vm.formDynamic.items[index].status = 1
            },
            //取消
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            //增加一列
            handleAdd () {
                this.index++;
                this.formDynamic.items.push({
                    index: this.index,
                    status: 1,
                    sort:0,
                    gradeName:'',//门店等级
                    startValue:'',//最小值
                    endValue:'',//最大值
                    levelLogo:'',//图片路径
                });
            },
            //删除一列
            handleRemove (index) {
                this.formDynamic.items[index].status = 0;
                this.formDynamic.items.splice(index,1);
                this.defaultList.splice(index,1);
                this.index--;
            },
            //获取提交数据
            getAjaxData(){
                for(var i=0;i<this.formDynamic.items.length;i++){
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
            },
            //获取数据
            getData(){
                let url = common.path2+'storeLevel/findListByAll'
                this.$http.get(url).then(res=>{
                    let data = res.data.data
                    console.log(data)
                    this.formDynamic.items = []
                    for(var i=0;i<data.length;i++){
                        let levelLogoArr = [];
                        levelLogoArr.push({url:data[i].levelLogo});
                        this.defaultList.push(levelLogoArr);
                        this.formDynamic.items.push({
                            gradeName:data[i].levelName,
                            startValue:data[i].beginUpgradeValue,
                            endValue:data[i].endUpgradeValue,
                            sort:data[i].sort,
                            levelLogo:data[i].levelLogo,
                            index: i+1,
                            status: 1
                        })
                        this.index = i+1
                    }
                    this.logoCtrl = true
                    console.log(this.defaultList)
                })
            }
        },
        components:{
            MyUpload
        },
        beforeMount:function(){
            this.getData()
        }
    }
</script>
<style lang='scss' scoped>
    .imgBox{
        position: relative;
        img,.cover{
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0,0,0,.2);
            margin-right: 4px;
        }
        .cover{
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0,0,0,.6);
            .ivu-icon-ios-cloud-upload-outline{
                color: #fff;
                font-size: 28px;
                cursor: pointer;
                margin: 0 2px;
            }
        }
    }
    .imgBox:hover{
        .cover{
            display: inline;
        }
    }
  
</style>

