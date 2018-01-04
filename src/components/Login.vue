<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                userName: 'admin',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    activated:function(){

    },
    mounted: function() {
        
    },
    methods: {
        handleSubmit () {
            let vm = this;
            vm.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let url = vm.common.path2 + "baseUsers/userLogin?userName="+vm.form.userName+"&password="+vm.form.password;
                    let ajaxData = {
                        userName:vm.form.userName,
                        password:vm.form.password
                    }
                    vm.$http.post(
                        url,
                        ajaxData
                    ).then(function(res){
                        console.log(res);
                        if(res.data.code != 200){
                            vm.$Notice.warning({
                                title: res.data.message
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


                    // vm.$router.push("/home");
                }
            });
        }
    },
    components:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login{
    width: 100%;
    height: 100%;
    background-image: url('https://file.iviewui.com/iview-admin/login_bg.jpg');
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
</style>
