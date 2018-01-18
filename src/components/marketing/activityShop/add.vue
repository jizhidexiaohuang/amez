<template>
  <div class="testWrap">
      <div class="addPage boxStyle">
          <h3>新增商家分组</h3>
          <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <FormItem label="分组名称" prop="groupName">
                  <Input style="width:300px;" v-model="formValidate.groupName"></Input>
              </FormItem>
              <FormItem label="选择商家" prop="selectBusiness">
                  <div class="box">
                      <div class="header">选择商家</div>
                      <div class="body">
                          <div class="leftTable">
                              <h4>待选门店</h4>
                              <Form :model="cd" inline>
                                <FormItem style="margin-bottom:10px; width:480px;">
                                    <Row>
                                        <Col span="18">
                                            <CityLinkage :cityConfig="cityConfig" v-on:listenCity="v=>{getCity(v,1)}"></CityLinkage>
                                        </Col>
                                        <Col span="4">
                                            <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                              </Form>
                              <Table
                                :loading="table.loading" 
                                :data="table.tableData1" 
                                :columns="tableColumns1" 
                                ref="table"
                                stripe
                                border
                                @on-select="fnSelect"
                                @on-select-all="fnSelectAll">
                              </Table>
                              <div style="margin: 10px;overflow: hidden">
                                <div style="float: right;">
                                    <Page 
                                    :total="table.recordsTotal" 
                                    :current="table.pageNun"
                                    show-sizer 
                                    @on-change="changePage"
                                    @on-page-size-change="changeSize">
                                    </Page>
                                </div>
                              </div>
                          </div>
                          <div class="rightTable">
                              <h4>已选门店</h4>
                              <Form :model="cd" inline>
                                <FormItem style="margin-bottom:10px; width:480px;">
                                    <Row>
                                        <Col span="18">
                                            <CityLinkage :cityConfig="cityConfig" v-on:listenCity="v=>{getCity(v,2)}"></CityLinkage>
                                        </Col>
                                        <Col span="4">
                                            <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                              </Form>
                              <Table
                                :loading="table.loading" 
                                :data="table.tableData1" 
                                :columns="tableColumns1" 
                                ref="table"
                                stripe
                                border
                                @on-select="fnSelect"
                                @on-select-all="fnSelectAll">
                              </Table>
                              <div style="margin: 10px;overflow: hidden">
                                <div style="float: right;">
                                    <Page 
                                    :total="table.recordsTotal" 
                                    :current="table.pageNun"
                                    show-sizer 
                                    @on-change="changePage"
                                    @on-page-size-change="changeSize">
                                    </Page>
                                </div>
                              </div>
                          </div>
                      </div>
                      <div class="footer">
                          <Button type="primary">确定</Button>
                          <Button type="ghost">取消</Button>
                      </div>
                  </div>
              </FormItem>
              <FormItem label="" prop="">
                  <Button type="primary" @click="handleSubmit('formValidate')" style="margin:0px 8px;">确定</Button>
                  <Button type="success" @click.native="returnHome('list')">取消</Button>
              </FormItem>
          </Form>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    import CityLinkage from '../../common/city.vue'
    export default {
        data (){
            return {
                cityConfig:{
                    key:false,
                    title:'区域',
                    type:'select'
                },
                cd:{
                    cityArr1:[],
                    cityArr2:[]
                },
                tableColumns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '店铺等级',
                        key: 'levelName',
                    },
                    {   
                        title: '成长值范围',
                        key: 'beginUpgradeValue',
                        render:(h,params)=>{
                            return h('div',params.row.beginUpgradeValue+'--'+params.row.endUpgradeValue)
                        }
                    }
                ],
                table:{
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                    tableData1: [],
                },
                formValidate:{
                    groupName:'',//分组名称
                    selectBusiness:'',//商家
                },
                ruleValidate:{

                }
            }
        },
        methods: {
            returnHome(type){
                this.$emit('returnList',type)
            },
            /* 分页回掉函数 */
            changePage (page) {
                console.log(page)
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            },
            getCity(data,type){
                console.log(data)
                console.log(type)
                if(type==1){
                    this.cityArr1 = data;
                }else if(type==2){
                    this.cityArr2 = data;
                }
            },
            /* 数据获取 */
            getData () {
                let vm = this;
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path+"storeLevel/findList?pageNo="+start+'&pageSize='+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size
                }
                vm.loading = true;
                this.$http.get(
                    url,
                    // ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res.data);
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.length;
                    vm.table.tableData1 = res.data.data;
                    vm.table.loading = false;
                }).catch(function(err){
                })
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
            fnBackformAdd (type) {
                this.changePageType(type);
                this.getData();
            },
            changePageType (type) {
                this.pageType = type;
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
                        vm.tableData1 = [];//为了处理进来的时候看到之前缓存的页面
                        vm.loading = true;//进一步模拟第一次进来时的页面效果
                        vm.pageType = 'list'//显示列表页，放在这里是给上边的处理留点时间，也就是初始化放在这段代码上边
                        vm.getData();//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            }
        },
        mounted: function(){
            this.getData();
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
<style lang="scss" scoped>
    h3{
        padding-bottom:8px;
        border-bottom:1px solid #dddee1;
    }
    form{
        margin-top:10px;
    }
    .box{
        border:1px solid #dddee1;
        .header{
            background: #afb3bd;
            padding-left:10px;
            font-size:16px;
            line-height: 34px;
        }
        .footer{
            background: #afb3bd;
            text-align: center;
            height: 45px;
            line-height: 45px;
            Button{
                margin:0 10px;
            }
        }
        .body{
            display: flex;
            .leftTable,.rightTable{
                flex: 1;
                padding:0px 5px;
            }
        }
    }
</style>
