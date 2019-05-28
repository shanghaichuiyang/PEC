<template>
  <div class="container">
    <Row span="12">
      <h4 style="padding:10px;">单位管理</h4>
    </Row>
    <div class="box">
      <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        label-position="left"
        :label-width="100">
        <Row style="padding-bottom:25px;">
            <Col span="12">
                <FormItem 
                label="单位名称" 
                prop="UnitName">
                <Input 
                    v-model="formData.UnitName" 
                    type="text" :maxlength="50"
                    placeholder=""></Input>
                </FormItem>
            </Col>
        </Row>
        <Row style="padding-bottom:25px;">
            <Col span="12">
                <FormItem 
                label="单位类型" 
                prop="UnitType">
                <Select v-model="formData.UnitType">
                    <Option v-for="item in UnitTypeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
                
                </FormItem>
            </Col>
            
        </Row>
        <Row style="padding-bottom:25px;">
            <Col span="12">
                <FormItem 
                label="备注" 
                prop="Remark">
                <Input 
                type="textarea" :rows="4"
                v-model="formData.Remark" 
                :maxlength="100"
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
      picShow:false,
      pictureSrc:null,
      ID:'',
      file:null,
      picUrl:null,
      formRules: {
        UnitName: [{
          type: 'string',
          required: true,
          message: '请输入公司名称',
          trigger: 'blur'
        }],
        UnitType: [{
          type: 'number',
          required: true,
          message: '请选择公司类型',
          trigger: 'blur'
        }],
        Remark: [{
          type: 'string',
          required: false,
          trigger: 'blur'
        }],
        
      },
      formData: {
        UnitName: "",
        UnitType: "",
        Remark: "",
        
      },
      UnitTypeList:[
          {"value":1,"name":"设计单位"},
          {"value":2,"name":"监理单位"},
          {"value":3,"name":"施工单位"},

      ]
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  mounted() {
    this.picUrl = config.urlhost+'/'
    this.ID= this.$route.query.id
    this.queryData()
  },
  methods: {
    queryData() {
      if(this.ID){
        this.$Loading.start()
        this.$axios.post('/api/Home/SelectUnitInfo', {
            Id:this.ID
        }).then(rs => {
            this.formData = rs.data.data;

            //加工数据
            //this.formData.Id=this.formData.UserID;

            this.$Loading.finish()
            if (rs.data.success) {

            } else {
              this.$Message.error(rs.data.message)
            }
        })
      }
    },
    handleUpload (file) {
        this.pictureSrc = window.URL.createObjectURL(file)
        this.picShow=true
        this.file = file
        return false
    },
    changeStats(status) {
        this.formData.ControlOver= status
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
      if(that.ID){
        let data = {};
        //加工数据
        //that.formData.IsFree= this.formData.IsFree?true:false;

        let obj = that.formData;
        Object.keys(obj).forEach(function(key){
            data[key]=obj[key];
        });

        that.$axios.post('/api/Home/UpDateUnitInfo', data).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/system/companyManagement')}, 1000);
          } else {
            that.$Message.error(result.message)
          }
        })
      }else{
        that.$axios.post('/api/Home/AddUnitInfo', {
          UnitName:that.formData.UnitName,
          UnitType:that.formData.UnitType,
          Remark:that.formData.Remark,
          Status:1,
          Phone:that.account.Phone,
          Admin:that.account.UserName,
        }).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/system/companyManagement')}, 1000);
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
