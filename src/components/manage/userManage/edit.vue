<template>
  <div class="testWrap">
      <div class="addPage boxStyle">
        <h2>编辑用户</h2>
        <Row>
            <Col span="8">
                <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                    <FormItem label="账户名称" prop="accountName">
                        <Input type="text" v-model="formCustom.accountName" placeholder="3-15位字符，可由中文、英文、数字及“_”、“-”组成"></Input>
                    </FormItem>
                    <FormItem label="登陆密码" prop="passwd">
                        <Input type="password" v-model="formCustom.passwd" placeholder="6-20位字符，可由英文、数字及标点符号组成"></Input>
                    </FormItem>
                    <FormItem label="确认密码" prop="passwdCheck">
                        <Input type="password" v-model="formCustom.passwdCheck" placeholder="再次确认密码"></Input>
                    </FormItem>
                    <FormItem label="账号状态">
                        <i-switch v-model="formCustom.accountStatus">
                            <span slot="open">开启</span>
                            <span slot="close">关闭</span>
                        </i-switch>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
                        <Button type="ghost" @click="handleReset('formCustom')" style="margin:0px 8px">取消</Button>
                        <Button type="success" @click.native="returnHome('list')">返回</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    export default {
        data (){
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入你的密码！'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入你的密码！'));
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次输入的密码不一样！'));
                } else {
                    callback();
                }
            };
            return {
                data:'',//渲染的数据
                status:0,//状态
                formCustom:{
                    userGroup:'',//用户组
                    accountName:'',//账号名称
                    passwd:'',//登陆密码
                    passwdCheck:'',//确认密码
                    accountStatus:true,//账号状态
                },
                ruleCustom: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    accountName: [
                        { require:true,min:3,max:15,message: '请输入3-15位字符！', trigger: 'blur'  }
                    ]
                }
            }
        },
        methods:{
            returnHome(){
                this.$emit('returnList','list')
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.formCustom.accountStatus==true){
                        this.status = 0
                    }else{
                        this.status = 1
                    }
                    let ajaxData = {
                        userId:this.message,
                        loginName:this.formCustom.accountName,//登陆名
                        password:this.formCustom.passwd,//登陆密码
                        isDisabled:this.status,//用户状态 0 启用 1 禁用
                    }
                    let url = common.path2+'system/api/baseUser/';
                    console.log(ajaxData)
                    this.$http.put(
                        url,
                        ajaxData,
                        {
                            headers: {
                                'Content-type': 'application/json;charset=UTF-8'
                            },
                        }
                    ).then(res=>{
                        if(res.status==200){
                            this.$Message.success('提交成功!');
                        }
                    })
                        this.returnHome()
                    } else {
                        this.$Message.error('失败');
                        return false
                    }
                })
            },
           
        },
        watch: {
           
        },
        created:function(){
          let url = common.path2+'system/api/baseUser/'+this.message
          this.$http.get(url).then(res=>{
              console.log(res)
              this.data = res.data
              this.formCustom.accountName = this.data.loginName;
              this.formCustom.passwd = this.data.password;
              this.formCustom.passwdCheck = this.data.password;
              if(this.data.isDisabled==0){
                  this.formCustom.accountStatus = true
              }else{
                  this.formCustom.accountStatus = false
              }
          })
        },
        mounted: function(){
          
        },
        activated: function(){
            
        },
        components:{

        },
        props:['message']
    }
</script>
<style lang="scss" scoped>
    .addPage{
        padding-left:20px;
    }
</style>

