<template lang="html">
  <div>
    <h3 style="padding:10px 0;">修改个人信息</h3>
    <Divider />
    <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        label-position="top"
        >
        <FormItem style="padding-bottom:20px;"
          label="头像" 
          prop="Picture">
          <Row>
              <Col span="12">
                <Upload
                    :before-upload="handleUpload"
                    action="">
                    <p v-show="!picShow" class="add"><Button type="primary">上传头像</Button></p>
                    <p v-show="picShow" class="pic" style="display:block;width:100px;height:100px;">
                        <img style="border-radius: 50px;" :src="pictureSrc?pictureSrc:picUrl+formData.Face">
                    </p>
                    <!-- <p v-show="picShow" class="pic"><Avatar size="large" :src="pictureSrc?pictureSrc:picUrl+formData.Picture" /></p> -->
                </Upload>
              </Col>
          </Row>
        </FormItem>
        <FormItem style="padding-bottom:20px;"
          label="姓名" 
          prop="UserName">
          <Row>
              <Col span="12">
                <Input 
                v-model="formData.UserName" 
                type="text" :maxlength="30"
                placeholder="" ></Input>
              </Col>
          </Row>          
        </FormItem>
        <FormItem style="padding-bottom:20px;"
          label="手机号码" 
          prop="Phone">
          <Row>
              <Col span="12">
                <Input 
                v-model="formData.Phone" 
                type="text" :maxlength="30"
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
        UserName: [{
          type: 'string',
          required: true,
          message: '请输入姓名',
          trigger: 'blur',
        }],
        Phone: [{
          validator: validateMobileCheck,
          required: true,
          trigger: 'blur'
        }],
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
    this.picUrl = config.apihost+'/'
    this.userID= this.$route.query.userID
    this.queryData()
  },
  methods: {
    queryData() {
      if(this.account){
        this.formData=Object.assign({}, this.account);
        if(this.account.Face){
          this.picShow=true;
        }
      }
    },
    handleUpload (file) {
        this.pictureSrc = window.URL.createObjectURL(file)
        this.picShow=true
        this.file = file
        return false
    },
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
      let that = this;
      if(that.formData) {
        let data = new FormData()
        if(that.file){
          data.append('file', that.file)
        }        
        let obj = that.formData;


        Object.keys(obj).forEach(function(key){
            data.append(key, obj[key]?obj[key]:'')
        });

        that.$Loading.start()
        that.$axios2.post('/api/Login/UpDateUserInfo', data).then(rs => {
            that.$Loading.finish()
            if (rs.data.success) {
              let result = Object.assign({}, that.formData);
              if(rs.data.data){
                result.Face =  rs.data.data;
                that.$store.commit('app/editAccount', result)
              }
              that.$Message.success(rs.data.message)
              setTimeout(()=>{that.$router.push('/')}, 1000);
            } else {
              that.$Message.error(rs.data.message)
            }
        })
      }

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
