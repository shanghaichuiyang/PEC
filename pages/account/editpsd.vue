<template lang="html">
  <div>
    <Row style="padding-bottom:20px;">
      <Col span="12" class="page_title">
           修改密码
      </Col>  
      <Col span="12" class="nuxt_link">
          <nuxt-link to="/">
              <Button type="primary" size="large">返回首页</Button> 
          </nuxt-link> 
           
      </Col> 
    </Row>   

    <Divider />
    <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        label-position="top"
        >
        <FormItem label="手机号" style="padding-bottom:20px;" prop="AccountNumber">
           <Row>
              <Col span="12">
                  <Input v-model="formData.AccountNumber" :maxlength="30" type="text"></Input>
              </Col>
           </Row> 
        </FormItem>
        <!-- <FormItem style="padding-bottom:20px;"
          label="原密码" 
          prop="OldPassword">
          <Row>
              <Col span="12">
                <Input 
                v-model="formData.OldPassword" 
                type="password" :maxlength="30"
                placeholder="" ></Input>
              </Col>
          </Row>          
        </FormItem> -->

        <FormItem prop="SmsCode" label="验证码" style="padding-bottom:20px">
         <Row class="Row">
            <Col span="7">
              
                <Input ref="SmsCode" v-model="formData.SmsCode" placeholder="请输入验证码" :maxlength="10" autocomplete="off" type="text" style="width:100%" ></Input>
            
            </Col>
            <Col span="4" offset="1">
                <Button v-show="!timerShow" type="primary" long @click="sendCode" :disabled="loading">发送</Button>
                <Button v-show="timerShow" type="primary" long disabled>{{timerCount}}秒重发</Button>
            </Col>
          </Row>
        </FormItem>

        <FormItem style="padding-bottom:20px;"
          label="新密码" 
          prop="NewPassword">
          <Row>
              <Col span="12">
                <Input 
                v-model="formData.NewPassword" 
                type="password" :maxlength="30"
                placeholder="" ></Input>
              </Col>
          </Row>
        </FormItem>
  
        <FormItem style="padding-bottom:20px;"
          label="确认密码" 
          prop="confirmNewPassword">
          <Row>
              <Col span="12">
                <Input 
                v-model="formData.confirmNewPassword" 
                type="password" :maxlength="30"
                placeholder="" ></Input>
              </Col>
          </Row>
        </FormItem>
        <FormItem style="text-align:center;padding-bottom:20px;">
          <Row>
              <Col span="12">
                <Button class="no" @click="doCancelled()">&nbsp;&nbsp;取消&nbsp;&nbsp;</Button>
                <Button class="yes" @click="doBeforeSubmit('form')">&nbsp;&nbsp;确认&nbsp;&nbsp;</Button>
              </Col>
          </Row>
          
        </FormItem>
      </Form>
    
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
      timerShow: false,
      timer: null,
      timerCount: '',
      loading: false,
      formRules: {
        OldPassword: [{
          type: 'string',
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
        NewPassword: [{
          type: 'string',
          required: false,
          message: '请输入新密码',
          trigger: 'blur'
        }],
        confirmNewPassword: [{
          type: 'string',
          required: false,
          message: '请输入确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (this.formData.NewPassword !== this.formData.confirmNewPassword) {
              callback(new Error('两次输入的密码不一致！'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      },
      formData: {

      }
    }
  },
  components: {

  },
  watch: {

  },
  destroyed(){
    clearInterval(this.timer)
  },
  computed: {
    ...mapState('app', {
      account: 'account',
      userInfo: 'userInfo'
    }),    
  },
  mounted() {
    
  },
  methods: {
    // 提交前操作
    doBeforeSubmit(name) {
      // 表单验证
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.doSubmit()
        }
      })
    },
  
    sendCode(){

        this.$refs.form.validateField('AccountNumber',(errMsg)=>{
          if(!errMsg){
            this.loading = true;
            this.doSendCode();
          }
        });

    },

     doSendCode(){
     
      this.$axios.post('/api/Login/SendSms', {
        mobile:this.formData.AccountNumber
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
    },
    // 提交
    doSubmit() {

        this.$Loading.start()
        this.$axios.post('/api/Customer/UpDatePassword', {
            // UserID:this.account.Id,
            // OldPassword:this.formData.OldPassword,
            AccountNumber: this.formData.AccountNumber,
            SmsCode: this.formData.SmsCode,
            NewPassword:this.formData.NewPassword,

        }).then(rs => {
            this.$Loading.finish()
            if (rs.data.success) {
                this.$Message.success(rs.data.message)
                setTimeout(()=>{this.$router.push('/')}, 1000);
            } else {
                this.$Message.error(rs.data.message)
            }
        })
        
    },
    doCancelled() {
        this.$router.go(-1)

    }
  },
  
}
</script>

<style lang="scss" scoped>
.top-right-button{
  width:auto;
  position:absolute;
  right:16px;
  top:16px;
  z-index:1;
}
.page_title{
  font-size: 25px;
}
.nuxt_link{
   text-align: right;

}

</style>
