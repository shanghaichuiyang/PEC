<template>
  <section class="container">
    <Card style="width:500px;position:absolute;right:20vw;padding:30px;">
      <div class="title">
        <Row><div class="title1">Welcome <span>Back</span></div></Row>
        <Row><div class="title2">欢迎登录EPC项目管理平台</div></Row>
      </div>
      <Form 
        ref="form"  
        label-position="top">
        <div class="form">
          <!-- <Row class="Row">
            账号
          </Row> -->
          <Row class="Row">
            <div class="input-wrap account">
              <FormItem prop="Accounts" label="账号">
                <Input ref="accout" v-model="formData.Accounts" placeholder="请输入手机号码" :maxlength="30" autocomplete="off" type="text" style="width:100%" />
              </FormItem>
            </div>
          </Row>
          <Row class="Row">
            <div class="input-wrap password">
              <FormItem prop="Passwords" label="密码">
                <Input ref="Passwords" v-model="formData.Passwords" placeholder="请输入密码" :maxlength="30" autocomplete="off" type="password" style="width:100%" />
              </FormItem>
            </div>
          </Row>
          <Row class="Row">
            <Col span="24" style="text-align:right;"><router-link to="/account/forgetpsd"><span style="color:#ccc;">忘记密码？</span></router-link></Col>
          </Row>
          <Row style="margin-top:10px;text-align:right;">
            <router-link class="" to="/account/regist"><Button :disabled="loading">注册</Button></router-link>
            <Button type="primary" @click="validate" :disabled="loading">
              <span v-show="loading">
                登录中
              </span>
              <span v-show="!loading">
                登录
              </span>
            </Button>
          </Row>

        </div>
      </Form>
      
    </Card>
    
  </section>
</template>

<script>
import cookie from 'js-cookie'
export default {
  layout: 'fullscreen',
  components: {},
  data() {
    return {
      showlogin: false,
      formData: {
        Accounts: '',
        Passwords: ''
      },
      formRule: {
        Accounts: [],
        Passwords: []
      },
      loading: false,
      // 是否记住密码
      remember: false
    }
  },
  watch: {
    loading(val) {
      if (val) {
        this.$Loading.start()
      } else {
        this.$Loading.finish()
      }
    }
  },
  mounted() {
    this.getUserData()
    // 监听回车
    document.addEventListener('keyup', this.doKeyUp, this)
    setTimeout(() => {
      this.toggle()
    }, 300)
  },
  // 销毁前去除监听函数
  beforeDestroy() {
    document.removeEventListener('keyup', this.doKeyUp, this)
  },
  methods: {
    getUserData() {
      let userdata = cookie.get('userdata')
      if (userdata) {
        userdata = JSON.parse(userdata)
        this.formData.Accounts = userdata.Accounts
        this.formData.Passwords = userdata.Passwords
        this.remember = true
      }
    },
    toggle() {
      this.showlogin = !this.showlogin
    },
    validate() {
      if (this.loading) return
      // 校验合法性
      var reg = /[^a-zA-Z0-9\\u4e00-\u9fa5]/
      if (this.formData.Accounts === '' || reg.test(this.formData.Accounts)) {
        this.$Message.warning('请输入正确的用户名')
        return
      }
      if (this.formData.Passwords === '') {
        this.$Message.warning('请输入正确的密码')
        return
      }
      // 登录
      this.login()
    },
    // 判断回车函数
    doKeyUp(evt) {
      if (evt.keyCode === 13) {
        this.validate()
      }
    },
    // 登录
    login() {
      this.loading = true

      this.$axios.post('/api/Customer/Login', {
      Account:this.formData.Accounts,
      Passwords:this.formData.Passwords
      }).then(rs => {
        let result = rs.data
        this.loading = false
        if (result.success) {
          this.$store.commit('app/setAccount', result.data)
          setTimeout(() => {
            this.$router.push('/');
          }, 1000)
        } else {
          this.$Message.error(result.message)
        }
      })
    },

    // 忘记密码
    doForget() {
      this.$Message.info('请联系管理员修改密码')
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
      span{
        color:teal;
        font-weight:bold;
      }
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
