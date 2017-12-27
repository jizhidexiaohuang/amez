<template>
    <div>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"/>
        <!-- 编辑容器 -->
        <div v-if="pageType == 'edit'" class="testWrap">
            编辑
        </div>
        <!-- 详情容器 -->
        <infoPage v-if="pageType == 'info'"  class="testWrap" :message="parentMsg" v-on:returnList="changePageType"/>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <Row style="margin-bottom:10px;">
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
            <Table
                :loading="loading" 
                :data="tableData1" 
                :columns="tableColumns1" 
                stripe
                border
                @on-select="fnSelect"
                @on-select-all="fnSelectAll"
            ></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page 
                        :total="recordsTotal" 
                        :current="pageNun"
                        show-sizer 
                        @on-change="changePage"
                        @on-page-size-change="changeSize"
                    ></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import expandRow from './table-expand.vue'
    import infoPage from './info.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                src:'../../../static/images/footer/1_1.png',
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
                tableData1: [],
                parentMsg:'',
                tableColumns1: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '服务项目',
                        key: 'orderNo',
                        render:(h,params)=>{
                            return h('div',[
                                // h('img',{
                                //     attrs:{
                                //         src:params.row.productImg
                                //     },
                                //     style:{
                                //         width:'60px',
                                //         height:'60px',
                                //         marginRight:'8px',
                                //         verticalAlign:'middle'
                                //     }
                                // }),
                                h('span',params.row.productName)
                            ])
                        }
                    },
                    {
                        title: '单价',
                        key: 'payTime',
                        render: (h,params) =>{
                            return "1000"
                        }
                    },
                    {
                        title: '订单总价',
                        key: 'amountTotal',
                    },
                    {
                        title: '服务状态',
                        key: 'status',
                        render:(h,params) =>{
                           console.log(params.row.status)
                           let status = params.row.status;
                           let text = ''
                            if(status==0){
                                text = '待付款'
                            }else if(status==1){
                                text = '交易关闭'
                            }else if(status==2){
                                text = '待服务'
                            }else if(status==3){
                                text = '退款中'
                            }else if(status==4){
                                text = '待评价'
                            }else if(status==5){
                                text = '评价完成'
                            }
                           return h('div',text)
                        }
                    },
                    {   
                        title: '应/实付金额',
                        key: 'amountReduce',
                        render:(h,params)=>{
                            return h('div',params.row.amountTotal-(params.row.amountReduce?params.row.amountReduce:0))
                        }
                    },
                    {   
                        title: '美容院',
                        key: 'storeName',
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.storeName),
                                h('div',params.row.addressPhone),
                            ])
                        }
                    },
                    {   
                        title: '订单类型',
                        key: 'type',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.type==0){
                                str = '到店服务'
                            }else{
                                str = '上门服务'
                            }
                            return h('div',str)
                        }
                    },
                    // {   
                    //     title: '买家信息',
                    //     key: 'addressReveiver',
                    //     render:(h,params)=>{
                    //         if(params.row.type==1){
                    //             return h('div',[
                    //                 h('p',params.row.memberRealName),
                    //                 h('p',params.row.addressPhone),
                    //             ])
                    //         }else{
                    //             return h('div',[
                    //                 h('p',params.row.memberNickName ),
                    //                 h('p',params.row.addressPhone),
                    //             ])
                    //         }
                    //     }
                    // },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        // fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            // this.show(params.index)
                                            this.changePageType('info');
                                            this.parentMsg = params.row.id
                                        }
                                    }
                                }, '查看'),
                            ]);
                        }
                    }
                ],
                test:1,
                recordsTotal:0,
                pageNun:1,
                loading: false,
                size: 10,
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.pageNun = page;   
                vm.getData();             
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            },
            /* 数据获取 */
            getData () {
                let vm = this;
                let start = (vm.pageNun-1)*vm.size;//从第几个开始
                let size = vm.size;//每页条数
                // let path_test = "http://120.79.42.13:8080/";
                let url = common.path+"orderBase/front/findByPage";
                let ajaxData = {
                    pageNo:start,
                    pageSize: size
                }
                vm.loading = true;
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res.data.data);
                    let oData = res.data
                    vm.recordsTotal = oData.total;
                    vm.tableData1 = res.data.data.list;
                    vm.loading = false;
                }).catch(function(err){
                })
            },
            /* 查看详情 */
            show (index) {
                this.$Modal.info({
                    title: '老师活动详情',
                    content: `老师名称：${this.tableData1[index].teacherName}<br>老师类型：${this.tableData1[index].typeName}<br>活动类型：${this.tableData1[index].typeName}`
                })
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.size = size;
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
            changePageType (type) {
                this.pageType = type;
            },
            /* 刷新 */
            refreshTable () {
                var vm = this;
                vm.pageNun = 1;
                vm.size = 10;
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
            infoPage,
            expandRow,
        }
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