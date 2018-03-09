<template>
  <div class="testWrap">
      <div class="boxStyle editPage">
        <h2>查看连锁品牌</h2>
        <h3>品牌名称：{{data.brandName}}</h3>
        <div><h3>品牌Logo:
            <img :src="data.brandLogo" alt=""></h3>
        </div>
        <h3>品牌所属公司：{{data.brandOwnershipCompany}}</h3>
        <Button type="success" @click.native="returnHome('list')">返回</Button>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    export default {
        data () {
            return {
                data:'',//返回的数据  
            }
        },
        methods:{
            returnHome(type){
                this.$emit('returnList',type)
            },
            
            getUploadList(data){
                let vm = this;
                vm.brandLogo = data;
            },
            //根据id查数据
            getDataById(id){
                let url = common.path2+'storeChainBrand/queryById/'+id;
                this.$http.get(url).then(res=>{
                    this.data = res.data.data;
                    console.log(this.data)
                })
            }
        },
        beforeMount:function(){
            // this.getDataById(this.infoId);
        },
        mounted:function(){
            this.getDataById(this.infoId);
        },
        components:{
            
        },
        props:['infoId']
    }
</script>
<style lang="scss" scoped>
.editPage{
    h2{
        margin-bottom:10px;
    }
    img{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
        vertical-align: middle;
    }
}
</style>