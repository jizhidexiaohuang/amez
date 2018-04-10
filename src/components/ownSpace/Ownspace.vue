<template>
    <div class="">
        个人中心    
    </div>
</template>

<script>
export default {
    name: '',
    data: function() {
         return {
            msg:"个人中心",
            options: {
                apiUrl: this.$webim.config.apiURL,
                user: '1913703612',
                pwd: '1913703612',
                appKey: this.$webim.config.appkey
            }
        }
    },
    activated:function(){
        this.init();
    },
    mounted: function() {
        this.init();
    },
    methods: {
        init () {
            let vm = this;
            vm.fnCallBack();
            vm.$imconn.open(vm.options);
        },
        fnCallBack () {
            let vm = this;
            vm.$imconn.listen({
                onOpened: function (message) {
                    vm.$imconn.getRoster({
                    success : function(roster) {
                        // 获取当前登录人的好友列表
                        var arrs = [];
                        for ( var i in roster) {
                            var ros = roster[i]; //好友的对象
                            arrs.push(ros);
                            //ros.name为好友名称
                        }
                        console.log(arrs);
                        }
                    });
                    console.log('连接打开=>', message)
                },
                onClosed: function (message) {
                    console.log('连接关闭=>', message)
                },
                onTextMessage: function (message) {
                    console.log('收到文本信息message=>', message)
                }
            })
        }
    },
    components:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
