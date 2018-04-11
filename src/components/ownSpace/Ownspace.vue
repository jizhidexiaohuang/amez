<template>
    <div class="testWrap">
        <Modal
            v-model="modal1"
            :title="modalTitle"
            @on-ok="ok">
            <Form :label-width="80">
                <div v-if="modalType == 'login'">
                    <FormItem label="用户名">
                        <Input v-model="login.userName" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="密码">
                        <Input v-model="login.passWord" type="password" placeholder="请输入密码"></Input>
                    </FormItem>
                </div>
                <div v-if="modalType == 'register'">
                    <FormItem label="用户名">
                        <Input v-model="register.userName" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="密码">
                        <Input v-model="register.passWord" type="password" placeholder="请输入密码"></Input>
                    </FormItem>
                </div>
                <div v-if="modalType == 'add'">
                    <FormItem label="用户名">
                        <Input v-model="add.userName" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="发送内容">
                        <Input v-model="add.message" placeholder="请输入发送内容"></Input>
                    </FormItem>
                </div>


                <div v-if="modalType == 'friendsNews'" style="min-height: 200px;">
                    <div v-if="!!subFriends.length">
                        <Row v-for="(item,index) in subFriends" :key="item.from" style="margin-bottom:10px;" v-if="!!item.status&&item.status!='[resp:true]'">
                            <Col span="7">
                                申请人：{{ item.from }}
                            </Col>
                            <Col span="10" offset="1">
                                内容：{{ item.status }}
                            </Col>
                            <Col span="6">
                                <Button type="success" @click="agreeAddFriend(item,index)" size="small">同意</Button>
                                <Button type="primary" @click="refuseAddFriend(item,index)" size="small">拒绝</Button>
                            </Col>
                        </Row>
                    </div>
                </div>
                
            </Form>
            <div v-if="modalType == 'friendsNews'" slot="footer" style="padding:0px; border-top:0px;">
            
            </div>
        </Modal>
        <div>
            <Button type="primary" @click="fnOenModal1('login')">登录</Button>
            <Button type="primary" @click="fnOenModal1('register')">注册</Button>
            <Button type="primary" @click="fnOenModal1('add')">添加好友</Button>
            <Button type="primary" @click="fnOenModal1('friendsNews')">好友申请</Button>
        </div>
        <Row>
            <Col span="18" offset="3" style="height: 490px; background: #fff; border-radius: 10px;"></Col>
        </Row>
    </div>
</template>

