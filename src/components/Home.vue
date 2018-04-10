<template>
    <div class="testWrap">
        <h2>待办事项</h2>
        <div class="boxStyle">
            <div class="item">
                <h3 ref="auditServer">{{auditServer}}</h3>
                <p>待审核服务</p>
            </div>
            <div class="item">
                <h3>{{auditEmployee}}</h3>
                <p>待审核员工</p>
            </div>
            <div class="clear"></div>
        </div>
        <h2 class="dataSee">数据概览</h2>
        <div class="boxStyle">
            <Tabs value="name1" @click.native="tabClick">
                <TabPane label="今日" name="name1">
                    <div class="item">
                        <h3>10</h3>
                        <p>新增会员</p>
                    </div>
                    <div class="item">
                        <h3>10</h3>
                        <p>新增门店</p>
                    </div>
                    <div class="item">
                        <h3>10</h3>
                        <p>新增服务</p>
                    </div>
                    <div class="item">
                        <h3>10</h3>
                        <p>新增会员卡</p>
                    </div>
                    <div class="item">
                        <h3>10</h3>
                        <p>新增服务订单</p>
                    </div>
                    <div class="item">
                        <h3>10</h3>
                        <p>新增售卡订单</p>
                    </div>
                    <div class="item">
                        <h3>10</h3>
                        <p>新增充值订单</p>
                    </div>
                    <div class="item">
                        <h3>10</h3>
                        <p>交易额</p>
                    </div>
                </TabPane>
                <TabPane label="7天" name="name2">
                    <div class="item">
                        <h3>10</h3>
                        <p>待审核员工</p>
                    </div>
                </TabPane>
                <TabPane label="30天" name="name3">
                     <div class="item">
                        <h3>10</h3> 
                        <p>待审核员工</p>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
import common from '../base.js';
export default {
    name: 'home',
    data: function() {
         return {
            auditServer:'',
            auditEmployee:''
        }
    },
    activated:function(){
         this.getService();
         this.getEmploee();
    },
    mounted: function() {
        let vm = this;
        this.fnIsEnter();
    },
    methods: {
        /* 是否有登录 */
        fnIsEnter () {
            if(!!!window.localStorage.getItem("userInfo")){
                alert("请先登录")
                this.$router.push("/login");
            }
        },
        // 获取审核服务数据
        getService () {
            let vm = this;
            const url = vm.common.path2 + 'product/findByPageForStore';
            const httpHeader = {headers: {'Content-Type': 'application/json'}};
            vm.$http.post(url,httpHeader).then(function(res){
                vm.auditServer = res.data.data.total;
            }).catch(function(err){
                vm.$Message.error('失败!');
            })
        },
        //获取审核员工数据
        getEmploee () {
            const vm = this;
            const url = vm.common.path2 + 'storeBeautician/front/findByPage';
            const httpHeader = {headers:{'Content-Type': 'application/json'}};
            vm.$http.post(url,httpHeader).then(function(res){
                vm.auditEmployee = res.data.data.total;
            }).catch(function(err){
                vm.$Message.error('请求失败!');
            });
        },
        getFirstSee () {

        },
        //tab点击事件
        tabClick () {
            this.getFirstSee();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .testWrap h2{
        margin-bottom: 6px;
    }
    .boxStyle .item{
        float: left;
        padding: 20px 43px;
        text-align: center;
    }
    .item h3{
        margin: 4px 0 24px 0;
        font-size: 20px;
    }
    .dataSee{
        margin-top: 10px;
    }
</style>
