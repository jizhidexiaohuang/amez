<template>
    <div>
        <!-- 列表容器 -->
        <Button @click="usingRange = true">选择模板</Button>
        <Modal
            v-model="usingRange"
            title="选择模板"
            @on-ok="ok"
            width="700"
            @on-cancel="cancel">
        <div>
            <Row style="margin-bottom:10px;" v-show="false">
                <Col span="5">
                    <ButtonGroup>
                        <Button @click.native="changePageType('list')" type="primary" size="small" icon="ios-search">新增</Button>
                        <Button @click.native="refreshTable" type="warning" size="small" icon="refresh">刷新</Button>
                        <Button type="error" size="small" icon="android-delete">删除</Button>
                    </ButtonGroup>
                </Col>
                <Col span="3" offset="16">
                    <Input size="small" placeholder="please write text" icon="ios-search"></Input>
                </Col>
            </Row>
            <Form :model="cd" inline v-if="false">
                <FormItem style="margin-bottom:10px;">
                    品牌
                    <Select v-model="cd.branchId" style="width:100px">
                        <Option v-for="item in branchList" :value="item.id" :key="item.id">{{ item.brandName }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:480px;">
                    <Row>
                        <CityLinkage :cityConfig="cityConfig" v-on:listenCity="getCity"></CityLinkage>
                    </Row>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputVal">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 80px">
                        <Option value="storeName">门店名称</Option>
                        <Option value="bossPhone">联系电话</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:200px;">
                     <Row>
                        <Col span="20">
                            <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                            <Button style="margin-left:5px;" @click.native="getData('init')" @click="ievent" type="warning" icon="refresh">刷新</Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <Table v-if="false"
                :loading="table.loading" 
                :data="table.tableData1" 
                :columns="tableColumns1" 
                stripe
                border
                @on-select="fnSelect"
                @on-select-cancel="fnCancel"
                @on-select-all="fnSelectAll"
                @on-selection-change="fnChange"
            ></Table>
            <div class="sliderBar">
                <ul>
                    <li v-for="item in themeList" :key="item.id" :class="item.id==isActive?'active':''" @click="addClass(item.id)">{{item.parentGroupName}}</li>
                </ul>
            </div>
            <div class="displayList">
                <RadioGroup v-model="imgId">
                    <Radio :label="item.bgImgUrl" v-for="item in imgList" :key="item.id">
                        <img :src="item.bgImgUrl" alt="">
                    </Radio>
                </RadioGroup>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page 
                        :total="table.recordsTotal" 
                        :current="table.pageNun"
                        :page-size="table.size"
                        :page-size-opts="table.option"
                        show-sizer 
                        @on-change="changePage"
                        @on-page-size-change="changeSize"
                    ></Page>
                </div>
            </div>
        </div>
    </Modal>
    </div>
</template>
<script>
    import common from '../../../../base.js'
    import CityLinkage from '../../../common/city.vue'
    export default {
        data () {
            return {
                src:'../../../../static/images/membercard.png',
                usingRange:false,
                tempArr:[],
                isActive:0,
                imgList:[],
                imgId:'',
                cityConfig:{
                    key:false,
                    title:'地区',
                    type:'select'
                },
                listId:[],
                themeList:[],
                branchList:[],
                cd:{
                    branchId:'',
                    selectType:'storeName',
                    inputVal:'',
                    cityArr:[]
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
                tableColumns1: [],
                table:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 6,
                    option:[6, 12, 18, 24]
                }
            }
        },
        props:['radioCtrl'],
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData(vm.isActive);
                if(this.radioCtrl){
                    this.imgId = this.radioCtrl;
                }
            },
            getTheme(){
                let vm = this;
                let url = common.path2+'memberCardTemplate/front/findByPage?pageNo=1&pageSize=10000';
                let ajaxData = {
                    "parentGroupId": 0
                }
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    console.log(res)
                    vm.themeList = res.data.data.list;
                    vm.isActive = res.data.data.list[0].id;
                    vm.getData(vm.isActive);
                })
            },
            addClass(val){
                this.isActive = val;
                this.table.pageNun = 1;
                if(this.radioCtrl){
                    this.imgId = this.radioCtrl;
                }
                this.getData(val);
            },
            /* 数据获取 */
            getData (num) {
                let vm = this;
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path2+"memberCardTemplate/front/findByPage?pageNo="+start+'&pageSize='+size;
                let ajaxData = {
                    "parentGroupId": num
                }
                console.log(ajaxData)
                vm.table.loading = true;
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    let oData = res.data
                    console.log(oData);
                    vm.table.recordsTotal = oData.data.total;
                    vm.imgList = oData.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
            /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 5;//页数
                vm.cd.inputVal = "";// 
                vm.cd.selectType = 'storeName';
                vm.cityConfig.key = true;
                vm.cd.cityArr = [];
                vm.cd.branchId = ''
            },
            ievent(data){
                this.cityConfig.key = data;
            },
            //获取连锁品牌
            getBranch(){
                let url = common.path2+"storeChainBrand/front/findByPage";
                let ajaxData = {
                    pageNo:1,
                    pageSize:1000
                }
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    let data = res.data.data.list;
                    this.branchList = data;
                    console.log(data)
                })
            },
            getCity(data){
                console.log(data)
                this.cd.cityArr = data
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
                // console.log(row);
                this.listId.push(row.id)
                console.log(this.listId)
            },
            // 取消选中某一项的回调函数
            fnCancel(selection,row){
                // console.log(row)
                this.remove(this.listId,row.id)
                console.log(this.listId)
            },
             /* 全选时的回调函数 */
            fnSelectAll (selection) {
                console.log(selection);
                console.log(this.listId)
                if(this.listId.length==0){
                    for(var i=0;i<selection.length;i++){
                        this.listId.push(selection[i].id);
                    }
                }else{
                    for(var i=0;i<selection.length;i++){
                        for(var j=0;j<this.listId.length;j++){
                            if(this.listId[j] == selection[i].id){
                                break;
                            }
                            if(this.listId[j] != selection[i].id){
                                if(j==this.listId.length-1){
                                    this.listId.push(selection[i].id)
                                }
                            }
                        }
                    }
                }
                console.log(this.listId)
            },
            // 选中项改变
            fnChange(selection){
                console.log(selection)
                if(selection.length==0){
                   for(var i=0;i<this.tempArr.length;i++){
                       this.remove(this.listId,this.tempArr[i].id);
                   } 
                }
            },
            // 删除特定的id
            remove(arr,id){
                let index = arr.indexOf(id)
                if (index > -1) {
                    arr.splice(index, 1);
                }
            },
            // 每请求一页的时候判断是否被选中
            selectOrNo(arr1,arr2){
                for(var i=0;i<arr1.length;i++){
                    for(var j=0;j<arr2.length;j++){
                        if(arr1[i]==arr2[j].id){
                            arr2[j]._checked = true
                        }
                    }
                }
            },
            fnBackformAdd (type) {
                this.changePageType(type);
                this.getData(this.isActive);
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.table.size = size;
                vm.getData(vm.isActive);
            },
            changePageType (type) {
                this.pageType = type;
            },
            /* 刷新 */
            refreshTable () {
                var vm = this;
                vm.table.pageNun = 1;
                vm.table.size = 10;
                vm.getData(vm.isActive);
            },
            /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
            fnExistTabList () {
                let vm = this;
                if(!!vm.activatedType){
                    let arrs = [];
                    let type = vm.$store.getters.tabTrue;
                    if(!!!type){
                        vm.table.tableData1 = [];//为了处理进来的时候看到之前缓存的页面
                        vm.table.loading = true;//进一步模拟第一次进来时的页面效果
                        vm.pageType = 'list'//显示列表页，放在这里是给上边的处理留点时间，也就是初始化放在这段代码上边
                        vm.getData(vm.isActive);//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
            ok () {
                //将选中的图片路径传给父组件
                this.$emit('listenImg',this.imgId);
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
        },
        beforeMount:function(){
            
        },
        mounted: function(){
            this.getTheme();
            this.getBranch()
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
           CityLinkage
        }
    }
</script>
<style scoped lang="scss">
    .ivu-modal{
        display: flex;
        min-height:300px;
    }
    .sliderBar{
        position: absolute;
        z-index: 999;
        flex:1;
        left: 0;
        top: 51px;
        bottom:60.67px;
        width:140px;
        border-right:1px solid #d1d1d1;
        ul{
            height: 100%;
            overflow: auto;
            li{
                text-align: center;
                font-size: 14px;
                line-height: 30px;
                &.active{
                    background:#2d8cf0;
                    color:#fff;
                }
            }
        }
    }
    .displayList{
        position: relative;
        flex:1;
        left:0px;
        padding-left:140px;
        min-height:180px;
        .ivu-radio-group-item{
            position: relative;
            img{
                display: inline-block;
                width: 140px;
                height: 80px;
                text-align: center;
                line-height: 60px;
                border: 1px solid transparent;
                border-radius: 4px;
                overflow: hidden;
                background: #fff;
                position: relative;
                box-shadow: 0 1px 1px rgba(0,0,0,.2);
                margin-right: 4px;
            }
            .ivu-radio{
                position: absolute;
                top:0!important;
            }
        }  
    }
</style>