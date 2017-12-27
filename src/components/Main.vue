<template>
    <div class="layout main" :class="{'layout-hide-text': layout.spanLeft < 3}">
        <Row type="flex">
            <Col :span="layout.spanLeft" class="layout-menu-left">
                <!-- 左侧菜单 -->
                <Menu ref="leftMenu"  :active-name="menu.active" :theme="layout.theme2" :open-names="menu.open" :accordion="true">
                    <template v-for="item in menu.menuList">
                        <router-link v-if="!!!item.hasChildList" :to="item.href">
                            <MenuItem  :name="item.href">
                                <Icon :type="item.type" :size="iconSize"></Icon>
                                <span class="layout-text">{{ item.name }}</span>
                            </MenuItem>
                        </router-link>
                        <Submenu v-if="!!item.hasChildList" :name="item.name">
                            <template slot="title">
                                <Icon :type="item.type" :size="iconSize"></Icon>
                                <span class="layout-text">{{ item.name }}</span>
                            </template>
                            <router-link v-for="list in item.childList" :to="list.href">
                                <MenuItem :name="list.href" class="layout-text">
                                    <span class="layout-text">{{ list.name }}</span>
                                </MenuItem>
                            </router-link>
                        </Submenu>
                    </template>
                </Menu>
            </Col>
            <Col :span="layout.spanRight">
                <!-- 头部 -->
                <Row class="layout-header">
                    <Button class="showOrHide" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                    <div class="layout-breadcrumb">
                        <Breadcrumb>
                            <BreadcrumbItem to="/home">首页</BreadcrumbItem>
                            <BreadcrumbItem v-for="item in bread.breadArrs" :to="item.path">{{ item.name }}</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                    <div class="layout-right-header">
                        <div style="float:left">
                            <router-link to="/newsmanage">
                                <Icon type="android-notifications"></Icon>
                            </router-link>
                        </div>
                        <div style="float:left; margin-left:20px; margin-right:10px;">
                            <Dropdown>
                                <a href="javascript:void(0)">
                                    {{ user.name }}
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem>
                                        <router-link to="/ownspace">个人中心</router-link>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <router-link to="/login">退出</router-link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>

                </Row>
                <!-- 页签区域 -->
                <div class="tagWrap">
                    <div class="tabLeft">
                        <swiper :options="swiperOption" ref="mySwiper">
                            <swiper-slide v-for="item in menu.arrs1">
                                <Tag
                                    type="dot" 
                                    @click.native="fnDoSome(item.path)" 
                                    :closable="item.path==='/home'?false:true" 
                                    checkable 
                                    :color="menu.currentPageName===item.path?'blue':'default'"
                                    @on-close="deleteItem(item)"
                                >{{item.name}}</Tag>
                            </swiper-slide>
                        </swiper>
                    </div>
                    <div class="tabRight">
                        <Dropdown style="margin-left:15px; margin-top:9px;">
                            <Button type="primary" size="small">
                                标签选项
                                <Icon type="arrow-down-b"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="fnHandleMenu('all')">关闭所有</DropdownItem>
                                <DropdownItem @click.native="fnHandleMenu('other')">关闭其它</DropdownItem>
                                <DropdownItem @click.native="fnHandleMenu('left')">关闭左侧</DropdownItem>
                                <DropdownItem @click.native="fnHandleMenu('right')">关闭右侧</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <!-- 内容区域 -->
                <div class="layout-content">
                    <div class="layout-content-main">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
                    </div>
                </div>
               
            </Col>
        </Row>
    </div>
</template>

