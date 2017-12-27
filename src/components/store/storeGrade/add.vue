<template>
  <div class="testWrap">
      <div class="addPage boxStyle">
        <h2>新增店铺等级</h2>
        <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 80%">
            <FormItem>
                <Row>
                    <Col span="3" style="text-align:center;">店铺等级</Col>
                    <Col span="3" style="text-align:center;">成长值范围</Col>
                    <Col span="3" style="text-align:center;">排序</Col>
                    <Col span="3" style="text-align:center;">等级图标</Col>
                </Row>
            </FormItem>
            <FormItem
                    v-for="(item, index) in formDynamic.items"
                    v-if="item.status"
                    :key="index"
                    :prop="'items.' + index + '.value'"
                    >
                <Row>
                    <Col span="3" style="padding:0 10px;">
                        <Input type="text" v-model="item.grade"></Input>
                    </Col>
                    <Col span="3">
                        <Row>
                            <Col span="10"><Input type="text" v-model="item.min"></Input></Col>
                            <Col span="2">---</Col>
                            <Col span="10"><Input type="text" v-model="item.max"></Input></Col>
                        </Row>
                    </Col>
                    <Col span="3" style="text-align:center;">
                        <InputNumber :max="10" :min="1" v-model="item.sort"></InputNumber>
                    </Col>
                    <Col span="3" style="text-align:center;">
                        <Upload action="//jsonplaceholder.typicode.com/posts/">
                            <Button type="ghost" icon="ios-cloud-upload-outline">上传照片</Button>
                        </Upload>
                    </Col>
                    <Col span="2" offset="1">
                        <Button type="error" @click="handleRemove(index)">删除</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="3">
                        <Button type="success" long @click="handleAdd" icon="plus-round">增加店铺等级</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formDynamic')">保存</Button>
                <Button type="ghost" @click="handleReset('formDynamic')" style="margin:0px 8px">取消</Button>
                <Button type="success" @click.native="returnHome('list')">返回</Button>
            </FormItem>
        </Form>
      </div>
  </div>
</template>
<script>
    import common from '../../../base.js'
    export default {
        data () {
            return {
                index: 1,
                formDynamic: {
                    items: [
                        {
                            grade:'',//门店等级
                            min:'',//最小值
                            max:'',//最大值
                            sort:1,//排序
                            index: 1,
                            status: 1
                        }
                    ]
                }
            }
        },
        methods:{
            returnHome(type){
                this.$emit('returnList',type)
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleAdd () {
                this.index++;
                this.formDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            handleRemove (index) {
                this.formDynamic.items[index].status = 0;
            }
        }
    }
</script>
<style lang='scss' scoped>

</style>

