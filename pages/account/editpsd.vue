<template lang="html">
  <div>
    <h3 style="padding:10px 0;">修改密码</h3>
    <Divider />
    <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        label-position="top"
        >
        <FormItem style="padding-bottom:20px;"
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
          label="确认新密码" 
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
      formRules: {
        OldPassword: [{
          type: 'string',
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
        NewPassword: [{
          type: 'string',
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }],
        confirmNewPassword: [{
          type: 'string',
          required: true,
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
  computed: {
    ...mapState('app', {
      account: 'account'
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
    // 提交
    doSubmit() {
        this.$Loading.start()
        this.$axios.post('/api/Login/UpDatePassword', {
            UserID:this.account.Id,
            OldPassword:this.formData.OldPassword,
            NewPassword:this.formData.NewPassword
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
</style>
