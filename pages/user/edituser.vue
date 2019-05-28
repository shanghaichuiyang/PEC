<template>
  <div class="container">
    <Row span="12">
      <h4 style="padding:10px;">用户信息管理</h4>
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
                label="姓名" 
                prop="UserName">
                <Input 
                    v-model="formData.UserName" 
                    type="text" :maxlength="50"
                    placeholder=""></Input>
                </FormItem>
            </Col>
            
        </Row>
        <Row style="padding-bottom:25px;">
          <Col span="12">
                <FormItem 
                  label="手机号码" 
                  prop="Phone">
                  <Input 
                    v-model="formData.Phone" 
                    type="text" :maxlength="50"
                    placeholder=""></Input>
                </FormItem>
            </Col>
            
        </Row>
        <Row style="padding-bottom:25px;">
          <Col span="12">
                <FormItem 
                  label="账号状态" 
                  prop="Stats">
                  <i-switch 
                    v-model="formData.Stats" 
                    :true-value="1"
                    :false-value="2"
                    @on-change="changeStats" />
                </FormItem>
            </Col>
            
        </Row>
        <Row style="padding-bottom:25px;">
          <Col span="12">
                <FormItem 
                  label="账号类型" 
                  prop="IsFree">
                    <RadioGroup v-model="formData.IsFree">
                        <Radio :label=0>免费</Radio>
                        <Radio :label=1>付费</Radio>
                    </RadioGroup>
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
    const validateMobileCheck = (rule, value, callback) => {
      if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) === false) {
        return callback(new Error('请填写正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      picShow:false,
      pictureSrc:null,
      userID:'',
      file:null,
      picUrl:null,
      formRules: {
        Stats: [{
          type: 'number',
          required: true,
          message: '请选择账号状态',
          trigger: 'blur'
        }],
        IsFree: [{
          type: 'number',
          required: true,
          message: '请选择账号类型',
          trigger: 'blur'
        }],
        UserName: [{
          type: 'string',
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        }],
        Phone: [{
          validator: validateMobileCheck,
          required: true,
          trigger: 'blur'
        }],
      },
      formData: {
        Phone: "",
        UserName: "",
        IsFree: 0,
        Stats:1
      }
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  mounted() {
    this.picUrl = config.urlhost+'/'
    this.userID= this.$route.query.userID
    this.queryData()
  },
  methods: {
    queryData() {
      if(this.userID){
        this.$Loading.start()
        this.$axios.post('/api/Login/GetOneUserInfo', {
            UserID:this.userID
        }).then(rs => {
            this.formData = rs.data.data[0];

            //加工数据
            this.formData.Id=this.formData.UserID;

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
      if(that.userID){
        let data = {};

        let obj = that.formData;
        Object.keys(obj).forEach(function(key){
            data[key]=obj[key];
        });

        that.$axios.post('/api/Login/UpDateUserInfo', data).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/user/userlist')}, 1000);
          } else {
            that.$Message.error(result.message)
          }
        })

      }else{
        that.$axios.post('/api/Login/AddUserInfo', {
          Phone:that.formData.Phone,
          AccountNumber:that.formData.Phone,
          UserName:that.formData.UserName,
          IsFree:that.formData.IsFree,
          Stats:that.formData.Stats,
          IsManage:1
        }).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/user/userlist')}, 1000);
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
