<template>
    <div>
        <div>
            <Button @click="fnOpenModal">选择产品</Button>
            <Modal
                v-model="usingRange"
                title="选择产品"
                @on-ok="ok"
                width="700">
                <div v-if="pageType == 'list'">
                    <div>
                        <Table
                            :loading="table.loading" 
                            :data="table.tableData1" 
                            :columns="tableColumns1" 
                            stripe
                            border
                            @on-select="onSelect"
                            @on-select-cancel="onSelectCancel"
                            @on-select-all="onSelectAll"
                            @on-selection-change="onSelectionChange"
                        ></Table>
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
                </div>
            </Modal>
        </div>
        <div v-if="!!showList.length" style="width:700px; margin-top: 10px;">
            <div>
                <Row style="border: 1px solid #dddee1; box-sizing: border-box; background:#f8f8f9; height: 40px; line-height: 40px;"> 
                    <Col span="12" style="padding-left: 18px; border-right: 1px solid #dddee1;">产品名称</Col>
                    <Col span="12" style="padding-left: 18px;">数量</Col>
                </Row>
                <Row class="aLine" v-for="(item,index) in showList1" :key="item.id">
                    <Col span="12" style="padding-left: 18px; border-right: 1px solid #dddee1;">{{ item.physicalName }}</Col>
                    <Col span="12" style="padding-left: 18px;">
                        <!-- {{ item.physicalNumber }} -->
                        <Input-number @on-change="fnDoSome" :min="0" v-model="item.physicalNumber"></Input-number>
                    </Col>
                </Row>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page 
                        :total="table1.recordsTotal" 
                        :current="table1.pageNun"
                        :page-size="table1.size"
                        :page-size-opts="table1.option"
                        show-sizer 
                        @on-change="changePage1"
                        @on-page-size-change="changeSize1"
                    ></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import common from '../../../base.js'
    export default {
        data () {
            return {
                usingRange:false,
                tempArr:[],
                listId:[],
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                tableColumns1: [
                    {
                        type: 'selection',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '产品名称',
                        key: 'physicalName',
                    },
                    {
                        title: '单位',
                        key: 'unit',
                    },
                    {
                        title: '批发价',
                        key: 'salePrice',
                        render: (h,params) => {
                            const row = params.row;
                            return +row.salePrice/100
                        }
                    },
                ],
                table:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 5,
                    option:[5, 10, 15, 20]
                },
                // 展示的数据
                showList: [],
                // 已经勾选的数据
                defaultList: [],
                // 开关
                tSwitch: false,
                table1:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 5,
                    option:[5, 10, 15, 20]
                },
                showList1:[],
            }
        },
        methods: {
            fnDoSome () {
                let vm = this;
                vm.$store.commit('TEST_DATA',vm.showList);
                vm.fnGetData();
            },
            /* ==================================== table ===================================== */

            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
            },
             /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData();
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
                        vm.getData();//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
            /* 选中某一项的回掉函数 */
            onSelect (selection,row) {
                let vm = this;
                vm.defaultList.push(row);
            },
            /* 取消选中某一项的回调函数 */ 
            onSelectCancel (selection,row) {
                let vm = this;
                vm.defaultList = vm.fnRemoveItemFromArrs(vm.defaultList,row);
            },
            /* 全选时的回调函数 */
            onSelectAll (selection) {
                let vm = this;
                if(vm.defaultList.length == 0){
                    for(var i = 0;i<selection.length;i++){
                        vm.defaultList.push(selection[i]);
                    }
                }else{
                    for(var i = 0;i<selection.length;i++){
                        for(var j = 0;j<vm.defaultList.length;j++){
                            if(vm.defaultList[j].id == selection[i].id){
                                break;
                            }else if(vm.defaultList[j].id != selection[i].id){
                                if(j == vm.defaultList.length - 1){
                                    vm.defaultList.push(selection[i]);
                                }
                            }
                        }
                    }
                }
            },
            // 选中项改变
            onSelectionChange (selection) {
                let vm = this;
                /* 全选按钮点击返回的数据为空时，要从默认的数据里边删掉这一页的数据 */
                if(selection.length == 0){
                    vm.defaultList = vm.fnRemoveArrFromArrs(vm.defaultList,vm.tempArr);
                }
            },
            /* ====================================模态框================================= */
            // 每请求一页的时候判断是否被选中
            selectOrNo(arr1,arr2){
                for(var i=0;i<arr1.length;i++){
                    for(var j=0;j<arr2.length;j++){
                        if(arr1[i].id==arr2[j].id){
                            arr2[j]._checked = true;
                        }
                    }
                }
            },
            /* 模态框的确定事件 */
            ok () {
                let vm = this;
                let arrs = [];
                /*
                 点击确定的时候
                 显示的数据和已经勾选的数据进行比对
                 如果id相同，那么就使用显示的数据的数量
                 否则默认为1
                */
                var arrs1 = vm.defaultList; // 勾选
                var arrs2 = vm.$store.getters.testData; // 显示
                if(!!!arrs2.length){
                    vm.defaultList.forEach((item,index)=>{
                        item.physicalNumber = 1;
                        arrs.push(item);
                    });
                }else{
                    for(var i = 0;i<arrs1.length;i++){
                        var _switch = true;
                        for(var j = 0;j<arrs2.length;j++){
                            if(arrs1[i].id == arrs2[j].id){
                                _switch = false;
                            }
                            // 新添加的勾选 
                            if(j == arrs2.length - 1&&!!_switch){
                                arrs2[j].physicalNumber = 1;
                                arrs.push(arrs2[j]);
                            }
                            if(j == arrs2.length - 1&&!!!_switch){
                                arrs.push(arrs1[i]);
                            }
                        }
                    }
                }
                this.$store.commit('TEST_DATA',arrs);
                this.showList = vm.$store.getters.testData;
                vm.fnGetData();
            },
            /* 打开模态框时的回调函数 */
            fnOpenModal () {
                let vm = this;
                /* 初始化配置 */
                vm.table.pageNun = 1;
                vm.showList = vm.$store.getters.testData;
                /* vm.showList = [
                    {
                        'id':201,
                        'physicalName':'面膜',
                        'physicalNumber':10
                    }
                ]; */
                if(!!!vm.showList.length){
                    vm.defaultList = [];
                }else{
                    vm.defaultList = vm.showList; // 展示的数据赋值给已经勾选的数据
                }
                vm.getData();
                vm.usingRange = true; // 模态框显示
            },
            /* 数据获取 */
            getData () {
                let vm = this;
                /* ajax的配置 */
                let start = vm.table.pageNun; // 从第几个开始
                let size = vm.table.size; // 每页条数
                let url = common.path2+"productPhysical/front/findByPage?pageNo="+start+'&pageSize='+size;
                let ajaxData = {};
                vm.table.loading = true; // 加载动画开启

                /* 获取所有产品数据 */
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
                    // 分页插件-总数量
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = oData.data.list;
                    // 加载动画的开关
                    vm.table.loading = false;
                    // 每一页请求回来的数据
                    vm.tempArr = oData.data.list;
                    // 复选框的选中状态的判断，vm.listId是选中的数据id，oData.data.list是每一页的数据
                    vm.selectOrNo(vm.defaultList,oData.data.list);
                }).catch(function(err){
                })
            },
            /* ======================================公共方法================================*/
            // 数组去重，arg1为原始数据，arg2为一个元素
            fnRemoveItemFromArrs (arrs,item) {
                var list = [];
                arrs.forEach((aItem,index)=>{
                    if(aItem.id != item.id){
                        list.push(aItem);
                    }
                })
                return list;
            },
            // 数组去重，arg1为原始数组，arg2为要被删除的数据
            fnRemoveArrFromArrs (arrs1,arrs2) {
                // 状态值  true 则加 false 则不加
                let list = [];
                for(var i = 0;i<arrs1.length;i++){
                    var _switch = true;
                    for(var j = 0;j<arrs2.length;j++){
                        if(arrs1[i].id == arrs2[j].id){
                            _switch = false;
                        }
                        if(j == arrs2.length -1&&!!_switch){
                            list.push(arrs1[i]);
                        }
                    }
                }
                return list;
            },
            // showList发生变化时，重新过滤数据
            fnGetData() {
                let vm = this;
                var startNum = (+vm.table1.pageNun-1)*+vm.table1.size;
                var endNum = +vm.table1.pageNun*+vm.table1.size;
                var arrs1 = [];
                let arrs = vm.showList;
                for(var b = 0;b<arrs.length;b++){
                    if(b>=startNum&&b<endNum){
                        arrs1.push(arrs[b]);
                    }
                }
                vm.showList1 = arrs1;
                vm.table1.recordsTotal = arrs.length;
            },
             /* 分页回掉函数 */
            changePage1 (page) {
                let vm = this;
                vm.table1.pageNun = page;   
                vm.fnGetData();          
            },
             /* 页码改变的回掉函数 */
            changeSize1 (size) {
                let vm = this;
                vm.table1.size = size;
                vm.fnGetData();
            },
        },
        mounted: function(){
            let vm = this;
            this.showList = this.$store.getters.testData; // 展示的数据
            vm.fnGetData();
            /* 进来的时候，让勾选的数据等于展示的数据 */
            if(!!this.showList.length){
                this.defaultList = this.showList;
            }
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList();
        },
        components:{
        },
    }
</script>
<style scoped>
    .testWrap{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px; top:0px;
        z-index: 1;
        padding:5px 10px 10px 10px;
    }
    .fl{
        float: left; 
    }
    .fr{
        float: right;
    }
    .aLine{
        border-left: 1px solid #dddee1; 
        border-right: 1px solid #dddee1; 
        border-bottom: 1px solid #dddee1;
        height: 48.15px;
        line-height: 48.15px;
    }
</style>