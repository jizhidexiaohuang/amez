<template>
    <div class="login" :style="backgroundDiv" @keydown.enter="fnHandleSubmit">
        <div class="longin-box">
            <div class="inner">
                <div class="title">美容邦管理后台</div>
                <div class="body">
                    <div class="label-title">
                        <span style="cursor: pointer;" :class="type == 1?'active':''" @click="fnChangeLoginType(1)">账号</span>
                        /
                        <span style="cursor: pointer;" :class="type == 2?'active':''" @click="fnChangeLoginType(2)">手机验证码登录</span>
                    </div>
                    <Input v-show="type == 1" v-model="form.userName" placeholder="请输入账号"></Input>
                    <Input v-show="type == 2" v-model="form.phone" placeholder="请输入手机号码"></Input>
                    <div class="label-title">
                        <span v-show="type == 1">密码</span>
                        <span v-show="type == 2">验证码</span>
                    </div>
                    <Input type="password" v-model="form.password" placeholder="请输入密码" v-show="type == 1"></Input>
                    <Input v-model="form.code" placeholder="请输入验证码" v-show="type == 2">
                        <span slot="append" class="getNum" @click="getCode">{{ codeText }}</span>
                    </Input>
                </div>
                <div class="btn" @click="fnHandleSubmit">登录</div>
                <div class="footer">账号、密码及权限问题请与超级管理员联系</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                userName: '', // 用户名
                password: '', // 密码
                phone:'', // 手机号码
                code: '',// 验证码
            },
            type:1, // 登录类型
            codeText: '获取验证码',//获取验证码的文字变化
            backgroundDiv: {
               backgroundImage: 'url(' + require('../../static/images/web_bg.png') + ')',
            }
        };
    },
    activated:function(){

    },
    mounted: function() {
        
    },
    methods: {
        /* 改变登录的类型 1是用户名 2是验证码 */
        fnChangeLoginType (type) {
            let vm = this;
            vm.type = type;
        },
        /* 提交 */
        fnHandleSubmit () {
            let vm = this;
            if(vm.type == 1){
                // 用户名登录校验
                // 校验
                if(!!vm.fnRestUser()){
                    // ajax
                    let url = vm.common.path2 + "baseUsers/userLogin?userName="+vm.form.userName+"&password="+vm.form.password+"&loginType=0";
                    let ajaxData = {
                        userName:vm.form.userName,
                        password:vm.form.password,
                        loginType: 0
                    }
                    vm.$http.post(
                        url,
                        ajaxData
                    ).then(function(res){
                        console.log(res);
                        if(res.data.code != 200){
                            vm.$Notice.warning({
                                title: !!!res.data.message?"异常错误，请重新登录！":res.data.message
                            });
                        }else{
                            vm.$store.dispatch("adminInfo",{
                                adminInfo:res.data.data
                            })
                            vm.$router.push("/home");
                            window.localStorage.setItem("userInfo",JSON.stringify(res.data.data));
                        }
                    }).catch(function(err){
                        console.log(err);
                    })
                }
            }else{
                // 验证码登录校验
                if(!!vm.fnRestPhone()){
                    // ajax
                    let url = vm.common.path2 + "baseUsers/userLogin?userName="+vm.form.phone+"&password="+vm.form.code+"&loginType=1";
                    let ajaxData = {
                        userName:vm.form.phone,
                        password:vm.form.code,
                        loginType: 1
                    }
                    vm.$http.post(
                        url,
                        ajaxData
                    ).then(function(res){
                        console.log(res);
                        if(res.data.code != 200){
                            vm.$Notice.warning({
                                title: !!!res.data.message?"异常错误，请重新登录！":res.data.message
                            });
                        }else{
                            vm.$store.dispatch("adminInfo",{
                                adminInfo:res.data.data
                            })
                            vm.$router.push("/home");
                            window.localStorage.setItem("userInfo",JSON.stringify(res.data.data));
                        }
                    }).catch(function(err){
                        console.log(err);
                    })
                }
            }
        },
        /* 用户名 */
        fnRestUser () {
            let vm = this;
            // false true
            if(!!!vm.form.userName){
                vm.$Notice.warning({
                    title: '请输入账号!'
                });
                return false;
            }else if(!!!vm.form.password){
                vm.$Notice.warning({
                    title: '请输入密码!'
                });
                return false;
            }else{
                return true;
            }
        },
        /* 手机号码 */
        fnRestPhone () {
            let vm = this;
            // false true
            if(!!!vm.form.phone){
                vm.$Notice.warning({
                    title: '请输入手机号码!'
                });
                return false;
            }else if(!!!vm.form.code){
                vm.$Notice.warning({
                    title: '请输入验证码!'
                });
                return false;
            }else{
                return true;
            }
        },
        /* 获取验证码 */
        getCode () {
            let vm = this;
            let num = 60;
            let timer = null;
            // 可以点击
            if(vm.codeText == "获取验证码"){
                if(!!!vm.form.phone.length){
                    vm.$Message.error('请输入手机号码!');
                    return false;
                }


                vm.codeText = num;
                timer = window.setInterval(function(){
                    if(num == 1){
                        window.clearInterval(timer);
                        vm.codeText = '获取验证码';    
                        return false
                    }
                    num = num - 1;
                    vm.codeText = num;
                },1000);

                // ajax
                let url = vm.common.path2 + "sms/sendSmsCode";
                let ajaxData = {
                    phone:vm.form.phone,
                    smsCode:'SMS_116815244',
                }
                vm.$http.post(
                    url,
                    ajaxData
                ).then(function(res){
                    console.log(1111111111);
                    console.log(res);
                    
                }).catch(function(err){
                    console.log(err);
                })
            }
        },
    },
    components:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--
background-image: url('http://mrb.amez999.com/group1/M00/00/0E/rBJ85FpgOfOAbljGAAYauz6GYKE102.png');

background-image: url('../../static/images/web_bg.png');
-->
<style scoped>
.login{
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
}
.login-con{
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;
}
.form-con{
    padding: 10px 0 0;
}
.login-tip{
    font-size: 10px;
    text-align: center;
    color: #c3c3c3;
}
.longin-box{
    width: 50%; height: 100%; 
    float: right;
    position: relative;
}
.inner{
    width: 260px;
    height: 300px; 
    position: absolute;
    left: 50%; top: 50%;
    margin-left: -175px; margin-top:-150px;
}
.title{
    font-size: 30px; font-weight: bold;
    margin-bottom: 20px;
}
.body{
    height: 150px;
}
.label-title{
    padding: 6px 0px;
}
.getNum{
    cursor: pointer;
}
.btn{
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #f38c41;
    color: #fff; font-size: 18px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
}
.footer{
    text-align:center;
    margin-top: 15px;
    font-size: 10px;
}
.active{
    color: #f28d3f;
}
</style>
