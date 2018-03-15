<template>
  <div style="width:700px;margin-top:10px;"  v-if="!!tSwitch">
        <div>
            <Row>
                <Col span="8">产品名称</Col>
                <Col span="8">单位</Col>
                <Col span="8">数量</Col>
            </Row>
            <Row v-for="(item,index) in dataList">
                <Col span="8">{{ item.physicalName }}</Col>
                <Col span="8">{{ item.unit }}</Col>
                <Col span="8">{{ item.physicalNumber }}</Col>
            </Row>
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
</template>
<script>
    export default {
        props: ['sendData'],
        data (){
            return {
                table:{
                    recordsTotal:0,
                    pageNun:1,
                    size: 5,
                    option:[5, 10, 15, 20]
                },
                listId:[],
                dataList:[], // 最终提交的数据
                tSwitch: false,
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
                }
                let url = this.common.path2+'productPhysical/front/findByPage?pageSize=100000';
                /* 获取所有产品 */
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
                            if(listId[i] == oData.list[j].id){
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
                    vm.table.recordsTotal = arrs.length;
                })
            },
            // 显示的数据和勾选过来的数据进行比对
            fnChangeData (val) {
                let vm = this;
                let arrs1 = this.$store.getters.testData; // 包含数量的数据
                let arrs2 = val; // 被勾选的数据
                if(arrs1.length>0){
                    this.tSwitch = true;
                    /* 进行比较，如果a1和b1的id相等，那么就用a1的产品数量，如果没有，则默认为0 */

                }else{
                    this.tSwitch = false;
                    arrs2.forEach((item,index)=>{
                        item.physicalNumber = 1;
                        vm.dataList.push(item);
                    }); 
                }
            }
        },
        mounted: function () {
            let vm = this;
            this.fnChangeData(this.sendData);
        },
        watch:{
            sendData:{
                deep:true,
                handler(val){
                    this.fnChangeData(val);
                }
            }
        }
    }
</script>
<style scoped lang="scss">

</style>
