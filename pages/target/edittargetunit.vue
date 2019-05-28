<template>
  <div class="container">
    <Row span="12">
      <h4 style="padding:10px;">指标单位</h4>
    </Row>
    <div class="box">
      <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        label-position="top">
        <Row style="padding-bottom:25px;">
          <Col span="12">
                <FormItem 
                label="StatItemId" 
                prop="StatItemId">
                    <Select v-model="formData.StatItemId" clearable>
                            <Option v-for="item in StatItemIdList" :value="item.statitemId.toString()" :key="item.statitemId">{{ item.StatItemName }}</Option>
                    </Select>
                </FormItem>
            </Col>
        </Row>
        <Row style="padding-bottom:25px;">
          <Col span="12">
                <FormItem 
                label="StatItemUnitName" 
                prop="StatItemUnitName">
                <Input 
                    v-model="formData.StatItemUnitName" 
                    type="text" :maxlength="50"
                    placeholder=""></Input>
                </FormItem>
            </Col>
        </Row>

        <FormItem style="text-align:left;">
          <Button @click="doCancelled()">&nbsp;&nbsp;取消&nbsp;&nbsp;</Button>
          <Button type="primary" @click="doBeforeSubmit('form')">&nbsp;&nbsp;确认&nbsp;&nbsp;</Button>
        </FormItem>
      </Form>
    </div>
    

  </div>
</template>


<script>
import config from '~/app.config.js'
import {
  mapState
} from 'vuex'
export default {
  layout: 'withTopMenu',
  data() {
    return {
      Id:'',
      formRules: {
        StatItemName: [{
          type: 'string',
          required: true,
          message: '请输入StatItemName',
          trigger: 'blur'
        }],
        StatItemCode: [{
          type: 'string',
          required: true,
          message: '请输入StatItemCode',
          trigger: 'blur'
        }],
      },
      formData: {
        StatItemId: "",
        StatItemUnitName: "",
      },
      loading:false,
      StatItemIdList:[],
      currentPage:1,
      pageSize:10,
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  mounted() {
    this.Id= this.$route.query.Id
    this.queryData()
  },
  methods: {
    queryData() {
      let that=this;
      
      //StatItemIdList
      this.$axios.get(('/api/Home/StatItem?PageIndex='+this.currentPage+'&PageSize='+this.pageSize)).then(rs => {
            if (rs.data.success) {
                that.StatItemIdList=rs.data.data;
            } else {
                that.StatItemIdList=[];
            }

            if(this.Id){
              this.$Loading.start()
              this.$axios.get('/api/Home/StatItemUnitInfo?Id='+this.Id).then(rs => {
                  this.$Loading.finish()
                  if (rs.data.success) {
                    let obj = rs.data.data;
                    Object.keys(obj).forEach(function(key){
                        that.formData[key]=obj[key].toString();
                    });
                  } else {
                    this.$Message.error(rs.data.message)
                  }
              })
            }
        })

      
    },
    // 提交前操作
    doBeforeSubmit(name) {
      // 表单验证
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading=true;
          this.doSubmit();
        }
      })
    },
    // 提交
    doSubmit() {
      let that = this;
      if(that.Id){
        let data = {};

        let obj = that.formData;
        Object.keys(obj).forEach(function(key){
            data[key]=obj[key];
        });

        that.$axios.post('/api/Home/StatItemUnitModify', data).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/target/targetunit')}, 1000);
          } else {
            that.$Message.error(result.message)
          }
        })

      }else{
        let data = {};

        let obj = that.formData;
        Object.keys(obj).forEach(function(key){
            data[key]=obj[key];
        });

        that.$axios.post('/api/Home/StatItemUnitAdd', data).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/target/targetunit')}, 1000);
          } else {
            that.$Message.error(result.message)
          }
        })
      }
      

    },
    doCancelled() {
        this.$router.go(-1)
    },
    

  }
}
</script>


<style lang="scss" scoped>
.container{
    //padding-top:8vh;
    width:100%;
    //height: 92vh;

        .box{
            width:90%;
            margin: 2rem auto;
            text-align: left;
            .add{
                width:3rem;
                height:3rem;
                background-color: #bbb;
                display:flex;
                justify-content: center;
                align-items: center;
                img{
                    width:40%;
                    height:40%;
                }
            }
            .pic{
                width:3rem;
                height:3rem;
                background-color: #f5f5f5;
                display:flex;
                justify-content: center;
                align-items: center;
                img{
                    width:100%;
                    height:100%;
                }

            }



        }



   
}


</style>
