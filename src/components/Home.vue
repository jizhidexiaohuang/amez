<template>
    <div class="">
        {{msg}}
    </div>
</template>

<script>
export default {
    name: 'home',
    data: function() {
         return {
            msg:"这是一个首页"
        }
    },
    activated:function(){

    },
    mounted: function() {
        this.fnIsEnter();
    },
    methods: {
        /* 是否有登录 */
        fnIsEnter () {
            if(!!!window.localStorage.getItem("userInfo")){
                alert("请先登录")
                this.$router.push("/login");
            }
        }
    },
    components:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
