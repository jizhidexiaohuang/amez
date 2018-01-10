<template>
    <div class="boxStyle">
        <div class="phone-box">
            <div class="header">
                <div></div>
            </div>
            <div class="body">
                <!--
                <div 
                    class="color-item" 
                    v-for="(color,index) in colors" v-dragging="{ item: color, list: colors, group: 'color' }"
                    :key="color.text"
                    @click="fnClick(index)"
                >
                    <Poptip placement="right">
                        <div class="modal-item">
                            <div>{{ color.type }}</div>
                        </div>
                        <div class="api" slot="content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>版本号</th>
                                        <th>更新时间</th>
                                        <th>说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>0.9.5</td>
                                        <td>2016-10-26</td>
                                        <td>新增信息提示组件 <code>Tooltip</code>和<code>Poptip</code></td>
                                    </tr>
                                    <tr>
                                        <td>0.9.4</td>
                                        <td>2016-10-25</td>
                                        <td>新增对话框组件 <code>Modal</code></td>
                                    </tr>
                                    <tr>
                                        <td>0.9.2</td>
                                        <td>2016-09-28</td>
                                        <td>新增选择器组件 <code>Select</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Poptip>
                </div>
                -->
                <div @click="fnClickItem(1)" :class="['item','banner-item',index == 1?'active':'']">
                    <div class="title" v-if="">轮播图</div>
                    <div class="item-edit-box">
                        <div class="edit-box-inner"></div>
                        <div class="arrow"></div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div></div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                colors: [{
                    text: "Aquamarine",
                    type: 0,
                }, {
                    text: "Hotpink",
                    type: 1,
                }, {
                    text: "Gold",
                    type: 2,
                }, {
                    text: "Crimson",
                    type: 3,
                }],
                index: "",// 当前选中哪个编辑区域
            }
        },
        methods: {
            fnClick (index) {
                console.log(index);
            },
            fnClickItem (i) {
                console.log(1);
                let vm = this;
                vm.index = i;
            }
        },
        mounted: function(){
            this.$dragging.$on('dragged', ({ value }) => {
                console.log(value.item)
                console.log(value.list)
                console.log(value.otherData)
            })
        },
        components:{
        }
    }
</script>
<style lang='scss' scoped>
.color-item{
    width: 100%; min-height:140px; 
    border: 1px solid red;
}
.phone-box{
    margin-left: 100px;
    margin-top: 50px;
    width: 320px; min-height: 500px;
    position:relative;
    .header{
        height: 50px; line-height: 50px; 
        width: 100%;
        background: #000;
        border-radius: 20px 20px 0px 0px;
        overflow: hidden;
        div{
            width: 60px; height: 5px;
            background: #3d3d3d;
            margin: 0 auto;
            margin-top: 20px;
            border-radius: 5px;
        }
    }
    .footer{
        height: 50px; line-height: 50px;
        width: 100%;
        background:#000;
        border-radius: 0px 0px 20px 20px;
        overflow: hidden;
        div{
            width: 30px; height: 30px; 
            border-radius: 50%; 
            border: 3px solid #3d3d3d;
            margin: 0 auto;
            margin-top: 10px;
        }
    }
    .body{
        width: 100%; 
        border-left: 9px solid #000;
        border-right: 9px solid #000;
    }
}
.modal-item{
    width:320px;
    height: 140px;
    padding-right:20px;
}
.ivu-poptip-popper{
    left: 320px;
}

.item{
    position: relative;
}
.banner-item{
    width: 100%;
    height: 150px;
    border: 2px solid #ccc;
    .title{
        width: 100%; height: 100%;
        text-align:center;
        line-height: 150px;
    }
}
.item-edit-box{
    position: absolute;
    min-height: 150px;
    width: 420px;
    right: -445px;
    top: -2px;
    .edit-box-inner{
        border:1px solid #d1d1d1;
        border-radius: 5px;
        background: #f8f8f8;  
        height: 160px;
    }
    .arrow{
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 7px 6px 0;
        border-color: transparent #d1d1d1 transparent transparent;
        position: absolute;
        left: -6px;
        top: 19px;
    }
    .arrow:after{
        content: "";
        border-right-color: #f8f8f8;
        left: 2px;
        top: -6px;
    }
}
.active{
    border: 2px dashed red;
}

</style>