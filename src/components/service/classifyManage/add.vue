<template>
    <div>
        <Form class="boxStyle" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px;">
            <FormItem  label="分类名称" prop="categoryName">
                <Input v-model="formValidate.categoryName" placeholder="请填写分类名称"></Input>
            </FormItem>
            <FormItem label="图片地址" prop="img" style="position:absolute; left:-9999px;">
                <Input v-model="formValidate.img" placeholder=""></Input>
            </FormItem>
            <FormItem label="图标">
                <MyUpload :defaultList="defaultList" :uploadConfig="uploadConfig" v-on:listenUpload="getUploadList"></MyUpload>
            </FormItem>
            <FormItem  label="状态">
                <iSwitch size="large" v-model="switch1" @on-change="changeSwitch1">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </iSwitch>
            </FormItem>
            <!-- 店铺选择  只有管理员可以看到 -->
            <FormItem label="所属门店" prop="storeName" style="width:500px;" v-if="false">
                <Input v-model="storeName" placeholder="请选择所属门店" @click.native="selectStore"></Input>
                <div class="tableBox" v-show="tableCtrl">
                    <Table
                        :loading="table.loading" 
                        :data="table.tableData1" 
                        :columns="tableColumns1" 
                        stripe
                        border
                        size="small"
                        @on-current-change="fnHighlight"
                        :show-header="false"
                        :stripe="false"
                        highlight-row
                        height="150"
                    ></Table>
                    <div style="overflow: hidden;" class="pageBox">
                        <div style="float: right;">
                            <Page 
                                size="small"
                                :total="table.recordsTotal" 
                                :current="table.pageNun"
                                @on-change="changePage"
                                @on-page-size-change="changeSize"
                            ></Page>
                        </div>
                    </div>
                </div>
            </FormItem>
            <FormItem>
                <Button :disabled="!!btnCode" type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handReturn('list')" style="margin-left: 8px;">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import MyUpload from '../../common/upload.vue'
    export default {
        data () {
            return {
                btnCode: false,
                formValidate: {
                    categoryName: '',// 分类名称
                    categoryLogo:'',//图片地址
                    pid: 0,//父类id
                },
                ruleValidate: {
                    categoryName: [
                        {required: true, message: '请填写分类名称', pattern: /.+/, trigger: 'change'}
                    ],
                },
                defaultList: [],
                uploadList:[],//图片列表
                path:this.common.path1+"system/api/file/uploadForKindeditor",
                serviceList:[],// 产品分类
                brandList:[],// 品牌分类
                switch1: false,
                uploadConfig: {
                    num:1
                },

                table:{
                    tableData1: [],
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                },
                tableColumns1: [
                    {
                        title: '店铺名称',
                        key: 'storeName'
                    }
                ],
                tableCtrl:false,
                storeId: '',
                storeName: '',
                isAdmin: false,
            }
        },
        props: ["sendChild"],
        methods: {
            // 提交验证
            handleSubmit (name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加品牌服务
                        let ajaxData = {
                            categoryName: vm.formValidate.categoryName, // 分类名称
                            categoryLogo: vm.uploadList.length>0?vm.uploadList[0].url:"",//封面图
                            pid: vm.formValidate.pid,// 父类id
                            isEnabled: !!!vm.switch1?0:1,//开启状态
                            categoryCode: 'CODE_XX', // 一级分类
                            storeId: vm.storeId, // 店铺id
                        }
                        let url = vm.common.path2+"productCategory/insert";
                        vm.btnCode = true;
                        vm.$http.post(
                            url,
                            JSON.stringify(ajaxData),
                            {
                                headers:{
                                    'Content-type':'application/json;charset=UTF-8'
                                }
                            }
                        ).then(function(res){
                            let oData = res.data
                            vm.$emit('returnList', 'list'); 
                            vm.btnCode = false;
                            vm.$Message.success('成功');
                        }).catch(function(err){
                            vm.btnCode = false;
                            vm.$Message.error('提交失败!');
                        })
                    } else {
                        vm.$Message.error('提交失败!');
                    }
                })
            },
            // 返回
            handReturn (val) {
                this.$emit('returnList', val); 
            },
            // 获取图片列表
            getUploadList (data) {
                let vm = this;
                vm.uploadList = data;
            },
            // 开关控制
            changeSwitch1 (status) {
            },
            /*表格选中高亮显示*/
            fnHighlight(currentRow,oldCurrentRow){
                this.storeName = currentRow.storeName;
                this.storeId = currentRow.id;
                this.tableCtrl = false;
            },
            // 点击所属门店输入框，显示或隐藏table
            selectStore(){
                if(this.tableCtrl){
                    this.tableCtrl = false;
                }else{
                    this.tableCtrl = true;
                }
            },
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
             /* 数据获取 */
            getData () {
                let vm = this;
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = vm.common.path2+"store/front/findByPage?pageNo="+start+'&pageSize='+size;
                let ajaxData = {
                }
                vm.loading = true;
                vm.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = oData.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
        },
        mounted: function(){
            let store = JSON.parse(window.localStorage.getItem("userInfo")).store;
            this.getData();
            if(store!=null){
                this.storeId = store.id;
                this.isAdmin = true;
            }
        },
        components:{
            MyUpload
        }
    }
</script>
<style scoped>
</style>

