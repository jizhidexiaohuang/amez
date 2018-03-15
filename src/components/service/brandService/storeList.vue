<template>
  <div style="width:700px;margin-top:10px;" v-if="businessCtrl">
        <Table
            :loading="table.loading" 
            :data="table.tableData1" 
            :columns="tableColumns1" 
            stripe
            border
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
</template>
<script>
    export default {
        data (){
            return {
                businessCtrl:false,
                pageType: 'list',
                openPage: false,
                listId:[],
                tableColumns1: [
                    {
                        title: '员工姓名',
                        width:200,
                        key: 'beauticianName',
                    },
                    {
                        title: '昵称',
                        key: 'beauticianNickName',
                    },
                    {
                        title: '联系方式',
                        key: 'phone',
                    },
                    {
                        title: '员工类型',
                        key: 'beauticianType',
                        render: (h,params) =>{
                            const row = params.row
                            if(row.beauticianType == 1){
                                return '店长'
                            }
                            if(row.beauticianType == 2){
                                return '正式员工'
                            }
                            if(row.beauticianType == 3){
                                return '兼职员工'
                            }
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
        computed:{
            getBusinessId(){
                return this.$store.getters.storeList;
            }
        },
        methods:{
             /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData(vm.listId); 
            },
             /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData(vm.listId);
            },
            // 请求更新数据
            getData(listId){
                let vm = this;
                if(vm.table.pageNun == Math.ceil(vm.table.recordsTotal/vm.table.size)){
                    if(listId.length<=((vm.table.pageNun-1)*vm.table.size)){
                        vm.table.pageNun = vm.table.pageNun - 1;
                    }
                }
                let start = vm.table.pageNun;
                let size = vm.table.size;//每页条数
                let ajaxData = {
                    "storeId":vm.$store.getters.storeId
                }
                let url = this.common.path2+'storeBeautician/front/findByPage?pageSize=100000';
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    let oData = res.data.data;
                    var arrs = [];
                    for(var i = 0;i<listId.length;i++){
                        for(var j = 0;j<oData.list.length;j++){
                            if(listId[i].id == oData.list[j].id){
                                arrs.push(oData.list[j]);
                            }
                        }
                    }
                    var startNum = (+vm.table.pageNun-1)*+vm.table.size;
                    var endNum = +vm.table.pageNun*+vm.table.size;
                    var arrs1 = [];
                    for(var b = 0;b<arrs.length;b++){
                        if(b>=startNum&&b<endNum){
                            arrs1.push(arrs[b]);
                        }
                    }
                    vm.table.tableData1 = arrs1;
                    vm.table.recordsTotal = arrs.length;
                    vm.table.loading = false;
                })
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
                        vm.getData(vm.listId);//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
        },
        watch:{
            getBusinessId:{
                deep:true,
                handler(val){
                    this.listId = val;
                    if(val.length!=0){
                        this.getData(val);
                        this.businessCtrl = true;
                    }else{
                        this.businessCtrl = false;
                    }
                }
            }
        },
        mounted: function () {
            let vm = this;
            let arrs = vm.$store.getters.storeList;
            this.listId = arrs;
            if(arrs.length>0){
                this.businessCtrl = true;
            }else{
                this.businessCtrl = false;
            }
            this.getData(arrs);
        }
    }
</script>
<style scoped lang="scss">

</style>
