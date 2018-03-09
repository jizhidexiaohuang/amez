<template>
  <div class="testWrap">
    <div class="infoPage boxStyle">
        <h3>佣金及费用设置</h3>
        <div class="orderDetail">
          <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="0">
            <h4>平台佣金比例设置</h4>
            <FormItem label="支付宝/微信支付，平台抽佣比例" prop="cardValue">
                <Col span="2">
                    <Input v-model="formValidate.cardValue" placeholder="0-100"></Input>              
                </Col>
                <Col span="2">&nbsp;%</Col>
            </FormItem>
            <FormItem label="余额支付，平台抽佣比例" prop="cardValue">
                <Col span="2">
                    <Input v-model="formValidate.cardValue" placeholder="0-100"></Input>              
                </Col>
                <Col span="2">&nbsp;%</Col>
            </FormItem>
            <FormItem label="一卡通支付，平台抽佣比例" prop="cardValue">
                <Col span="2">
                    <Input v-model="formValidate.cardValue" placeholder="0-100"></Input>              
                </Col>
                <Col span="2">&nbsp;%</Col>
            </FormItem>
            <FormItem label="会员卡售卡渠道奖励" prop="cardValue">
                <Col span="2">
                    <Input v-model="formValidate.cardValue" placeholder="0-100"></Input>              
                </Col>
                <Col span="2">&nbsp;%</Col>
            </FormItem>
            <FormItem label="会员卡卡面金额支付，平台抽佣比例" prop="cardValue">
                <Col span="2">
                    <Input v-model="formValidate.cardValue" placeholder="0-100"></Input>              
                </Col>
                <Col span="2">&nbsp;%</Col>
            </FormItem>
            <FormItem label="会员卡充值金额支付，平台抽佣比例" prop="cardValue">
                <Col span="2">
                    <Input v-model="formValidate.cardValue" placeholder="0-100"></Input>              
                </Col>
                <Col span="2">&nbsp;%</Col>
            </FormItem>
            <h4>提现手续费设置</h4>
            <FormItem label="员工提现手续费" prop="cardValue">
                <Col span="2">
                    <Input v-model="formValidate.cardValue" placeholder="0-100"></Input>              
                </Col>
                <Col span="2">&nbsp;%</Col>
            </FormItem>
          </Form>
        </div>
        <Button type="primary" @click="saveSettings()">保存</Button>
    </div>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                orderBase:'',
                formValidate:{
                  cardValue:'',
                },
                ruleValidate:{

                }
            }
        },
        computed:{
            payType:function(){
                let str ;
                if(this.orderBase.payType=='0'){
                    str = '微信支付'
                }else if(this.orderBase.payType=='1'){
                    str = '支付宝支付'
                }else{
                    str = '其他'
                }
                return str;
            }
        },
        methods:{
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            saveSettings(){
              console.log('弹框')
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    let vm = this;
                    let start;
                    let end;
                    let effectiveDay;
                    if (valid) {
                        console.log('保存设置')
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            getData(id){
                let vm = this;
                let url = this.common.path2+'memberCardTradeRecode/queryById/'+id;
                this.$http.get(url).then(res=>{
                    console.log(res);
                    let oData = res.data.data;
                    console.log(oData)
                    vm.orderBase = oData;
                })
            },
            ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
        },
        mounted:function(){
            // this.getData(this.infoId);
        },
        watch:{

        },
        components:{
            
        }
    }
</script>
<style scoped lang="scss">
    .infoPage{
        padding:20px 20px;
        h3{
            border-bottom:1px solid #e2e2e2;
            padding-bottom:6px;
        }
        .orderDetail{
            margin-top:15px;
            h4{
                border-bottom:1px dashed #e2e2e2;
                padding-bottom:4px;
                margin-bottom:10px;
            }
            .ivu-row{
                line-height: 30px;
                height: 30px;
            }
        }
        .service_info{
            h4{
                margin-top:15px;
            }
            .table{
                border:1px solid #dddee1;
                margin:8px 0px;
                .title{
                    background:#dddee1;
                    .ivu-col{
                        line-height:40px;
                    }
                }
                .content{
                    padding:5px 0;
                }
                .ivu-col{
                    text-align: center;        
                }
                .ivu-col-span-3{
                    line-height: 80px;
                }
                .spec{
                    line-height: 20px;
                    padding-top:20px;
                }
            }
        }
    }
</style>