<script>
import common from '../base.js'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    data () {
        return {
            user:{
                name:"admin"
            },
            layout:{
                spanLeft: 3,//layout布局左侧的宽度
                spanRight: 21,//layout布局右侧的宽度
                theme2: 'dark',//菜单主题
            },
            menu: {
                currentPageName: this.$route.fullPath,//页签样式显示的标识
                open: [this.$route.matched[0].name],//菜单展开的标识
                active: this.$route.path,//被点击菜单的标识
                arrs:['/home'],//保存页签,防止重复
                arrs1:[{path:'/home',name:'首页'}],//遍历该数组生成页签
                menuList: [],//模拟后台返回过来的菜单列表 
            },
            bread:{
                breadArrs:[],//面包屑数组，用来遍历面包屑
                leftType:1,//1可以点击，0不可以点击
                rightType:1,//1可以点击，0不可以点击
            },
            screenWidth: document.body.clientWidth,
            swiperOption: {
                "slidesPerView":"auto",
                "observer":true,//修改swiper自己或子元素时，自动初始化swiper
                "observeParents":true,
            }
        }
    },
    mounted: function(){
        this.fnGetMenuList();//获取菜单
        this.addItem();
        this.fnBreadcrumb();//更新面包屑
    },
    computed: {
        iconSize () {
            return this.layout.spanLeft === 3 ? 14 : 24;
        },
    },
    activated: function(){
    },
    methods: {
        /* 菜单的收缩和展开 */
        toggleClick () {
            if (this.layout.spanLeft === 1) {
                this.layout.spanLeft = 3;
                this.layout.spanRight = 21;
            } else {
                this.layout.spanLeft = 1;
                this.layout.spanRight = 23;
            }
        },
        /* 页签点击事件 */
        fnDoSome(msg){
            this.$router.push({path:msg});
        },
        /* 页签添加 */
        addItem(){
            let vm = this;
            // console.log(vm.$route);
            let path = vm.$route.fullPath;
            let name = vm.$route.meta.name;
            let type = vm.$route.meta.type;
            if(vm.menu.arrs.indexOf(path) == -1&&type=="菜单"){
                vm.menu.arrs.push(path);
                vm.menu.arrs1.push({path:path,name:name});
            }
        },
        /* 删除页签 */
        deleteItem(item){
            let vm = this;
            let arrs = [];
            let index = vm.menu.arrs.indexOf(item.path);
            vm.menu.arrs.splice(index,1);
            vm.menu.arrs1.splice(index,1);
            let len = vm.menu.arrs.length>1?1:0;
            if(item.path == vm.$route.path){
                vm.$router.push(vm.menu.arrs[len]);
            }
        },
        /* 面包屑 */
        fnBreadcrumb () {
            let vm = this;
            let arrs = [];
            let route = this.$route;
            if(route.name == "首页"){// 首页
                vm.bread.breadArrs = [];
                return false;
            }else if(route.name != "首页"){// 非首页
                if(!!!route.matched[0].path&&route.matched.length>1){// 只有一级
                    let obj = {};
                    obj.name = route.matched[1].name;
                    obj.path = route.matched[1].path;
                    arrs.push(obj);
                }else if(!!route.matched[0].path){// 二级以上
                    route.matched.forEach((item,index) => {
                        let obj = {};
                        obj.name = item.name;
                        if(index == (route.matched.length-1)){
                            obj.path = item.path; 
                        }else{
                            obj.path = "";
                        }
                        arrs.push(obj);
                    })
                }
            }
            vm.bread.breadArrs = arrs;
        },
        /* 获取菜单数据 */
        fnGetMenuList () {
            let timer = null;
            let arrs = common.menuList;
            let vm = this;
                // timer.setTimeout(function(){
                //     vm.menuList = arrs;
                // }，1000)
            window.setTimeout(function(){
                vm.menu.menuList = arrs;
                vm.fnMenuChange();
                //初始化菜的那
            },400)
        },
        /* 激活菜单 */
        fnMenuChange () {
            this.menu.open = [];
            this.menu.open = [this.$route.matched[0].name];
            this.menu.active = this.$route.path;
            this.$nextTick(function() {
                this.$refs.leftMenu.updateOpened();
                this.$refs.leftMenu.updateActiveName();
            });
        },
        /* 页签删除后再点开的处理 */
        fnExistTabList (to) {
            let vm = this;
            if(this.menu.arrs.indexOf(to.fullPath) == -1){
                //不存在的情况
                vm.$store.dispatch('tabFalse');
            }else{
                //存在的情况
                vm.$store.dispatch('tabTrue');
            }
        },
        /* 页签管理 */
        fnHandleMenu (type) {
            let vm = this;
            switch (type) {
                case "all":
                    //如果当前就是首页就不用处理
                    if(vm.$route.name!="首页"){
                        vm.menu.arrs = ['/home'];
                        vm.menu.arrs1 = [{path:'/home',name:'首页'}];
                        vm.$router.push('/home');
                    }
                    break;
                case "left":
                    if(vm.$route.name != "首页"){
                        let index = vm.menu.arrs.indexOf(vm.$route.path);
                        console.log(index); 
                        if(index>1){
                            let arrs = ['/home'];
                            let arrs1 = [{path:'/home',name:'首页'}];
                            vm.menu.arrs.forEach(function(item,i){
                                if(i>=index){
                                    arrs.push(item);
                                    arrs1.push(vm.menu.arrs1[i]);
                                }
                            })
                            vm.menu.arrs = arrs;
                            vm.menu.arrs1 = arrs1;
                        }
                    }
                    break;
                case "right":
                    let index = vm.menu.arrs.indexOf(vm.$route.path);
                    let arrs = [];
                    let arrs1 = [];
                    vm.menu.arrs.forEach(function(item,i){
                        if(i<=index){
                            arrs.push(item);
                            arrs1.push(vm.menu.arrs1[i]);
                        }
                    })
                    vm.menu.arrs = arrs;
                    vm.menu.arrs1 = arrs1;
                    break;
                case "other":
                    //如果当前是首页就简单处理
                    if(vm.$route.name == "首页"){
                        vm.menu.arrs = ['/home'];
                        vm.menu.arrs1 = [{path:'/home',name:'首页'}];
                    }else{
                        let path = vm.$route.path;
                        let arrs = ['/home'];
                        let arrs1 = [{path:'/home',name:'首页'}];
                        if(vm.menu.arrs.length>2){
                            vm.menu.arrs.forEach(function(item,index){
                                if(item == path){
                                    arrs.push(item);
                                    arrs1.push(vm.menu.arrs1[index]);
                                }
                            })
                            vm.menu.arrs = arrs;
                            vm.menu.arrs1 = arrs1;
                        }
                    }
                    break;
                default:
                    //情况不符
            }
        }

    },
    components:{
        swiper,
        swiperSlide
    },
    watch:{  
        $route(to, from) {  
            this.fnExistTabList(to);//判断是否存在页签中
            this.fnMenuChange();
            this.menu.currentPageName = to.fullPath;
            this.addItem();
            this.fnBreadcrumb();
        },
        screenWidth(val){
            this.screenWidth = val;
        }  
    }  
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
@import '../../static/sass/main.scss'
</style>




