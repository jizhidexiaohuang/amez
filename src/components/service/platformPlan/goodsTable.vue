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
                        <Form :model="cd" inline>
                            <FormItem style="margin-bottom:10px;">
                                员工类型
                                <Select v-model="cd.beauticianType" style="width:100px">
                                    <!--<Option v-for="item in branchList" :value="item.id" :key="item.id">{{ item.brandName }}</Option>-->
                                    <Option :value="1" :key="1">店长</Option>
                                    <Option :value="2" :key="2">正式员工</Option>
                                    <Option :value="3" :key="3">兼职员工</Option>
                                </Select>
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
                        <Table
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
    </div>
</template>
<script>
    import common from '../../../base.js'
    export default {
        data () {
            return {
                usingRange:false,
                tempArr:[],
                cityConfig:{
                    key:false,
                    title:'地区',
                    type:'select'
                },
                listId:[],
                branchList:[

                ],
                cd:{
                    beauticianType:''
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
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
                }
            }
        },
        /* computed:{
            getBusinessId(){
                return this.$store.getters.businessId;
            }
        }, */
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path2+"productPhysical/front/findByPage?pageNo="+start+'&pageSize='+size;
                let ajaxData = {

                }
                if(!!vm.cd.beauticianType){
                    ajaxData.beauticianType = vm.cd.beauticianType;
                }
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
                    // 分页插件-总数量
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = oData.data.list;
                    // 加载动画的开关
                    vm.table.loading = false;
                    // 复选框的选中状态的判断，vm.listId是选中的数据id，oData.data.list是每一页的数据
                    vm.selectOrNo(vm.listId,oData.data.list)
                    vm.tempArr = oData.data.list;
                }).catch(function(err){
                })
            },
            /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 5;//页数
                vm.cityConfig.key = true;

                vm.cd.beauticianType = '';
            },
            ievent(data){
                this.cityConfig.key = data;
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
                this.listId.push(row.id);
            },
            // 取消选中某一项的回调函数
            fnCancel(selection,row){
                this.remove(this.listId,row.id);
            },
             /* 全选时的回调函数 */
            fnSelectAll (selection) {
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
            },
            // 选中项改变
            fnChange(selection){
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
            /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            /* 刷新 */
            refreshTable () {
                var vm = this;
                vm.table.pageNun = 1;
                vm.table.size = 10;
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
            ok () {
                this.$Message.info('成功');
                this.$store.commit('PRODUCT_LIST',this.listId);
            },
            fnOpenModal () {
                this.listId = this.$store.getters.productList;
                this.getData();
                this.usingRange = true;
            }
        },
        mounted: function(){
            
            // this.getData();
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
</style>