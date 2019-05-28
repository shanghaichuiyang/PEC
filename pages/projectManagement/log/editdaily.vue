<template>
  <div class="container">
    <Row span="12">
      <h4 style="padding:10px;">日志内容</h4>
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
                label="日期" 
                prop="DeclareDate">
                    <DatePicker v-model="formData.DeclareDate" type="date" @on-change="change"></DatePicker>
                </FormItem>
            </Col>
        </Row>
        <Row style="padding-bottom:25px;">
            <Col span="12">
                <FormItem 
                label="形象进度" 
                prop="ImageProgress">
                  <Select v-model="formData.ImageProgress">
                      <Option v-for="item in ImageProgressList" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </FormItem>
            </Col>
        </Row>
        <Row style="padding-bottom:25px;">
            <Col span="12">
                <FormItem 
                label="天气" 
                prop="Weathers">
                  <Select v-model="formData.Weathers">
                      <Option v-for="item in WeathersList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                  </Select>
                </FormItem>
            </Col>
        </Row>
        <Row style="padding-bottom:25px;">
            <Col span="12">
                <FormItem 
                label="完成内容" 
                prop="FinishContent">
                  <Input 
                  v-model="formData.FinishContent" 
                  type="text" :maxlength="30"
                  placeholder="" ></Input>
                </FormItem>
            </Col>
        </Row>
        <Row style="padding-bottom:25px;">
            <Col span="12">
                <FormItem 
                label="备注内容" 
                prop="Remarks">
                  <Input 
                  type="textarea" :rows="4"
                  v-model="formData.Remarks" 
                  :maxlength="100"
                  placeholder=""></Input>
                </FormItem>
            </Col>
        </Row>
        <Row style="padding-bottom:25px;">
            <Col span="12">
                <FormItem 
                label="上传图片" 
                prop="ImageFileIds"
                ref="ImageFileIds">
                  <Row>
                      <Col span="6" offset="2">
                        <Upload
                            :before-upload="handleUpload"
                            action="">
                            <p v-show="!picShow" class="add" style="width:100%;"><Button type="primary" long>选择图片</Button></p>
                            <p v-show="picShow" class="pic" style="display:block;width:100px;height:100px;">
                                <img style="border-radius: 50px;" :src="pictureSrc">
                            </p>
                            <!-- <p v-show="picShow" class="pic"><Avatar size="large" :src="pictureSrc?pictureSrc:picUrl+formData.Picture" /></p> -->
                        </Upload>
                        <Input 
                          type="text"
                          v-model="Remarks" 
                          :maxlength="50"
                          placeholder="填写备注" style="padding-bottom:5px;"></Input>
                        <Button type="primary" @click="doUpload">上传图片</Button>
                      </Col>
                      <template v-for="item in picList" >
                          <Col span="6" offset="2">
                            <div>
                              <div style="display:block;width:100%;height:200px;">
                                <img style="height:100%;" :src="picUrl+item.FileId">
                              </div>
                              <div style="position:absolute;bottom:0;display:block;width:100%;line-height:30px;background:black;opacity:0.8;color:white;padding-left:10px;">
                                <span>{{item.Remarks}}</span>
                              </div>
                            </div>
                          </Col>
                          
                      </template>
                  </Row>

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
        DeclareDate: [{
          type: 'date',
          required: true,
          message: '请选择日期',
          trigger: 'blur'
        }],
        ImageProgress: [{
          type: 'string',
          required: true,
          message: '请选择形象进度',
          trigger: 'blur'
        }],
        Weathers: [{
          type: 'number',
          required: true,
          message: '请选择天气',
          trigger: 'blur'
        }],
        FinishContent: [{
          type: 'string',
          required: true,
          message: '请输入完成内容',
          trigger: 'blur'
        }],
        Remarks: [{
          type: 'string',
          required: true,
          message: '请输入备注内容',
          trigger: 'blur'
        }],
        ImageFileIds: [{
          type: 'array',
          required: false,
          message: '请上传图片',
          trigger: 'blur'
        }],
      },
      formData: {
        DeclareDate: new Date(),
        ImageProgress: "",
        Weathers: "",
        FinishContent:"",
        Remarks:"",
        ImageFileIds:[]
      },
      ImageProgressList:['桩基工程'],
      WeathersList:[
        {'code':1,'name':'晴'},
        {'code':2,'name':'多云'},
        {'code':3,'name':'阴天'},
        {'code':4,'name':'雷阵雨'},
        {'code':5,'name':'小雨'},
        {'code':6,'name':'中雨'},
        {'code':7,'name':'大雨'},
        {'code':8,'name':'暴雨'},
        {'code':9,'name':'雨夹雪'},
        {'code':10,'name':'小雪'},
        {'code':11,'name':'中雪'},
        {'code':12,'name':'大雪'},
        {'code':13,'name':'暴雪'},
        {'code':14,'name':'冰雹'},
        {'code':15,'name':'冻雨'},
      ],
      DeclareDate:'',
      Remarks:'',
      picList:[],

    }
  },
  computed: {
    ...mapState('app', {
      account: 'account',
      projectid: 'projectid'
    })
  },
  mounted() {
    // this.picUrl = config.urlhost+'/api/Home/Image?FileId='
    this.picUrl = config.imghost;
    this.ID= this.$route.query.userID
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
      let that = this;
      if(that.ID){
        that.$Loading.start()
        that.$axios.post('/api/Login/GetOneUserInfo', {
            UserID:that.ID
        }).then(rs => {

            that.$Loading.finish()
            if (rs.data.success) {

            } else {
              that.$Message.error(rs.data.message)
            }
        })
      }else{
        that.$Loading.start()
        that.$axios.post(('/api/Home/FinishProcessAddInfo?userId='+that.account.Id), {
            ProjectId:that.projectid,
            DeclareDate:new Date()
        }).then(rs => {
            that.$Loading.finish()
            if (rs.data.success) {
              
            } else {
              that.$Message.error(rs.data.message)
            }
        })
      }
    },
    handleUpload (file) {
        console.log((file.type.indexOf('png')!=-1)||(file.type.indexOf('jpg')!=-1)||(file.type.indexOf('gif')!=-1))
        console.log(file.type.indexOf('jpg')!=-1)
        console.log(file.type.indexOf('png')!=-1)
        console.log(file.type.indexOf('gif')!=-1)
        console.log(file.type)
        if((file.type.indexOf('png')!=-1)||(file.type.indexOf('jpg')!=-1)||(file.type.indexOf('gif')!=-1)||(file.type.indexOf('jpeg')!=-1)){
          this.pictureSrc = window.URL.createObjectURL(file)
          this.picShow=true
          this.file = file
        }else{
            this.$Message.error('支持jpg,png,gif格式');
        }
        
        return false
    },
    doUpload(){
      let that = this;
      if(that.Remarks && that.file){
            let data = new FormData()
            if(that.file){
                data.append('File', that.file)
            }
            data.append('FileType', 1)
            data.append('Remarks', that.Remarks)

            that.$Loading.start()
            that.$axios2.post('/api/Home/Upload', data).then(rs => {
                that.$Loading.finish()
                if (rs.data.success) {
                    that.additem(rs.data.data);

                    that.formData.ImageFileIds.push(rs.data.data.FileId);
                    console.log(that.formData.ImageFileIds);

                    that.Remarks='';
                    that.file=null;
                    that.pictureSrc = '';
                    that.picShow=false;

                    that.$Message.success(rs.data.message);
                } else {
                    that.$Message.error(rs.data.message)
                }
            })

      }
      else if(!that.file){
        that.$Message.error("请先选择上传的图片")

      }
      else if(!that.Remarks){
        that.$Message.error("请先输入备注")

      }
    },
    additem(obj){
        this.picList.push(obj);
        console.log(this.formData.ImageFileIds);
        // CId: 0
        // CreateTime: "2019-03-01T15:19:48.7639597+08:00"
        // Extension: ".gif"
        // FileId: "a8549ec79fe6440480b792ae18b5a8e4"
        // FileType: 1
        // Id: 0
        // ImgName: "timg.gif"
        // Remarks: "撞墙"
        // State: 1
        // Stats: 1
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
        // let data = {};

        // let obj = that.formData;
        // Object.keys(obj).forEach(function(key){
        //     data[key]=obj[key];
        // });

        // that.$axios.post('/api/Login/UpDateUserInfo', data).then(rs => {
        //   let result = rs.data
        //   that.loading = false
        //   if (result.success) {
        //     that.$Message.success(result.message);
        //     setTimeout(()=>{this.$router.push('/system/personManagement')}, 1000);
        //   } else {
        //     that.$Message.error(result.message)
        //   }
        // })
      }else{
        let data = {};

        let obj = that.formData;
        Object.keys(obj).forEach(function(key){
            data[key]=obj[key];
        });
        data.ProjectId=that.projectid;
        data.ImageFileIds = data.ImageFileIds.join(',')
        //data.userId=this.account.Id;
        // console.log(that.DeclareDate)
        // data.DeclareDate=that.DeclareDate;

        that.$axios.post(('/api/Home/FinishProcessAdd?userId='+that.account.Id), data).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/projectManagement/log/daily')}, 1000);
          } else {
            that.$Message.error(result.message)
          }
        })
      }
      

    },
    formatDate: function (value) {
        var date = new Date(value);
        let Y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let H = date.getHours();
        let i = date.getMinutes();
        let s = date.getSeconds();
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        //var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i;
        let t = Y + '-' + m + '-' + d;
        console.log(t)
        return t;
    },
    doCancelled() {
        this.$router.go(-1)

    },
    change(a,b){
      this.DeclareDate=a.toString();
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
            



        }



   
}


</style>