<script>
/*
1.登录进来，就是连接状态
2.获取好友列表
3.添加好友
4.接收好友
5.消息列表
6.发送消息
7.接收消息
*/
export default {
    name: '',
    data: function() {
         return {
            msg:"个人中心",
            modal1: false, // 模态框
            modalType: '', // 模态框类型
            activatedType: false,//主要解决mounted和activated重复调用
            subFriends: [], // 好友申请
            friendList: [], // 好友列表
            /* 登录的信息 */
            login: {
                userName: '',
                passWord: '',
            },
            /* 注册的信息 */
            register:{
                userName: '',
                passWord: '',
            },
            /* 添加好友的信息 */
            add: {
                userName: '',
                message: '',
            }
        }
    },
    computed: {
        modalTitle: function () {
            let vm = this;
            let type = vm.modalType;
            if(type == 'login'){
                return '登录';
            }else if(type == 'register'){
                return '注册';
            }else if(type == 'add') {
                return '添加好友'
            }else if(type == 'friendsNews'){
                return '好友申请'
            }
        }
    },
    activated:function(){
        this.fnExistTabList();
    },
    mounted: function() {
        this.init();
    },
    methods: {
        /* ===============登录=============== */ 
        fnLogin () {
            let vm = this;
            let options = {
                apiUrl: vm.$webim.config.apiURL,
                user: vm.login.userName,
                pwd: vm.login.passWord,
                appKey: vm.$webim.config.appkey
            };
            vm.$imconn.open(options);
        },
        /* ==============注册================ */
        fnRegisterUser () {
            let vm = this;
            var options = {
                username : vm.register.userName,
                password : vm.register.passWord,
                appKey : vm.common.imConfig.appkey,
                apiUrl: vm.common.imConfig.apiURL,
                success : function(result) {
                    //注册成功;
                    vm.$Message.success('注册成功');
                },
                error : function(e) {
                    //注册失败;
                    vm.$Message.error('注册失败!');
                }
            };
            console.log(vm.$imconn);
            vm.$imconn.registerUser(options);
        },
        /* =============IM初始化============== */ 
        init () {
            let vm = this;
            vm.$imconn.listen({
                onOpened: function (message) {
                    console.log('连接成功=>', message)
                    vm.$Message.success('登录成功');
                    vm.fnGetRoster(); // 获取好友列表
                },
                onClosed: function (message) {
                    console.log('连接关闭=>', message)
                },
                onTextMessage: function (message) {
                    console.log('收到文本信息message=>', message)
                },
                onPresence: function ( message ) {
                    vm.handlePresence(message);
                }
            })
        },
        /* ==============获取好友列表=========== */
        fnGetRoster () {
            let vm = this;
            vm.$imconn.getRoster({
                success: function (roster) {
                    debugger
                    var arrs = [];

                    roster.forEach((item,i) => {
                        if(item.subscription === 'both' ||item.subscription === 'to') {
                            arrs.push(item);
                        }
                    })
                    vm.friendList = arrs;
                    console.log('~~~~~~~~~~~~');
                    console.log(vm.friendList);
                }
            })
        },
        /* ============添加好友=============== */
        fnAddFriends () {
            let vm = this;
            vm.$imconn.subscribe({
                to: vm.add.userName,
                message: !!vm.add.message?vm.add.message:'加个好友呗'
            })
        },
        /* ============同意添加好友=============== */
        agreeAddFriend (data,index) {
            let vm = this;
            let arrs = [];
            /*同意添加好友操作的实现方法*/
            vm.$imconn.subscribed({
                to: data.from,
                message : '[resp:true]'
            })
            vm.$imconn.subscribe({//需要反向添加对方好友
                to: data.from,
                message : '[resp:true]'
            });
            vm.$Message.success('添加成功');
            vm.subFriends.forEach((item,i) => {
                if(i!=index){
                    arrs.push(item);
                }
            })
            vm.subFriends = arrs;
            vm.fnGetRoster();
        },
        /* ============拒绝添加好友=============== */
        refuseAddFriend (data,index) {
            let vm = this;
            let arrs = [];
            /*拒绝添加好友的方法处理*/
            vm.$imconn.unsubscribed({
                to: data.from,
                message : 'rejectAddFriend'
            });
            vm.$Message.success('拒绝成功');
            vm.subFriends.forEach((item,i) => {
                if(i!=index){
                    arrs.push(item);
                }
            })
            vm.subFriends = arrs;
        },
        //收到联系人订阅请求的处理方法，具体的type值所对应的值请参考xmpp协议规范
        handlePresence (e) {
            let vm = this;
            // 对方收到请求添加好友
            if(e.type == 'subscribe'){
                console.log('收到好友申请');
                console.log(e);
                vm.subFriends.push(e);
                /* 如果e.status == [resp:true] 则意外添加好友被认可，这时候需要刷新好友列表*/
                if(e.status == '[resp:true]'){
                    vm.fnGetRoster();
                }
            }
        },
        /* 打开注册模态框 */
        fnOenModal1 (type) {
            let vm = this;
            vm.modal1 = true;
            // 初始化操作
            vm.modalType = type;
            // 登录
            /* vm.login.userName = '';
            vm.login.passWord = ''; */
            // 注册
            vm.register.userName = '';
            vm.register.passWord = '';
            // 添加好友
            vm.add.userName = '';
            vm.add.message = '';
        },
        /* 模态框的确定事件 */ 
        ok () {
            let vm = this;
            let type = vm.modalType; // 模态框类型
            switch (type) {
                // 登录
                case 'login':
                    vm.fnLogin();
                    break;
                // 注册
                case 'register':
                    vm.fnRegisterUser();
                    break;
                // 添加好友
                case 'add':
                    vm.fnAddFriends();
                    break;
                default:
                    alert('错误');
            }
        },
        /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
        fnExistTabList () {
            let vm = this;
            if(!!vm.activatedType){
                let type = vm.$store.getters.tabTrue;
                if(!!!type){
                    vm.init();
                }
            }
            vm.activatedType = true;//主要解决mounted和activated重复调用
        },
    },
    components:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
