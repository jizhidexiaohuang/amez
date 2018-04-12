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
        <div style="height: 480px; width: 680px; background:#fff; border-radius: 5px; margin: 10px auto; position: relative;">
            <div class="configBox"></div>
            <div class="listBox">
                <div class="item" v-for="(item,index) in friendList" :class="['item',index == friendIndex?'item_active':'']">
                    <div class="item_icon">
                        <Icon type="ios-person-outline"></Icon>
                    </div>
                    <div class="item_user_name" @click="selectSendToName(item,index)">{{ item.name }}</div>
                </div>
            </div>
            <div class="contentBox" v-if="!!sendtoInfo">
                <div class="content_title">
                    {{ !!sendtoInfo?sendtoInfo.name:'' }}
                </div>
                <div class="content_top" id="content_top" ref="content_top">
                    <div style="overflow: hidden;">
                        <div class="content_item" v-for="(item,index) in showNewsList">
                            <div :class="item.newsType == 'receive'?'fl':'fr'" style="width: 200px; overflow: hidden;">
                                <div :class="item.newsType == 'receive'?'txt_fl':'txt_fr'" style="color: #999999;">
                                    <span>{{ sendtoInfo.name }}</span>
                                    <span>{{ item.theTime }}</span>
                                </div>
                                <div :class="['send_content',item.newsType == 'receive'?'bg1':'bg2']" class="send_content bg1">{{ item.sourceMsg }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content_bottom">
                    <div style="width; 100%;">
                        <textarea @keyup.13="sendInfo" class="text_area" v-model="sendText">
                            
                        </textarea>
                    </div>
                    <div style="width: 100%; height: 39px;">
                        <Button @click="sendInfo" type="success" style="float: right; margin-top: 3px; margin-right: 5px;">发送</Button>
                    </div>
                </div>
            </div>
        </div>
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
            sendtoInfo: '', // 发送信息给谁
            sendText: '', // 发送的信息
            newsList:[], // 用来存储不同人的消息
            showNewsList: [], // 展示对应的消息列表
            friendIndex: 1000, // 当前聊天好友的索引值
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
                    // 生成消息数据
                    vm.fnMakeNewsList(message);
                    vm.fnFriendShowNews(message);
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
        /* ============发送消息================= */
        sendInfo () {
            let vm = this;
            var msg = vm.sendText.trim();
            if(!!!msg){
                vm.$Message.error('请填写内容!');
                return false;
            }
            var to = vm.sendtoInfo.name;
            var options = {
                to : to,
                msg : msg,
                type : "chat",
                ext: {
                    "time": vm.common.baseFormatDate()
                }
            };
            //发送文本消息接口
            vm.$imconn.send(options);

            // 往数组里添加消息记录
            vm.newsList.forEach((item,i) => {
                if(item.name == vm.sendtoInfo.name){
                    item.list.push({
                        "sourceMsg": vm.sendText,
                        "newsType": 'send',
                        "theTime": vm.common.baseFormatDate()
                    })
                }
            });
            vm.sendText = '';
            // 滚动条固定在底部
            let _div = vm.$refs.content_top;
            let _num = _div.scrollHeight;
            vm.fnChangeScroll(_div,_num);
        },
        // 收到信息时做相关的提示
        fnFriendShowNews (message) {
            let vm = this;
            let name = message.from;
            let flag = false;
            if(this.$route.path != '/ownspace'){
                flag = true;
            }else{
                if(name != vm.sendtoInfo.name){
                    flag = true;
                }else{
                    // 滚动条固定在底部
                    let _div = vm.$refs.content_top;
                    let _num = _div.scrollHeight;
                    vm.fnChangeScroll(_div,_num);
                }
            }
            !!flag&&vm.$Notice.info({
                title: name,
                desc: message.sourceMsg,
                duration:2
            });
        },
        // 聊天数据
        fnMakeNewsList (message) {
            let vm = this;
            var flag = true; 
            vm.newsList.forEach((item,i) => {
                if(item.name == message.from){
                    item.list.push({
                        "sourceMsg": message.sourceMsg,
                        "newsType": 'receive',
                        "theTime": message.ext.time
                    })
                    flag = false;
                }
            })
            if(!!flag){
                var obj = {
                    "name": message.from,
                    "list": []
                }
                obj.list.push({
                    "sourceMsg": message.sourceMsg,
                    "newsType": 'receive',
                    "theTime": message.ext.time
                })
                vm.newsList.push(obj);
            }
        },
        // 选择聊天对象
        selectSendToName (info,friendIndex) {
            console.log(info);
            let vm = this;
            vm.sendtoInfo = info;
            vm.friendIndex = friendIndex;

            // 判断是否有聊过天
            if(vm.newsList.length == 0){
                var obj = {
                    "name": info.name,
                    "list": [],
                }
                vm.newsList.push(obj);
            }else{
                var flag = true;
                vm.newsList.forEach((item,i) => {
                    if(item.name == info.name){
                        flag = false;
                    }
                })
                if(!!flag){
                    var obj = {
                        "name": info.name,
                        "list": [],
                    }
                    vm.newsList.push(obj);
                }
            }
            console.log(vm.newsList);

            /* 展示对应的消息列表 */
            vm.newsList.forEach((item,i) => {
                if(item.name == info.name){
                    vm.showNewsList = item.list;
                }
            })
            // 滚动条固定在底部
            if(vm.showNewsList.length>0){
                let _div = vm.$refs.content_top;
                let _num = _div.scrollHeight != undefined?_div.scrollHeight:0;
                vm.fnChangeScroll(_div,_num);
            }
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
        /* 元素的滚动条滚动位置变化 */ 
        fnChangeScroll (_div,_num) {
            let vm = this;
            let div = _div;
            let num = _num || 0;
            vm.$nextTick(() => {
                div.scrollTop = num;
            })
        }
    },
    components:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fl{
    float: left;
}
.fr{
    float: right;
}
.txt_fl{
    text-align: left;
}
.txt_fr{
    text-align: right;
}
.configBox{
    width: 50px; 
    height: 100%;
    border-right: 1px solid #f2f2f2;
    float: left;
    background-color: #fcfdfb;
}
.listBox{
    float: left;
    width: 200px;
    border-right: 1px solid #f2f2f2;
    height: 480px;
    overflow-y: auto;
}
.contentBox{
    float: left;
    height: 100%;
}
.content_title{
    padding-left: 15px;
    height: 40px; 
    line-height: 40px;
    font-size: 20px;
}
.content_top{
    width: 100%;
    height: 295px;
    padding-top: 10px;
    border-bottom: 1px solid #f2f2f2;
    overflow-y: auto;
}
.content_item{
    margin-left: 10px; 
    margin-right: 10px;
    margin-bottom: 10px;
    overflow: hidden;
}
.content_bottom{
    width: 100%;
    height: 149px;
}
.text_area{
    width: 430px;
    height: 100px;
    padding: 10px 20px 10px 20px;
    border: none;
    background-color: white;
    flex-direction: column;
    outline:none;
    font-size: 14px;
    color: #999999;
    resize: none;
}
.item{
    overflow: hidden;
    line-height: 40px;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
}
.item_active{
    background: #f3f6f6;
}
.item_icon{
    height: 40px; width: 40px;
    border-radius: 50%; 
    background:#f1f2ec; 
    font-size: 25px; 
    text-align:center; 
    line-height: 40px;
    float: left;
    margin-right: 5px;
}
.item_user_name{
    float: left;
    font-size: 14px;
    color: #1a1a1a;
    width: calc(100% - 70px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
}
.send_content{
    margin-top: 5px;
    background: #f1f2ec;
    width: 200px;
    word-wrap:break-word;
    padding: 5px;
    border-radius: 5px;
}
.bg1{
    background: #f1f2ec;
}
.bg2{
    background: #b4e4fc;
}
</style>
