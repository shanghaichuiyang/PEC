<template lang="html">
  <div class="projectedit">
    <div class="top-left-title">添加项目</div>
    <Divider />
    <Form 
        ref="form" 
        :model="formData" 
        :rules="formRules" 
        label-position="top"
        >
        <Row>
            <Col span="11">
                <FormItem style="padding-bottom:20px;"
                label="项目名称" 
                prop="ProjectName">
                <Row>
                    <Col span="24">
                        <Input 
                        v-model="formData.ProjectName" 
                        type="text" :maxlength="30"
                        placeholder="" ></Input>
                    </Col>
                </Row>          
                </FormItem>
            </Col>
            <Col span="11" offset="2">
                <FormItem style="padding-bottom:20px;"
                label="业主名称" 
                prop="OwnerName">
                <Row>
                    <Col span="24">
                        <Input 
                        v-model="formData.OwnerName" 
                        type="text" :maxlength="30"
                        placeholder="" ></Input>
                    </Col>
                </Row>          
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="11">
                <FormItem style="padding-bottom:20px;"
                label="项目经理" 
                prop="ProjectManager">
                <Row>
                    <Col span="24">
                        <Input 
                        v-model="formData.ProjectManager" 
                        type="text" :maxlength="30"
                        placeholder="" ></Input>
                    </Col>
                </Row>          
                </FormItem>
            </Col>
            <Col span="11" offset="2">
                <FormItem style="padding-bottom:20px;"
                label="设计单位" 
                prop="DesignUnit">
                <Row>
                    <Col span="24">
                        <Select v-model="formData.DesignUnit" clearable>
                            <Option v-for="item in DesignUnitList" :value="item.Id" :key="item.Id">{{ item.UnitName }}</Option>
                        </Select>
                    </Col>
                </Row>          
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="11">
                <FormItem style="padding-bottom:20px;"
                label="监理单位" 
                prop="SupervisorUnit">
                <Row>
                    <Col span="24">
                        <Select v-model="formData.SupervisorUnit" clearable>
                            <Option v-for="item in SupervisorUnitList" :value="item.Id" :key="item.Id">{{ item.UnitName }}</Option>
                        </Select>
                    </Col>
                </Row>          
                </FormItem>
            </Col>
            <Col span="11" offset="2">
                <FormItem style="padding-bottom:20px;"
                label="施工单位" 
                prop="ConstructionUnit">
                <Row>
                    <Col span="24">
                        <Select v-model="formData.ConstructionUnit" clearable>
                            <Option v-for="item in ConstructionUnitList" :value="item.Id" :key="item.Id">{{ item.UnitName }}</Option>
                        </Select>
                    </Col>
                </Row>          
                </FormItem>
            </Col>
        </Row>
        <Divider />
        <!-- <Row>
            <span class="itemTitle">导入项目效果图</span>
        </Row> -->
        <Row>
            <FormItem style="padding-bottom:20px;"
                label="导入项目效果图" 
                prop="Face">
                <Row>
                    <Col span="24">
                        <Upload
                            :before-upload="handleUploadpng"
                            action="">
                            
                            <Button v-show="!hasUploadpng">选择文件(只支持png格式)</Button>
                            <p v-show="hasUploadpng" class="pic"><img :src="pictureSrc"></p>
                        </Upload>
                    </Col>
                </Row>          
            </FormItem>
            
        </Row>
        <Divider />
        <!-- <Row>
            <span class="itemTitle">导入项目数据</span>
        </Row> -->
        <Row>
            <FormItem style="padding-bottom:20px;"
                label="导入项目数据" 
                prop="PilePosition">
                <Row>
                    <Col span="24">
                        <Upload
                            :before-upload="handleUploadjson"
                            action="">
                            
                            <Button>选择文件(只支持json格式)</Button>
                            <p ref="jsonText">{{formData.PilePosition}}</p>
                        </Upload>
                    </Col>
                </Row>          
            </FormItem>
            
        </Row>
        <Divider />
        <Row>
            <FormItem style="padding-bottom:20px;"
                label="项目位置" 
                prop="position">
                <Row>
                    <Col span="24">
                        <myPickMap ref="pickMap" @on-change="doChange"></myPickMap>
                    </Col>
                </Row>          
            </FormItem>
        </Row>
        <Divider />
        <Row>
            <Button :disabled="loading" @click="doBeforeSubmit('form')" type="primary" style="width:20%;">确定</Button>
            <Button :disabled="loading" style="width:20%;margin-left:20px;" @click="doCancel()">取消</Button>
        </Row>
    </Form>
    
  </div>
</template>

