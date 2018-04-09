<template>
    <div class="">
        <div style="position:fixed; right:50px; bottom:20px;">
            <Button v-if="false" @click="fnDoSome" type="primary">添加模块</Button> 
            <Button v-if="!!operators.determine" @click="fnSendData" type="primary">确定</Button> 
        </div>
        <div class="phone-box">
            <div class="header">
                <div></div>
            </div>
            <div class="body">
                <div class="aItem" v-for="(item,index) in list"  :class="['aItem',item.type == 'Footer'?'footerItem':'']">
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
    import Server from './child/server.vue'
    import Activity from './child/activity.vue'
    import Footer from './child/footer.vue'
    import Shop from './child/shop.vue'
    export default {
        data () {
            return {
                operators: {},
                activatedType: false,//主要解决mounted和activated重复调用
                list:[],// 最后提交的数据
                curIndex: 0,// 传递给子组件的数据
                typeArrs:['test','Banner','Server','Activity','Shop','Footer'],
                fnIsShow: false,
            }
        },
        methods: {
            /* 模板类型选择 */
            fnSelectType (type) {
                switch (type) {
                    case '1':
                        return "Banner"
                        break;
                    case '2':
                        return "Server"
                        break;
                    case '3':
                        return "Activity"
                        break;
                    case '4':
                        return "Shop"
                        break;
                    case '5':
                        return "Footer"
                        break;
                    default:
                        return "Banner"  
                }
            },
            /* 模板类型选择 */
            fnSelectType1 (type) {
                switch (type) {
                    case 'Banner':
                        return 1
                        break;
                    case 'Server':
                        return 2
                        break;
                    case 'Activity':
                        return 3
                        break;
                    case 'Shop':
                        return 4
                        break;
                    case 'Footer':
                        return 5
                        break;
                    default:
                        return 1  
                }
            },
            /* 获取数据 */
            fnajaxData () {
                let vm = this;
                // let url = "http://120.79.42.13:8005/app/baseHomeTemplate/front/findByPage?pageSize=1000";
                let url = vm.common.path2 + "baseHomeTemplate/front/findByPage?pageSize=1000";
                this.$http.post(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then(function(res){
                    let oData = res.data.data.list
                    oData.reverse();
                    let myArrs = [];
                    for(var i = 0;i<oData.length;i++){
                        var obj = {};
                        obj.id = oData[i].id;
                        obj.type = vm.fnSelectType(oData[i].templateType);
                        obj.data = {};
                        obj.data.text = vm.fnSelectType(oData[i].templateType);
                        obj.data.imgList = JSON.parse(oData[i].templateContent);
                        obj.templateCode = oData[i].templateCode;
                        myArrs.push(obj);
                    }
                    vm.list = myArrs;
                }).catch(function(err){
                })
            },
            fnGeData () {
                let vm = this;
                let arrs = [
                    /* 轮播图 */
                    {
                        type: 'Banner', // 编辑类型
                        data: {
                            text: '轮播图',
                            imgList:[
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    myId: 1, // 唯一标识
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    myId: 2,
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    myId: 3,
                                },
                            ]
                        }, // 数据
                    },
                    /* 服务分类图 */
                    {
                        type: 'Server', // 编辑类型
                        data: {
                            text: '服务分类图',
                            imgList:[
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    name: '美容',
                                    myId: 4,
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    name: '养生',
                                    myId: 5
                                },
                            ]
                        }, // 数据 
                    },
                    /* 活动区 */
                    {
                        type: 'Activity', // 编辑类型
                        data: {
                            text: '活动类型图',
                            imgList:[
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    title1: '智能测肤',
                                    title2: '智能测肤等你来体验',
                                    myId: 6,
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    title1: '钟意TA',
                                    title2: '智能测肤中意的那个ta',
                                    myId: 7
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    title1: '闺蜜团购',
                                    title2: '和闺蜜一起变美吧',
                                    myId: 8
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    title1: '会员卡',
                                    title2: '超多优惠等你来拿',
                                    myId: 9
                                }
                            ]
                        }, // 数据 
                    },
                    /* 商品区 */
                    {
                        type: 'Shop', // 
                        data: {
                            text: '商品区',
                            imgList:[
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    name: '美容',
                                    myId: 11,
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    name: '养生',
                                    myId: 12
                                },
                            ]
                        }, // 数据 
                    },
                    /* 底部菜单 */
                    {
                        type: 'Footer', // 编辑类型
                        data: {
                            text: '底部菜单',
                            imgList:[
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    name: '美容',
                                    myId: 4,
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    name: '美店',
                                    myId: 5
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    name: '订单',
                                    myId: 5
                                },
                                {
                                    url:"http://120.79.42.13:82/group1/M00/00/0A/rBJ85FpZ0AiAVyu2AAHptOKNRTE839.jpg",
                                    src:"http://www.baidu.com",
                                    name: '我的',
                                    myId: 5
                                },
                            ]
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
                    templateCode: 'INDEX_ONE',
                    type: 'Footer', // 编辑类型
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
                        // vm.fnGeData();
                        // debugger
                        vm.curIndex = null;
                        this.fnajaxData();
                        setTimeout(function(){
                            vm.curIndex = 0;    
                        },200)
                        // vm.curIndex = 0;
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
            /* 确定提交 */
            fnSendData () {
                let vm = this;
                let arrs = vm.list;
                arrs.forEach(function(item,index){
                    vm.fnAjaxBySend(item);
                });
            },
            /* 确定提交的ajax */
            fnAjaxBySend (data) {
                let vm = this;
                var data = vm.fnRefreshData(data);
                if(!!data.id){
                    // 这是编辑
                    // let url = "http://120.79.42.13:8005/app/baseHomeTemplate/edit";
                    let url = vm.common.path2 + "baseHomeTemplate/edit";
                    vm.$http.put(
                        url,
                        data,
                    ).then(function(res){
                    }).catch(function(err){
                    })
                }else{
                    // 这是新增
                    // let url = "http://120.79.42.13:8005/app/baseHomeTemplate/insert";
                    let url = vm.common.path2 + "baseHomeTemplate/insert";
                    vm.$http.post(
                        url,
                        data,
                        {
                            headers:{
                                'Content-type':'application/json;charset=UTF-8'
                            }
                        }
                    ).then(function(res){
                        vm.$Message.success('成功');
                    }).catch(function(err){
                        vm.$Message.success(err);
                    })
                }
            },
            /* 提交ajax之前,需要对传过去的参数进行还原处理 */
            fnRefreshData (data) {
                let vm = this;
                var ajaxData = {};
                if(!!data.id){
                    ajaxData.id = data.id;
                }
                ajaxData.templateType = vm.fnSelectType1(data.type);
                ajaxData.templateContent = JSON.stringify(data.data.imgList);
                ajaxData.templateCode = data.templateCode;
                return ajaxData;
            },
        },
        mounted: function(){
            this._u.operatorsEdit(this); // 控制页面按钮的显示
            this.fnajaxData();
            // this.fnGeData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList();
        },
        components:{
            Banner,
            Server,
            Activity,
            Footer,
            Shop
        }
    }
</script>
<style lang='scss' scoped>
.phone-box{
    margin-left: 100px;
    margin-top: 50px;
    width: 320px; min-height: 500px;
    position:relative;
    background: #fff;
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
        padding-bottom: 60px;
    }
}
.aItem{
    position: relative;
    width: 100%;
}
.footerItem{
    position: absolute;
    bottom: 50px;
    right: 9px;
    left: 9px;
    width: unset;
}
</style>