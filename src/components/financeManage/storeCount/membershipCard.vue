<template>
  <div class="">
      
      <Table
        :loading="table.loading" 
        :data="table.tableData1" 
        :columns="tableColumns1" 
        ref="table"
        stripe
        border
        @on-select="fnSelect"
        @on-select-all="fnSelectAll"
    ></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page 
                :total="table.recordsTotal" 
                :current="table.pageNun"
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
        data() {
            return {
                table:{
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                    tableData1: [],
                },
                tableColumns1:[
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'beauticianName',
                    },
                    {
                        title: '姓名',
                        key: 'beauticianName',
                    }
                ]
            }
        },
        methods:{
            /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;
                vm.getData();             
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
                console.log(row);
                console.log(selection);
            },
            /* 全选时的回调函数 */
            fnSelectAll (selection) {
                console.log(selection);
            },
            getData(){
                let vm = this;
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = this.common.path2 +"storeBeautician/front/findByPage?pageNo="+start+'&pageSize='+size;
                vm.table.loading = true;
                let ajaxData = {};
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = oData.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            }
        },
        beforeMount: function(){
            this.getData();
        },
    }
</script>
<style lang="scss" scoped>

</style>