<script>
import myPickMap from './mapForEdit.vue'
import {
  mapState
} from 'vuex'
export default {
  layout: 'withTopMenu',
  data() {
    return {
        loading:false,
        projectID:null,
        project:{
            Name:''
        },
        hasUpload:false,
        hasUploadpng:false,
        hasUploadjson:false,
        file:null,
        pictureSrc:null,

        DesignUnitList:[],
        SupervisorUnitList:[],
        ConstructionUnitList:[],

        formRules: {
            ProjectName: [{
            type: 'string',
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
            }],
            OwnerName: [{
            type: 'string',
            required: true,
            message: '请输入业主名称',
            trigger: 'blur'
            }],
            ProjectManager: [{
            type: 'string',
            required: true,
            message: '请输入项目经理',
            trigger: 'blur'
            }],
            DesignUnit: [{
            type: 'number',
            required: true,
            message: '请选择设计单位',
            trigger: 'blur'
            }],
            SupervisorUnit: [{
            type: 'number',
            required: true,
            message: '请选择监理单位',
            trigger: 'blur'
            }],
            ConstructionUnit: [{
            type: 'number',
            required: true,
            message: '请选择施工单位',
            trigger: 'blur'
            }],
            Face: [{
            type: 'string',
            required: true,
            message: '请选择项目效果图',
            trigger: 'blur'
            }],
            PilePosition: [{
            type: 'string',
            required: true,
            message: '请选择项目数据',
            trigger: 'blur'
            }],
            position: [{
            type: 'string',
            required: true,
            message: '请选择项目位置',
            trigger: 'blur'
            }],
            
        },
        formData: {

        },
    }
  },
  components: {
    myPickMap
  },
  watch: {
    isload() {
      this.queryScoreInfo();
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    }),    
  },
  mounted() {
    this.$refs.pickMap.loadmap();
    this.projectID= this.$route.query.ProjectID
    this.init();
    
  },
  methods: {
    init(){
        let that=this;

        that.$axios.post('/api/Home/SelectUnitInfo', {
            pageIndex:1,
            pageSize:999
        }).then(rs => {
            if (rs.data.success) {
                console.log(rs.data.data.t_Units)
                rs.data.data.t_Units.forEach(val => {
                    
                    switch(val.UnitType){
                        case 1:
                            that.DesignUnitList.push(val);
                            break;
                        case 2:
                            that.SupervisorUnitList.push(val);
                            break;
                        case 3:
                            that.ConstructionUnitList.push(val);
                            break;
                    }
                })
            } else {
                //this.$Message.error(rs.data.message)
            }


        })

        
        
    },
    handleUploadpng (file) {
        let that = this;
        console.log(file,'file');
        if(file.type.indexOf('png')!=-1){
            that.pictureSrc = null;
            that.pictureSrc = window.URL.createObjectURL(file);
            that.file = file;

            let data = new FormData()
            if(that.file){
                data.append('File', that.file)
            }
            data.append('FileType', 4)
            data.append('Remarks', '')
            that.$Loading.start()
            that.$axios2.post('/api/Home/Upload', data).then(rs => {
                that.$Loading.finish()
                if (rs.data.success) {
                    that.hasUploadpng=true;

                    // let result = Object.assign({}, that.formData);
                    // result.Face =  rs.data.data;
                    // that.$store.commit('app/editAccount', result)
                    console.log(rs.data.data,'pic');
                    this.formData.Face = rs.data.data.FileId;
                    that.$Message.success(rs.data.message);
                    
                } else {
                that.$Message.error(rs.data.message)
                }
            })

        }else{
            this.$Message.error('支持png格式');
        }


        
        return false;
    },
    handleUploadjson (file) {
        let that = this;
        console.log(file,'file');
        if(file.type.indexOf('json')!=-1){
            let that = this;

            let requestURL = window.URL.createObjectURL(file);
            let request = new XMLHttpRequest();
            //使用open（）打开一个新请求
            request.open('GET', requestURL);
            //设置XHR访问JSON格式数据，然后发送请求
            //设置XHR访问text格式数据
            request.responseType = 'text';
            request.send();
            //处理来自服务器的数据
            request.onload = function() {
                let superHeroesText = request.response;
                let superHeroes = JSON.parse(superHeroesText);
                that.showText(superHeroesText)
                
            };
            that.showText(request.response)
            return false;

        }else{
            this.$Message.error('支持json格式');
        }


        
        return false;
    },
    showText(data){
        this.formData.PilePosition = data;
        this.$refs.jsonText.innerHTML=data;
        console.log(this.$refs.jsonText.innerHTML);
    },
    // 提交前操作
    doBeforeSubmit(name) {
        console.log(this.formData,'formdata')
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
    //   if(that.projectID){
    //     if(that.formData) {

    //         let data = {};

    //         let obj = that.formData;
    //         Object.keys(obj).forEach(function(key){
    //             data[key]=obj[key];
    //         });

    //         that.$Loading.start()
    //         that.$axios.post('/api/Home/ProjectAdd?UserId='+this.account.Id, data).then(rs => {
    //             that.$Loading.finish()
    //             if (rs.data.success) {
    //             //that.$store.commit('app/editAccount', result)
    //             that.$Message.success(rs.data.message)
    //             setTimeout(()=>{that.$router.push('/projectmanagement/list/projectlist')}, 1000);
    //             } else {
    //             that.$Message.error(rs.data.message)
    //             }
    //         })
    //     }
    //   }else{
        if(that.formData) {

            let data = {};

            let obj = that.formData;
            Object.keys(obj).forEach(function(key){
                data[key]=obj[key];
            });

            that.$Loading.start()
            that.$axios.post('/api/Home/ProjectAdd?UserId='+this.account.Id, data).then(rs => {
                that.$Loading.finish()
                if (rs.data.success) {
                //that.$store.commit('app/editAccount', result)
                that.$Message.success(rs.data.message)
                setTimeout(()=>{that.$router.push('/projectmanagement/list/projectlist')}, 1000);
                } else {
                that.$Message.error(rs.data.message)
                }
            })
        }
      

    },
    //取消
    doCancel() {
        this.$router.go(-1)

    },
    doChange(value){
        this.formData.position = value;
        let data = value.split(',');
        this.formData.LatitudeStart=data[0];
        this.formData.LatitudeEnd=data[1];

    }
  },
  
}
</script>

<style lang="scss" scoped>
.projectedit{
    margin-bottom:50px;

    .top-left-title{
        font-size:24px;
    }
    .itemTitle{
        height:45px;
        line-height:45px;
    }
}

</style>
