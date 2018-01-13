<template>
    <div class="boxStyle">
        <div style="position:fixed; right:50px; bottom:20px;">
            <Button @click="fnDoSome" type="primary">添加模块</Button> 
        </div>
        <div class="phone-box">
            <div class="header">
                <div></div>
            </div>
            <div class="body">
                <div class="aItem" v-for="(item,index) in list">
                    <component v-on:getData="fnGetDataFromChild" v-on:deleteModal="fnDeleteModal" :index="index" :curIndex="curIndex" :datas="item" v-bind:is="item.type" @click.native="fnTest(index)"></component>
                </div>
            </div>
            <div class="footer">
                <div></div>
            </div>
            
        </div>
    </div>
</template>
<script>
    import Banner from './child/banner.vue'
    export default {
        data () {
            return {
                activatedType: false,//主要解决mounted和activated重复调用
                list:[],
                curIndex: 0,// 传递给子组件的数据
            }
        },
        methods: {
            /* 获取数据 */
            fnGeData () {
                let vm = this;
                let arrs = [
                    {
                        type: 'Banner', // 编辑类型
                        data: {
                            text: '区域1',
                            imgList:[
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg"
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg"
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg"
                                }
                            ]
                        }, // 数据
                    },
                    {
                        type: 'Banner', // 编辑类型
                        data: {
                            text: '区域2'
                        }, // 数据
                    },
                    {
                        type: 'Banner', // 编辑类型
                        data: {
                            text: '区域3'
                        }, // 数据
                    }
                ]
                vm.list = arrs;
            },
            /* 更新被选中的值 */
            fnTest (index) {
                let vm = this;
                vm.curIndex = index;
            },
            /* 重新编辑组件获取到的数据 */
            fnGetDataFromChild (obj) {
                console.log(1111111111112);
                console.log(obj);
                let vm = this;
                let arrs = [];
                vm.list.forEach(function(item,index){
                    if(vm.curIndex == index){
                        arrs.push(obj);
                    }else{
                        arrs.push(vm.list[index]);
                    }
                })
                vm.list = arrs;
            },
            /* 添加模块 */
            fnDoSome () {
                let vm = this;
                let obj = {
                    type: 'Banner', // 编辑类型
                    data: {
                        text: '测试区域'
                    }, // 数据
                }
                let arrs = vm.list;
                arrs.push(obj);
                vm.curIndex = arrs.length - 1;
                vm.list = arrs;
            },
            /* 删除模块 */
            fnDeleteModal () {
                let vm = this;
                let arrs = [];
                let arrs1 = vm.list;
                /* if(vm.list.length == 1){
                   return false;
                } */
                vm.list.forEach(function(item,index){
                    if(vm.curIndex != index){
                        arrs.push(item);
                    }
                })
                vm.list = arrs1;
                // vm.list = arrs;
                setTimeout(function(){
                    vm.list = arrs;
                    vm.curIndex = vm.curIndex == 0?0:vm.curIndex-1
                },5)
            },
            /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
            fnExistTabList () {
                let vm = this;
                if(!!vm.activatedType){
                    let arrs = [];
                    let type = vm.$store.getters.tabTrue;
                    if(!!!type){
                        // 模拟再次进来时的界面
                        vm.fnGeData();
                        vm.curIndex = 0;
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
        },
        mounted: function(){
            this.fnGeData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList();
        },
        components:{
            Banner
        }
    }
</script>
<style lang='scss' scoped>
.phone-box{
    margin-left: 100px;
    margin-top: 50px;
    width: 320px; min-height: 500px;
    position:relative;
    .header{
        height: 50px; line-height: 50px; 
        width: 100%;
        background: #000;
        border-radius: 20px 20px 0px 0px;
        overflow: hidden;
        div{
            width: 60px; height: 5px;
            background: #3d3d3d;
            margin: 0 auto;
            margin-top: 20px;
            border-radius: 5px;
        }
    }
    .footer{
        height: 50px; line-height: 50px;
        width: 100%;
        background:#000;
        border-radius: 0px 0px 20px 20px;
        overflow: hidden;
        div{
            width: 30px; height: 30px; 
            border-radius: 50%; 
            border: 3px solid #3d3d3d;
            margin: 0 auto;
            margin-top: 10px;
        }
    }
    .body{
        width: 100%; 
        border-left: 9px solid #000;
        border-right: 9px solid #000;
        min-height: 500px;
    }
}
.aItem{
    position: relative;
    width: 100%;
}
</style>