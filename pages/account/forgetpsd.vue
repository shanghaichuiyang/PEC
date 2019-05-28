<template>
  <section class="container">
    <Card style="width:500px;position:absolute;right:20vw;padding:30px;">
      <div class="title">
        <Row><div class="title1">Forgot Password</div></Row>
        <Row><div class="title2">忘记密码</div></Row>
      </div>
      
      <div class="form">
        <Form 
        ref="form" 
        :model="formData" 
        :rules="formRule" 
        :label-width="100"
        label-position="left">
          <Row class="Row">
            <Col>
              <FormItem prop="Phone" label="手机号码">
                <Input ref="Phone" v-model="formData.Phone" placeholder="请输入手机号码" :maxlength="11" autocomplete="off" type="text" style="width:100%" />
              </FormItem>
            </Col>
          </Row>
          <Row class="Row">
            <Col span="18">
              <FormItem prop="SmsCode" label="验证码">
                <Input ref="SmsCode" v-model="formData.SmsCode" placeholder="请输入验证码" :maxlength="10" autocomplete="off" type="text" style="width:100%" />
              </FormItem>
            </Col>
            <Col span="6">
                <Button v-show="!timerShow" type="primary" long @click="sendCode" :disabled="loading">发送</Button>
                <Button v-show="timerShow" type="primary" long disabled>{{timerCount}}秒重发</Button>
            </Col>
          </Row>
          <Row class="Row">
            <Col>
              <FormItem prop="Passwords" label="密码">
                <Input ref="Passwords" v-model="formData.Passwords" placeholder="请输入密码" :maxlength="30" autocomplete="off" type="password" style="width:100%" />
              </FormItem>
            </Col>
          </Row>
          <Row class="Row">
            <Col>
              <FormItem prop="confirmPasswords" label="确认密码">
                <Input ref="confirmPasswords" v-model="formData.confirmPasswords" placeholder="请输入确认密码" :maxlength="30" autocomplete="off" type="password" style="width:100%" />
              </FormItem>
            </Col>
          </Row>
          <Row style="margin-top:10px;text-align:right;">
            <FormItem>
              <router-link class="" to="/account/login"><Button :disabled="loading">取消</Button></router-link>
              <Button type="primary" @click="findpsd" :disabled="loading">
                <span v-show="loading">
                  操作中
                </span>
                <span v-show="!loading">
                  确定
                </span>
              </Button>
            </FormItem>
          </Row>



        </Form>
        

      </div>
    </Card>
    
  </section>
</template>

<script>
export default {
  layout: 'fullscreen',
  components: {},
  data() {
    const validateMobileCheck = (rule, value, callback) => {
      if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) === false) {
        return callback(new Error('请填写正确的手机号'))
      } else {
        callback()
      }
    }
    const validatePasswordsCheck = (rule, value, callback) => {
      if(value==''){
        callback(new Error('请输入确认密码！'))
      }else if (this.formData.Passwords !== this.formData.confirmPasswords) {
        callback(new Error('两次输入的密码不一致！'))
      } else {
        callback()
      }
    }    
    return {
      formData: {
        Phone: '',
        SmsCode: '',
        Passwords: '',
        confirmPasswords: '',
      },
      formRule: {
        Phone: [{
          validator: validateMobileCheck,
          required: true,
          trigger: 'blur'
        }],
        SmsCode: [{
          type: 'string',
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }],
        Passwords: [{
          type: 'string',
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        confirmPasswords: [{
          validator: validatePasswordsCheck,
          type: 'string',
          required: true,
          trigger: 'blur'
        }],
      },
      loading: false,
      

      timerShow: false,
      timerCount: '',
      timer: null,


    }
  },
  destroyed(){
    clearInterval(this.timer);
  },
  mounted() {
    
  },
  methods: {
    sendCode(){
        this.$refs.form.validateField('Phone',(errMsg)=>{
          if(!errMsg){
            this.loading = true;
            this.doSendCode();
          }
        });

    },
    doSendCode(){
      this.$axios.post('/api/Login/SendSms', {
        mobile:this.formData.Phone
      }).then(rs => {
        let result = rs.data;
        this.loading = false;
        if (result.success) {
          this.setTimer();
        } else {
          this.$Message.error(result.message)
        }
      })
    },
    findpsd(){
      this.$refs.form.validate((valid) => {
        console.log(valid)
        console.log(this.$refs.Phone.value)
        if (valid) {
          this.loading = true;
          this.dofindpsd();
        } 
      })
    },
    dofindpsd(){
      this.$axios.post('/api/Login/UpDatePassword', {
        SmsCode:this.formData.SmsCode,
        AccountNumber:this.formData.Phone,
        NewPassword:this.formData.Passwords,
      }).then(rs => {
        let result = rs.data
        this.loading = false
        if (result.success) {
          setTimeout(() => {
            this.$router.push('/account/login');
          }, 1000)
        } else {
          this.$Message.error(result.message)
        }
      })

    },
    setTimer(){
      const TIME_COUNT = 60;
      if (!this.timer) {
       this.timerCount = TIME_COUNT;
       this.timerShow = true;
       this.timer = setInterval(() => {
       if (this.timerCount > 0 && this.timerCount <= TIME_COUNT) {
         this.timerCount--;
        } else {
         this.timerShow = false;
         clearInterval(this.timer);
         this.timer = null;
        }
       }, 1000)
      }
    }
  },
  
}
</script>

<style lang="scss" scoped>
.container{
  display:flex;
  align-items: center;
  min-height:90vh;
  .title{
    padding:30px 0;

    .title1{
      color:lightblue;
      font-size:20px;
      
    }
    .title2{
      color:gainsboro;
      font-size:18px;
    }


  }
  .Row{
    line-height:30px;
    padding:2px 0;
  }



}


</style>