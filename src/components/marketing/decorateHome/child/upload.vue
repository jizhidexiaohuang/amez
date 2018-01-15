<template>
    <div>
        <div class="demo-upload-list" v-for="(item,index) in uploadList" v-dragging="{ item: item, list:uploadList,group:'myId'}" :key="item.myId">
            <template v-if="item.status === 'finished'">
                <img style="width:60px; height:60px;" :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item,index)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item,index)"></Icon>
                </div>
                <div class="demo-upload-text" style="">
                    <!--
                    <div>
                        <input type="text" placeholder="请输入链接地址"/>
                    </div>
                    <div>
                        <input type="text" placeholder="请输入链接地址"/>
                    </div>
                    -->
                    <Form label-position="left">
                        <FormItem label="链接">
                            <Input class="aText" v-model="item.src" placeholder="请输入链接地址"></Input>
                        </FormItem>
                    </Form>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="http://120.79.42.13:8080/system/api/file/uploadFile"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="图片预览" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                imgName: '',
                visible: false,
                uploadList: [],
                curIndex: ''
            }
        },
        props: ["defaultList","uploadConfig"],
        methods: {
            /*======================上传图片  start=======================*/
            handleView (data,index) {
                this.imgName = data.url;
                this.curIndex = index;
                this.visible = true;
            },
            handleRemove (file,i) {
                let vm = this;
                /* let curArrs = [];
                let oldArrs = vm.uploadList;
                oldArrs.forEach(function(item,index){
                    if(i!=index){
                        curArrs.push(item)
                    }
                });
                vm.uploadList = curArrs; */
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.$emit("listenUpload",this.uploadList);
            },
            handleSuccess (res, file) {
                // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.url = res.data;
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
                file.src = '';
                file.myId = +(new Date());
                this.$emit("listenUpload",this.uploadList);
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {
                let num = this.uploadConfig.num||5;
                let title = '最多可以上传'+ num + '张照片';
                const check = this.uploadList.length < num;
                if (!check) {
                    this.$Notice.warning({
                        title: title
                    });
                }
                return check;
            },
            /*======================上传图片  end=======================*/
        },
        mounted: function(){
            this.uploadList = this.$refs.upload.fileList;
            console.log(this.uploadList);
        },
        watch:{
            uploadList (curVal,oldVal) {
                // console.log("新值:"+curVal);
                // console.log("旧值:"+oldVal);
                this.$emit("listenUpload",this.uploadList);
            },
        },
    };
</script>
<style scoped>
    .demo-upload-list{
        display: inline-block;
        width:100%;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        margin-right: 4px;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-bottom: 5px;
        z-index:999;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        line-height: 60px;
        display: none;
        position: absolute;
        height: 60px;
        top: 0px;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
        width: 60px; text-align:center;
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .demo-upload-text{
        position:absolute;
        height: 60px; 
        left: 70px; right: 0px; 
        top: 0px;
    }
    .demo-upload-text div input{
        background: #fff;
        height: 30px;
        line-height: 30px;
        display: block;
    }
    .aText{
        height: 30px;
        margin-bottom: 4px;
    }
    .ivu-input-wrapper{
        width: 70%;
    }
</style>