<template>
  <div class="container">
    <Row span="12">
      <h4 style="padding:10px;">人员管理</h4>
    </Row>
    <div class="box">
      <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        label-position="top"
        >
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
                label="所属部门" 
                prop="DepartmentID">
                <Select v-model="formData.DepartmentID">
                    <Option v-for="item in DepartmentList" :value="item.Id" :key="item.Id">{{ item.DepartmentName }}</Option>
                </Select>
                
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
      ID:'',
      file:null,
      picUrl:null,
      formRules: {
        UserName: [{
          type: 'string',
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        DepartmentID: [{
          type: 'number',
          required: true,
          message: '请选择所属部门',
          trigger: 'blur'
        }],
        Phone: [{
          validator: validateMobileCheck,
          required: true,
          trigger: 'blur'
        }],
        Stats: [{
          type: 'number',
          required: true,
          message: '请选择账号状态',
          trigger: 'blur'
        }],
      },
      formData: {
        UnitName: "",
        UnitType: "",
        Remark: "",
        Stats:1
      },
      DepartmentList:[]
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
    //this.queryData()
    this.init();
  },
  methods: {
    init(){
      let that = this;
      this.$axios.post('/api/Home/SelectDepartment', {
          pageIndex:1,
          pageSize:999,
          CompanyId:that.account.CompanyId,
        }).then(rs => {
            
            if (rs.data.success) {
                this.DepartmentList = rs.data.data.list;
            } else {
              this.$Message.error(rs.data.message)
            }
            this.queryData();
        })

      
    },
    queryData() {
      if(this.ID){
        this.$Loading.start()
        this.$axios.post('/api/Login/GetOneUserInfo', {
            UserID:this.ID
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
      if(that.ID){
        let data = {};
        //加工数据
        //that.formData.IsFree= this.formData.IsFree?true:false;

        let obj = that.formData;
        Object.keys(obj).forEach(function(key){
            data[key]=obj[key];
        });

        that.$axios.post('/api/Login/UpDateUserInfo', data).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/system/personManagement')}, 1000);
          } else {
            that.$Message.error(result.message)
          }
        })
      }else{
        that.$axios.post('/api/Login/AddUserInfo', {
          UserName:that.formData.UserName,
          AccountNumber:that.formData.Phone,
          Phone:that.formData.Phone,
          Stats:that.formData.Stats,
          IsManage:2,
          DepartmentID:that.formData.DepartmentID,
          CompanyID:that.account.CompanyID,
        }).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/system/personManagement')}, 1000);
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
