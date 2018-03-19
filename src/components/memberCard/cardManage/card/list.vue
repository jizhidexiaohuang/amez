<template>
    <div>
        <!-- 列表容器 -->
        <div class="testWrap">
            <div class="boxStyle">
                <Tabs type="card" :animated="false" :value="TabPaneCtrl" @on-click="changeTabPane">
                    <TabPane label="会员卡" name="card"><MembershipCard></MembershipCard></TabPane>
                    <TabPane label="售卡记录" name="cardSaleRecord"><cardSaleRecord></cardSaleRecord></TabPane>
                    <TabPane label="充值记录" name="rechargeRecord"><rechargeRecord></rechargeRecord></TabPane>
                </Tabs>
            </div>
        </div>
    </div>
</template>
<script>
    import MembershipCard from './membershipCard.vue'
    import cardSaleRecord from '../cardSaleRecord/list.vue'
    import rechargeRecord from '../rechargeRecord/list.vue'
    export default {
        data () {
            return {
                TabPaneCtrl:'card'
            }
        },
        computed:{
            getTabCtrl() {
                console.log(this.$store.getters.tabCtrl)
                return this.$store.getters.tabCtrl;
            }
        },
        methods: {
           changeTabPane(val){
               console.log(val)
               this.$store.commit('TAB_CTRL',val)
               if(val!='cardSaleRecord'){
                   this.$store.commit('CARD_NAME','');
               }
           }
        },
        mounted: function(){
            
        },
        activated: function(){
            
        },
        components:{
           MembershipCard,
           cardSaleRecord,
           rechargeRecord
        },
        watch:{
            getTabCtrl:{
                handler(val){
                    console.log(val)
                    this.TabPaneCtrl = val;
                }
            }
        },
    }
</script>
<style scoped>
</style>