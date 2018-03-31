<template>
  <div style="width:700px;margin-top:10px;" v-if="serviceCtrl">
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
                serviceCtrl:false,
                pageType: 'list',
                openPage: false,
                listId:[],
                tableColumns1: [
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '服务名称',
                        key: 'serverName',
                    },
                    {
                        title: '原价',
                        key: 'salePrice',
                        render:(h,params)=>{
                            return h('div','￥'+params.row.salePrice/100);
                        }
                    },
                    {
                        title: '折后价',
                        key: 'salePrice',
                        render:(h,params)=>{
                            if(this.discount){
                                return h('div','￥'+(params.row.salePrice*this.discount/100));
                            }else{
                                return h('div','￥'+params.row.salePrice*1);                                
                            }
                        }
                    }
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
        props:['discount'],
        computed:{
            getServiceId(){
                return this.$store.getters.serviceId;
            }
        },
        methods:{
             /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData(vm.listId); 
            },
             /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.table.size = size;
                vm.getData(vm.listId);
            },
            // 请求更新数据
            getData(listId){
                let vm = this;
                if(vm.table.pageNun == Math.ceil(vm.table.recordsTotal/vm.table.size)){
                    console.log('最后一页了');
                    if(listId.length<=((vm.table.pageNun-1)*vm.table.size)){
                        vm.table.pageNun = vm.table.pageNun - 1;
                    }
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let ajaxData = {
                    productIdList:listId
                }
                let url = this.common.path2+'product/findByPageForMemberCard?pageNo='+start+'&pageSize='+size;
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(res=>{
                    console.log(res)
                    let oData = res.data.data;
                    vm.table.tableData1 = oData.list;
                    vm.table.recordsTotal = oData.total;
                    vm.table.loading = false;
                })
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
                console.log(row);
            },
            // 取消选中某一项的回调函数
            fnCancel(selection,row){
                console.log(row)
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
            getServiceId:{
                deep:true,
                handler(val){
                    console.log(val)
                    this.listId = val;
                    if(val.length!=0){
                        this.getData(val);
                        this.serviceCtrl = true;
                    }else{
                        this.serviceCtrl = false;
                    }
                }
            },
            discount:{
                deep:true,
                handler(val){
                    if(!val){
                        this.discount = 1;
                        console.log(val)
                    }
                }
            }
        }
    }
</script>
<style scoped lang="scss">

</style>
