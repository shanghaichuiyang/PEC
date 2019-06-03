<template lang="html">
    <div>
      <Input prefix="ios-search" search enter-button="搜索" placeholder="请输入搜索内容" size="large" v-model="keyWord" @on-search="search(keyWord)" />
      <Table :columns="listColumns" :data="listData" style="margin-top:0px;">
        <template slot-scope="{row,index}" slot="action">
          <div>
            <Button type="warning" :userid="row.Id" @click="edit(row.Id)">修改</Button>
            <Button type="error" :userid="row.Id" @click="del(row.Id)">删除</Button>
          </div>
        </template> 
      </Table> 
      <div class="pageBox"><Page :total="totalCount" size="small" /></div>
    </div>
</template>


<script>
import config from '~/app.config.js'
import {
  mapState
} from 'vuex'
export default {
  layout: 'withTopMenu2',
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

      listData:[],
      totalCount:0,
      currentPage:1,
      pageSize:10,
      keyWord:null,
      
      listColumns:[
        {
          title:'',
          key:null,
          align:'center',
          type: 'selection'
        },
        {
            title: '序号',
            key: 'Id',
            align: 'center',
        },
        {
            title: '部门名称',
            key: 'DepartmentName',
            align: 'center'
        },
        {
            title: '部门类型',
            key: 'ParentID',
            align: 'center',
            render: (h, params) => {
              switch(params.row.ParentID){
                case 1:
                  return h('span', '投资方');
                  break;
                case 2:
                  return h('span', '施工单位');
                  break;
                case 3:
                  return h('span', '设计单位');
                  break;
                case 4:
                  return h('span', '监理单位');
                  break;
                default:
                  return h('span', '其他');
              }
              
              return h('span', '投资方');
            }
        },
        {
            title: '权限',
            key: 'RoleId',
            align: 'center',
            render: (h, params) => {
              switch(params.row.RoleId){
                case 1:
                  return h('span', '权限一');
                  break;
                case 2:
                  return h('span', '权限二');
                  break;
                case 8:
                  return h('span', '权限八');
                  break;
                case 9:
                  return h('span', '权限九');
                  break;
                default:
                  return h('span', '权限五');
              }
              
              return h('span', '权限一');
            }
        },
        {
            title: '备注',
            key: 'Remark',
            align: 'center'
        },
        {
            title: '操作',
            slot: 'action',
            align: 'center'
        },
      ],
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    })
  },
  mounted() {

    this.loadData();

    this.picUrl = config.urlhost+'/'
    this.ID= this.$route.query.id
    
    //this.queryData()

    if(document.getElementById("one") || document.getElementById("two")){
      document.getElementById("one").innerText = "系统管理" 
      document.getElementById("two").innerText = "部门管理"
    }
    
  
    // var a = document.getElementsByClassName("ivu-layout-content")[0];
    // if(a){
    //   a.style.display = 'none'
    // }
    //新增
    document.getElementById("add").onclick=function(){
      console.log('添加...'); 
    }
  },
  methods: {
    // queryData() {
    //   if(this.ID){
    //     this.$Loading.start()
    //     this.$axios.post('/api/Home/SelectDepartment', {
    //         Id:this.ID
    //     }).then(rs => {
    //         this.formData = rs.data.data;

    //         //加工数据
    //         //this.formData.Id=this.formData.UserID;

    //         this.$Loading.finish()
    //         if (rs.data.success) {

    //         } else {
    //           this.$Message.error(rs.data.message)
    //         }
    //     })
    //   }
    // },

    loadData(keyWord){
      let that = this;

      this.$axios.post('/api/Home/SelectDepartment', {
          DepartmentName:keyWord,
      }).then(rs => {
            if (rs.data.success) {
              that.totalCount=rs.data.data.rowcount;
              that.listData=rs.data.data.list;
            } else {
              that.totalCount=0;
              that.listData=[];
            }
        })
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

        that.$axios.post('/api/Home/UpdateDepartment', data).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/system/departmentManagement')}, 1000);
          } else {
            that.$Message.error(result.message)
          }
        })
      }else{
        that.$axios.post('/api/Home/AddDepartment', {
          DepartmentName:that.formData.DepartmentName,
          Remark:that.formData.Remark,
          CompanyId:that.account.CompanyId,
          AdminId:that.account.Id,
        }).then(rs => {
          let result = rs.data
          that.loading = false
          if (result.success) {
            that.$Message.success(result.message);
            setTimeout(()=>{this.$router.push('/system/departmentManagement')}, 1000);
          } else {
            that.$Message.error(result.message)
          }
        })
      }
    },
    doCancelled() {
        this.$router.go(-1)

    },
    search(keyWord){
      this.loadData(keyWord);

    },
    edit(id){
      console.log(id);
    },
    del(id){
      //console.log(id)
    }

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
            // .pic{
            //     width:3rem;
            //     height:3rem;
            //     background-color: #f5f5f5;
            //     display:flex;
            //     justify-content: center;
            //     align-items: center;
            //     img{
            //         width:100%;
            //         height:100%;
            //     }

            // }
            



        }



   
}


</style>
